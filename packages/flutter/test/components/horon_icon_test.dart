import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 위젯을 라이트·다크 테마의 화면 가운데에 올립니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, Color? iconColor}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: IconTheme(
        data: IconThemeData(color: iconColor),
        child: child,
      ),
    ),
  ),
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

/// 한 변이 [size]인 팔콘을 [RepaintBoundary]에 담아 올리고 그린 픽셀을 돌려줍니다.
Future<_Raster> _paintFalcon(
  WidgetTester tester, {
  required double size,
  Color? color,
  Brightness brightness = Brightness.light,
  Color? iconColor,
}) async {
  final GlobalKey key = GlobalKey();
  await tester.pumpWidget(
    _host(
      RepaintBoundary(
        key: key,
        child: HoronIcon(size: size, color: color),
      ),
      brightness: brightness,
      iconColor: iconColor,
    ),
  );
  expect(tester.takeException(), isNull);
  return _rasterize(tester, key);
}

int _rgb(Color color) => color.toARGB32() & 0xFFFFFF;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronIcon(), brightness: brightness));
      expect(tester.takeException(), isNull);
      expect(tester.getSize(find.byType(HoronIcon)), const Size(16, 16), reason: 'size 기본값은 1em = 16');
    }
  });

  testWidgets('the falcon paints at 16, 20 and 24 and scales with its size', (WidgetTester tester) async {
    final Rect at22 = (await _paintFalcon(tester, size: 22)).paintedBounds()!;
    final Rect at44 = (await _paintFalcon(tester, size: 44)).paintedBounds()!;
    final Rect at16 = (await _paintFalcon(tester, size: 16)).paintedBounds()!;
    final Rect at20 = (await _paintFalcon(tester, size: 20)).paintedBounds()!;
    final Rect at24 = (await _paintFalcon(tester, size: 24)).paintedBounds()!;

    for (final Rect bounds in <Rect>[at16, at20, at22, at24, at44]) {
      expect(bounds.width, greaterThan(0), reason: '팔콘은 면으로 채워집니다');
      expect(bounds.height, greaterThan(0));
    }
    // 22×22 viewBox를 size에 맞춰 확대하므로, 그린 상자는 size에 비례해야 합니다.
    expect(at44.width / at22.width, closeTo(2, 0.06), reason: '22 → 44에서 두 배로 커집니다');
    expect(at44.height / at22.height, closeTo(2, 0.06));
    expect(at24.width / at16.width, closeTo(1.5, 0.08), reason: '16 → 24에서 1.5배로 커집니다');
    // viewBox 안에서 팔콘은 가로로 길고 세로로 짧은 눈 모양입니다.
    expect(at22.width, greaterThan(at22.height), reason: '팔콘 눈은 가로로 긴 표식입니다');
    expect(at22.width, lessThanOrEqualTo(22));
    expect(at22.height, lessThan(22));
  });

  testWidgets('the falcon fills with the colour argument', (WidgetTester tester) async {
    final Color expected = HoronThemeData.light.colors.textBrand;
    final Set<int> colors = (await _paintFalcon(tester, size: 22, color: expected)).opaqueRgb();
    expect(colors, isNotEmpty, reason: '불투명 픽셀이 있어야 합니다');
    expect(colors, <int>{_rgb(expected)}, reason: 'fill=currentColor 자리는 color 인자가 됩니다');
  });

  testWidgets('the colour falls back to IconTheme, then to the text colour', (WidgetTester tester) async {
    final HoronThemeData light = HoronThemeData.light;
    final Set<int> themed = (await _paintFalcon(tester, size: 22, iconColor: light.colors.textSecondary)).opaqueRgb();
    expect(themed, <int>{_rgb(light.colors.textSecondary)});

    final Set<int> inherited = (await _paintFalcon(tester, size: 22)).opaqueRgb();
    final Set<int> dark = (await _paintFalcon(tester, size: 22, brightness: Brightness.dark)).opaqueRgb();
    expect(inherited, isNotEmpty);
    expect(dark, isNotEmpty);
    expect(inherited, isNot(<int>{_rgb(light.colors.textSecondary)}));
    expect(dark, isNot(inherited), reason: '다크에서는 밝은 글자 색으로 그립니다');
  });

  testWidgets('the icon vocabulary is the 79 Paper names in React order', (WidgetTester tester) async {
    expect(HoronIconName.values.length, 79);
    expect(HoronIconName.values.first, HoronIconName.plus);
    expect(HoronIconName.values.last, HoronIconName.plusCircle);
    expect(HoronIconName.values.indexOf(HoronIconName.horon), 68, reason: 'React iconNames의 69번째 항목이 horon입니다');
  });

  testWidgets('every icon name resolves to a glyph', (WidgetTester tester) async {
    for (final HoronIconName name in HoronIconName.values) {
      await tester.pumpWidget(_host(HoronGlyph(name: name)));
      expect(tester.takeException(), isNull, reason: '$name이 예외 없이 그려져야 합니다');
      expect(tester.getSize(find.byType(HoronGlyph)), const Size(20, 20), reason: '$name의 기본 크기는 20');
    }
  });

  testWidgets('horon renders the falcon, not a Material icon', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.horon)));
    expect(find.byType(HoronIcon), findsOneWidget);
    expect(find.byType(Icon), findsNothing);

    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.plus)));
    expect(find.byType(HoronIcon), findsNothing);
    expect(tester.widget<Icon>(find.byType(Icon)).icon, Icons.add, reason: 'plus → Icons.add');
  });

  testWidgets('a given glyph size is honoured', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.search)));
    expect(tester.widget<Icon>(find.byType(Icon)).size, 20);

    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.search, size: 24)));
    expect(tester.widget<Icon>(find.byType(Icon)).size, 24);

    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.horon, size: 24)));
    expect(tester.getSize(find.byType(HoronIcon)), const Size(24, 24));
  });

  testWidgets('glyph colour follows the colour argument and IconTheme', (WidgetTester tester) async {
    final HoronThemeData theme = HoronThemeData.light;

    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.check, color: Color(0xFF123456))));
    expect(tester.widget<Icon>(find.byType(Icon)).color, const Color(0xFF123456));

    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.check), iconColor: theme.colors.textSecondary));
    expect(tester.widget<Icon>(find.byType(Icon)).color, theme.colors.textSecondary);

    await tester.pumpWidget(_host(const HoronGlyph(name: HoronIconName.horon), iconColor: theme.colors.textBrand));
    final Set<int> painted = (await _paintFalcon(tester, size: 22, iconColor: theme.colors.textBrand)).opaqueRgb();
    expect(painted, <int>{_rgb(theme.colors.textBrand)}, reason: 'HoronGlyph의 horon도 같은 색 규칙을 씁니다');
  });

  testWidgets('all 79 glyphs reflow at phone width without overflowing', (WidgetTester tester) async {
    for (final double width in <double>[320, 1024]) {
      await tester.pumpWidget(
        _host(
          SizedBox(
            width: width,
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: <Widget>[for (final HoronIconName name in HoronIconName.values) HoronGlyph(name: name)],
            ),
          ),
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 아이콘 격자가 흘러야 합니다');
    }
  });
}
