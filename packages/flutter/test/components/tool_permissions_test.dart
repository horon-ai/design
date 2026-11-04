import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 도구 권한 목록의 계약을 확인합니다.
///
/// React `tool-permissions.tsx`가 정한 구조(둥근 카드, 옅은 헤더 + 개수 알약 + Allow all,
/// 도구마다 한 줄 + `SegmentedControl size="sm" surface="solid"`)와 세 값의 선택 상태를
/// 고정합니다.
const List<HoronToolPermissionItem> _tools = <HoronToolPermissionItem>[
  HoronToolPermissionItem(name: 'files.read', description: Text('Read files in the workspace')),
  HoronToolPermissionItem(name: 'shell.run', defaultValue: HoronToolPermissionsToolPermission.off),
];

const Map<HoronToolPermissionsToolPermission, String> _labels = <HoronToolPermissionsToolPermission, String>{
  HoronToolPermissionsToolPermission.allow: 'Allow',
  HoronToolPermissionsToolPermission.ask: 'Ask',
  HoronToolPermissionsToolPermission.off: 'Off',
};

Widget _host(Brightness brightness, Widget child, {double width = 600}) {
  return MaterialApp(
    // 밝기를 바꿀 때 AnimatedTheme가 이전 색에서 보간하지 않도록 트리를 새로 만듭니다.
    key: ValueKey<Brightness>(brightness),
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: width),
          child: child,
        ),
      ),
    ),
  );
}

/// [color]로 채운 [Container]입니다.
Finder _filled(Color color) => find.byWidgetPredicate((Widget widget) {
  if (widget is! Container) return false;
  final Decoration? decoration = widget.decoration;
  if (decoration is! BoxDecoration || decoration.color != color) return false;
  return true;
});

void main() {
  final HoronColors colors = HoronThemeData.light.colors;
  const HoronSpaceSpec space = HoronSpaceSpec();
  const HoronRadiusSpec radius = HoronRadiusSpec();

  testWidgets('라이트와 다크에서 기본 상태가 예외 없이 그려진다', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(brightness, const HoronToolPermissions(title: Text('Tool permissions'), tools: _tools)),
      );
      expect(tester.takeException(), isNull);
      expect(find.text('Tool permissions'), findsOneWidget);
      expect(find.text('2'), findsOneWidget);
      expect(find.text('Allow all'), findsOneWidget);
      expect(find.text('files.read'), findsOneWidget);
      expect(find.text('Read files in the workspace'), findsOneWidget);
      expect(find.text('Allow'), findsNWidgets(2));
      expect(find.text('Ask'), findsNWidgets(2));
      expect(find.text('Off'), findsNWidgets(2));
    }
  });

  testWidgets('카드는 16 반경 표면이고 헤더는 44 높이 옅은 띠다', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(Brightness.light, const HoronToolPermissions(title: Text('Tool permissions'), tools: _tools)),
    );

    // `rounded-2xl border border-border-default bg-bg-surface` — 카드.
    final Container card = tester.widget<Container>(
      find.byWidgetPredicate((Widget widget) {
        if (widget is! Container) return false;
        final Decoration? decoration = widget.decoration;
        return decoration is BoxDecoration &&
            decoration.color == colors.bgSurface &&
            decoration.borderRadius == BorderRadius.circular(radius.xl2) &&
            (decoration.border! as Border).top.color == colors.borderDefault;
      }),
    );
    expect(card.clipBehavior, Clip.antiAlias);

    // `h-11 border-b bg-bg-subtle px-4` — 헤더.
    final Finder header = _filled(colors.bgSubtle);
    expect(header, findsOneWidget);
    expect(tester.getSize(header).height, 44);
    final BoxDecoration headerDecoration = tester.widget<Container>(header).decoration! as BoxDecoration;
    expect((headerDecoration.border! as Border).bottom.color, colors.borderDefault);

    // `h-5 px-1.5` — 개수 알약.
    final Container pill = tester.widget<Container>(
      find.byWidgetPredicate((Widget widget) {
        if (widget is! Container) return false;
        final Decoration? decoration = widget.decoration;
        return decoration is BoxDecoration &&
            decoration.color == colors.overlayInk6 &&
            decoration.borderRadius == BorderRadius.circular(radius.full);
      }),
    );
    expect(tester.getSize(find.byWidget(pill)).height, 20);
    expect(pill.padding, const EdgeInsets.symmetric(horizontal: 6));

    // `px-4 py-3 gap-4` — 도구 한 줄.
    final Finder row = find.byWidgetPredicate(
      (Widget widget) =>
          widget is Container && widget.padding == const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    );
    expect(row, findsWidgets);
  });

  testWidgets('제목은 labelMd semibold, 도구 이름은 고정폭 code, 설명은 caption이다', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(Brightness.light, const HoronToolPermissions(title: Text('Tool permissions'), tools: _tools)),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.text('files.read')));

    final DefaultTextStyle title = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Tool permissions'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(title.style.fontSize, theme.text.labelMd.fontSize);
    expect(title.style.fontWeight, HoronFontWeight.semibold);
    expect(title.style.color, colors.textPrimary);

    // `font-mono text-code font-medium` — 도구 이름.
    final Text name = tester.widget<Text>(find.text('files.read'));
    expect(name.style!.fontFamily, HoronFont.mono);
    expect(name.style!.fontSize, theme.text.code.fontSize);
    expect(name.style!.fontWeight, HoronFontWeight.medium);
    expect(name.style!.color, colors.textPrimary);

    // `text-caption text-text-secondary` — 설명.
    final DefaultTextStyle description = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Read files in the workspace'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(description.style.fontSize, theme.text.caption.fontSize);
    expect(description.style.color, colors.textSecondary);
  });

  testWidgets('각 줄의 세그먼트는 sm solid 인셋이 아닌 컨트롤이다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronToolPermissions(title: Text('T'), tools: _tools)));

    final List<HoronSegmentedControl> controls = tester
        .widgetList<HoronSegmentedControl>(find.byType(HoronSegmentedControl))
        .toList();
    expect(controls.length, 2);
    for (final HoronSegmentedControl control in controls) {
      expect(control.size, HoronSegmentedControlSize.sm);
      expect(control.surface, HoronSegmentedControlSurface.solid);
      expect(control.fill, isFalse);
      expect(control.items.map((HoronSegmentedItem item) => item.label), <String>['Allow', 'Ask', 'Off']);
    }
    // 기본값 ask가 선택됩니다.
    expect(controls.first.value, 'ask');
    expect(controls.last.value, 'off');
    // `h-9 p-[3px]` — sm 트랙은 36 높이입니다.
    expect(tester.getSize(find.byType(HoronSegmentedControl).first).height, space.step(9));
  });

  testWidgets('세 값이 모두 선택 상태로 그려진다', (WidgetTester tester) async {
    for (final HoronToolPermissionsToolPermission value in HoronToolPermissionsToolPermission.values) {
      await tester.pumpWidget(
        _host(
          Brightness.light,
          HoronToolPermissions(
            title: const Text('T'),
            tools: const <HoronToolPermissionItem>[HoronToolPermissionItem(name: 'a.b')],
            values: <String, HoronToolPermissionsToolPermission>{'a.b': value},
          ),
        ),
      );
      expect(tester.takeException(), isNull, reason: '$value 상태가 그려지지 않습니다');
      expect(
        tester.widget<HoronSegmentedControl>(find.byType(HoronSegmentedControl)).value,
        value.name,
        reason: '$value가 선택 상태여야 합니다',
      );
      for (final HoronToolPermissionsToolPermission option in HoronToolPermissionsToolPermission.values) {
        final Text text = tester.widget<Text>(find.text(_labels[option]!));
        final Color expected = option == value ? colors.textPrimary : colors.textSecondary;
        expect(text.style!.color, expected, reason: '$value일 때 ${_labels[option]}의 글자색');
      }
    }
  });

  testWidgets('세그먼트를 누르면 그 도구만 바뀌고 나머지는 그대로다', (WidgetTester tester) async {
    Map<String, HoronToolPermissionsToolPermission>? changed;
    await tester.pumpWidget(
      _host(
        Brightness.light,
        HoronToolPermissions(
          title: const Text('T'),
          tools: _tools,
          onValuesChange: (Map<String, HoronToolPermissionsToolPermission> next) => changed = next,
        ),
      ),
    );

    await tester.tap(find.text('Off').first);
    await tester.pump();

    expect(changed, isNotNull);
    expect(changed!['files.read'], HoronToolPermissionsToolPermission.off);
    expect(changed!['shell.run'], HoronToolPermissionsToolPermission.off);
  });

  testWidgets('Allow all은 모든 도구를 allow로 바꾼다', (WidgetTester tester) async {
    Map<String, HoronToolPermissionsToolPermission>? changed;
    await tester.pumpWidget(
      _host(
        Brightness.light,
        HoronToolPermissions(
          title: const Text('T'),
          tools: _tools,
          onValuesChange: (Map<String, HoronToolPermissionsToolPermission> next) => changed = next,
        ),
      ),
    );

    await tester.tap(find.text('Allow all'));
    await tester.pump();

    expect(changed, isNotNull);
    expect(changed!.keys, unorderedEquals(<String>['files.read', 'shell.run']));
    expect(changed!.values, everyElement(HoronToolPermissionsToolPermission.allow));
  });

  testWidgets('값을 제어하면 바깥이 준 값이 선택 상태가 된다', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        Brightness.light,
        const HoronToolPermissions(
          title: Text('T'),
          tools: <HoronToolPermissionItem>[HoronToolPermissionItem(name: 'a.b')],
          values: <String, HoronToolPermissionsToolPermission>{'a.b': HoronToolPermissionsToolPermission.off},
        ),
      ),
    );
    expect(tester.widget<HoronSegmentedControl>(find.byType(HoronSegmentedControl)).value, 'off');
    expect(tester.widget<Text>(find.text('Off')).style!.color, colors.textPrimary, reason: '선택된 칸은 text-primary입니다');
  });

  testWidgets('좁은 폭에서는 세그먼트가 이름 아래로 내려간다', (WidgetTester tester) async {
    const HoronToolPermissions component = HoronToolPermissions(title: Text('T'), tools: _tools);

    await tester.pumpWidget(_host(Brightness.light, component, width: 768));
    expect(tester.takeException(), isNull);
    expect(
      tester.getTopLeft(find.byType(HoronSegmentedControl).first).dy,
      lessThan(tester.getBottomLeft(find.text('files.read')).dy),
      reason: '넓은 폭에서는 이름과 세그먼트가 한 줄을 나눠 씁니다',
    );

    await tester.pumpWidget(_host(Brightness.light, component, width: 320));
    expect(tester.takeException(), isNull);
    expect(
      tester.getTopLeft(find.byType(HoronSegmentedControl).first).dy,
      greaterThan(tester.getBottomLeft(find.text('files.read')).dy),
      reason: '320px에서는 세그먼트가 이름 아래로 내려갑니다',
    );
  });
}
