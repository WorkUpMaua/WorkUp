import 'package:aluguel_dart/application/get_all_aluguel_usecase.dart';
import 'package:shelf/shelf.dart';
import 'package:aluguel_dart/shared/http/json_response.dart';
import 'package:aluguel_dart/shared/http/app_failures.dart';

class GetAllAluguelController {
  final GetAllAluguelUsecase getAllAluguelUsecase;

  GetAllAluguelController(this.getAllAluguelUsecase);

  Future<Response> handle(Request req) async {
    try {

      final store = await getAllAluguelUsecase.call();

      return jsonOk({
        'alugueis': store?.map((key, value) => MapEntry(key, value.toJson()))
      });

    } on AppFailure catch (e) {
      return jsonBadRequest({'error': e.message});
    } catch (e) {
      return jsonServerError({
        'error': 'internal_error',
        'detail': e.toString(),
      });
    }
  }
}
