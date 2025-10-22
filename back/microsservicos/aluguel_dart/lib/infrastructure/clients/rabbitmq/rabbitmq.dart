import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:aluguel_dart/shared/environments.dart';
import 'package:dart_amqp/dart_amqp.dart';

class RabbitMQClient {
  RabbitMQClient._();

  static final String _exchangeName = 'global_events';
  static Client? _client;
  static Channel? _channel;
  static Exchange? _exchange;

  static Future<Channel> _connectRabbitMQ() async {
    if (_channel != null) return _channel!;

    final rabbitUrl = Environments.getEnvs().rabbitmqURL;
    if (rabbitUrl == 'not-found' || rabbitUrl.isEmpty) {
      stderr.writeln('Environment variable RABBITMQ_URL is not defined.');
      exit(1);
    }

    final uri = Uri.parse(rabbitUrl);

    final settings = ConnectionSettings(
      host: uri.host,
      port: uri.hasPort ? uri.port : 5672,
      authProvider: PlainAuthenticator(
        uri.userInfo.split(':').first,
        uri.userInfo.contains(':') ? uri.userInfo.split(':').last : '',
      ),
      virtualHost: uri.path.isNotEmpty ? uri.path.substring(1) : '/',
    );

    _client = Client(settings: settings);

    _channel = await _client!.channel();
    await _channel!.qos(prefetchCount: 1);

    _exchange = await _channel!.exchange(
      _exchangeName,
      ExchangeType.TOPIC,
      durable: true,
    );

    _client!.connectionListener = ConnectionListener(
      onConnected: () => stdout.writeln('[RabbitMQ] Connected.'),
      onDisconnected: () {
        stderr.writeln('[RabbitMQ] Disconnected.');
        _channel = null;
        _exchange = null;
        _client = null;
      },
    );

    return _channel!;
  }

  /// Publica JSON no exchange topic `global_events`.
  static Future<bool> publishEvent<T extends Object>(
    String routingKey,
    T eventData, {
    Map<String, Object?>? headers,
  }) async {
    try {
      final ch = await _connectRabbitMQ();
      final ex = _exchange ??= await ch.exchange(
        _exchangeName,
        ExchangeType.TOPIC,
        durable: true,
      );

      final payload = utf8.encode(jsonEncode(eventData));
      ex.publish(
        payload,
        routingKey,
        properties: MessageProperties()
          ..contentType = 'application/json'
          ..deliveryMode = 2
          ..headers = headers,
      );

      stdout.writeln("[PUBLISHER] '$routingKey' -> '$_exchangeName': $eventData");
      return true;
    } catch (e) {
      stderr.writeln("[PUBLISHER] Error '$routingKey': $e");
      return false;
    }
  }

  /// Consome mensagens JSON de uma fila ligada por `bindingKey`.
  static Future<void> consumeEvents<T extends Object>(
    String queueName,
    String bindingKey,
    Future<void> Function(T event) callback,
  ) async {
    final ch = await _connectRabbitMQ();

    // Declara queue durável
    final queue = await ch.queue(
      queueName,
      durable: true,
      autoDelete: false,
      exclusive: false,
    );

    // Garante exchange e faz bind
    final ex = _exchange ??= await ch.exchange(
      _exchangeName,
      ExchangeType.TOPIC,
      durable: true,
    );
    await queue.bind(ex, routingKey: bindingKey);

    stdout.writeln("[CONSUMER] Listening '$queueName' (binding='$bindingKey')");

    // Inicia o consumo com ack manual
    final consumer = await queue.consume(noAck: false);

    consumer.listen((AmqpMessage msg) async {
      try {
        final bodyStr = utf8.decode(msg.payload);
        final dynamic decoded = jsonDecode(bodyStr);
        await callback(decoded as T);
        msg.ack();
      } catch (e) {
        stderr.writeln('[CONSUMER] Error: $e');
        msg.reject(requeue: false);
      }
    });
  }

  static Future<void> closeRabbitMQConnection() async {
    try {
      await _client?.close();
      stdout.writeln('[RabbitMQ] Connection closed.');
    } catch (e) {
      stderr.writeln('Error closing connection: $e');
    } finally {
      _exchange = null;
      _channel = null;
      _client = null;
    }
  }
}
