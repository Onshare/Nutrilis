import 'package:flutter_test/flutter_test.dart';

import 'package:nutrilis_client/app/app.dart';

void main() {
  testWidgets('navigates from splash to auth entry', (WidgetTester tester) async {
    await tester.pumpWidget(const NutrilisApp());
    await tester.pump(const Duration(milliseconds: 1700));
    await tester.pumpAndSettle();

    expect(find.text('登录 / 注册'), findsOneWidget);
  });
}
