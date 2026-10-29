import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/mcp_server_row.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SingleChildScrollView(child: sized)),
    ),
  );
}

HoronMcpServerRow _row({VoidCallback? onConfigure, VoidCallback? onMenuPressed}) {
  return HoronMcpServerRow(
    name: 'notion',
    tags: const <String>['Official', 'Local'],
    brandTags: const <String>['All devices'],
    description: '페이지와 데이터베이스를 읽습니다',
    meta: const <String>['v1.2.0', 'stdio', '2 tools'],
    onConfigure: onConfigure,
    onMenuPressed: onMenuPressed,
  );
}

HoronThemeData _themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronMcpServerRow)));

Finder _sizedBox(double size) =>
    find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == size && widget.height == size);

Finder _decoratedWith(Color color) => find.byWidgetPredicate(
  (Widget widget) =>
      widget is DecoratedBox &&
      widget.decoration is BoxDecoration &&
      (widget.decoration as BoxDecoration).color == color,
);

Container _pillOf(WidgetTester tester, String label) =>
    tester.widget<Container>(find.ancestor(of: find.text(label), matching: find.byType(Container)).first);

void main() {
  testWidgets('renders in light and dark without exceptions', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_row(onConfigure: () {}), brightness: brightness, width: 720));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('the tile derives its initials from the name unless given', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    expect(find.text('NO'), findsOneWidget);
    expect(_sizedBox(theme.space.step(10)), findsOneWidget, reason: 'size-10 타일');
    expect(_decoratedWith(theme.colors.interactivePrimary), findsOneWidget);
    final Text initials = tester.widget<Text>(find.text('NO'));
    expect(initials.style?.fontWeight, HoronFontWeight.semibold);
    expect(initials.style?.color, theme.colors.interactiveOnPrimary);

    await tester.pumpWidget(_host(const HoronMcpServerRow(name: 'notion', initials: 'NT'), width: 720));
    expect(find.text('NT'), findsOneWidget);
    expect(find.text('NO'), findsNothing);
  });

  testWidgets('tags and brand tags keep their pill colours', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    HoronThemeData theme = _themeOf(tester);

    final Container tag = _pillOf(tester, 'Official');
    expect(tag.constraints?.maxHeight, theme.space.step(5.5));
    expect((tag.decoration! as BoxDecoration).color, theme.colors.overlayInk6);
    expect((tag.decoration! as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.full));

    final Container brand = _pillOf(tester, 'All devices');
    expect((brand.decoration! as BoxDecoration).color, theme.colors.accentSky500_18);

    await tester.pumpWidget(_host(_row(), brightness: Brightness.dark, width: 720));
    await tester.pumpAndSettle();
    theme = _themeOf(tester);
    expect((_pillOf(tester, 'Official').decoration! as BoxDecoration).color, theme.colors.bgSurface6);
  });

  testWidgets('the meta line joins values with a middle dot and repeats duplicates', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(const HoronMcpServerRow(name: 'notion', meta: <String>['stdio', 'stdio', '2 tools']), width: 720),
    );
    final HoronThemeData theme = _themeOf(tester);

    expect(find.text('stdio'), findsNWidgets(2), reason: 'React는 같은 값에 key 접미사를 붙여 둘 다 그립니다');
    expect(find.text('·'), findsNWidgets(2));
    final Text value = tester.widget<Text>(find.text('2 tools'));
    expect(value.style?.fontSize, 12);
    expect(value.style?.color, theme.colors.textPlaceholder);
  });

  testWidgets('the status pill and the two actions keep their sizes', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(onConfigure: () {}, onMenuPressed: () {}), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    final Container status = _pillOf(tester, 'Connected');
    expect(status.constraints?.maxHeight, theme.space.step(5.5));
    expect((status.decoration! as BoxDecoration).color, theme.colors.accentSky500_18);

    final AnimatedContainer configure = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('Configure'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(configure.constraints?.maxHeight, theme.space.step(8), reason: 'glass sm h-8');
    expect(IconTheme.of(tester.element(find.byIcon(Icons.settings_outlined))).size, theme.space.s3_5);

    final AnimatedContainer overflow = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.byIcon(Icons.more_horiz), matching: find.byType(AnimatedContainer)).first,
    );
    expect(overflow.constraints?.maxWidth, theme.space.step(8));
    expect((overflow.decoration! as BoxDecoration).shape, BoxShape.circle, reason: 'icon-button rounded-full');
    final Icon dots = tester.widget<Icon>(find.byIcon(Icons.more_horiz));
    expect(dots.size, theme.space.s4, reason: 'IconButton sm [&_svg]:size-4');
  });

  testWidgets('the actions call back', (WidgetTester tester) async {
    int configures = 0;
    int menus = 0;
    await tester.pumpWidget(
      _host(_row(onConfigure: () => configures += 1, onMenuPressed: () => menus += 1), width: 720),
    );

    await tester.tap(find.text('Configure'));
    await tester.pumpAndSettle();
    expect(configures, 1);

    await tester.tap(find.byIcon(Icons.more_horiz));
    await tester.pumpAndSettle();
    expect(menus, 1);
    expect(tester.takeException(), isNull);
  });

  testWidgets('hides the overflow button without a menu callback', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    expect(find.byIcon(Icons.more_horiz), findsNothing);
    expect(find.text('Configure'), findsOneWidget, reason: 'Configure는 menu와 무관하게 늘 있습니다');
  });

  testWidgets('moves the actions below the text under the sm breakpoint', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(onConfigure: () {}, onMenuPressed: () {}), width: 900));
    final Offset wideName = tester.getTopLeft(find.text('notion'));
    final Offset wideStatus = tester.getTopLeft(find.text('Connected'));
    expect(wideStatus.dx, greaterThan(wideName.dx), reason: '넓은 폭에서는 액션이 오른쪽입니다');

    await tester.pumpWidget(_host(_row(onConfigure: () {}, onMenuPressed: () {}), width: 360));
    await tester.pumpAndSettle();
    final Offset narrowName = tester.getTopLeft(find.text('notion'));
    final Offset narrowStatus = tester.getTopLeft(find.text('Connected'));
    expect(narrowStatus.dy, greaterThan(narrowName.dy + 20), reason: '좁은 폭에서는 액션이 아래로 내려갑니다');
    expect(tester.takeException(), isNull);
  });
}
