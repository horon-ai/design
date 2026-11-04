import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `showHoronModal` 라우트를 확인합니다.
///
/// 계획이 요구하는 것은 두 가지입니다.
///
/// 1. 페이지가 `scopesRoute` 시맨틱 경계를 가진다(스크린 리더가 모달 밖을 읽지 않음).
/// 2. 스크림을 누르면 닫힌다.
void main() {
  testWidgets('showHoronModal pushes a route that scopes the page and closes by scrim', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Builder(
            builder: (BuildContext context) => TextButton(
              onPressed: () => showHoronModal<void>(
                context,
                barrierLabel: '닫기',
                builder: (BuildContext context) => const Center(child: HoronModalSurface(child: Text('모달 본문'))),
              ),
              child: const Text('열기'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.text('모달 본문'), findsOneWidget);

    expect(
      find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.scopesRoute == true),
      findsWidgets,
      reason: 'RawDialogRoute가 페이지를 라우트 경계로 감쌉니다',
    );

    await tester.tapAt(const Offset(5, 5));
    await tester.pumpAndSettle();
    expect(find.text('모달 본문'), findsNothing, reason: '스크림을 누르면 닫힙니다');
  });
}
