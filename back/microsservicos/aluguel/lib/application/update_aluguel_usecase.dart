import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/shared/security/door_code_hasher.dart';

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
    String? hashedDoorCode;
    if (doorCode != null) {
      if (doorCode.isEmpty) {
        throw StateError('doorCode não pode ser vazio.');
      }
      if (!RegExp(r'^\d{5}$').hasMatch(doorCode)) {
        throw StateError('doorCode deve conter exatamente 5 dígitos.');
      }
      hashedDoorCode = hashDoorCode(doorCode);
    }

    return repository.updateAluguel(
      id,
      startDate: startDate,
      endDate: endDate,
      people: people,
      finalPrice: finalPrice,
      status: status,
      doorCode: hashedDoorCode,
    );
  }
}