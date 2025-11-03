import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';

class VerifyDoorCodeUsecase {
  final AluguelRepository repository;

  VerifyDoorCodeUsecase({required this.repository});

  Future<bool> call({
    required String doorCode,
  }) async {

    final aluguel = await repository.getDoorAluguel(doorCode);

    if (aluguel == null) {
      throw StateError('Door code not found');
    }

    if (aluguel.status.toUpperCase() != 'CONFIRMED') {
      return false;
    }

    final nowEpoch = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    if (nowEpoch < aluguel.startDate || nowEpoch > aluguel.endDate) {
      return false;
    }

    return await verifyDoorCodeWithCatalog(
      aluguel: aluguel
    );
  }
}
