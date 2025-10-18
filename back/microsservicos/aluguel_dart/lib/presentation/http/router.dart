import 'package:aluguel_dart/presentation/http/controllers/create_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/delete_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/update_aluguel_controller.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';


Router buildAluguelRoutes({
  required GetAluguelController getController,
  required CreateAluguelController createController,
  required UpdateAluguelController updateController,
  required DeleteAluguelController deleteController,
}) {
  final r = Router();

  // Health
  r.get('/health', (_) => Response.ok('ok'));

  r.get('/aluguel', getController.handle);

  r.post('/aluguel', createController.handle);

  r.patch('/aluguel', updateController.handle);

  r.delete('/aluguel', deleteController.handle);

  return r;
}
