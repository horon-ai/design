import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronCombobox`의 열기·검색·선택·빈 상태·닫기를 검사합니다.
///
/// 팝업은 [HoronMenuAnchor]가 열고 닫으므로 트리거 탭과 Escape, 바깥 누르기를
/// 실제 위젯과 좌표로 눌러 확인합니다.
const Offset _outside = Offset(2, 2);

const List<HoronComboboxItem> _items = <HoronComboboxItem>[
  HoronComboboxItem(value: 'kr', label: 'South Korea', selectedLabel: 'KR', keywords: <String>['Korea']),
  HoronComboboxItem(value: 'us', label: 'United States', selectedLabel: 'US'),
  HoronComboboxItem(value: 'jp', label: 'Japan', selectedLabel: 'JP'),
  HoronComboboxItem(value: 'de', label: 'Germany', selectedLabel: 'DE', disabled: true),
];

/// 왼쪽 위에 320px 폭의 콤보박스를 두는 화면입니다.
///
/// 팝업이 트리거 아래로 열리므로 화면 위쪽에 붙여 두고, 나머지 영역은 바깥
/// 누르기를 확인하는 자리로 남깁니다.
Widget _host({
  Brightness brightness = Brightness.light,
  bool multiple = false,
  String emptyLabel = 'No results',
  ValueChanged<String?>? onChanged,
  ValueChanged<List<String>>? onValuesChanged,
}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: SizedBox(
            width: 320,
            child: HoronCombobox(
              items: _items,
              multiple: multiple,
              placeholder: multiple ? 'Tags' : 'Country',
              emptyLabel: emptyLabel,
              onChanged: onChanged,
              onValuesChanged: onValuesChanged,
            ),
          ),
        ),
      ),
    ),
  );
}

/// 팝업의 검색 상자입니다. 목록이 열려 있는지도 이 위젯으로 확인합니다.
final Finder _search = find.byType(TextField);

Future<void> _open(WidgetTester tester) async {
  await tester.tap(find.byType(HoronCombobox));
  await tester.pumpAndSettle();
}

Future<void> _searchFor(WidgetTester tester, String text) async {
  await tester.enterText(_search, text);
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      // 앞 회차의 열림 상태가 남지 않도록 빈 화면을 한 번 거칩니다.
      await tester.pumpWidget(const SizedBox.shrink());
      await tester.pumpWidget(_host(brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');

      await _open(tester);
      expect(find.text('South Korea'), findsOneWidget);
      expect(tester.takeException(), isNull, reason: 'open popup at brightness $brightness');
    }
  });

  testWidgets('tapping opens the list and the search filters it', (WidgetTester tester) async {
    await tester.pumpWidget(_host());
    await tester.pump();
    expect(find.text('South Korea'), findsNothing, reason: '목록은 트리거를 누르기 전까지 닫혀 있습니다');

    await _open(tester);
    expect(_search, findsOneWidget);
    for (final String label in <String>['South Korea', 'United States', 'Japan', 'Germany']) {
      expect(find.text(label), findsOneWidget, reason: '$label 행이 보여야 합니다');
    }

    await _searchFor(tester, 'jap');
    expect(find.text('Japan'), findsOneWidget);
    expect(find.text('South Korea'), findsNothing);
    expect(find.text('United States'), findsNothing);

    await _searchFor(tester, 'Korea');
    expect(find.text('South Korea'), findsOneWidget, reason: 'keywords도 검색 대상입니다');
    expect(find.text('Japan'), findsNothing);

    await _searchFor(tester, '');
    expect(find.text('Japan'), findsOneWidget, reason: '검색어를 지우면 목록이 돌아옵니다');
  });

  testWidgets('choosing a single item reports it and closes the list', (WidgetTester tester) async {
    final List<String?> seen = <String?>[];
    await tester.pumpWidget(_host(onChanged: seen.add));
    await _open(tester);

    await tester.tap(find.text('Japan'));
    await tester.pumpAndSettle();
    expect(seen, <String>['jp']);
    expect(_search, findsNothing, reason: '단일 선택은 목록을 닫습니다');
    expect(find.text('Japan'), findsNothing);
    expect(find.text('JP'), findsOneWidget, reason: '트리거는 selectedLabel을 보여 줍니다');

    await _open(tester);
    await tester.tap(find.text('Germany'));
    await tester.pumpAndSettle();
    expect(seen, <String>['jp'], reason: '비활성 행은 고를 수 없습니다');
    expect(_search, findsOneWidget);
  });

  testWidgets('a multiple combobox keeps the list open and toggles values', (WidgetTester tester) async {
    final List<List<String>> seen = <List<String>>[];
    await tester.pumpWidget(_host(multiple: true, onValuesChanged: seen.add));
    await _open(tester);
    expect(find.text('Tags'), findsOneWidget);

    await tester.tap(find.text('South Korea'));
    await tester.pumpAndSettle();
    expect(seen, <List<String>>[
      <String>['kr'],
    ]);
    expect(_search, findsOneWidget, reason: '다중 선택은 목록을 열어 둡니다');
    expect(find.text('KR'), findsOneWidget, reason: '고른 항목이 칩으로 남습니다');

    await tester.tap(find.text('Japan'));
    await tester.pumpAndSettle();
    expect(seen.last, <String>['kr', 'jp']);
    expect(_search, findsOneWidget);

    await tester.tap(find.text('South Korea'));
    await tester.pumpAndSettle();
    expect(seen.last, <String>['jp'], reason: '같은 항목을 다시 누르면 빠집니다');
    expect(find.text('KR'), findsNothing);
    expect(find.text('JP'), findsOneWidget);
  });

  testWidgets('the empty label shows when nothing matches', (WidgetTester tester) async {
    await tester.pumpWidget(_host(emptyLabel: 'Nothing here'));
    await _open(tester);

    await _searchFor(tester, 'zzz');
    expect(find.text('Nothing here'), findsOneWidget);
    expect(find.text('Japan'), findsNothing);
    expect(_search, findsOneWidget, reason: '일치 항목이 없어도 목록은 닫히지 않습니다');
    expect(tester.takeException(), isNull);
  });

  testWidgets('escape and an outside tap close the list', (WidgetTester tester) async {
    await tester.pumpWidget(_host());

    await _open(tester);
    expect(_search, findsOneWidget);
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(_search, findsNothing, reason: 'Escape는 목록을 닫습니다');

    await _open(tester);
    expect(_search, findsOneWidget);
    await tester.tapAt(_outside);
    await tester.pumpAndSettle();
    expect(_search, findsNothing, reason: '바깥 누르기는 목록을 닫습니다');
  });
}
