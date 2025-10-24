import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';

class GetAllAluguelUsecase {
  final AluguelRepository repository;

  GetAllAluguelUsecase({required this.repository});

  Future<Map<String, Aluguel>?> call() async {
    return await repository.getAllAluguel();
  }
}
