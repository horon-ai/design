import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SingleChildScrollView(child: sized)),
    ),
  );
}

HoronIntegrationRow _row(HoronIntegrationStatus status, {VoidCallback? onAction, String? detail = 'alpox@gmail.com'}) {
  return HoronIntegrationRow(
    icon: const Icon(Icons.cloud_outlined),
    name: 'Google Drive',
    detail: detail,
    status: status,
    onAction: onAction,
  );
}

HoronThemeData _themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronIntegrationRow)));

Finder _tile() => find.descendant(
  of: find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == 40 && widget.height == 40),
  matching: find.byType(DecoratedBox),
);

Color _tileColor(WidgetTester tester) => (tester.widget<DecoratedBox>(_tile()).decoration as BoxDecoration).color!;

Finder _borderedBox() => find.byWidgetPredicate(
  (Widget widget) =>
      widget is DecoratedBox &&
      widget.decoration is BoxDecoration &&
      (widget.decoration as BoxDecoration).border != null,
);

void main() {
  testWidgets('every status renders in light and dark without exceptions', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronIntegrationStatus status in HoronIntegrationStatus.values) {
        await tester.pumpWidget(_host(_row(status, onAction: () {}), brightness: brightness, width: 720));
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });

  testWidgets('each status paints its own tile and control', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.connected), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    for (final HoronIntegrationStatus status in HoronIntegrationStatus.values) {
      await tester.pumpWidget(_host(_row(status, onAction: () {}), width: 720));
      await tester.pumpAndSettle();
      final Color expected = switch (status) {
        HoronIntegrationStatus.connected => HoronPalette.sky500,
        HoronIntegrationStatus.reconnect => HoronPalette.sky700,
        HoronIntegrationStatus.notConnected => theme.colors.interactivePrimary,
      };
      expect(_tileColor(tester), expected, reason: status.name);
      final String control = switch (status) {
        HoronIntegrationStatus.connected => 'Connected',
        HoronIntegrationStatus.reconnect => 'Reconnect',
        HoronIntegrationStatus.notConnected => 'Connect',
      };
      expect(find.text(control), findsOneWidget, reason: status.name);
    }
  });

  testWidgets('the connected pill is 30px on accent-sky with a 6px live dot', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.connected), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    final Container pill = tester.widget<Container>(
      find.ancestor(of: find.text('Connected'), matching: find.byType(Container)).first,
    );
    expect(pill.constraints?.maxHeight, theme.space.step(7.5));
    expect((pill.decoration! as BoxDecoration).color, theme.colors.accentSky500_18);
    expect((pill.decoration! as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.full));

    final Finder dot = find.byWidgetPredicate(
      (Widget widget) =>
          widget is DecoratedBox &&
          widget.decoration is BoxDecoration &&
          (widget.decoration as BoxDecoration).shape == BoxShape.circle,
    );
    expect(dot, findsOneWidget);
    expect(
      find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == theme.space.s1_5),
      findsOneWidget,
    );
  });

  testWidgets('reconnect draws the danger border and the danger detail and button', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.reconnect, onAction: () {}), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    final DecoratedBox border = tester.widget<DecoratedBox>(_borderedBox());
    expect(((border.decoration as BoxDecoration).border! as Border).top.color, theme.colors.borderDanger);
    expect((border.decoration as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.xl2));

    final Text detail = tester.widget<Text>(find.text('alpox@gmail.com'));
    expect(detail.style?.color, theme.colors.textDanger);
    expect(detail.style?.fontSize, theme.text.caption.fontSize);

    final Container button = tester.widget<Container>(
      find.ancestor(of: find.text('Reconnect'), matching: find.byType(Container)).first,
    );
    expect(button.constraints?.maxHeight, theme.space.step(7.5));
    expect((button.decoration! as BoxDecoration).color, theme.colors.accentRed500_14);
    expect(tester.widget<Text>(find.text('Reconnect')).style?.color, theme.colors.textDanger);
    expect(find.byIcon(Icons.power), findsNothing, reason: 'reconnect에는 Plug 아이콘이 없습니다');
  });

  testWidgets('not-connected paints the primary button with a 14px plug', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.notConnected, onAction: () {}), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    final Container button = tester.widget<Container>(
      find.ancestor(of: find.text('Connect'), matching: find.byType(Container)).first,
    );
    expect((button.decoration! as BoxDecoration).color, theme.colors.interactivePrimary);
    expect(tester.widget<Text>(find.text('Connect')).style?.color, theme.colors.textInverse);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.power))).size, theme.space.s3_5);
    expect(_borderedBox(), findsNothing);
  });

  testWidgets('the action button calls back', (WidgetTester tester) async {
    int actions = 0;
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.notConnected, onAction: () => actions += 1), width: 720));
    await tester.tap(find.text('Connect'));
    await tester.pumpAndSettle();
    expect(actions, 1);
    expect(tester.takeException(), isNull);
  });

  testWidgets('the glass shell clips at 16px', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.connected), width: 720));
    final HoronThemeData theme = _themeOf(tester);
    final ClipRRect clip = tester.widget<ClipRRect>(find.byType(ClipRRect).first);
    expect((clip.borderRadius as BorderRadius).topLeft.x, theme.radius.xl2);
  });

  testWidgets('moves the control below the text under the sm breakpoint', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.connected), width: 900));
    final Offset wideName = tester.getTopLeft(find.text('Google Drive'));
    final Offset widePill = tester.getTopLeft(find.text('Connected'));
    expect(widePill.dx, greaterThan(wideName.dx), reason: '넓은 폭에서는 알약이 오른쪽입니다');

    await tester.pumpWidget(_host(_row(HoronIntegrationStatus.connected), width: 360));
    await tester.pumpAndSettle();
    final Offset narrowName = tester.getTopLeft(find.text('Google Drive'));
    final Offset narrowPill = tester.getTopLeft(find.text('Connected'));
    expect(narrowPill.dy, greaterThan(narrowName.dy + 20), reason: '좁은 폭에서는 알약이 아래로 내려갑니다');
    expect(tester.takeException(), isNull);
  });
}
