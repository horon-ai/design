import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpList(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 420, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('settings list: the card is thick glass at the 16px radius', (WidgetTester tester) async {
    await pumpList(tester, const HoronSettingsList(children: <Widget>[HoronSettingsRow(title: '언어', last: true)]));
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
    final ClipRRect clip = tester.widget<ClipRRect>(
      find.descendant(of: find.byType(HoronSettingsList), matching: find.byType(ClipRRect)).first,
    );
    expect((clip.borderRadius as BorderRadius).topLeft.x, closeTo(16, 0.01));
  });

  testWidgets('settings row: the title and description sit left, the control right', (WidgetTester tester) async {
    await pumpList(
      tester,
      const HoronSettingsList(
        children: <Widget>[
          HoronSettingsRow(
            title: '알림',
            description: '새 소식이 오면 알려 줍니다',
            control: HoronSettingsSwitch(value: true),
            last: true,
          ),
        ],
      ),
    );
    expect(find.text('알림'), findsOneWidget);
    expect(find.text('새 소식이 오면 알려 줍니다'), findsOneWidget);
    expect(find.byType(HoronSwitch), findsOneWidget);
  });

  testWidgets('settings row: a leading tile tightens the gap and the vertical padding', (WidgetTester tester) async {
    await pumpList(
      tester,
      const HoronSettingsList(
        children: <Widget>[
          HoronSettingsRow(
            title: '계정',
            leading: HoronSettingsRowIcon(icon: Icon(Icons.person_outline)),
            last: true,
          ),
        ],
      ),
    );
    expect(find.byType(HoronSettingsRowIcon), findsOneWidget);
    expect(tester.getSize(find.byType(HoronSettingsRowIcon)), const Size(32, 32));
  });

  testWidgets('settings row: only non-last rows draw the divider', (WidgetTester tester) async {
    await pumpList(
      tester,
      const HoronSettingsList(
        children: <Widget>[
          HoronSettingsRow(title: '첫째'),
          HoronSettingsRow(title: '둘째', last: true),
        ],
      ),
    );
    final Iterable<DecoratedBox> rows = tester.widgetList<DecoratedBox>(
      find.descendant(of: find.byType(HoronSettingsRow), matching: find.byType(DecoratedBox)),
    );
    final int withBorder = rows.where((DecoratedBox box) {
      final Decoration decoration = box.decoration;
      return decoration is BoxDecoration && decoration.border != null;
    }).length;
    expect(withBorder, 1, reason: 'only the first row keeps its bottom border');
  });

  testWidgets('settings keys: each keycap is 26 tall in a 6px radius', (WidgetTester tester) async {
    await pumpList(
      tester,
      const HoronSettingsList(
        children: <Widget>[
          HoronSettingsRow(
            title: '단축키',
            control: HoronSettingsKeys(keys: <String>['⌘', 'K']),
            last: true,
          ),
        ],
      ),
    );
    expect(find.text('⌘'), findsOneWidget);
    expect(find.text('K'), findsOneWidget);
    expect(tester.getSize(find.byType(HoronSettingsKey).first).height, 26);
  });

  testWidgets('settings list: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpList(
        tester,
        const HoronSettingsList(
          children: <Widget>[HoronSettingsRow(title: '언어', description: '한국어', last: true)],
        ),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
