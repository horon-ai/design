import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui_example/gallery/app.dart';
import 'package:horon_ui_example/gallery/gallery_strings.dart';
import 'package:horon_ui_example/gallery/registry.dart';
import 'package:horon_ui_example/gallery/section_builder.dart';

/// 갤러리가 섹션 본문을 실제로 그리는지 고정합니다.
///
/// 회귀 대상: 섹션 파일 43개가 있어도 앱 진입점이 `sectionBuilder`를 넘기지
/// 않으면 셸은 `notImplemented` 자리표시자를 그립니다. 그래서 갤러리를 열면
/// 모든 컴포넌트가 "아직 구현되지 않은 섹션입니다."로 보였고, 셸 테스트 4개는
/// 그 경로를 지나지 않아 초록이었습니다.
void main() {
  const GallerySection badgeSection = GallerySection(
    slug: 'badge',
    title: 'Badge',
    group: 'display',
  );

  void sizeSurface(WidgetTester tester) {
    tester.view.physicalSize = const Size(1400, 1000);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);
  }

  testWidgets('a registered slug renders its component, not the placeholder', (
    WidgetTester tester,
  ) async {
    sizeSurface(tester);
    await tester.pumpWidget(
      const GalleryApp(
        sections: <GallerySection>[badgeSection],
        sectionBuilder: gallerySectionFor,
      ),
    );
    await tester.pumpAndSettle();

    expect(
      find.text(const GalleryStrings.ko().notImplemented),
      findsNothing,
      reason: '등록된 슬러그가 자리표시자로 그려졌습니다',
    );
    expect(find.byType(HoronBadge), findsWidgets);
  });

  testWidgets('an unregistered slug falls back to the placeholder', (
    WidgetTester tester,
  ) async {
    sizeSurface(tester);
    await tester.pumpWidget(
      const GalleryApp(
        sections: <GallerySection>[
          GallerySection(
            slug: 'not_a_component',
            title: 'None',
            group: 'display',
          ),
        ],
        sectionBuilder: gallerySectionFor,
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text(const GalleryStrings.ko().notImplemented), findsOneWidget);
  });

  testWidgets('every registered section resolves to a widget', (
    WidgetTester tester,
  ) async {
    // registry는 통합 담당자가 채우므로, 지금은 "등록된 것은 전부 표에 있다"만
    // 단언합니다. 슬러그가 늘면 integrate 스크립트가 이 표도 함께 늘립니다.
    late BuildContext captured;
    await tester.pumpWidget(
      MaterialApp(
        home: Builder(
          builder: (BuildContext context) {
            captured = context;
            return const SizedBox.shrink();
          },
        ),
      ),
    );

    final List<String> missing = <String>[
      for (final GallerySection section in gallerySections)
        if (gallerySectionFor(captured, section) == null) section.slug,
    ];
    expect(missing, isEmpty, reason: '섹션 표에 없는 슬러그: $missing');
  });
}
