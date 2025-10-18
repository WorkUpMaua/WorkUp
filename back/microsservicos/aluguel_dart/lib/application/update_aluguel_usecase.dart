import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';

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

    return repository.updateAluguel(
      id,
      startDate: startDate,
      endDate: endDate,
      people: people,
      finalPrice: finalPrice,
      status: status,
    );
  }
}
