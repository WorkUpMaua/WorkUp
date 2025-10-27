import 'package:aluguel_dart/domain/events/base_event.dart';

class RabbitMQEvent implements BaseEvent {
  @override
  final String eventType;

  @override
  final Map<String, dynamic> payload;

  const RabbitMQEvent({
    required this.eventType,
    required this.payload,
  });

  Map<String, dynamic> toJson() => {
    'eventType': eventType,
    'payload': payload,
  };
}
