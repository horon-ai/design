import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 도구 권한 목록의 계약을 확인합니다.
///
/// React `tool-permissions.tsx`가 정한 구조(중립 배경 헤더 + 개수 알약 + Allow all,
/// 도구마다 한 줄 + Allow/Ask/Off 세그먼트)와 세 값의 선택 상태를 고정합니다.
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

/// [label] 글자를 품은 세그먼트(AnimatedContainer)입니다.
AnimatedContainer _segment(WidgetTester tester, String label, {int index = 0}) {
  final Finder text = find.text(label).at(index);
  return tester.widget<AnimatedContainer>(find.ancestor(of: text, matching: find.byType(AnimatedContainer)).first);
}

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

  testWidgets('제목은 13/18 semibold, 도구 이름은 고정폭 13, 설명은 12 regular다', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(Brightness.light, const HoronToolPermissions(title: Text('Tool permissions'), tools: _tools)),
    );

    final DefaultTextStyle title = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Tool permissions'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(title.style.fontSize, 13);
    expect(title.style.fontWeight, HoronFontWeight.semibold);
    expect(title.style.color, colors.textPrimary);

    final Text name = tester.widget<Text>(find.text('files.read'));
    expect(name.style!.fontFamily, HoronFont.mono);
    expect(name.style!.fontSize, 13);
    expect(name.style!.color, colors.textPrimary);

    final DefaultTextStyle description = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Read files in the workspace'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(description.style.fontSize, 12);
    expect(description.style.fontWeight, HoronFontWeight.regular);
    expect(description.style.color, colors.textPlaceholder);
  });

  testWidgets('기본값 ask가 선택되고 알약이 유리 표면과 rim을 쓴다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronToolPermissions(title: Text('T'), tools: _tools)));

    final BoxDecoration ask = _segment(tester, 'Ask').decoration! as BoxDecoration;
    expect(ask.color, colors.glassThick);
    expect(ask.borderRadius, BorderRadius.circular(radius.full));
    expect((ask.border! as Border).top.color, colors.glassRimStrong);

    // 트랙은 `h-9 p-[3px]` — 36px이고, 세 칸이 그 안에 들어갑니다(`h-7.5`).
    final Rect track = tester.getRect(find.byKey(const Key('horon-tool-permissions-track')).first);
    expect(track.height, space.step(9));
    for (final String label in <String>['Allow', 'Ask', 'Off']) {
      final Rect text = tester.getRect(find.text(label).first);
      expect(text.top, greaterThanOrEqualTo(track.top + space.step(3)), reason: '$label 칸의 위 여백');
      expect(text.bottom, lessThanOrEqualTo(track.bottom - space.step(3)), reason: '$label 칸의 아래 여백');
    }
  });

  testWidgets('선택되지 않은 칸은 알약을 칠하지 않는다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronToolPermissions(title: Text('T'), tools: _tools)));
    final BoxDecoration allow = _segment(tester, 'Allow').decoration! as BoxDecoration;
    expect(allow.color, Colors.transparent);
    expect((allow.border! as Border).top.color, Colors.transparent);
    expect(allow.boxShadow, isNull);
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
      for (final HoronToolPermissionsToolPermission option in HoronToolPermissionsToolPermission.values) {
        final Text text = tester.widget<Text>(find.text(_labels[option]!));
        final Color expected = option == value ? colors.textPrimary : colors.textSecondary;
        expect(text.style!.color, expected, reason: '$value일 때 ${_labels[option]}의 글자색');
      }
      expect((_segment(tester, _labels[value]!).decoration! as BoxDecoration).color, colors.glassThick);
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
    expect((_segment(tester, 'Off').decoration! as BoxDecoration).color, colors.glassThick);
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
    expect((_segment(tester, 'Off').decoration! as BoxDecoration).color, colors.glassThick);
    expect((_segment(tester, 'Ask').decoration! as BoxDecoration).color, Colors.transparent);
  });

  testWidgets('좁은 폭에서는 세그먼트가 이름 아래로 내려간다', (WidgetTester tester) async {
    const HoronToolPermissions component = HoronToolPermissions(title: Text('T'), tools: _tools);

    await tester.pumpWidget(_host(Brightness.light, component, width: 768));
    expect(tester.takeException(), isNull);
    expect(
      tester.getTopLeft(find.byKey(const Key('horon-tool-permissions-track')).first).dy,
      lessThan(tester.getBottomLeft(find.text('files.read')).dy),
      reason: '넓은 폭에서는 이름과 세그먼트가 한 줄을 나눠 씁니다',
    );

    await tester.pumpWidget(_host(Brightness.light, component, width: 320));
    expect(tester.takeException(), isNull);
    expect(
      tester.getTopLeft(find.byKey(const Key('horon-tool-permissions-track')).first).dy,
      greaterThan(tester.getBottomLeft(find.text('files.read')).dy),
      reason: '320px에서는 세그먼트가 이름 아래로 내려갑니다',
    );
  });
}
