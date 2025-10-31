import 'package:aluguel_dart/domain/entities/aluguel.dart';

abstract class AluguelRepository {
  Future<Aluguel> createAluguel({
    required String userId,
    required String workspaceId,
    required int startDate,
    required int endDate,
    required int people,
    required double finalPrice,
    required String status,
  });

  Future<Aluguel?> getAluguel(String id);

  Future<Map<String, Aluguel>?> getAllAluguel();

  Future<Aluguel> updateAluguel(
    String id, {
    int? startDate,
    int? endDate,
    int? people,
    double? finalPrice,
    String? status,
    String? doorCode,
  });


  Future<void> deleteAluguel(String id);
}
