import 'dart:collection';
import 'package:uuid/uuid.dart';

import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';

class AluguelRepositoryMock implements AluguelRepository {
  Map<String, Aluguel> store = HashMap();
  final Uuid uuid = const Uuid();

  AluguelRepositoryMock() {
    final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;

    store = {
      "aluguel_1": Aluguel(
        id: "aluguel_1",
        userId: "user_001",
        workspaceId: "workspace_A",
        startDate: now + 86400,
        endDate: now + 172800, 
        people: 2,
        finalPrice: 150.0,
        status: "confirmed",
        createdAt: now - 3600, 
        updatedAt: now - 1800,
      ),
      "aluguel_2": Aluguel(
        id: "aluguel_2",
        userId: "user_002",
        workspaceId: "workspace_B",
        startDate: now - 172800, 
        endDate: now - 86400, 
        people: 3,
        finalPrice: 200.0,
        status: "completed",
        createdAt: now - 259200, 
        updatedAt: now - 86400, 
      ),
      "aluguel_3": Aluguel(
        id: "aluguel_3",
        userId: "user_003",
        workspaceId: "workspace_A",
        startDate: now + 259200,
        endDate: now + 345600,   
        people: 1,
        finalPrice: 100.0,
        status: "pending",
        createdAt: now - 7200,  
        updatedAt: now - 3600,   
      ),
    };
  }

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


    final now = DateTime.now().millisecondsSinceEpoch;
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
      createdAt: atual.createdAt,
      updatedAt: DateTime.now().millisecondsSinceEpoch,
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
}
