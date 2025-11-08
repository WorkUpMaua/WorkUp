import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';

import '../models/listing.dart';
import '../models/reservation.dart';
import '../models/user_profile.dart';
import '../models/user_session.dart';
import 'api_config.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic details;

  const ApiException({required this.message, this.statusCode, this.details});

  @override
  String toString() =>
      'ApiException(statusCode: \$statusCode, message: $message, details: $details)';
}

class WorkupApi {
  factory WorkupApi({http.Client? client}) {
    if (client != null) {
      return WorkupApi._(client: client);
    }
    return _instance;
  }

  WorkupApi._({http.Client? client}) : _client = client ?? http.Client();

  static final WorkupApi _instance = WorkupApi._();

  final http.Client _client;
  final ApiConfig _config = ApiConfig.instance;

  static const Map<String, String> _jsonHeaders = {
    'Content-Type': 'application/json',
  };

  Future<UserProfile> registerUser({
    required String name,
    required String email,
    required String password,
    required String cpf,
    required String phone,
    required DateTime? birthDate,
  }) async {
    final uri = _config.uri(WorkupService.user, path: '/user');
    final payload = {
      'username': email,
      'password': password,
      'name': name,
      'cpf': cpf,
      'birth': birthDate?.millisecondsSinceEpoch ?? 0,
      'phone': phone,
    };

    final data = await _sendJson(
      () => _client.post(uri, headers: _jsonHeaders, body: jsonEncode(payload)),
    );

    final user = data['user'] ?? data['information'];
    if (user is! Map<String, dynamic>) {
      throw const ApiException(
        message: 'Resposta inesperada do serviço de usuário',
      );
    }

    return UserProfile.fromJson(user);
  }

  Future<UserSession> login({
    required String email,
    required String password,
  }) async {
    final uri = _config.uri(WorkupService.user, path: '/login');
    final data = await _sendJson(
      () => _client.post(
        uri,
        headers: _jsonHeaders,
        body: jsonEncode({'username': email, 'password': password}),
      ),
    );

    final token = data['token']?.toString();
    if (token == null || token.isEmpty) {
      throw const ApiException(
        message: 'Token não retornado pelo serviço de login',
      );
    }

    final profile = await fetchUserProfile(token);
    return UserSession(token: token, profile: profile);
  }

  Future<UserProfile> fetchUserProfile(String id) async {
    final uri = _config.uri(WorkupService.user, path: '/user/$id');
    final data = await _sendJson(() => _client.get(uri));
    final user = data['user'] ?? data;
    if (user is! Map<String, dynamic>) {
      throw const ApiException(
        message: 'Resposta inesperada ao buscar usuário',
      );
    }
    return UserProfile.fromJson(user);
  }

  Future<UserProfile> updateUserProfile({
    required String id,
    String? name,
    String? phone,
    DateTime? birthDate,
    String? cpf,
  }) async {
    final uri = _config.uri(WorkupService.user, path: '/user/$id');
    final payload = <String, dynamic>{};
    if (name != null) payload['name'] = name;
    if (phone != null) payload['phone'] = phone;
    if (birthDate != null) {
      payload['birth'] = birthDate.millisecondsSinceEpoch;
    }
    if (cpf != null) payload['cpf'] = cpf;

    final data = await _sendJson(
      () =>
          _client.patch(uri, headers: _jsonHeaders, body: jsonEncode(payload)),
    );

    final user = data['user'] ?? data['updatedUser'] ?? data;
    if (user is! Map<String, dynamic>) {
      throw const ApiException(
        message: 'Resposta inesperada ao atualizar usuário',
      );
    }

    return UserProfile.fromJson(user);
  }

  Future<List<Listing>> fetchCatalogo() async {
    final uri = _config.uri(WorkupService.catalogo, path: '/catalogo');
    final data = await _sendJson(() => _client.get(uri));
    final rooms = data['rooms'];

    if (rooms is Map<String, dynamic>) {
      return rooms.values
          .map((raw) => Listing.fromJson(Map<String, dynamic>.from(raw)))
          .toList();
    }

    if (rooms is List) {
      return rooms
          .map((raw) => Listing.fromJson(Map<String, dynamic>.from(raw)))
          .toList();
    }

    // Pode ser que o serviço retorne um único objeto como fallback
    return [Listing.fromJson(data)];
  }

  Future<Listing> fetchCatalogoById(String id) async {
    final uri = _config.uri(WorkupService.catalogo, path: '/catalogo/$id');
    final data = await _sendJson(() => _client.get(uri));
    return Listing.fromJson(data);
  }

  Future<Listing> createCatalogo({
    required String userId,
    required String name,
    required String description,
    required String address,
    required List<String> comodities,
    required double price,
    required int capacity,
    required String doorSerial,
    required List<XFile> pictures,
    List<Uint8List>? pictureBytes,
  }) async {
    final uri = _config.uri(WorkupService.catalogo, path: '/catalogo');
    final request = http.MultipartRequest('POST', uri)
      ..fields['userID'] = userId
      ..fields['name'] = name
      ..fields['description'] = description
      ..fields['address'] = address
      ..fields['price'] = price.toString()
      ..fields['capacity'] = capacity.toString()
      ..fields['doorSerial'] = doorSerial;

    for (var i = 0; i < comodities.length; i++) {
      request.fields['comodities[$i]'] = comodities[i];
    }
    if (comodities.isEmpty) {
      request.fields['comodities'] = '';
    }

    for (var i = 0; i < pictures.length; i++) {
      final file = pictures[i];
      final filename = _resolveFilename(file);

      if (kIsWeb) {
        final bytes = pictureBytes != null && i < pictureBytes.length
            ? pictureBytes[i]
            : await file.readAsBytes();
        request.files.add(
          http.MultipartFile.fromBytes(
            'pictures',
            bytes,
            filename: filename,
            contentType: MediaType('image', _guessMime(filename)),
          ),
        );
      } else {
        request.files.add(
          await http.MultipartFile.fromPath(
            'pictures',
            file.path,
            filename: filename,
            contentType: MediaType('image', _guessMime(filename)),
          ),
        );
      }
    }

    final data = await _sendMultipart(request);
    final room = data['room'] ?? data;
    if (room is! Map<String, dynamic>) {
      throw const ApiException(
        message: 'Resposta inesperada ao criar catálogo',
      );
    }
    return Listing.fromJson(room);
  }

  Future<void> deleteCatalogo(String roomId, String userId) async {
    final uri = _config.uri(WorkupService.catalogo, path: '/catalogo/$roomId');
    await _sendJson(
      () => _client.delete(
        uri,
        headers: _jsonHeaders,
        body: jsonEncode({'userID': userId}),
      ),
    );
  }

  Future<List<Listing>> fetchUserProperties(String userId) async {
    final uri = _config.uri(WorkupService.property, path: '/property/$userId');
    final data = await _sendJson(() => _client.get(uri));
    final userProps = data['userProperties'];
    if (userProps is! Map<String, dynamic>) return const [];
    final properties = userProps['properties'];
    if (properties is! Map<String, dynamic>) return const [];
    return properties.values
        .map((raw) => Listing.fromJson(Map<String, dynamic>.from(raw)))
        .toList();
  }

  Future<int> checkAvailability({
    required String workspaceId,
    required int startDate,
    required int endDate,
  }) async {
    final uri = _config.uri(
      WorkupService.availability,
      path: '/availability/$workspaceId',
      queryParameters: {'startDate': startDate, 'endDate': endDate},
    );

    final data = await _sendJson(() => _client.get(uri));
    final spots = data['availableSpots'];
    if (spots is num) return spots.toInt();
    return 0;
  }

  Future<List<Reservation>> fetchUserReservations(String userId) async {
    final uri = _config.uri(WorkupService.aluguel, path: '/all-aluguel');
    final data = await _sendJson(() => _client.get(uri));
    final rentals = data['alugueis'];
    if (rentals is! Map<String, dynamic>) return const [];
    return rentals.values
        .map((raw) => Reservation.fromJson(Map<String, dynamic>.from(raw)))
        .where((reservation) => reservation.userId == userId)
        .toList();
  }

  Future<Reservation> createReservation({
    required String userId,
    required String workspaceId,
    required int startDate,
    required int endDate,
    required int people,
    required double finalPrice,
  }) async {
    final uri = _config.uri(WorkupService.aluguel, path: '/aluguel');
    final payload = {
      'userId': userId,
      'workspaceId': workspaceId,
      'startDate': startDate,
      'endDate': endDate,
      'people': people,
      'finalPrice': finalPrice,
    };

    final data = await _sendJson(
      () => _client.post(uri, headers: _jsonHeaders, body: jsonEncode(payload)),
    );

    return Reservation.fromJson(data);
  }

  Future<Reservation> updateReservationStatus({
    required String reservationId,
    required String status,
  }) async {
    final uri = _config.uri(WorkupService.aluguel, path: '/aluguel');
    final payload = {'id': reservationId, 'status': status};
    final data = await _sendJson(
      () =>
          _client.patch(uri, headers: _jsonHeaders, body: jsonEncode(payload)),
    );
    return Reservation.fromJson(data);
  }

  Future<void> deleteReservation(String reservationId) async {
    final uri = _config.uri(WorkupService.aluguel, path: '/aluguel');
    await _sendJson(
      () => _client.delete(
        uri,
        headers: _jsonHeaders,
        body: jsonEncode({'id': reservationId}),
      ),
    );
  }

  Future<Map<String, dynamic>> _sendMultipart(
    http.MultipartRequest request,
  ) async {
    try {
      final response = await request.send();
      final body = await response.stream.bytesToString();
      final data = _decodeBody(body);
      if (response.statusCode >= 400) {
        throw ApiException(
          message: _extractMessage(data) ?? 'Erro ${response.statusCode}',
          statusCode: response.statusCode,
          details: data,
        );
      }
      return data;
    } on ApiException {
      rethrow;
    } on http.ClientException catch (e) {
      throw ApiException(
        message: 'Não foi possível conectar ao servidor',
        details: e.message,
      );
    } on FormatException catch (e) {
      throw ApiException(
        message: 'Resposta inválida do servidor',
        details: e.message,
      );
    } catch (e) {
      throw ApiException(
        message: 'Não foi possível conectar ao servidor',
        details: e.toString(),
      );
    }
  }

  Future<Map<String, dynamic>> _sendJson(
    Future<http.Response> Function() request,
  ) async {
    try {
      final response = await request();
      return _parseResponse(response);
    } on ApiException {
      rethrow;
    } on http.ClientException catch (e) {
      throw ApiException(
        message: 'Não foi possível conectar ao servidor',
        details: e.message,
      );
    } on FormatException catch (e) {
      throw ApiException(
        message: 'Resposta inválida do servidor',
        details: e.message,
      );
    } catch (e) {
      throw ApiException(
        message: 'Não foi possível conectar ao servidor',
        details: e.toString(),
      );
    }
  }

  Map<String, dynamic> _parseResponse(http.Response response) {
    final data = _decodeBody(response.body);
    if (response.statusCode >= 400) {
      throw ApiException(
        message: _extractMessage(data) ?? 'Erro ${response.statusCode}',
        statusCode: response.statusCode,
        details: data,
      );
    }
    return data;
  }

  Map<String, dynamic> _decodeBody(String body) {
    if (body.isEmpty) return {};
    final decoded = jsonDecode(body);
    if (decoded is Map<String, dynamic>) return decoded;
    return {'data': decoded};
  }

  String? _extractMessage(Map<String, dynamic> data) {
    if (data['message'] is String) return data['message'] as String;
    if (data['error'] is String) return data['error'] as String;
    return null;
  }

  String _resolveFilename(XFile file) {
    if (file.name.isNotEmpty) return file.name;
    return _basename(file.path);
  }

  String _basename(String filePath) {
    final normalized = filePath.replaceAll('\\', '/');
    final segments = normalized.split('/');
    if (segments.isEmpty || segments.last.isEmpty) {
      return 'picture.jpg';
    }
    return segments.last;
  }

  String _guessMime(String filename) {
    final lower = filename.toLowerCase();
    if (lower.endsWith('.png')) return 'png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpeg';
    if (lower.endsWith('.gif')) return 'gif';
    return 'jpeg';
  }
}
