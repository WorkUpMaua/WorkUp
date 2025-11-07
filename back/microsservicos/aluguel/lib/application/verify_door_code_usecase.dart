import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';

class VerifyDoorCodeUsecase {
  final AluguelRepository repository;

  VerifyDoorCodeUsecase({required this.repository});

  Future<String> call({
    required String doorCode,
  }) async {
    final normalizedDoorCode = doorCode.trim();

    if (!RegExp(r'^\d{5}$').hasMatch(normalizedDoorCode)) {
      throw StateError('door code invalid');
    }

    final allAlugueis = await repository.getAllAluguel();

    if (allAlugueis == null || allAlugueis.isEmpty) {
      throw StateError('door code not found');
    }

    final nowEpoch = DateTime.now().millisecondsSinceEpoch ~/ 1000;

    Aluguel? matchingAluguel;

    for (final aluguel in allAlugueis.values) {
      final storedDoor = aluguel.doorCode?.trim();
      if (storedDoor == null || storedDoor.isEmpty) {
        continue;
      }
      if (storedDoor != normalizedDoorCode) {
        continue;
      }
      if (aluguel.status.toUpperCase() != 'CONFIRMED') {
        continue;
      }
      if (nowEpoch < aluguel.startDate || nowEpoch > aluguel.endDate) {
        continue;
      }
      matchingAluguel = aluguel;
      break;
    }

    if (matchingAluguel == null) {
      throw StateError('door code not found');
    }

    final doorSerial = await fetchDoorCodeFromCatalog(
      matchingAluguel.workspaceId,
    );

    if (doorSerial == null || doorSerial.trim().isEmpty) {
      throw StateError('door serial not found');
    }

    return doorSerial.trim();
  }
}
