import 'dart:convert';

import 'package:aluguel_dart/application/update_aluguel_usecase.dart';
import 'package:aluguel_dart/shared/http/app_failures.dart';
import 'package:aluguel_dart/shared/http/json_response.dart';
import 'package:shelf/shelf.dart';

class UpdateAluguelController {
  final UpdateAluguelUsecase updateAluguelUsecase;

  UpdateAluguelController(this.updateAluguelUsecase);

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

      final int? startDate = data['startDate'];
      final int? endDate = data['endDate'];
      final int? people = data['people'];
      final num? finalPrice = data['finalPrice'];
      final String? status = data['status'];

      if (startDate != null && endDate != null && endDate <= startDate) {
        throw AppFailure('endDate_must_be_greater_than_startDate');
      }
      if (people != null && people <= 0) {
        throw AppFailure('people_must_be_positive');
      }
      if (finalPrice != null && finalPrice <= 0) {
        throw AppFailure('finalPrice_must_be_positive');
      }

      final aluguelAtualizado = await updateAluguelUsecase.call(
        id.toString(),
        startDate: startDate,
        endDate: endDate,
        people: people,
        finalPrice: finalPrice?.toDouble(),
        status: status,
      );

      return jsonOk(aluguelAtualizado.toJson());
    } on AppFailure catch (e) {
      return jsonBadRequest({'error': e.message});
    } catch (e) {
      return jsonServerError({'error': 'internal_error', 'detail': e.toString()});
    }
  }
}
