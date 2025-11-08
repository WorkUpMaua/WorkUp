import '../models/listing.dart';
import '../models/reservation.dart';
import '../models/user_profile.dart';

/// Mantém os dados da sessão atual na memória durante o ciclo de vida do app.
class UserStorage {
  static final UserStorage _instance = UserStorage._internal();
  factory UserStorage() => _instance;
  UserStorage._internal();

  String? _token;
  UserProfile? _loggedUser;
  final Map<String, Listing> _catalogCache = {};
  List<Listing> _ownedProperties = [];
  List<Reservation> _reservations = [];

  bool get isLogged => _loggedUser != null;
  String? get token => _token;
  String? get userId => _loggedUser?.id;
  UserProfile? get loggedUser => _loggedUser;

  void saveSession({required String token, required UserProfile profile}) {
    _token = token;
    _loggedUser = profile;
  }

  void updateLoggedUser(UserProfile profile) {
    _loggedUser = profile;
  }

  void clearLoggedUser() {
    _token = null;
    _loggedUser = null;
    _catalogCache.clear();
    _ownedProperties = [];
    _reservations = [];
  }

  void cacheCatalog(List<Listing> rooms) {
    _catalogCache
      ..clear()
      ..addEntries(rooms.map((room) => MapEntry(room.id, room)));
  }

  void upsertCatalogRoom(Listing room) {
    _catalogCache[room.id] = room;
  }

  Listing? getCatalogRoom(String id) => _catalogCache[id];

  List<Listing> get catalog => List.unmodifiable(_catalogCache.values);

  void cacheOwnedProperties(List<Listing> properties) {
    _ownedProperties = List<Listing>.from(properties);
  }

  List<Listing> get ownedProperties => List.unmodifiable(_ownedProperties);

  void cacheReservations(List<Reservation> reservations) {
    _reservations = List<Reservation>.from(reservations);
  }

  List<Reservation> get reservations => List.unmodifiable(_reservations);
}
