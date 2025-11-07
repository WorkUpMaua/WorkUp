import 'dart:convert';

import 'package:crypto/crypto.dart';

String hashDoorCode(String code) {
  final normalizedCode = code.trim();
  final bytes = utf8.encode(normalizedCode);
  return sha256.convert(bytes).toString();
}

bool verifyDoorCodeHash({
  required String plainCode,
  required String hashedCode,
}) {
  return hashDoorCode(plainCode) == hashedCode;
}
