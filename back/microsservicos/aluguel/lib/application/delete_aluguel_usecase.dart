import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';

class DeleteAluguelUsecase {
  final AluguelRepository repository;

  DeleteAluguelUsecase({required this.repository});

  Future<void> call(String id) async {
    if (id.isEmpty) {
      throw ArgumentError('ID do aluguel não pode ser vazio.');
    }

    await repository.deleteAluguel(id);
  }
}
