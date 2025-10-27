import 'dart:io';
import 'package:aluguel_dart/application/update_aluguel_usecase.dart';
import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq_event.dart';
import 'package:aluguel_dart/shared/environments.dart';


typedef EventHandlerFn = Future<void> Function(dynamic payload);

final Map<String, EventHandlerFn> eventsFunctions = {
  'AvaiabilityChecked': (payload) async {
    final aluguelID = payload["aluguel"]["id"];
    final people = payload["aluguel"]['people'];
    final availableSpots = payload['availableSpots'];
    Aluguel updatedAluguel;

    if(people <= availableSpots) {
      updatedAluguel = await UpdateAluguelUsecase(repository: Environments.getAluguelRepo()).call(aluguelID, status: 'CONFIRMED');
      final aluguelConfirmed = RabbitMQEvent(eventType: 'AluguelConfirmed', payload: updatedAluguel.toJson());
      await publishEvent('aluguel.updated', aluguelConfirmed.toJson());
      await scheduleAluguelExpiration(eventType: 'AluguelExpired', payload: updatedAluguel.toJson());
    } else { 
      updatedAluguel = await UpdateAluguelUsecase(repository: Environments.getAluguelRepo()).call(aluguelID, status: 'CANCELED');
    }
  },
  'AvaiabilityFree': (payload) async {
    final aluguelID = payload["aluguel"]["bookingID"];
    Aluguel updatedAluguel;
    updatedAluguel = await UpdateAluguelUsecase(repository: Environments.getAluguelRepo()).call(aluguelID, status: 'COMPLETED');
    final aluguelCompleted = RabbitMQEvent(eventType: 'AluguelCompleted', payload: updatedAluguel.toJson());
    await publishEvent('aluguel.updated', aluguelCompleted.toJson());
  }
};

Future<void> eventHandler(Map<String, dynamic> event) async {
  try {
    RabbitMQEvent convertedEvent = RabbitMQEvent(eventType: event['eventType'], payload: event['payload']);
    final String eventType = convertedEvent.eventType;
    final dynamic payload = convertedEvent.payload;
    eventsFunctions[eventType]!(payload);
  } catch (err) {
    print(err);
  }
}

Future<void> startQueue() async {
  try {
    await consumeEvents('aluguel_queue', 'avaiability.*', eventHandler);
  } catch (err) {
    print("Couldn't start the service queues");
    exit(1);
  }
}
