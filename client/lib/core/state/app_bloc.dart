import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../serialization/localized_text.dart';

class AppSession extends Equatable {
  const AppSession({
    required this.accessToken,
    required this.refreshToken,
    required this.displayName,
    required this.identifier,
  });

  final String accessToken;
  final String refreshToken;
  final String displayName;
  final String identifier;

  @override
  List<Object?> get props => [accessToken, refreshToken, displayName, identifier];
}

class HistoryEntry extends Equatable {
  const HistoryEntry({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.route,
    required this.iconKey,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText subtitle;
  final String route;
  final String iconKey;

  @override
  List<Object?> get props => [id, title, subtitle, route, iconKey];
}

class AppState extends Equatable {
  const AppState({
    this.locale = AppLocale.zh,
    this.session,
    this.favoriteIds = const <String>{},
    this.history = const <HistoryEntry>[],
  });

  final AppLocale locale;
  final AppSession? session;
  final Set<String> favoriteIds;
  final List<HistoryEntry> history;

  AppState copyWith({
    AppLocale? locale,
    AppSession? session,
    bool clearSession = false,
    Set<String>? favoriteIds,
    List<HistoryEntry>? history,
  }) {
    return AppState(
      locale: locale ?? this.locale,
      session: clearSession ? null : (session ?? this.session),
      favoriteIds: favoriteIds ?? this.favoriteIds,
      history: history ?? this.history,
    );
  }

  @override
  List<Object?> get props => [locale, session, favoriteIds, history];
}

sealed class AppEvent {
  const AppEvent();
}

class AppLocaleToggled extends AppEvent {
  const AppLocaleToggled();
}

class AppSessionUpdated extends AppEvent {
  const AppSessionUpdated(this.session);

  final AppSession session;
}

class AppSignedOut extends AppEvent {
  const AppSignedOut();
}

class AppFavoriteToggled extends AppEvent {
  const AppFavoriteToggled(this.id);

  final String id;
}

class AppHistoryRecorded extends AppEvent {
  const AppHistoryRecorded(this.entry);

  final HistoryEntry entry;
}

class AppBloc extends Bloc<AppEvent, AppState> {
  AppBloc() : super(const AppState()) {
    on<AppLocaleToggled>((event, emit) {
      emit(
        state.copyWith(
          locale: state.locale == AppLocale.zh ? AppLocale.en : AppLocale.zh,
        ),
      );
    });
    on<AppSessionUpdated>((event, emit) {
      emit(state.copyWith(session: event.session));
    });
    on<AppSignedOut>((event, emit) {
      emit(state.copyWith(clearSession: true));
    });
    on<AppFavoriteToggled>((event, emit) {
      final favorites = {...state.favoriteIds};
      if (favorites.contains(event.id)) {
        favorites.remove(event.id);
      } else {
        favorites.add(event.id);
      }
      emit(state.copyWith(favoriteIds: favorites));
    });
    on<AppHistoryRecorded>((event, emit) {
      final filtered = state.history.where((item) => item.id != event.entry.id).toList();
      emit(state.copyWith(history: [event.entry, ...filtered].take(20).toList()));
    });
  }
}
