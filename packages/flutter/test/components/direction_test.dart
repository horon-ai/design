import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/direction.dart';

/// [child]를 horon 테마 아래에 띄웁니다.
Future<void> pumpDirection(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  );
}

/// 지금 방향을 안쪽 위젯에서 읽습니다.
TextDirection directionAt(WidgetTester tester) =>
    Directionality.of(tester.element(find.byKey(const ValueKey<String>('probe'))));

void main() {
  testWidgets('direction: the wrapper sets the reading direction', (WidgetTester tester) async {
    await pumpDirection(
      tester,
      HoronDirection.rtl(child: const SizedBox(key: ValueKey<String>('probe'), width: 10, height: 10)),
    );
    expect(directionAt(tester), TextDirection.rtl);
    expect(HoronDirection.of(tester.element(find.byKey(const ValueKey<String>('probe')))), TextDirection.rtl);

    await pumpDirection(
      tester,
      HoronDirection.ltr(child: const SizedBox(key: ValueKey<String>('probe'), width: 10, height: 10)),
    );
    expect(directionAt(tester), TextDirection.ltr);

    // 기본 생성자는 React와 같은 `ltr`입니다.
    await pumpDirection(
      tester,
      HoronDirection(child: const SizedBox(key: ValueKey<String>('probe'), width: 10, height: 10)),
    );
    expect(directionAt(tester), TextDirection.ltr);
  });

  testWidgets('direction: isRtl and resolve read the ambient direction', (WidgetTester tester) async {
    late bool rtlLtr;
    late bool rtlRtl;
    late double resolvedLtr;
    late double resolvedRtl;

    await pumpDirection(
      tester,
      Builder(
        builder: (BuildContext context) {
          rtlLtr = HoronDirection.isRtl(context);
          resolvedLtr = HoronDirection.resolve(context, ltr: 1, rtl: 2);
          return HoronDirection.rtl(
            child: Builder(
              builder: (BuildContext inner) {
                rtlRtl = HoronDirection.isRtl(inner);
                resolvedRtl = HoronDirection.resolve(inner, ltr: 1, rtl: 2);
                return const SizedBox.shrink();
              },
            ),
          );
        },
      ),
    );

    expect(rtlLtr, isFalse);
    expect(resolvedLtr, 1);
    expect(rtlRtl, isTrue);
    expect(resolvedRtl, 2);
  });

  testWidgets('direction: mirrorIcon flips an icon only in RTL', (WidgetTester tester) async {
    await pumpDirection(
      tester,
      HoronDirection.rtl(
        child: HoronDirectionalIcon(child: const SizedBox(key: ValueKey<String>('icon'), width: 16, height: 16)),
      ),
    );

    final Transform mirror = tester.widget<Transform>(
      find.ancestor(of: find.byKey(const ValueKey<String>('icon')), matching: find.byType(Transform)).first,
    );
    expect(mirror.transform.entry(0, 0), -1, reason: 'RTL flips the icon horizontally');

    // LTR에서는 변환이 없습니다.
    await pumpDirection(
      tester,
      HoronDirection.ltr(
        child: HoronDirectionalIcon(child: const SizedBox(key: ValueKey<String>('icon'), width: 16, height: 16)),
      ),
    );
    expect(
      find.ancestor(of: find.byKey(const ValueKey<String>('icon')), matching: find.byType(Transform)),
      findsNothing,
      reason: 'LTR leaves the icon alone',
    );

    // `mirror: false`는 RTL에서도 뒤집지 않습니다.
    await pumpDirection(
      tester,
      HoronDirection.rtl(
        child: HoronDirectionalIcon(
          mirror: false,
          child: const SizedBox(key: ValueKey<String>('icon'), width: 16, height: 16),
        ),
      ),
    );
    expect(
      find.ancestor(of: find.byKey(const ValueKey<String>('icon')), matching: find.byType(Transform)),
      findsNothing,
      reason: 'a symmetric icon opts out',
    );
  });

  testWidgets('direction: insets mirror start and end in RTL', (WidgetTester tester) async {
    late EdgeInsetsGeometry insets;
    await pumpDirection(
      tester,
      Builder(
        builder: (BuildContext context) {
          insets = HoronDirection.insets(start: 8, end: 16, top: 2, bottom: 4);
          return const SizedBox.shrink();
        },
      ),
    );

    expect(insets.resolve(TextDirection.ltr), const EdgeInsets.fromLTRB(8, 2, 16, 4));
    expect(insets.resolve(TextDirection.rtl), const EdgeInsets.fromLTRB(16, 2, 8, 4));
  });

  testWidgets('direction: align picks the directional edge', (WidgetTester tester) async {
    expect(HoronDirection.align(atEnd: false).resolve(TextDirection.ltr), Alignment.centerLeft);
    expect(HoronDirection.align(atEnd: false).resolve(TextDirection.rtl), Alignment.centerRight);
    expect(HoronDirection.align(atEnd: true).resolve(TextDirection.ltr), Alignment.centerRight);
    expect(HoronDirection.align(atEnd: true).resolve(TextDirection.rtl), Alignment.centerLeft);
  });

  testWidgets('direction: a Row inside the wrapper lays its children out from the right', (WidgetTester tester) async {
    await pumpDirection(
      tester,
      HoronDirection.rtl(
        child: SizedBox(
          width: 200,
          child: Row(
            children: const <Widget>[
              SizedBox(key: ValueKey<String>('first'), width: 20, height: 20),
              SizedBox(key: ValueKey<String>('second'), width: 20, height: 20),
            ],
          ),
        ),
      ),
    );

    final double first = tester.getRect(find.byKey(const ValueKey<String>('first'))).left;
    final double second = tester.getRect(find.byKey(const ValueKey<String>('second'))).left;
    expect(first, greaterThan(second), reason: 'RTL lays the first child on the right');
    expect(first, moreOrLessEquals(180), reason: 'the row starts at the right edge');
  });

  testWidgets('direction: both brightnesses render the wrapper', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpDirection(
        tester,
        HoronDirection.rtl(child: const SizedBox(key: ValueKey<String>('probe'), width: 10, height: 10)),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(directionAt(tester), TextDirection.rtl);
    }
  });
}
