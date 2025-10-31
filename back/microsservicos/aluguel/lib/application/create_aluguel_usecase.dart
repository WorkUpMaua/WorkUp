import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq_event.dart';
import 'package:aluguel_dart/shared/security/door_code_hasher.dart';

class CreateAluguelUsecase {
  final AluguelRepository repository;

  CreateAluguelUsecase({required this.repository});

  Future<Aluguel> call({
    required String userId,
    required String workspaceId,
    required int startDate,
    required int endDate,
    required int people,
    required num finalPrice,
    String? doorCode,
  }) async {
    if (endDate < startDate) {
      throw StateError('endDate não pode ser menor que startDate.');
    }
    if (people <= 0) {
      throw StateError(
        'O número de pessoas para a reserva deve ser diferente de null e maior que zero.',
      );
    }
    if (finalPrice < 0) {
      throw StateError('finalPrice não pode ser negativo.');
    }
    if (doorCode != null) {
      if (doorCode.isEmpty) {
        throw StateError('doorCode não pode ser vazio.');
      }
      if (!RegExp(r'^\d{5}$').hasMatch(doorCode)) {
        throw StateError('doorCode deve conter exatamente 5 dígitos.');
      }
    }

    final String? hashedDoorCode =
        doorCode != null ? hashDoorCode(doorCode) : null;

    final createdAluguel = await repository.createAluguel(
      userId: userId,
      workspaceId: workspaceId,
      startDate: startDate,
      endDate: endDate,
      people: people,
      finalPrice: finalPrice.toDouble(),
      status: 'PENDING',
      doorCode: hashedDoorCode,
    );

    final aluguelCreated = RabbitMQEvent(
      eventType: 'AluguelCreated',
      payload: createdAluguel.toJson(),
    );

    final published =
        await publishEvent('aluguel.created', aluguelCreated.toJson());

    if (published) {
      return createdAluguel;
    } else {
      throw StateError('Não foi possível criar o aluguel');
    }
  }
}
