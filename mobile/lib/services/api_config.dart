import 'dart:io';

import 'package:flutter/foundation.dart';

/// Identifica os microsserviços disponíveis no backend.
enum WorkupService { catalogo, user, property, availability, aluguel }

/// Classe utilitária responsável por montar os endpoints baseados nas
/// variáveis de ambiente fornecidas via `--dart-define`.
class ApiConfig {
  ApiConfig._internal();
  static final ApiConfig instance = ApiConfig._internal();

  static const String _baseOverride =
      String.fromEnvironment('WORKUP_API_BASE', defaultValue: '');
  static const String _defaultScheme = String.fromEnvironment(
    'WORKUP_API_SCHEME',
    defaultValue: 'http',
  );
  static const String _defaultHost = String.fromEnvironment(
    'WORKUP_API_HOST',
    defaultValue: 'localhost',
  );
  static const int _catalogoPort = int.fromEnvironment(
    'WORKUP_CATALOGO_PORT',
    defaultValue: 4000,
  );
  static const int _userPort = int.fromEnvironment(
    'WORKUP_USER_PORT',
    defaultValue: 4001,
  );
  static const int _aluguelPort = int.fromEnvironment(
    'WORKUP_ALUGUEL_PORT',
    defaultValue: 4002,
  );
  static const int _availabilityPort = int.fromEnvironment(
    'WORKUP_AVAILABILITY_PORT',
    defaultValue: 4003,
  );
  static const int _propertyPort = int.fromEnvironment(
    'WORKUP_PROPERTY_PORT',
    defaultValue: 4004,
  );

  String get _host => _resolveHost(_defaultHost);

  String get scheme => _defaultScheme;

  /// Monta uma [Uri] com base no microsserviço solicitado.
  Uri uri(
    WorkupService service, {
    String path = '/',
    Map<String, dynamic>? queryParameters,
  }) {
    final sanitizedPath = path.startsWith('/') ? path : '/$path';

    if (_baseOverride.isNotEmpty) {
      final base = Uri.parse(_baseOverride);
      final combinedPath = _combinePaths(base.path, sanitizedPath);
      return base.replace(
        path: combinedPath,
        queryParameters: _mergeQueries(
          base.queryParameters,
          _stringifyQuery(queryParameters),
        ),
      );
    }

    return Uri(
      scheme: scheme,
      host: _host,
      port: _portFor(service),
      path: sanitizedPath,
      queryParameters: _stringifyQuery(queryParameters),
    );
  }

  int _portFor(WorkupService service) {
    switch (service) {
      case WorkupService.catalogo:
        return _catalogoPort;
      case WorkupService.user:
        return _userPort;
      case WorkupService.property:
        return _propertyPort;
      case WorkupService.availability:
        return _availabilityPort;
      case WorkupService.aluguel:
        return _aluguelPort;
    }
  }

  Map<String, String>? _stringifyQuery(Map<String, dynamic>? query) {
    if (query == null || query.isEmpty) return null;
    final cleaned = <String, String>{};
    query.forEach((key, value) {
      if (value == null) return;
      cleaned[key] = value.toString();
    });
    return cleaned;
  }

  String _resolveHost(String value) {
    if (value.toLowerCase() != 'localhost') {
      return value;
    }

    if (kIsWeb) {
      return value;
    }

    try {
      if (Platform.isAndroid) {
        // Loopback padrão para emulador Android falar com localhost do host.
        return '10.0.2.2';
      }
    } catch (_) {
      // Em plataformas onde Platform não está disponível, mantém padrão.
    }

    return value;
  }

  String _combinePaths(String basePath, String extraPath) {
    if (basePath.endsWith('/')) {
      basePath = basePath.substring(0, basePath.length - 1);
    }
    return '$basePath$extraPath';
  }

  Map<String, String>? _mergeQueries(
    Map<String, String>? base,
    Map<String, String>? extra,
  ) {
    if ((base == null || base.isEmpty) &&
        (extra == null || extra.isEmpty)) {
      return null;
    }
    final merged = <String, String>{};
    if (base != null) merged.addAll(base);
    if (extra != null) merged.addAll(extra);
    return merged;
  }
}
