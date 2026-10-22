import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronButton]을 horon 테마 아래에 띄웁니다.
///
/// `HoronTheme.of`는 확장이 없으면 [StateError]를 던지므로, 모든 테스트가
/// `horonTheme`로 조립한 테마를 씁니다.
Future<void> pumpButton(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
}

void main() {
  testWidgets('button: the eight sizes render at the React heights', (WidgetTester tester) async {
    // button.tsx의 `h-[…]`/`size-…` 클래스 값입니다: 26 / 32 / 37 / 44 / 32 / 24 / 28 / 36.
    const Map<HoronButtonSize, double> expected = <HoronButtonSize, double>{
      HoronButtonSize.xs: 26,
      HoronButtonSize.sm: 32,
      HoronButtonSize.defaultValue: 37,
      HoronButtonSize.lg: 44,
      HoronButtonSize.icon: 32,
      HoronButtonSize.iconXs: 24,
      HoronButtonSize.iconSm: 28,
      HoronButtonSize.iconLg: 36,
    };

    for (final MapEntry<HoronButtonSize, double> entry in expected.entries) {
      final bool isIcon = entry.key.name.startsWith('icon');
      await pumpButton(
        tester,
        HoronButton(
          label: isIcon ? null : 'Button',
          leading: isIcon ? const Icon(Icons.add) : null,
          size: entry.key,
          onPressed: () {},
        ),
      );

      final Size size = tester.getSize(find.byType(HoronButton));
      expect(size.height, closeTo(entry.value, 0.5), reason: 'height for ${entry.key.name}');
      if (isIcon) {
        expect(size.width, closeTo(entry.value, 0.5), reason: 'width for ${entry.key.name}');
      }
    }
  });

  testWidgets('button: a disabled button does not fire onPressed', (WidgetTester tester) async {
    int taps = 0;
    await pumpButton(tester, HoronButton(label: 'Disabled', disabled: true, onPressed: () => taps++));

    await tester.tap(find.byType(HoronButton), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(taps, 0);

    // onPressed가 null이어도 같은 결과입니다.
    await pumpButton(tester, const HoronButton(label: 'No callback'));
    await tester.tap(find.byType(HoronButton), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(taps, 0);
  });

  testWidgets('button: the link variant paints an underline', (WidgetTester tester) async {
    await pumpButton(tester, HoronButton(label: 'Read more', variant: HoronButtonVariant.link, onPressed: () {}));

    final RenderParagraph paragraph = tester.renderObject<RenderParagraph>(find.text('Read more'));
    expect(paragraph.text.style?.decoration, TextDecoration.underline);

    // 다른 변형은 밑줄이 없습니다.
    await pumpButton(tester, HoronButton(label: 'Read more', onPressed: () {}));
    final RenderParagraph plain = tester.renderObject<RenderParagraph>(find.text('Read more'));
    expect(plain.text.style?.decoration, isNot(TextDecoration.underline));
  });

  testWidgets('button: a leading icon shrinks the left padding', (WidgetTester tester) async {
    await pumpButton(tester, HoronButton(label: 'Save', onPressed: () {}));
    final Rect plainButton = tester.getRect(find.byType(HoronButton));
    final Rect plainText = tester.getRect(find.text('Save'));
    // `px-5` - 아이콘이 없으면 왼쪽 패딩이 20입니다.
    expect(plainText.left - plainButton.left, closeTo(HoronSpace.s5, 0.5));

    await pumpButton(tester, HoronButton(label: 'Save', leading: const Icon(Icons.check), onPressed: () {}));
    final Rect button = tester.getRect(find.byType(HoronButton));
    final Rect icon = tester.getRect(find.byIcon(Icons.check));
    final Rect text = tester.getRect(find.text('Save'));

    // `has-data-[icon=inline-start]:pl-2` - 아이콘이 앞에 붙으면 패딩이 8로 줄어듭니다.
    expect(icon.left - button.left, closeTo(HoronSpace.s2, 0.5));
    // 그리고 `gap-2`만큼 떨어집니다.
    expect(text.left - icon.right, closeTo(HoronSpace.s2, 0.5));
  });

  testWidgets('button: both brightnesses render every variant', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronButtonVariant variant in HoronButtonVariant.values) {
        await pumpButton(
          tester,
          HoronButton(label: 'Button', variant: variant, onPressed: () {}),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${variant.name} on ${brightness.name}');
      }
    }
  });

  testWidgets('button: a button with no label, child or icon asserts', (WidgetTester tester) async {
    // 계약 위반은 조용히 빈 버튼을 그리지 않고 즉시 실패합니다.
    expect(() => HoronButton(onPressed: () {}), throwsA(isA<AssertionError>()));
  });
}
