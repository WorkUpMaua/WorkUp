import 'dart:collection';
import 'package:uuid/uuid.dart';

import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';

class AluguelRepositoryMock implements AluguelRepository {
  Map<String, Aluguel> store = HashMap();
  final Uuid uuid = const Uuid();

  String newId() => uuid.v4();

  @override
  Future<Aluguel> createAluguel({
    required String userId,
    required String workspaceId,
    required int startDate,
    required int endDate,
    required int people,
    required double finalPrice,
    required String status,
  }) async {


    final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    final id = newId();

    final novo = Aluguel(
      id: id,
      userId: userId,
      workspaceId: workspaceId,
      startDate: startDate,
      endDate: endDate,
      people: people,
      finalPrice: finalPrice,
      status: status,
      createdAt: now,
      updatedAt: now,
    );

    store[id] = novo;
    return novo;
  }

  @override
  Future<Aluguel?> getAluguel(String id) async {
    return store[id];
  }

  @override
  Future<Map<String, Aluguel>?> getAllAluguel() async {
    return store;
  }

  @override
  Future<Aluguel> updateAluguel(
    String id, {
    int? startDate,
    int? endDate,
    int? people,
    double? finalPrice,
    String? status,
    String? doorCode,
  }) async {
    final atual = store[id];

    if (atual == null) {
      throw StateError('Nenhum aluguel encontrado com o ID "$id".');
    }

    final novoStart = startDate ?? atual.startDate;
    final novoEnd = endDate ?? atual.endDate;

    final updated = Aluguel(
      id: atual.id,
      userId: atual.userId,
      workspaceId: atual.workspaceId,
      startDate: novoStart,
      endDate: novoEnd,
      people: people ?? atual.people,
      finalPrice: finalPrice ?? atual.finalPrice,
      status: status ?? atual.status,
      doorCode: doorCode ?? atual.doorCode,
      createdAt: atual.createdAt,
      updatedAt: DateTime.now().millisecondsSinceEpoch ~/ 1000,
    );

    store[id] = updated;
    return updated;
  }

  @override
  Future<void> deleteAluguel(String id) async {
    final removed = store.remove(id);
    if (removed == null) {
      throw StateError('Aluguel com id "$id" não encontrado para exclusão.');
    }
  }

  @override
  Future<Aluguel?> getDoorAluguel(String doorCode) async {
    for (var aluguel in store.values) {

      if (aluguel.doorCode == doorCode) {
        return aluguel;
      }

    }
    return null;
  }

}
