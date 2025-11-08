import 'package:intl/intl.dart';

class UserProfile {
  final String id;
  final String name;
  final String email;
  final String cpf;
  final String phone;
  final DateTime? birthDate;

  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.cpf,
    required this.phone,
    this.birthDate,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    DateTime? birthDate;
    final rawBirth = json['birth'];
    if (rawBirth is int) {
      birthDate = DateTime.fromMillisecondsSinceEpoch(rawBirth);
    } else if (rawBirth is String && rawBirth.isNotEmpty) {
      final parsed = int.tryParse(rawBirth);
      if (parsed != null) {
        birthDate = DateTime.fromMillisecondsSinceEpoch(parsed);
      }
    }

    return UserProfile(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      cpf: json['cpf']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      birthDate: birthDate,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'cpf': cpf,
      'phone': phone,
      'birth': birthDate?.millisecondsSinceEpoch,
    };
  }

  UserProfile copyWith({String? name, String? phone, DateTime? birthDate}) {
    return UserProfile(
      id: id,
      name: name ?? this.name,
      email: email,
      cpf: cpf,
      phone: phone ?? this.phone,
      birthDate: birthDate ?? this.birthDate,
    );
  }

  String formattedBirth({String pattern = 'dd/MM/yyyy'}) {
    if (birthDate == null) return '';
    return DateFormat(pattern).format(birthDate!);
  }
}
