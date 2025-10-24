import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq_event.dart';
import 'package:dart_amqp/dart_amqp.dart';
import 'package:aluguel_dart/shared/environments.dart';

final String RABBITMQ_URL = Environments.getEnvs().rabbitmqURL;

void _ensureRabbitUrlOrExit() {
  if (RABBITMQ_URL.isEmpty || RABBITMQ_URL == 'not-found') {
    stderr.writeln('Environment variable RABBITMQ_URL is not defined.');
    exit(1);
  }
}

const String EXCHANGE_NAME = 'global_events';

Client? _client;
Channel? _channel;

/// Abre (ou reaproveita) a conexão e retorna um Channel
Future<Channel> connectRabbitMQ() async {
  if (_channel != null) {
    return _channel!;
  }

  _ensureRabbitUrlOrExit();

  try {
    final uri = Uri.parse(RABBITMQ_URL);

    final settings = ConnectionSettings(
      host: uri.host,
      port: uri.hasPort ? uri.port : 5672,
      authProvider: PlainAuthenticator(
        'guest',
        'guest',
      ),
      virtualHost: uri.path.isNotEmpty ? uri.path.substring(1) : '/',
    );

    _client = Client(settings: settings);
    _channel = await _client!.channel();
    stdout.writeln('[RabbitMQ] Connected to RabbitMQ.');
    stdout.writeln('[RabbitMQ] Channel created.');
    return _channel!;
  } catch (error) {
    stderr.writeln('[RabbitMQ] Failed to connect or create channel: $error');
    rethrow;
  }
}

/// Publica um evento no Exchange Global do tipo 'topic'.
/// Mantém a assinatura e o retorno booleano do TS.
Future<bool> publishEvent(
  String routingKey,
  Map<String, dynamic> eventData, // <- força plain object, como no TS
) async {
  try {
    final ch = await connectRabbitMQ();

    final exchange = await ch.exchange(
      EXCHANGE_NAME,
      ExchangeType.TOPIC,
      durable: true,
    );

    final bodyBytes = utf8.encode(jsonEncode(eventData));

    final props = MessageProperties()..deliveryMode = 2; // persistente
    exchange.publish(bodyBytes, routingKey, properties: props);

    stdout.writeln(
      "[PUBLISHER] Topic Event '$routingKey' published to '$EXCHANGE_NAME': $eventData",
    );
    return true;
  } catch (error) {
    stderr.writeln(
      "[PUBLISHER] Error publishing Topic Event '$routingKey' to '$EXCHANGE_NAME': $error",
    );
    return false;
  }
}

Future<void> consumeEvents<T extends Object>(
  String queueName,
  String bindingKey,
  Future<void> Function(T event) callback,
) async {
  try {
    final ch = await connectRabbitMQ();

    final exchange = await ch.exchange(
      EXCHANGE_NAME,
      ExchangeType.TOPIC,
      durable: true,
    );

    final queue = await ch.queue(
      queueName,
      durable: true,
      autoDelete: false,
      exclusive: false,
    );

    await ch.qos(0, 1);
    await queue.bind(exchange, bindingKey);

    stdout.writeln("[CONSUMER] Listening on queue '$queueName' with binding '$bindingKey'");

    final consumer = await queue.consume();

    consumer.listen((AmqpMessage msg) async {
      try {
        final raw = msg.payloadAsString;
        final decoded = jsonDecode(raw);

        final rk = (msg.routingKey?.isNotEmpty ?? false) ? msg.routingKey! : bindingKey;

        final Map<String, dynamic> payload =
            decoded is Map<String, dynamic> ? decoded : <String, dynamic>{'data': decoded};

        final event = RabbitMQEvent(eventType: rk, payload: payload);

        stdout.writeln('[CONSUMER] Received ($rk): $payload');
        await callback(event as T);

        msg.ack();
      } catch (err) {
        stderr.writeln('[CONSUMER] Error processing message: $err');
        msg.reject(false);
      }
    });
  } catch (err) {
    stderr.writeln('[CONSUMER] Error setting up consumer: $err');
    rethrow;
  }
}

/// Fecha canal e conexão (espelhando a função TS)
Future<void> closeRabbitMQConnection() async {
  if (_channel != null) {
    try {
      await _channel!.close();
      stdout.writeln('[RabbitMQ] Channel closed.');
    } catch (error) {
      stderr.writeln('Error closing channel: $error');
    } finally {
      _channel = null;
    }
  }

  if (_client != null) {
    try {
      await _client!.close();
      stdout.writeln('[RabbitMQ] Connection closed.');
    } catch (error) {
      stderr.writeln('Error closing connection: $error');
    } finally {
      _client = null;
    }
  }
}

const String _DELAY_EXCHANGE = 'aluguel.delay.ex'; // exchange de delay (direct)
const String _DELAY_QUEUE = 'aluguel.delay.q';     // fila de delay
const String _DELAY_RK = 'aluguel.expire';         // routing key para entrar no delay
const String _EXPIRED_RK = 'aluguel.expired';      // routing key de saída (vai para EXCHANGE_NAME)

Future<void> _ensureDelayInfra(Channel ch) async {
  // Exchange/Fila de delay: quando a msg expira, vai para o exchange principal (EXCHANGE_NAME)
  final delayEx = await ch.exchange(_DELAY_EXCHANGE, ExchangeType.DIRECT, durable: true);

  final delayQ = await ch.queue(
    _DELAY_QUEUE,
    durable: true,
    arguments: <String, Object>{
      'x-dead-letter-exchange': EXCHANGE_NAME, // seu exchange principal (topic)
      'x-dead-letter-routing-key': _EXPIRED_RK,
    },
  );

  await delayQ.bind(delayEx, _DELAY_RK);
}

/// Agenda um evento para ser disparado em `endDateMs`.
/// Se `endDateMs` já passou, publica imediatamente em `EXCHANGE_NAME` com routing key `_EXPIRED_RK`.
Future<void> scheduleAluguelExpiration({
  required String aluguelId,
  required int endDateMs, // timestamp em ms (UTC)
}) async {
  final ch = await connectRabbitMQ();
  final now = DateTime.now().toUtc().millisecondsSinceEpoch;
  final delayMs = endDateMs - now;

  if (delayMs <= 0) {
    // já venceu: publica direto no exchange principal
    final mainEx = await ch.exchange(EXCHANGE_NAME, ExchangeType.TOPIC, durable: true);
    final msg = {'aluguelId': aluguelId};
    final props = MessageProperties()..deliveryMode = 2;
    mainEx.publish(utf8.encode(jsonEncode(msg)), _EXPIRED_RK, properties: props);
    stdout.writeln("[SCHEDULER] Expired immediately -> $_EXPIRED_RK payload=$msg");
    return;
  }

  await _ensureDelayInfra(ch);

  final delayEx = await ch.exchange(_DELAY_EXCHANGE, ExchangeType.DIRECT, durable: true);
  final props = MessageProperties()
    ..deliveryMode = 2
    ..expiration = delayMs.toString(); 

  final payload = {'aluguelId': aluguelId};
  delayEx.publish(utf8.encode(jsonEncode(payload)), _DELAY_RK, properties: props);
  stdout.writeln("[SCHEDULER] Scheduled in ${delayMs}ms -> $_DELAY_EXCHANGE:$_DELAY_RK payload=$payload");
}
