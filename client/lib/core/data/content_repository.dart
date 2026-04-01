import '../network/api_exception.dart';
import '../network/api_response.dart';
import '../network/dio_client.dart';
import 'content_models.dart';

class ContentRepository {
  const ContentRepository(this._client);

  final DioClient _client;

  Future<HomePayload> fetchHome() async {
    final response = await _client.dio.get<Map<String, dynamic>>('/home');
    return _unwrap(response.data, (raw) {
      return HomePayload.fromJson((raw as Map).cast<String, dynamic>());
    });
  }

  Future<List<RecipeSummary>> fetchRecipes() async {
    final response = await _client.dio.get<Map<String, dynamic>>('/recipes');
    return _unwrap(response.data, (raw) {
      return ((raw as List).cast<Map>())
          .map((item) => RecipeSummary.fromJson(item.cast<String, dynamic>()))
          .toList();
    });
  }

  Future<RecipeDetail> fetchRecipeDetail(String id) async {
    final response = await _client.dio.get<Map<String, dynamic>>('/recipes/$id');
    return _unwrap(response.data, (raw) {
      return RecipeDetail.fromJson((raw as Map).cast<String, dynamic>());
    });
  }

  Future<List<TherapySummary>> fetchTherapies() async {
    final response = await _client.dio.get<Map<String, dynamic>>('/therapies');
    return _unwrap(response.data, (raw) {
      return ((raw as List).cast<Map>())
          .map((item) => TherapySummary.fromJson(item.cast<String, dynamic>()))
          .toList();
    });
  }

  Future<TherapyDetail> fetchTherapyDetail(String id) async {
    final response = await _client.dio.get<Map<String, dynamic>>('/therapies/$id');
    return _unwrap(response.data, (raw) {
      return TherapyDetail.fromJson((raw as Map).cast<String, dynamic>());
    });
  }

  Future<List<DailyCareTopic>> fetchDailyCare() async {
    final response = await _client.dio.get<Map<String, dynamic>>('/daily-care');
    return _unwrap(response.data, (raw) {
      return ((raw as List).cast<Map>())
          .map((item) => DailyCareTopic.fromJson(item.cast<String, dynamic>()))
          .toList();
    });
  }

  Future<List<QuizQuestion>> fetchQuiz() async {
    final response = await _client.dio.get<Map<String, dynamic>>('/quiz');
    return _unwrap(response.data, (raw) {
      return ((raw as List).cast<Map>())
          .map((item) => QuizQuestion.fromJson(item.cast<String, dynamic>()))
          .toList();
    });
  }

  Future<QuizResult> submitQuiz(Map<String, int> answers) async {
    final response = await _client.dio.post<Map<String, dynamic>>(
      '/quiz/submit',
      data: {'answers': answers},
    );
    return _unwrap(response.data, (raw) {
      return QuizResult.fromJson((raw as Map).cast<String, dynamic>());
    });
  }

  T _unwrap<T>(
    Map<String, dynamic>? json,
    T Function(Object? raw) mapper,
  ) {
    if (json == null) {
      throw const ApiException('Empty response');
    }
    final envelope = ApiResponse<T>.fromJson(json, mapper);
    if (envelope.error != null) {
      throw ApiException(envelope.error!.message);
    }
    if (envelope.data == null) {
      throw const ApiException('Missing data payload');
    }
    return envelope.data as T;
  }
}
