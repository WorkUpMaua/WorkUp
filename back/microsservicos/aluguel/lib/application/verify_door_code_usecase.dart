import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';

class VerifyDoorCodeUsecase {
  final AluguelRepository repository;

  VerifyDoorCodeUsecase({required this.repository});

  Future<bool> call({
    required String aluguelId,
    required String plainDoorCode,
  }) async {
    if (!RegExp(r'^\d{5}$').hasMatch(plainDoorCode)) {
      throw StateError('doorCode deve conter exatamente 5 digitos.');
    }

    final aluguel = await repository.getAluguel(aluguelId);

    if (aluguel == null) {
      throw StateError('aluguel_not_found');
    }

    if (aluguel.status.toUpperCase() != 'CONFIRMED') {
      return false;
    }

    final nowEpoch = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    if (nowEpoch < aluguel.startDate || nowEpoch > aluguel.endDate) {
      return false;
    }

    return await verifyDoorCodeWithCatalog(
      workspaceId: aluguel.workspaceId,
      doorCode: plainDoorCode,
    );
  }
}
