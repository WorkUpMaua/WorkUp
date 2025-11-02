import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';

class GetAluguelUsecase {
  final AluguelRepository repository;

  GetAluguelUsecase({required this.repository});

  Future<Aluguel> call(String id) async {
    if (id.isEmpty) {
      throw ArgumentError('ID do aluguel não pode ser vazio.');
    }

    final aluguel = await repository.getAluguel(id);

    if (aluguel == null) {
      throw StateError('Nenhum aluguel encontrado com o ID "$id".');
    }

    return aluguel;
  }
}
