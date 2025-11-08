import 'user_profile.dart';

class UserSession {
  final String token;
  final UserProfile profile;

  const UserSession({required this.token, required this.profile});
}
