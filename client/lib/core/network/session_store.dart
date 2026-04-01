class SessionStore {
  String? accessToken;
  String? refreshToken;

  void update({
    required String access,
    required String refresh,
  }) {
    accessToken = access;
    refreshToken = refresh;
  }

  void clear() {
    accessToken = null;
    refreshToken = null;
  }
}
