import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';

class UpdateAluguelUsecase {
  final AluguelRepository repository;

  UpdateAluguelUsecase({required this.repository});

  Future<Aluguel> call(
    String id, {
    int? startDate,
    int? endDate,
    int? people,
    double? finalPrice,
    String? status,
    String? doorCode,
  }) async {
    if (startDate != null && endDate != null && endDate < startDate) {
      throw StateError('endDate não pode ser menor que startDate.');
    }
    if (people != null && people <= 0) {
      throw StateError('capacity deve ser maior que 0.');
    }
    if (finalPrice != null && finalPrice < 0) {
      throw StateError('finalPrice não pode ser negativo.');
    }

    String? desiredDoorCode = doorCode;

    if (status != null &&
        status.toUpperCase() == 'CONFIRMED' &&
        doorCode == null) {
      final current = await repository.getAluguel(id);
      if (current == null) {
        throw StateError('aluguel_not_found');
      }

      final fetchedDoorCode = await fetchDoorCodeFromCatalog(
        current.workspaceId,
      );
      if (fetchedDoorCode == null || fetchedDoorCode.isEmpty) {
        throw StateError('door_code_not_found');
      }
      desiredDoorCode = fetchedDoorCode;
    }

    String? sanitizedDoorCode;
    if (desiredDoorCode != null) {
      final trimmedDoorCode = desiredDoorCode.trim();
      if (trimmedDoorCode.isEmpty) {
        throw StateError('doorCode nǜo pode ser vazio.');
      }
      if (!RegExp(r'^\d{5}$').hasMatch(trimmedDoorCode)) {
        throw StateError('doorCode deve conter exatamente 5 d��gitos.');
      }
      sanitizedDoorCode = trimmedDoorCode;
    }

    return repository.updateAluguel(
      id,
      startDate: startDate,
      endDate: endDate,
      people: people,
      finalPrice: finalPrice,
      status: status,
      doorCode: sanitizedDoorCode,
    );
  }
}
