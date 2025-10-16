import 'dart:io';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/infrastructure/repositories/aluguel_repository_mock.dart';

enum Stage {
  dev,
  test
}

class Environments {
  late Stage stage;

  Environments() {
    _loadStage();
  }

  void _loadStage() {
    final rawStage = Platform.environment['STAGE']?.toUpperCase() ?? 'TEST';
    switch (rawStage) {
      case 'DEV':
        stage = Stage.dev;
        break;
      case 'TEST':
        stage = Stage.test;
        break;
    }
  }

  static Environments get() {
    return Environments();
  }

  static AluguelRepository getAluguelRepo() {
    final env = Environments.get();

    switch (env.stage) {
        case Stage.test:
            return AluguelRepositoryMock();
        case Stage.dev:
        default:
            throw Exception('Nenhum repositório configurado para o stage: ${env.stage}');
    }
  }

  @override
  String toString() {
    return 'Environments(stage: $stage)';
  }
}
