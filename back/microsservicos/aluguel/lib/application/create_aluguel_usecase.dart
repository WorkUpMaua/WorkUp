import 'package:aluguel_dart/domain/entities/aluguel.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq_event.dart';

class CreateAluguelUsecase {
  final AluguelRepository repository;

  CreateAluguelUsecase({required this.repository});

  Future<Aluguel> call({
    required String userId,
    required String workspaceId,
    required int startDate, 
    required int endDate,   
    required int people,
    required num finalPrice,
  }) async {

    if (endDate < startDate) {
      throw StateError('endDate não pode ser menor que startDate.');
    }
    if (people <= 0) {
      throw StateError('O número de pessoas para a reserva deve ser diferente de null e maior que.');
    }
    if (finalPrice < 0) {
      throw StateError('finalPrice não pode ser negativo.');
    }

    Aluguel createdAluguel = await repository.createAluguel(
      userId: userId,
      workspaceId: workspaceId,
      startDate: startDate,
      endDate: endDate,
      people: people,
      finalPrice: finalPrice.toDouble(),
      status: 'PENDING',
    );

    RabbitMQEvent aluguelCreated = RabbitMQEvent(eventType: 'AluguelCreated', payload: createdAluguel.toJson());

    final published = await publishEvent('aluguel.created', aluguelCreated.toJson());

    if(published){
      return createdAluguel;
    } else {
      throw StateError('Não foi possível criar o aluguel');
    }

  }
}
    
    
    
