import 'dart:io';
import 'package:aluguel_dart/application/update_aluguel_usecase.dart';
import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/events/base_event.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq_event.dart';
import 'package:aluguel_dart/shared/environments.dart';


typedef EventHandlerFn = Future<void> Function(dynamic payload);

final Map<String, EventHandlerFn> eventsFunctions = {
  'AluguelAvaiabilityChecked': (payload) async {
    final aluguelID = payload["aluguelID"];
    final people = payload['people'];
    final availableSpots = int.tryParse(payload['availableSpots']);
    Aluguel updatedAluguel;

    if(people <= availableSpots) {
      updatedAluguel = await UpdateAluguelUsecase(repository: Environments.getAluguelRepo()).call(aluguelID, status: 'CONFIRMED');
      await scheduleAluguelExpiration(aluguelId: updatedAluguel.id, endDateMs: updatedAluguel.endDate);
    } else {
      updatedAluguel = await UpdateAluguelUsecase(repository: Environments.getAluguelRepo()).call(aluguelID, status: 'CANCELED');
    }

    final aluguelUpdatedEvent = RabbitMQEvent(eventType: 'AluguelUpdated', payload: updatedAluguel.toJson());

    await publishEvent('aluguel.updated', aluguelUpdatedEvent);

  }
};

Future<void> eventHandler(BaseEvent event) async {
  try {
    final String eventType = event.eventType;
    final dynamic payload = event.payload;
    eventsFunctions[eventType]!(payload);
  } catch (err) {
    print(err);
  }
}

Future<void> startQueue() async {
  try {
    await consumeEvents('aluguel_queue', 'aluguel.avaiability.checked', eventHandler);
  } catch (err) {
    print("Couldn't start the service queues");
    exit(1);
  }
}
