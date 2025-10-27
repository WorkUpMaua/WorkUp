import 'dart:convert';
import 'package:shelf/shelf.dart';

const _headers = {'content-type': 'application/json'};

Response jsonOk(Object body) =>
    Response.ok(jsonEncode(body), headers: _headers);

Response jsonCreated(Object body) =>
    Response(201, body: jsonEncode(body), headers: _headers);

Response jsonBadRequest(Object body) =>
    Response(400, body: jsonEncode(body), headers: _headers);

Response jsonNotFound(Object body) =>
    Response(404, body: jsonEncode(body), headers: _headers);

Response jsonServerError(Object body) =>
    Response(500, body: jsonEncode(body), headers: _headers);
