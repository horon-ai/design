import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronVeil`이 그리는 세 층과 강등 규칙을 검사합니다.
///
/// 계약은 CSS `.veil-field`·`.veil-overlay`·`.veil-drop`과 같습니다: 토큰 블러 다음
/// 토큰 채도 행렬, 상태별 채움, [BoxShadow]로 그린 1px 링(필드 오류는 `border-danger`),
/// 종류별 soft shadow입니다. 뒤 배경을 필터할 수 없으면 `glass-fill-frost` 한 겹으로
/// 내려갑니다.
void main() {
  Future<void> pumpVeil(
    WidgetTester tester,
    Widget veil, {
    Brightness brightness = Brightness.light,
    bool disableAnimations = false,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Builder(
          builder: (BuildContext context) => MediaQuery(
            data: MediaQuery.of(context).copyWith(disableAnimations: disableAnimations),
            child: Scaffold(
              body: Center(child: SizedBox(width: 240, height: 56, child: veil)),
            ),
          ),
        ),
      ),
    );
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronVeil)));

  HoronVeilScheme schemeOf(WidgetTester tester) => themeOf(tester).veil.forBrightness(themeOf(tester).brightness);

  Color fillOf(WidgetTester tester) => tester.widget<ColoredBox>(find.byKey(HoronVeilKeys.fill)).color;

  ui.ImageFilter backdropOf(WidgetTester tester) =>
      tester.widget<BackdropFilter>(find.byKey(HoronVeilKeys.backdrop)).filter!;

  BoxDecoration decorationOf(WidgetTester tester) {
    final DecoratedBox box = tester.widget<DecoratedBox>(find.byKey(HoronVeilKeys.decoration));
    return box.decoration as BoxDecoration;
  }

  /// 링 그림자입니다. CSS `0 0 0 1px`처럼 blur 없이 spread만 있는 그림자입니다.
  BoxShadow? ringOf(WidgetTester tester) {
    for (final BoxShadow shadow in decorationOf(tester).boxShadow ?? const <BoxShadow>[]) {
      if (shadow.blurRadius == 0) return shadow;
    }
    return null;
  }

  /// 링을 뺀 soft shadow 목록입니다.
  List<BoxShadow> softShadowsOf(WidgetTester tester) => <BoxShadow>[
    for (final BoxShadow shadow in decorationOf(tester).boxShadow ?? const <BoxShadow>[])
      if (shadow.blurRadius != 0) shadow,
  ];

  group('field', () {
    testWidgets('uses the field fill, the 1px ring and the 0 2px 10px shadow', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(child: Text('필드')));

      final HoronVeilScheme scheme = schemeOf(tester);
      final HoronVeilTokens veil = themeOf(tester).veil;
      final BoxShadow ring = ringOf(tester)!;
      expect(fillOf(tester), scheme.field);
      expect(ring.color, scheme.ring);
      expect(ring.spreadRadius, veil.ringWidth);
      expect(ring.blurRadius, 0);
      expect(ring.offset, Offset.zero);
      expect(softShadowsOf(tester), scheme.fieldShadow);
      expect(decorationOf(tester).borderRadius, BorderRadius.circular(themeOf(tester).radius.md));
    });

    testWidgets('focus swaps the fill for fieldFocus and keeps the ring', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(focused: true, child: Text('필드')));
      expect(fillOf(tester), schemeOf(tester).fieldFocus);
      expect(ringOf(tester)!.color, schemeOf(tester).ring);
    });

    testWidgets('invalid swaps only the ring colour for border-danger', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(invalid: true, child: Text('필드')));
      expect(ringOf(tester)!.color, themeOf(tester).colors.borderDanger);
      expect(ringOf(tester)!.spreadRadius, themeOf(tester).veil.ringWidth);
      // 채움과 soft shadow는 그대로입니다.
      expect(fillOf(tester), schemeOf(tester).field);
      expect(softShadowsOf(tester), schemeOf(tester).fieldShadow);
    });
  });

  group('overlay', () {
    testWidgets('uses the 74% overlay fill and the 0 6px 24px shadow', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(kind: HoronVeilKind.overlay, child: Text('오버레이')));

      final HoronVeilScheme scheme = schemeOf(tester);
      expect(fillOf(tester), scheme.overlay);
      expect(ringOf(tester)!.color, scheme.ring);
      expect(softShadowsOf(tester), scheme.overlayShadow);
      expect(decorationOf(tester).borderRadius, BorderRadius.circular(themeOf(tester).radius.xl));
    });

    testWidgets('focus does not change the overlay fill', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(kind: HoronVeilKind.overlay, focused: true, child: Text('오버레이')));
      expect(fillOf(tester), schemeOf(tester).overlay);
    });
  });

  group('drop', () {
    testWidgets('keeps the field fill and shadow but draws no ring', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(kind: HoronVeilKind.drop, child: Text('드롭')));

      expect(fillOf(tester), schemeOf(tester).field);
      expect(ringOf(tester), isNull);
      expect(decorationOf(tester).boxShadow, schemeOf(tester).fieldShadow);
      expect(decorationOf(tester).borderRadius, BorderRadius.circular(themeOf(tester).space.step(2.5)));
    });
  });

  group('backdrop', () {
    testWidgets('blurs with the token sigma and then applies the token saturate matrix', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(child: Text('필드')));
      final HoronVeilTokens veil = themeOf(tester).veil;

      expect(veil.blur, 8);
      expect(veil.saturate, 1.6);
      expect(
        backdropOf(tester),
        ui.ImageFilter.compose(
          outer: ui.ColorFilter.matrix(veil.saturateMatrix),
          inner: ui.ImageFilter.blur(sigmaX: veil.blur, sigmaY: veil.blur, tileMode: ui.TileMode.mirror),
        ),
      );
      expect(find.byType(BackdropFilter), findsOneWidget);
    });
  });

  group('frost fallback', () {
    testWidgets('reduced motion drops the filter and paints glass-fill-frost', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(child: Text('필드')), disableAnimations: true);

      expect(find.byKey(HoronVeilKeys.backdrop), findsNothing);
      expect(find.byType(BackdropFilter), findsNothing);
      expect(find.byKey(HoronVeilKeys.frost), findsOneWidget);
      expect(tester.widget<ColoredBox>(find.byKey(HoronVeilKeys.frost)).color, themeOf(tester).colors.glassFillFrost);
      // 링과 그림자는 서리 단계에도 남습니다.
      expect(ringOf(tester)!.spreadRadius, 1);
      expect(tester.takeException(), isNull);
    });
  });

  group('brightness', () {
    testWidgets('dark uses the dark scheme colours', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(child: Text('필드')), brightness: Brightness.dark);
      expect(fillOf(tester), HoronVeilTokens.dark.field);
      expect(ringOf(tester)!.color, HoronVeilTokens.dark.ring);
      expect(softShadowsOf(tester), HoronVeilTokens.dark.fieldShadow);
    });
  });

  group('shape', () {
    testWidgets('a custom radius reaches both the clip and the decoration', (WidgetTester tester) async {
      await pumpVeil(tester, const HoronVeil(borderRadius: BorderRadius.all(Radius.circular(28)), child: Text('필드')));
      final ClipRRect clip = tester.widget<ClipRRect>(
        find.descendant(of: find.byType(HoronVeil), matching: find.byType(ClipRRect)).first,
      );
      expect((clip.borderRadius as BorderRadius).topLeft.x, 28);
      expect((decorationOf(tester).borderRadius! as BorderRadius).topLeft.x, 28);
    });

    testWidgets('three kinds render in both brightnesses without exceptions', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        for (final HoronVeilKind kind in HoronVeilKind.values) {
          await pumpVeil(
            tester,
            HoronVeil(kind: kind, child: Text(kind.name)),
            brightness: brightness,
          );
          expect(tester.takeException(), isNull, reason: '${brightness.name} ${kind.name}');
        }
      }
    });
  });

  group('HoronSurfaceLayer', () {
    testWidgets('veilField and veilOverlay delegate to HoronVeil', (WidgetTester tester) async {
      for (final (HoronSurface surface, HoronVeilKind kind) in <(HoronSurface, HoronVeilKind)>[
        (HoronSurface.veilField, HoronVeilKind.field),
        (HoronSurface.veilOverlay, HoronVeilKind.overlay),
      ]) {
        await pumpVeil(
          tester,
          HoronSurfaceLayer(surface: surface, borderRadius: BorderRadius.circular(12), child: const Text('표면')),
        );
        final HoronVeil veil = tester.widget<HoronVeil>(find.byType(HoronVeil));
        expect(veil.kind, kind, reason: surface.name);
      }
    });

    testWidgets('glass still delegates to HoronLiquidGlass', (WidgetTester tester) async {
      await pumpVeil(
        tester,
        HoronSurfaceLayer(
          surface: HoronSurface.glass,
          borderRadius: BorderRadius.circular(12),
          child: const Text('표면'),
        ),
      );
      expect(find.byType(HoronLiquidGlass), findsOneWidget);
      expect(find.byType(HoronVeil), findsNothing);
    });
  });
}
