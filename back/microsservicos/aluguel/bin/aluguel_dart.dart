import 'dart:io';
import 'dart:async';
import 'package:aluguel_dart/application/get_all_aluguel_usecase.dart';
import 'package:aluguel_dart/infrastructure/clients/rabbitmq/rabbitmq.dart';
import 'package:aluguel_dart/presentation/events/event_handler.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_all_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/router.dart';
import 'package:aluguel_dart/shared/environments.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';

import 'package:aluguel_dart/application/get_aluguel_usecase.dart';
import 'package:aluguel_dart/application/create_aluguel_usecase.dart';
import 'package:aluguel_dart/application/update_aluguel_usecase.dart';
import 'package:aluguel_dart/application/delete_aluguel_usecase.dart';
import 'package:aluguel_dart/application/verify_door_code_usecase.dart';
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/create_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/update_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/delete_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_door_hash_controller.dart';

Future<void> _shutdownServer(HttpServer server, String message) async {
  stdout.writeln(message);
  try {
    await closeRabbitMQConnection();
  } catch (e) {
    stderr.writeln('Erro ao fechar RabbitMQ: $e');
  } finally {
    try {
      await server.close(force: true);
    } catch (_) {}
    exit(0);
  }
}

Future<void> main() async {
  final AluguelRepository repo = Environments.getAluguelRepo();

  final getAluguelUsecase = GetAluguelUsecase(repository: repo);
  final createAluguelUsecase = CreateAluguelUsecase(repository: repo);
  final updateAluguelUsecase = UpdateAluguelUsecase(repository: repo);
  final deleteAluguelUsecase = DeleteAluguelUsecase(repository: repo);
  final getAllAluguelUsecase = GetAllAluguelUsecase(repository: repo);
  final verifyDoorCodeUsecase = VerifyDoorCodeUsecase(repository: repo);

  final getController = GetAluguelController(getAluguelUsecase);
  final createController = CreateAluguelController(createAluguelUsecase);
  final updateController = UpdateAluguelController(updateAluguelUsecase);
  final deleteController = DeleteAluguelController(deleteAluguelUsecase);
  final getAllAluguelController = GetAllAluguelController(getAllAluguelUsecase);
  final getDoorHashController = GetDoorHashController(verifyDoorCodeUsecase);

  final router = Router()
    ..mount(
      '/',
      buildAluguelRoutes(
        getController: getController,
        createController: createController,
        updateController: updateController,
        deleteController: deleteController,
        getAllAluguelController: getAllAluguelController,
        getDoorHashController: getDoorHashController,
      ).call,
    );

  final handler = Pipeline()
      .addMiddleware(corsHeaders())
      .addMiddleware(logRequests())
      .addHandler(router.call);

  final port = Environments.getEnvs().port;
  final server = await io.serve(handler, InternetAddress.anyIPv4, port);
  print('Aluguel. Porta: $port');
  await startQueue();
  ProcessSignal.sigint.watch().listen(
    (_) async => _shutdownServer(server, 'Service aluguel interrupted!'),
  );
  if (!Platform.isWindows) {
    ProcessSignal.sigterm.watch().listen(
      (_) async => _shutdownServer(server, 'Service aluguel terminated!'),
    );
  }
}
