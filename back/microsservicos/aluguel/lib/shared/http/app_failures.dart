class AppFailure implements Exception {
  final String message;
  final int? code;

  AppFailure(this.message, {this.code});

  @override
  String toString() => 'AppFailure: $message';
}
