class UserStorage {
  static final UserStorage _instance = UserStorage._internal();
  factory UserStorage() => _instance;
  UserStorage._internal();

  final Map<String, Map<String, dynamic>> _users = {};

  void addUser(Map<String, dynamic> user) {
    _users[user['email']] = user;
  }

  Map<String, dynamic>? getUser(String email) {
    return _users[email];
  }

  bool validateCredentials(String email, String password) {
    final user = _users[email];
    if (user == null) return false;
    return user['password'] == password;
  }

  bool isEmailRegistered(String email) {
    return _users.containsKey(email);
  }

  // Normalize a string to digits only for CPF/phone comparisons
  String _onlyDigits(String value) => value.replaceAll(RegExp(r'[^0-9]'), '');

  bool isCpfRegistered(String cpf) {
    final norm = _onlyDigits(cpf);
    for (final user in _users.values) {
      final userCpf = user['cpf']?.toString() ?? '';
      if (_onlyDigits(userCpf) == norm && norm.isNotEmpty) return true;
    }
    return false;
  }

  bool isPhoneRegistered(String phone) {
    final norm = _onlyDigits(phone);
    for (final user in _users.values) {
      final userPhone = user['phone']?.toString() ?? '';
      if (_onlyDigits(userPhone) == norm && norm.isNotEmpty) return true;
    }
    return false;
  }

  void clearLoggedUser() {
    // Limpa qualquer informação de sessão que precisar
  }
}
