import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:dart_amqp/dart_amqp.dart';
import 'package:aluguel_dart/shared/environments.dart';

const String EXCHANGE_NAME = 'global_events';

final String RABBITMQ_URL = Environments.getEnvs().rabbitmqURL;

void _ensureRabbitUrlOrExit() {
  if (RABBITMQ_URL.isEmpty || RABBITMQ_URL == 'not-found') {
    stderr.writeln('Environment variable RABBITMQ_URL is not defined.');
    exit(1);
  }
}

Client? _connection;
Channel? _channel;

/// Invalida (fecha com segurança) o canal cacheado e zera a referência
Future<void> _invalidateChannel({String reason = 'unknown'}) async {
  try {
    if (_channel != null) {
      await _channel!.close();
    }
  } catch (_) {
    // ignore
  } finally {
    _channel = null;
    stdout.writeln('[RabbitMQ] Channel invalidated (reason: $reason). Will recreate on next use.');
  }
}

/// Retorna (ou cria) a conexão
Future<Client> _getConnection() async {
  if (_connection != null) return _connection!;

  _ensureRabbitUrlOrExit();
  final uri = Uri.parse(RABBITMQ_URL);

  final user = uri.userInfo.isNotEmpty ? Uri.decodeComponent(uri.userInfo.split(':').first) : 'guest';
  final pass = (uri.userInfo.contains(':'))
      ? Uri.decodeComponent(uri.userInfo.split(':').last)
      : 'guest';

  final settings = ConnectionSettings(
    host: uri.host,
    port: uri.hasPort ? uri.port : 5672,
    virtualHost: uri.path.isNotEmpty ? uri.path.substring(1) : '/',
    authProvider: PlainAuthenticator(user, pass),
    // Se precisar TLS, use: tls: TlsSettings(),
  );

  _connection = Client(settings: settings);
  return _connection!;
}

/// Cria (ou retorna) um canal pronto para uso e com o exchange declarado (como no TS)
Future<Channel> connectRabbitMQ() async {
  if (_channel != null) return _channel!;
  try {
    final conn = await _getConnection();
    _channel = await conn.channel();

    // Espelha o TS: assert do exchange topic/durable
    await _channel!.exchange(EXCHANGE_NAME, ExchangeType.TOPIC, durable: true);

    stdout.writeln('[RabbitMQ] Connected. Channel created and exchange asserted.');
    return _channel!;
  } catch (e) {
    stderr.writeln('[RabbitMQ] Failed to connect/create channel: $e');
    rethrow;
  }
}

/// Wrapper: executa ação no canal com retry 1x se o canal morrer
Future<T> _withChannel<T>(Future<T> Function(Channel ch) action, {required String op}) async {
  Future<T> attempt() async {
    final ch = await connectRabbitMQ();
    return action(ch);
  }

  try {
    return await attempt();
  } on ChannelException catch (e) {
    stderr.writeln('[RabbitMQ] ChannelException during $op: $e. Recreating channel and retrying once...');
    await _invalidateChannel(reason: 'ChannelException:$e');
    final result = await attempt();
    stdout.writeln('[RabbitMQ] $op succeeded after channel recreation.');
    return result;
  } on IOException catch (e) {
    stderr.writeln('[RabbitMQ] IOException during $op: $e. Recreating channel and retrying once...');
    await _invalidateChannel(reason: 'IOException:$e');
    final result = await attempt();
    stdout.writeln('[RabbitMQ] $op succeeded after channel recreation.');
    return result;
  } on StateError catch (e) {
    stderr.writeln('[RabbitMQ] StateError during $op: $e. Recreating channel and retrying once...');
    await _invalidateChannel(reason: 'StateError:$e');
    final result = await attempt();
    stdout.writeln('[RabbitMQ] $op succeeded after channel recreation.');
    return result;
  }
}

/// Publica evento (payload cru), igual ao TS. Retorna true se não houve exceção.
/// OBS: dart_amqp não expõe backpressure (bool). Consideramos sucesso se publicar sem lançar exceção.
Future<bool> publishEvent<T extends Object>(
  String routingKey,
  T eventData,
) async {
  return _withChannel<bool>((ch) async {
    final exchange = await ch.exchange(EXCHANGE_NAME, ExchangeType.TOPIC, durable: true);

    final body = utf8.encode(jsonEncode(eventData));
    final props = MessageProperties()..deliveryMode = 2; // persistente

    exchange.publish(body, routingKey, properties: props);

    stdout.writeln("[PUBLISHER] Topic '$routingKey' published to '$EXCHANGE_NAME': $eventData");
    return true;
  }, op: 'publishEvent');
}

/// Consome eventos entregando payload cru T para o callback (paridade com TS).
/// Ack no sucesso; nack (sem requeue) no erro.
Future<void> consumeEvents<T extends Object>(
  String queueName,
  String bindingKey,
  Future<void> Function(T event) callback,
) async {
  await _withChannel<void>((ch) async {
    // Declarar exchange (assert) como no TS
    final exchange = await ch.exchange(EXCHANGE_NAME, ExchangeType.TOPIC, durable: true);

    final queue = await ch.queue(
      queueName,
      durable: true,
      exclusive: false,
      autoDelete: false,
    );

    await ch.qos(0, 1); // prefetch(1)

    // ✅ Correção: bind usando o objeto Exchange, não a string
    await queue.bind(exchange, bindingKey);

    stdout.writeln("[CONSUMER] Listening on queue '$queueName' with binding '$bindingKey'");

    final consumer = await queue.consume(noAck: false);

    consumer.listen(
      (AmqpMessage msg) async {
        bool ackedOrRejected = false;
        try {
          final payload = jsonDecode(msg.payloadAsString) as T;
          stdout.writeln('[CONSUMER] Received (${msg.routingKey ?? bindingKey}): $payload');

          await callback(payload);

          if (!ackedOrRejected) {
            msg.ack(); // ack na mensagem (dart_amqp)
            ackedOrRejected = true;
          }
        } catch (err) {
          stderr.writeln('[CONSUMER] Error processing message: $err');
          if (!ackedOrRejected) {
            msg.reject(false); // nack sem requeue (equivalente ao TS: nack(msg, false, false))
            ackedOrRejected = true;
          }
        }
      },
      onError: (err) async {
        stderr.writeln('[CONSUMER] Stream error: $err. Marking channel as dead.');
        await _invalidateChannel(reason: 'consumer.onError:$err');
      },
      onDone: () async {
        stderr.writeln('[CONSUMER] Stream closed. Marking channel as dead.');
        await _invalidateChannel(reason: 'consumer.onDone');
      },
      cancelOnError: false,
    );
  }, op: 'consumeEvents.setup');
}

/// Fecha canal e conexão (paridade com TS)
Future<void> closeRabbitMQConnection() async {
  if (_channel != null) {
    try {
      await _channel!.close();
      stdout.writeln('[RabbitMQ] Channel closed.');
    } catch (e) {
      stderr.writeln('Error closing channel: $e');
    } finally {
      _channel = null;
    }
  }

  if (_connection != null) {
    try {
      await _connection!.close();
      stdout.writeln('[RabbitMQ] Connection closed.');
    } catch (e) {
      stderr.writeln('Error closing connection: $e');
    } finally {
      _connection = null;
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
  required String eventType,
  required Map<String, dynamic> payload
}) async {
  final ch = await connectRabbitMQ();
  final now = DateTime.now().toUtc().millisecondsSinceEpoch;
  final delayMs = (payload['endDate'] * 1000) - now;

  if (delayMs <= 0) {
    // já venceu: publica direto no exchange principal
    final mainEx = await ch.exchange(EXCHANGE_NAME, ExchangeType.TOPIC, durable: true);
    final msg = {
      'eventType': eventType,
      'payload': payload
    };
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

  final data = {
      'eventType': eventType,
      'payload': payload
    };
  delayEx.publish(utf8.encode(jsonEncode(data)), _DELAY_RK, properties: props);
  stdout.writeln("[SCHEDULER] Scheduled in ${delayMs}ms -> $_DELAY_EXCHANGE:$_DELAY_RK payload=$payload");
}
