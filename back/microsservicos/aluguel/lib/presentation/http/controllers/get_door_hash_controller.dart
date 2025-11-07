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

      final doorSerial = await verifyDoorCodeUsecase.call(
        doorCode: doorCode,
      );

      return jsonOk({'doorSerial': doorSerial});
    } on AppFailure catch (e) {
      return jsonBadRequest({'error': e.message});
    } on StateError catch (e) {
      final message = e.message;
      if (message == 'door code not found') {
        return jsonNotFound({'error': message});
      }
      if (message == 'door serial not found') {
        return jsonBadRequest({'error': message});
      }
      if (message == 'door code invalid') {
        return jsonBadRequest({'error': message});
      }
      return jsonBadRequest({'error': message});
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
