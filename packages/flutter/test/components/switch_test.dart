import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 스위치의 트랙·썸 모양과 두 크기, 그리고 값 동작을 확인합니다.
///
/// React의 `data-[size=default]:h-6 data-[size=default]:w-10`과
/// `data-[size=sm]:h-[18px] data-[size=sm]:w-[30px]`를 그대로 재고, 썸이 켜짐에서
/// 오른쪽으로 이동하는지도 확인합니다. 크기를 "비슷하게" 정하면 이 검사가
/// 실패합니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  BoxDecoration trackDecoration(WidgetTester tester) {
    final Container track = tester.widget<Container>(find.byKey(HoronSwitch.trackKey));
    return track.decoration! as BoxDecoration;
  }

  /// 트랙 안에서 썸의 중심 x가 차지하는 비율입니다.
  double thumbFraction(WidgetTester tester) {
    final Rect track = tester.getRect(find.byKey(HoronSwitch.trackKey));
    final Finder thumb = find.descendant(
      of: find.byKey(HoronSwitch.trackKey),
      matching: find.byWidgetPredicate(
        (Widget widget) =>
            widget is DecoratedBox &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).shape == BoxShape.circle,
      ),
    );
    return (tester.getRect(thumb).center.dx - track.left) / track.width;
  }

  group('크기', () {
    testWidgets('기본 크기는 24×40이고 썸은 20이다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, onChanged: (_) {})));

      expect(tester.getSize(find.byKey(HoronSwitch.trackKey)), const Size(40, 24));
      expect(const HoronSwitch(value: false).thumbSize, 20);
      expect(const HoronSwitch(value: false).trackWidth, 40);
      expect(const HoronSwitch(value: false).trackHeight, 24);
    });

    testWidgets('sm 크기는 18×30이고 썸은 14다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, size: HoronSwitchSize.sm, onChanged: (_) {})));

      expect(tester.getSize(find.byKey(HoronSwitch.trackKey)), const Size(30, 18));
      expect(const HoronSwitch(value: false, size: HoronSwitchSize.sm).thumbSize, 14);
    });

    testWidgets('트랙은 높이의 절반으로 완전히 둥글다', (WidgetTester tester) async {
      for (final HoronSwitchSize size in HoronSwitchSize.values) {
        await tester.pumpWidget(
          MaterialApp(
            key: ValueKey<HoronSwitchSize>(size),
            theme: horonTheme(Brightness.light),
            home: Scaffold(
              body: Center(
                child: HoronSwitch(value: false, size: size, onChanged: (_) {}),
              ),
            ),
          ),
        );
        final Size track = tester.getSize(find.byKey(HoronSwitch.trackKey));
        expect(trackDecoration(tester).borderRadius, BorderRadius.circular(track.height / 2));
      }
    });
  });

  group('색과 썸 위치', () {
    testWidgets('켜지면 트랙이 primary다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: true, onChanged: (_) {})));

      expect(trackDecoration(tester).color, HoronLightColors.primary);
    });

    testWidgets('꺼지면 트랙이 input이고 테두리는 border다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, onChanged: (_) {})));

      expect(trackDecoration(tester).color, HoronLightColors.input);
      expect((trackDecoration(tester).border! as Border).top.color, HoronLightColors.border);
    });

    testWidgets('오류면 테두리가 destructive다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, invalid: true, onChanged: (_) {})));

      expect((trackDecoration(tester).border! as Border).top.color, HoronLightColors.destructive);
    });

    testWidgets('켜짐은 썸이 오른쪽, 꺼짐은 왼쪽에 붙는다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, onChanged: (_) {})));
      await tester.pumpAndSettle();
      final double off = thumbFraction(tester);
      expect(off, lessThan(0.4), reason: '꺼짐 썸이 왼쪽에 있지 않습니다');

      await tester.pumpWidget(
        MaterialApp(
          key: const ValueKey<String>('on'),
          theme: horonTheme(Brightness.light),
          home: Scaffold(
            body: Center(child: HoronSwitch(value: true, onChanged: (_) {})),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final double on = thumbFraction(tester);
      expect(on, greaterThan(0.6), reason: '켜짐 썸이 오른쪽에 있지 않습니다');
      expect(on - off, greaterThan(0.3));
    });

    testWidgets('라이트와 다크가 각자의 primary 트랙으로 그려진다', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        await tester.pumpWidget(
          MaterialApp(
            key: ValueKey<Brightness>(brightness),
            theme: horonTheme(brightness),
            home: Scaffold(
              body: Center(child: HoronSwitch(value: true, onChanged: (_) {})),
            ),
          ),
        );
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);
        expect(Theme.of(tester.element(find.byType(HoronSwitch))).brightness, brightness);
        expect(
          trackDecoration(tester).color,
          brightness == Brightness.dark ? HoronDarkColors.primary : HoronLightColors.primary,
        );
      }
    });

    testWidgets('다크에서 꺼진 트랙은 input의 80%이고 테두리는 border다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, onChanged: (_) {}), brightness: Brightness.dark));

      final BoxDecoration decoration = trackDecoration(tester);
      expect(decoration.color!.a, lessThan(HoronDarkColors.input.a), reason: '다크 꺼짐 트랙은 input의 80%입니다');
      expect((decoration.border! as Border).top.color, HoronDarkColors.border);
    });
  });

  group('값 동작', () {
    testWidgets('켜진 스위치를 누르면 false를 넘긴다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronSwitch(value: true, onChanged: seen.add)));

      await tester.tap(find.byType(HoronSwitch));
      await tester.pump();

      expect(seen, <bool>[false]);
    });

    testWidgets('꺼진 스위치를 누르면 true를 넘긴다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronSwitch(value: false, onChanged: seen.add)));

      await tester.tap(find.byType(HoronSwitch));
      await tester.pump();

      expect(seen, <bool>[true]);
    });

    testWidgets('비활성은 눌러도 값을 넘기지 않는다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronSwitch(value: false, enabled: false, onChanged: seen.add)));

      await tester.tap(find.byType(HoronSwitch), warnIfMissed: false);
      await tester.pump();

      expect(seen, isEmpty, reason: '비활성 스위치가 값을 바꿨습니다');
    });

    testWidgets('비활성은 불투명도 50%로 그린다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: false, enabled: false, onChanged: (_) {})));

      expect(tester.widget<Opacity>(find.byType(Opacity).first).opacity, 0.5);
    });

    testWidgets('콜백이 없으면 눌러도 아무 일이 없다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(const HoronSwitch(value: false)));

      await tester.tap(find.byType(HoronSwitch), warnIfMissed: false);
      await tester.pump();

      expect(tester.takeException(), isNull);
      expect(
        find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.toggled == false),
        findsOneWidget,
      );
    });
  });

  group('라벨과 보조 기술', () {
    testWidgets('라벨을 그리고 toggled 상태를 알린다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSwitch(value: true, label: '알림', onChanged: (_) {})));

      expect(find.text('알림'), findsOneWidget);
      expect(
        find.byWidgetPredicate(
          (Widget widget) =>
              widget is Semantics && widget.properties.toggled == true && widget.properties.label == '알림',
        ),
        findsOneWidget,
      );
    });
  });
}
