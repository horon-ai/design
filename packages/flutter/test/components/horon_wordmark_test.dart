import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// React `HoronWordmark`의 `height = 11.5`, `viewBox="0 0 48.7038 11.5"`입니다.
const double _aspect = 48.7038 / 11.5;

/// 위젯을 라이트·다크 테마의 화면 가운데에 올립니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
  theme: horonTheme(brightness),
  // MaterialApp은 테마를 200ms 동안 이어 그립니다. 한 프레임에서 밝기별 색을 읽으려면
  // 그 애니메이션을 끄고 최종 테마로 바로 그리게 합니다.
  themeAnimationDuration: Duration.zero,
  home: Scaffold(body: Center(child: child)),
);

/// 화면에 실제로 칠해진 픽셀입니다.
class _Raster {
  const _Raster({required this.width, required this.height, required this.rgba});

  final int width;
  final int height;
  final Uint8List rgba;

  /// (x, y) 픽셀의 RGBA입니다.
  List<int> at(int x, int y) {
    final int offset = (y * width + x) * 4;
    return <int>[rgba[offset], rgba[offset + 1], rgba[offset + 2], rgba[offset + 3]];
  }

  /// 알파가 0보다 큰 픽셀을 모두 감싸는 상자입니다. 그린 것이 없으면 null입니다.
  Rect? paintedBounds() {
    int left = width;
    int top = height;
    int right = -1;
    int bottom = -1;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (at(x, y)[3] == 0) continue;
        if (x < left) left = x;
        if (y < top) top = y;
        if (x > right) right = x;
        if (y > bottom) bottom = y;
      }
    }
    if (right < 0) return null;
    return Rect.fromLTRB(left.toDouble(), top.toDouble(), right + 1.0, bottom + 1.0);
  }

  /// 완전히 불투명한 픽셀의 RGB 집합입니다. 안티에일리어싱 경계는 섞인 색이라 빠집니다.
  Set<int> opaqueRgb() {
    final Set<int> colors = <int>{};
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        final List<int> pixel = at(x, y);
        if (pixel[3] != 255) continue;
        colors.add((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]);
      }
    }
    return colors;
  }
}

/// [key]가 붙은 [RepaintBoundary]를 실제 픽셀로 굽습니다.
Future<_Raster> _rasterize(WidgetTester tester, GlobalKey key) async {
  final RenderRepaintBoundary boundary = key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
  final _Raster? raster = await tester.runAsync(() async {
    final ui.Image image = await boundary.toImage();
    final ByteData data = (await image.toByteData(format: ui.ImageByteFormat.rawRgba))!;
    return _Raster(
      width: image.width,
      height: image.height,
      rgba: data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
    );
  });
  return raster!;
}

/// [height] 크기의 워드마크를 그려 픽셀을 돌려줍니다.
Future<_Raster> _paintMark(
  WidgetTester tester, {
  double? height,
  Color? color,
  Brightness brightness = Brightness.light,
}) async {
  final GlobalKey key = GlobalKey();
  await tester.pumpWidget(
    _host(
      RepaintBoundary(
        key: key,
        child: HoronWordmark(height: height ?? 11.5, color: color),
      ),
      brightness: brightness,
    ),
  );
  expect(tester.takeException(), isNull);
  return _rasterize(tester, key);
}

int _rgb(Color color) => color.toARGB32() & 0xFFFFFF;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronWordmark(), brightness: brightness));
      expect(tester.takeException(), isNull);
      expect(
        tester.getSize(find.byType(HoronWordmark)),
        Size(11.5 * _aspect, 11.5),
        reason: 'React 기본 height 11.5, 폭은 viewBox 비율을 따릅니다',
      );
    }
  });

  testWidgets('a given height is honoured and the width follows the viewBox', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronWordmark(height: 24)));
    expect(tester.getSize(find.byType(HoronWordmark)), Size(24 * _aspect, 24));
    expect(tester.getSize(find.byType(HoronWordmark)).width, closeTo(101.65, 0.01));
  });

  testWidgets('the mark paints and scales with its height', (WidgetTester tester) async {
    final Rect at24 = (await _paintMark(tester, height: 24)).paintedBounds()!;
    final Rect at48 = (await _paintMark(tester, height: 48)).paintedBounds()!;

    expect(at24.width, greaterThan(0));
    expect(at24.height, greaterThan(0));
    // 글자 여섯 개가 거의 viewBox를 채우고, 높이에 비례해 커집니다.
    expect(at24.height, greaterThan(24 * 0.9), reason: '워드마크는 세로를 거의 다 씁니다');
    expect(at24.width, greaterThan(24 * _aspect * 0.9));
    expect(at48.width / at24.width, closeTo(2, 0.08));
    expect(at48.height / at24.height, closeTo(2, 0.15));
  });

  testWidgets('the mark fills with the colour argument', (WidgetTester tester) async {
    final Color expected = HoronThemeData.light.colors.textBrand;
    final Set<int> colors = (await _paintMark(tester, height: 60, color: expected)).opaqueRgb();
    expect(colors, isNotEmpty, reason: '채워진 픽셀이 있어야 합니다');
    expect(colors, <int>{_rgb(expected)}, reason: 'fill=currentColor 자리는 color 인자가 됩니다');
  });

  testWidgets('without a colour it paints the brightness\'s text colour', (WidgetTester tester) async {
    final Set<int> light = (await _paintMark(tester, height: 60)).opaqueRgb();
    final Set<int> dark = (await _paintMark(tester, height: 60, brightness: Brightness.dark)).opaqueRgb();

    expect(light, <int>{_rgb(HoronThemeData.light.colors.textPrimary)}, reason: '기본은 밝기의 본문 글자 색입니다');
    expect(dark, <int>{_rgb(HoronThemeData.dark.colors.textPrimary)}, reason: '다크에서는 밝은 글자 색입니다');
  });

  testWidgets('the title is the accessible name React puts on aria-label', (WidgetTester tester) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    await tester.pumpWidget(_host(const HoronWordmark()));
    expect(find.bySemanticsLabel('Horon'), findsOneWidget);

    await tester.pumpWidget(_host(const HoronWordmark(title: '호론')));
    expect(find.bySemanticsLabel('호론'), findsOneWidget);
    expect(find.bySemanticsLabel('Horon'), findsNothing);
    handle.dispose();
  });

  testWidgets('the mark fits a phone width without overflowing', (WidgetTester tester) async {
    for (final double width in <double>[320, 1024]) {
      await tester.pumpWidget(
        _host(
          SizedBox(
            width: width,
            child: const Wrap(
              spacing: 12,
              runSpacing: 12,
              children: <Widget>[HoronWordmark(), HoronWordmark(height: 24), HoronWordmark(height: 40)],
            ),
          ),
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 워드마크가 흘러야 합니다');
    }
  });
}
