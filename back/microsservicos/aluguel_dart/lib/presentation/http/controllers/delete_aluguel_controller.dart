import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:aluguel_dart/application/delete_aluguel_usecase.dart';
import 'package:aluguel_dart/shared/http/json_response.dart';
import 'package:aluguel_dart/shared/http/app_failures.dart';

class DeleteAluguelController {
  final DeleteAluguelUsecase deleteAluguelUsecase;

  DeleteAluguelController(this.deleteAluguelUsecase);

  Future<Response> handle(Request req) async {
    try {
      final body = await req.readAsString();
      if (body.isEmpty) {
        throw AppFailure('body_required');
      }

      final data = jsonDecode(body);
      final id = data['id'];

      if (id == null || id.toString().trim().isEmpty) {
        throw AppFailure('id_required');
      }

      await deleteAluguelUsecase.call(id.toString());

      return jsonOk({'message': 'aluguel_deleted_successfully', 'id': id});

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
