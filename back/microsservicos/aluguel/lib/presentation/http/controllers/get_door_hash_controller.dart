import 'dart:async';
import 'dart:convert';

import 'package:aluguel_dart/application/verify_door_code_usecase.dart';
import 'package:aluguel_dart/shared/http/app_failures.dart';
import 'package:aluguel_dart/shared/http/json_response.dart';
import 'package:shelf/shelf.dart';

class GetDoorHashController {
  final VerifyDoorCodeUsecase verifyDoorCodeUsecase;

  GetDoorHashController(this.verifyDoorCodeUsecase);

  Future<Response> handle(Request req) async {
    try {
      final body = await req.readAsString();
      if (body.isEmpty) {
        throw AppFailure('body_required');
      }

      final data = jsonDecode(body);

      final doorCode = data['doorCode']?.toString();
      if (doorCode == null || doorCode.isEmpty) {
        throw AppFailure('doorCode_required');
      }

      final isValid = await verifyDoorCodeUsecase.call(
        doorCode: doorCode,
      );

      return jsonOk({'valid': isValid});
    } on AppFailure catch (e) {
      return jsonBadRequest({'error': e.message});
    } on StateError catch (e) {
      if (e.message == 'aluguel_not_found') {
        return jsonNotFound({'error': e.message});
      }
      return jsonBadRequest({'error': e.message});
    } on TimeoutException {
      return Response(
        504,
        body: jsonEncode({'error': 'catalogo_timeout'}),
        headers: {'content-type': 'application/json'},
      );
    } catch (e) {
      return jsonServerError({
        'error': 'internal_error',
        'detail': e.toString(),
      });
    }
  }
}
