import 'dart:convert';

import 'package:shelf/shelf.dart';
import 'package:aluguel_dart/application/get_aluguel_usecase.dart';
import 'package:aluguel_dart/shared/http/json_response.dart';
import 'package:aluguel_dart/shared/http/app_failures.dart';

class GetAluguelController {
  final GetAluguelUsecase getAluguelUsecase;

  GetAluguelController(this.getAluguelUsecase);

  Future<Response> handle(Request req) async {
    try {

      final body = await req.readAsString();
      if (body.isEmpty) {
        throw AppFailure('body_required');
      }

      final data = jsonDecode(body);
      final id = data['id'] as String;
      
      if (id.trim().isEmpty) {
        throw AppFailure('id_required');
      }

      final aluguel = await getAluguelUsecase.call(id);

      return jsonOk(aluguel.toJson());

    } on AppFailure catch (e) {
      return jsonBadRequest({'error': e.message});
    } catch (e) {
      return jsonServerError({'error': 'internal_error', 'detail': e.toString()});
    }
  }
}
