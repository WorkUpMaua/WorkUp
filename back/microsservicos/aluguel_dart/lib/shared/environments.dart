import 'dart:io';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/repositories/aluguel_repository_mock.dart';

enum Stage {
  dev,
  test,
}

class Environments {
  final Stage stage;
  final int port;
  final String rabbitmqURL;
  static dynamic _mockInstance;

  Environments._(this.stage, this.port, this.rabbitmqURL);

  static Environments getEnvs() {
    final rawStage = Platform.environment['STAGE']?.toUpperCase() ?? 'TEST';
    final Stage stage = Stage.values.firstWhere(
      (s) => s.name.toUpperCase() == rawStage,
      orElse: () => Stage.test,
    );
    
    final int port = int.tryParse(Platform.environment['ALUGUEL_PORT'] ?? '') ?? 8080;
    final String rabbitmqURL = Platform.environment['RABBITMQ_URL'] ?? 'not-found';

    return Environments._(stage, port, rabbitmqURL);
  }

  static AluguelRepository getAluguelRepo() {
    final env = Environments.getEnvs();
    switch (env.stage) {
      case Stage.test:
      _mockInstance ??= AluguelRepositoryMock();
      return _mockInstance;
      case Stage.dev:
        throw Exception('Repositório real ainda não configurado para DEV');
    }
  }

  @override
  String toString() => 'Environments(stage: $stage, port: $port)';
}
