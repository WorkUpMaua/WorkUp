import 'dart:io';
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
import 'package:aluguel_dart/domain/repositories/aluguel_repository.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/create_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/update_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/delete_aluguel_controller.dart';
Future<void> main() async {

  final AluguelRepository repo = Environments.getAluguelRepo();

  final getAluguelUsecase = GetAluguelUsecase(repository: repo);
  final createAluguelUsecase = CreateAluguelUsecase(repository: repo);
  final updateAluguelUsecase = UpdateAluguelUsecase(repository: repo);
  final deleteAluguelUsecase = DeleteAluguelUsecase(repository: repo);

  final getController = GetAluguelController(getAluguelUsecase);
  final createController = CreateAluguelController(createAluguelUsecase);
  final updateController = UpdateAluguelController(updateAluguelUsecase);
  final deleteController = DeleteAluguelController(deleteAluguelUsecase);

  final router = Router()
  ..mount(
    '/',
    buildAluguelRoutes(
      getController: getController,
      createController: createController,
      updateController: updateController,
      deleteController: deleteController,
    ).call,
  );

  final handler = Pipeline()
      .addMiddleware(corsHeaders())
      .addMiddleware(logRequests())
      .addHandler(router.call);
      
  final port = Environments.getEnvs().port;

  await io.serve(handler, InternetAddress.anyIPv4, port);
  print('Aluguel. Porta: $port');
}
