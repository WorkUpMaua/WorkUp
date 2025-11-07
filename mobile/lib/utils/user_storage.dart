class UserStorage {
  static final UserStorage _instance = UserStorage._internal();
  factory UserStorage() => _instance;
  UserStorage._internal();

  final Map<String, Map<String, dynamic>> _users = {};
  String? _loggedUserEmail;

  final Set<String> _usersWithInitializedReservations = {};

  void addUser(Map<String, dynamic> user) {
    final userCopy = Map<String, dynamic>.from(user);

    if (!userCopy.containsKey('reservations')) {
      userCopy['reservations'] = <Map<String, dynamic>>[];
    } else {
      userCopy['reservations'] = List<Map<String, dynamic>>.from(
        userCopy['reservations'] ?? [],
      );
    }

    _users[userCopy['email']] = userCopy;
  }

  Map<String, dynamic>? getUser(String email) {
    return _users[email];
  }

  bool validateCredentials(String email, String password) {
    final user = _users[email];
    if (user == null) return false;
    if (user['password'] == password) {
      _loggedUserEmail = email;
      return true;
    }
    return false;
  }

  Map<String, dynamic>? getLoggedUser() {
    if (_loggedUserEmail == null) return null;
    return _users[_loggedUserEmail];
  }

  bool updateLoggedUser(Map<String, dynamic> updatedData) {
    if (_loggedUserEmail == null) return false;

    final currentUser = _users[_loggedUserEmail];
    if (currentUser == null) return false;

    currentUser['name'] = updatedData['name'];
    currentUser['birthDate'] = updatedData['birthDate'];

    return true;
  }

  // ========== GERENCIAMENTO DE RESERVAS ==========

  List<Map<String, dynamic>> getReservations() {
    if (_loggedUserEmail == null) return [];

    final user = _users[_loggedUserEmail];
    if (user == null) return [];

    final reservations = user['reservations'];
    if (reservations == null) {
      user['reservations'] = [];
      return [];
    }

    return List<Map<String, dynamic>>.from(reservations);
  }

  bool addReservation(Map<String, dynamic> reservation) {
    if (_loggedUserEmail == null) return false;

    final user = _users[_loggedUserEmail];
    if (user == null) return false;

    if (user['reservations'] == null) {
      user['reservations'] = [];
    }

    (user['reservations'] as List).add(reservation);
    return true;
  }

  bool updateReservationStatus(String reservationId, String newStatus) {
    if (_loggedUserEmail == null) return false;

    final user = _users[_loggedUserEmail];
    if (user == null) return false;

    final reservations = user['reservations'] as List?;
    if (reservations == null) return false;

    for (var reservation in reservations) {
      if (reservation['id'] == reservationId) {
        reservation['status'] = newStatus;

        // Se foi cancelada, libera a propriedade
        if (newStatus == 'cancelled') {
          final workspaceId = reservation['workspaceId'];
          if (workspaceId != null) {
            markPropertyAsAvailable(workspaceId.toString());
          }
        }

        return true;
      }
    }

    return false;
  }

  void initializeMockReservations() {
    if (_loggedUserEmail == null) return;

    if (_usersWithInitializedReservations.contains(_loggedUserEmail)) {
      return;
    }

    final user = _users[_loggedUserEmail];
    if (user == null) return;

    if (user['reservations'] != null &&
        (user['reservations'] as List).isNotEmpty) {
      _usersWithInitializedReservations.add(_loggedUserEmail!);
      return;
    }

    // Não inicializa mais reservas mockadas
    user['reservations'] = [];
    _usersWithInitializedReservations.add(_loggedUserEmail!);
  }

  bool isEmailRegistered(String email) {
    return _users.containsKey(email);
  }

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
    _loggedUserEmail = null;
  }

  // ========== GERENCIAMENTO DE PROPRIEDADES ==========

  final List<Map<String, dynamic>> _allProperties = [];

  bool addProperty(Map<String, dynamic> property) {
    if (_loggedUserEmail == null) return false;

    property['ownerEmail'] = _loggedUserEmail;
    property['isRented'] = false; // Adiciona flag de disponibilidade

    _allProperties.add(property);

    return true;
  }

  List<Map<String, dynamic>> getAllProperties() {
    return List<Map<String, dynamic>>.from(_allProperties);
  }

  // Retorna apenas propriedades disponíveis (não alugadas)
  List<Map<String, dynamic>> getAvailableProperties() {
    return _allProperties
        .where((property) => property['isRented'] != true)
        .toList();
  }

  List<Map<String, dynamic>> getUserProperties() {
    if (_loggedUserEmail == null) return [];

    return _allProperties
        .where((property) => property['ownerEmail'] == _loggedUserEmail)
        .toList();
  }

  Map<String, dynamic>? getPropertyById(String propertyId) {
    try {
      return _allProperties.firstWhere((prop) => prop['id'] == propertyId);
    } catch (e) {
      return null;
    }
  }

  bool removeProperty(String propertyId) {
    if (_loggedUserEmail == null) return false;

    final index = _allProperties.indexWhere(
      (prop) =>
          prop['id'] == propertyId && prop['ownerEmail'] == _loggedUserEmail,
    );

    if (index != -1) {
      _allProperties.removeAt(index);
      return true;
    }

    return false;
  }

  bool updateProperty(String propertyId, Map<String, dynamic> updatedData) {
    if (_loggedUserEmail == null) return false;

    final index = _allProperties.indexWhere(
      (prop) =>
          prop['id'] == propertyId && prop['ownerEmail'] == _loggedUserEmail,
    );

    if (index != -1) {
      updatedData['ownerEmail'] = _allProperties[index]['ownerEmail'];
      updatedData['id'] = _allProperties[index]['id'];
      _allProperties[index] = updatedData;
      return true;
    }

    return false;
  }

  // Marca propriedade como alugada
  void markPropertyAsRented(String propertyId) {
    final index = _allProperties.indexWhere((prop) => prop['id'] == propertyId);
    if (index != -1) {
      _allProperties[index]['isRented'] = true;
    }
  }

  // Marca propriedade como disponível
  void markPropertyAsAvailable(String propertyId) {
    final index = _allProperties.indexWhere((prop) => prop['id'] == propertyId);
    if (index != -1) {
      _allProperties[index]['isRented'] = false;
    }
  }

  void debugPrintUsers() {
    print('=== USERS DEBUG ===');
    _users.forEach((email, userData) {
      print('Email: $email');
      print('Reservations: ${userData['reservations']}');
    });
    print('Logged user: $_loggedUserEmail');
    print(
      'Users with initialized reservations: $_usersWithInitializedReservations',
    );
    print('Total properties: ${_allProperties.length}');
    print('Available properties: ${getAvailableProperties().length}');
  }
}
