import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

void main() {
  testWidgets('debug colours', (WidgetTester tester) async {
    final GlobalKey key = GlobalKey();
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: IconTheme(data: const IconThemeData(), child: RepaintBoundary(key: key, child: const HoronWordmark(height: 60))),
          ),
        ),
      ),
    );
    final BuildContext context = tester.element(find.byType(HoronWordmark));
    final HoronThemeData theme = HoronTheme.of(context);
    // ignore: avoid_print
    print('iconTheme=${IconTheme.of(context).color} themeIcon=${Theme.of(context).iconTheme.color}');
    // ignore: avoid_print
    print('textPrimary=${theme.colors.textPrimary} defaultText=${DefaultTextStyle.of(context).style.color}');

    final RenderRepaintBoundary boundary = key.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final ui.Image image = (await tester.runAsync(() => boundary.toImage()))!;
    final ByteData data = (await image.toByteData(format: ui.ImageByteFormat.rawRgba))!;
    final Uint8List rgba = data.buffer.asUint8List();
    final Set<int> colors = <int>{};
    final Set<int> alphas = <int>{};
    for (var i = 0; i < rgba.length; i += 4) {
      alphas.add(rgba[i + 3]);
      if (rgba[i + 3] == 255) colors.add((rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2]);
    }
    // ignore: avoid_print
    print('image=${image.width}x${image.height} opaque=${colors.take(8)} alphas=${alphas.take(8)}');
  });
}
