import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/file_drop.dart';

/// 파일 드롭 영역의 계약을 확인합니다.
///
/// React `file-drop.tsx`의 점선 상자, 끌어오는 동안의 브랜드 테두리, 거부된 파일의 위험
/// 테두리, 업로드 중 표시와 비활성 상태를 고정합니다.
const String _label = 'Drop files here or click to upload';

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

Finder _border(String state) => find.byKey(ValueKey<String>('horon-file-drop-border-$state'));

void main() {
  final HoronColors colors = HoronThemeData.light.colors;
  const HoronSpaceSpec space = HoronSpaceSpec();

  testWidgets('라이트와 다크에서 기본 상태가 예외 없이 그려진다', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(brightness, const HoronFileDrop()));
      expect(tester.takeException(), isNull);
      expect(find.text(_label), findsOneWidget);
      expect(_border('idle'), findsOneWidget);
      final Icon icon = tester.widget<Icon>(find.byIcon(Icons.file_upload_outlined));
      expect(icon.size, 16);
      final HoronColors expectedColors = brightness == Brightness.dark
          ? HoronThemeData.dark.colors
          : HoronThemeData.light.colors;
      expect(icon.color, expectedColors.textSecondary);
    }
  });

  testWidgets('아이콘과 라벨은 8 간격으로 가운데 놓인다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronFileDrop()));
    final double iconRight = tester.getTopRight(find.byIcon(Icons.file_upload_outlined)).dx;
    final double labelLeft = tester.getTopLeft(find.text(_label)).dx;
    expect(labelLeft - iconRight, greaterThanOrEqualTo(space.s2));
  });

  testWidgets('거부된 파일은 위험 테두리를 쓴다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronFileDrop(rejected: true)));
    expect(_border('rejected'), findsOneWidget);
    expect(_border('idle'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('업로드 중에는 아이콘 대신 진행 표시를 그린다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronFileDrop(uploading: true)));
    expect(tester.takeException(), isNull);
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.byIcon(Icons.file_upload_outlined), findsNothing);
    // 업로드 중에는 누를 수 없고 `opacity-40`입니다.
    final Opacity opacity = tester.widget<Opacity>(
      find.ancestor(of: find.text(_label), matching: find.byType(Opacity)).first,
    );
    expect(opacity.opacity, 0.4);
  });

  testWidgets('누르면 onTap을 부르고 비활성이면 부르지 않는다', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(_host(Brightness.light, HoronFileDrop(onTap: () => taps++)));
    await tester.tap(find.byType(HoronFileDrop));
    await tester.pump();
    expect(taps, 1);

    await tester.pumpWidget(_host(Brightness.light, HoronFileDrop(onTap: () => taps++, disabled: true)));
    await tester.tap(find.byType(HoronFileDrop));
    await tester.pump();
    expect(taps, 1, reason: '비활성 상태에서는 눌러도 콜백이 오지 않습니다');
    expect(tester.takeException(), isNull);
  });

  testWidgets('끌어오는 동안 브랜드 테두리로 바뀌고 놓으면 자료를 넘긴다', (WidgetTester tester) async {
    final List<Object> dropped = <Object>[];
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Column(
            children: <Widget>[
              Draggable<String>(
                data: 'file.one',
                feedback: const SizedBox(width: 24, height: 24),
                child: ColoredBox(
                  key: const Key('horon-file-drop-drag-source'),
                  color: colors.overlayInk10,
                  child: const SizedBox(width: 60, height: 40),
                ),
              ),
              HoronFileDrop(onDrop: (Object data) => dropped.add(data)),
            ],
          ),
        ),
      ),
    );

    final TestGesture gesture = await tester.startGesture(
      tester.getCenter(find.byKey(const Key('horon-file-drop-drag-source'))),
    );
    await tester.pump();
    await gesture.moveTo(tester.getCenter(find.byType(HoronFileDrop)));
    await tester.pump();
    expect(_border('dragging'), findsOneWidget);

    await gesture.up();
    await tester.pump();
    expect(dropped, <Object>['file.one']);
    expect(_border('idle'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('폭이 모자라면 550까지만 넓어지고 그 아래에서는 부모를 따른다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronFileDrop(), width: 900));
    expect(tester.getSize(_border('idle')).width, 550);
    expect(tester.takeException(), isNull);

    await tester.pumpWidget(_host(Brightness.light, const HoronFileDrop(), width: 320));
    expect(tester.getSize(_border('idle')).width, 320);
    expect(tester.takeException(), isNull);
  });
}
