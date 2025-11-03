import 'dart:io';
import 'package:aluguel_dart/application/update_aluguel_usecase.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq_event.dart';
import 'package:aluguel_dart/shared/environments.dart';

typedef EventHandlerFn = Future<void> Function(dynamic payload);

final Map<String, EventHandlerFn> eventsFunctions = {
  'AvaiabilityChecked': (payload) async {
    final aluguelID = payload["aluguel"]["id"];
    final people = payload["aluguel"]['people'];
    final availableSpots = payload['availableSpots'];
    try {
      if (people <= availableSpots) {
        final updatedAluguel = await UpdateAluguelUsecase(
          repository: Environments.getAluguelRepo(),
        ).call(aluguelID, status: 'CONFIRMED');
        final aluguelConfirmed = RabbitMQEvent(
          eventType: 'AluguelConfirmed',
          payload: updatedAluguel.toJson(),
        );
        await publishEvent('aluguel.updated', aluguelConfirmed.toJson());
        await scheduleAluguelExpiration(
          eventType: 'AluguelExpired',
          payload: updatedAluguel.toJson(),
        );
      } else {
        await UpdateAluguelUsecase(
          repository: Environments.getAluguelRepo(),
        ).call(aluguelID, status: 'CANCELED');
      }
    } catch (error) {
      print('[AvaiabilityChecked] Failed to handle "$aluguelID": $error');
    }
  },
  'AvaiabilityFree': (payload) async {
    final aluguelID = payload["aluguel"]["bookingID"];
    final repo = Environments.getAluguelRepo();
    try {
      final existing = await repo.getAluguel(aluguelID);
      if (existing == null) {
        print(
          '[AvaiabilityFree] Ignoring event. Aluguel "$aluguelID" not found.',
        );
        return;
      }

      final updatedAluguel = await UpdateAluguelUsecase(
        repository: repo,
      ).call(aluguelID, status: 'COMPLETED');
      final aluguelCompleted = RabbitMQEvent(
        eventType: 'AluguelCompleted',
        payload: updatedAluguel.toJson(),
      );
      await publishEvent('aluguel.updated', aluguelCompleted.toJson());
    } catch (error) {
      print('[AvaiabilityFree] Failed to handle "$aluguelID": $error');
    }
  },
};

Future<void> eventHandler(Map<String, dynamic> event) async {
  try {
    RabbitMQEvent convertedEvent = RabbitMQEvent(
      eventType: event['eventType'],
      payload: event['payload'],
    );
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
