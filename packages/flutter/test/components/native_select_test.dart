import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/checkbox.dart';
import 'package:horon_ui/src/components/native_select.dart';

/// `native_select`의 라벨·오류·비활성·플랫폼 선택기·높이를 확인합니다.
///
/// 플랫폼 선택기는 위젯 테스트에서 실제 OS 화면을 띄울 수 없으므로 두 길로 확인합니다.
/// 주입 콜백([HoronNativeSelect.onRequestPicker])은 그 자체로 계약이고, 안드로이드
/// 기본 경로는 `TargetPlatformVariant`로 플랫폼을 바꿔 목록 시트가 열리는지 봅니다.
/// Material `DropdownButton`이 화면에 나오지 않는 것도 함께 단언합니다.
void main() {
  const List<HoronNativeSelectOption<String>> options = <HoronNativeSelectOption<String>>[
    HoronNativeSelectOption<String>(value: 'ko', label: '한국어'),
    HoronNativeSelectOption<String>(value: 'en', label: 'English'),
    HoronNativeSelectOption<String>(value: 'off', label: '사용 안 함', enabled: false),
  ];

  Future<void> pumpNativeSelect(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 260, child: child)),
        ),
      ),
    );
    // MaterialApp은 테마를 AnimatedTheme로 감싸므로 밝기를 바꾼 직후에는 색이
    // 아직 이전 값입니다. 애니메이션이 끝난 뒤에 재야 합니다.
    await tester.pumpAndSettle();
  }

  BoxDecoration fieldDecoration(WidgetTester tester) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find
          .descendant(
            of: find.byType(HoronNativeSelect<String>),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
            ),
          )
          .first,
    );
    return box.decoration as BoxDecoration;
  }

  testWidgets('native_select: the label sits above and the value inside', (WidgetTester tester) async {
    await pumpNativeSelect(tester, const HoronNativeSelect<String>(label: '언어', value: 'ko', options: options));

    expect(find.text('언어'), findsOneWidget);
    expect(find.text('한국어'), findsOneWidget);

    // 라벨이 필드 위에 있습니다.
    final Rect label = tester.getRect(find.text('언어'));
    final Rect field = tester.getRect(find.text('한국어'));
    expect(label.bottom, lessThanOrEqualTo(field.top));
  });

  testWidgets('native_select: without a value the placeholder shows in muted colour', (WidgetTester tester) async {
    await pumpNativeSelect(tester, const HoronNativeSelect<String>(placeholder: '언어 선택', options: options));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronNativeSelect<String>))).colorScheme;
    final Text placeholder = tester.widget<Text>(find.text('언어 선택'));
    expect(placeholder.style!.color, scheme.onSurfaceVariant);
  });

  testWidgets('native_select: an error paints the destructive border and prints below', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpNativeSelect(
        tester,
        const HoronNativeSelect<String>(value: 'ko', options: options, error: '언어를 골라 주세요'),
        brightness: brightness,
      );
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronNativeSelect<String>))).colorScheme;
      final Color expected = brightness == Brightness.dark ? scheme.error.withValues(alpha: 0.5) : scheme.error;
      expect(fieldDecoration(tester).border!.top.color, expected, reason: brightness.name);

      // 오류 문구는 필드 아래에 있습니다.
      final Rect field = tester.getRect(find.text('한국어'));
      final Rect error = tester.getRect(find.text('언어를 골라 주세요'));
      expect(error.top, greaterThanOrEqualTo(field.bottom), reason: brightness.name);
    }
  });

  testWidgets('native_select: a disabled field never opens the picker', (WidgetTester tester) async {
    int opened = 0;
    await pumpNativeSelect(
      tester,
      HoronNativeSelect<String>(
        value: 'ko',
        options: options,
        enabled: false,
        onRequestPicker: (BuildContext context, List<HoronNativeSelectOption<String>> offered, String? current) async {
          opened++;
          return null;
        },
      ),
    );

    await tester.tap(find.byType(HoronNativeSelect<String>), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(opened, 0);
  });

  testWidgets('native_select: the injected picker receives the options and reports the pick', (
    WidgetTester tester,
  ) async {
    List<HoronNativeSelectOption<String>>? received;
    String? current;
    final List<String> changes = <String>[];
    await pumpNativeSelect(
      tester,
      HoronNativeSelect<String>(
        value: 'ko',
        options: options,
        onChanged: changes.add,
        onRequestPicker: (BuildContext context, List<HoronNativeSelectOption<String>> offered, String? value) async {
          received = offered;
          current = value;
          return 'en';
        },
      ),
    );

    await tester.tap(find.text('한국어'));
    await tester.pumpAndSettle();

    expect(received, hasLength(3));
    expect(current, 'ko');
    expect(changes, <String>['en']);
  });

  testWidgets('native_select: the injected picker returning null reports nothing', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpNativeSelect(
      tester,
      HoronNativeSelect<String>(
        value: 'ko',
        options: options,
        onChanged: changes.add,
        onRequestPicker: (BuildContext context, List<HoronNativeSelectOption<String>> offered, String? value) async =>
            null,
      ),
    );

    await tester.tap(find.text('한국어'));
    await tester.pumpAndSettle();
    expect(changes, isEmpty);
  });

  testWidgets('native_select: android opens a list sheet, not a DropdownButton', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpNativeSelect(tester, HoronNativeSelect<String>(value: 'ko', options: options, onChanged: changes.add));

    await tester.tap(find.text('한국어'));
    await tester.pumpAndSettle();

    // 시트 안에 항목이 모두 있고, 비활성 항목은 눌리지 않습니다.
    expect(find.text('English'), findsOneWidget);
    expect(find.text('사용 안 함'), findsOneWidget);
    expect(find.byType(DropdownButton<String>), findsNothing);
    expect(find.byType(DropdownButtonFormField<String>), findsNothing);

    await tester.tap(find.text('English'));
    await tester.pumpAndSettle();
    expect(changes, <String>['en']);
  }, variant: TargetPlatformVariant.only(TargetPlatform.android));

  testWidgets('native_select: the selected row in the sheet carries a check mark', (WidgetTester tester) async {
    await pumpNativeSelect(tester, const HoronNativeSelect<String>(value: 'en', options: options));

    await tester.tap(find.text('English'));
    await tester.pumpAndSettle();

    // 목록 시트 안에서 체크 표시는 선택된 행에만 하나 있습니다.
    final int marks = tester
        .widgetList<CustomPaint>(find.descendant(of: find.byType(ListView), matching: find.byType(CustomPaint)))
        .where((CustomPaint paint) => paint.painter is HoronCheckMarkPainter)
        .length;
    expect(marks, 1);
  }, variant: TargetPlatformVariant.only(TargetPlatform.android));

  testWidgets('native_select: iOS opens a Cupertino wheel, not a Material picker', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpNativeSelect(tester, HoronNativeSelect<String>(value: 'ko', options: options, onChanged: changes.add));

    await tester.tap(find.text('한국어'));
    await tester.pumpAndSettle();

    expect(find.byType(CupertinoPicker), findsOneWidget);
    expect(find.byType(DropdownButton<String>), findsNothing);

    // 바퀴를 한 줄 올려 English로 옮기고 완료를 누릅니다.
    await tester.drag(find.byType(CupertinoPicker), const Offset(0, -HoronSpace.s11));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(HoronNativeSelect.confirmKey));
    await tester.pumpAndSettle();

    expect(changes, <String>['en']);
  }, variant: TargetPlatformVariant.only(TargetPlatform.iOS));

  testWidgets('native_select: cancelling the wheel changes nothing', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpNativeSelect(tester, HoronNativeSelect<String>(value: 'ko', options: options, onChanged: changes.add));

    await tester.tap(find.text('한국어'));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(HoronNativeSelect.cancelKey));
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
  }, variant: TargetPlatformVariant.only(TargetPlatform.iOS));

  testWidgets('native_select: the two sizes draw the React heights', (WidgetTester tester) async {
    await pumpNativeSelect(tester, const HoronNativeSelect<String>(value: 'ko', options: options));
    expect(tester.getSize(find.byType(HoronNativeSelect<String>)).height, closeTo(37, 0.01));

    await pumpNativeSelect(tester, const HoronNativeSelect<String>.sm(value: 'ko', options: options));
    expect(tester.getSize(find.byType(HoronNativeSelect<String>)).height, closeTo(28, 0.01));
  });

  testWidgets('native_select: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpNativeSelect(
        tester,
        const HoronNativeSelect<String>(label: '언어', value: 'en', options: options, error: '오류'),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
