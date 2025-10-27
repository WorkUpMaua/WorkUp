import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:aluguel_dart/application/create_aluguel_usecase.dart';
import 'package:aluguel_dart/shared/http/json_response.dart';
import 'package:aluguel_dart/shared/http/app_failures.dart';

class CreateAluguelController {
  final CreateAluguelUsecase createAluguelUsecase;

  CreateAluguelController(this.createAluguelUsecase);

  Future<Response> handle(Request req) async {
    try {
      final body = await req.readAsString();
      if (body.isEmpty) {
        throw AppFailure('body_required');
      }

      final data = jsonDecode(body);

      final userId = data['userId'];
      final workspaceId = data['workspaceId'];
      final startDate = data['startDate'];
      final endDate = data['endDate'];
      final people = data['people'];
      final finalPrice = data['finalPrice'];
      
      if (userId == null || userId.toString().isEmpty) {
        throw AppFailure('userId_required');
      }
      if (workspaceId == null || workspaceId.toString().isEmpty) {
        throw AppFailure('workspaceId_required');
      }
      if (startDate == null) {
        throw AppFailure('startDate_required');
      }
      if (endDate == null) {
        throw AppFailure('endDate_required');
      }
      if (people == null) {
        throw AppFailure('people_required');
      }
      if (finalPrice == null) {
        throw AppFailure('finalPrice_required');
      }

      final aluguel = await createAluguelUsecase.call(
        userId: userId,
        workspaceId: workspaceId,
        startDate: startDate,
        endDate: endDate,
        people: people,
        finalPrice: finalPrice,
      );

      return jsonCreated(aluguel.toJson());

    } on AppFailure catch (e) {
      return jsonBadRequest({'error': e.message});
    } catch (e) {
      return jsonServerError({'error': 'internal_error', 'detail': e.toString()});
    }
  }
}
