import 'package:aluguel_dart/presentation/http/controllers/create_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/delete_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_all_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_aluguel_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/get_door_hash_controller.dart';
import 'package:aluguel_dart/presentation/http/controllers/update_aluguel_controller.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';


Router buildAluguelRoutes({
  required GetAluguelController getController,
  required CreateAluguelController createController,
  required UpdateAluguelController updateController,
  required DeleteAluguelController deleteController,
  required GetAllAluguelController getAllAluguelController,
  required GetDoorHashController getDoorHashController,
}) {
  final r = Router();

  // Health
  r.get('/health', (_) => Response.ok('ok'));

  r.get('/aluguel', getController.handle);

  r.get('/all-aluguel', getAllAluguelController.handle);

  r.post('/aluguel', createController.handle);

  r.patch('/aluguel', updateController.handle);

  r.delete('/aluguel', deleteController.handle);

  r.post('/get-door-hash', getDoorHashController.handle);

  return r;
}
