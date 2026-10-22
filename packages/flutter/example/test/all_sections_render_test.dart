import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui_example/gallery/gallery_theme.dart';
import 'package:horon_ui_example/gallery/registry.dart';
import 'package:horon_ui_example/gallery/section_builder.dart';

/// 등록된 갤러리 섹션이 전부 예외 없이 그려지는지 확인합니다.
///
/// 이 테스트가 잡는 결함의 종류는 두 가지입니다.
///
/// 1. 섹션 위젯이 테마 슬롯을 읽는데 테마에 그 슬롯이 없는 경우. 2026-10-22에
///    갤러리 테마가 스텁이라 `HoronTheme.of`를 부르는 컴포넌트 16개가 열리는
///    순간 `StateError`를 던졌고, 그때 있던 셸 테스트 4개는 그 경로를 지나지
///    않아 전부 초록이었습니다.
/// 2. 섹션 위젯 자체가 던지는 경우(잘못된 assert, 없는 토큰 이름 등).
///
/// 그래서 섹션마다 라이트·다크 두 번, 폰 폭과 태블릿 폭 두 번 그립니다. 이
/// 테스트는 등록부를 그대로 순회하므로 컴포넌트가 늘면 자동으로 따라갑니다.
void main() {
  const List<({String name, double width})> surfaces =
      <({String name, double width})>[
        (name: 'phone', width: 360),
        (name: 'tablet', width: 834),
      ];

  for (final GallerySection section in gallerySections) {
    for (final Brightness brightness in Brightness.values) {
      for (final ({String name, double width}) surface in surfaces) {
        testWidgets(
          '${section.slug} renders at ${surface.name} in ${brightness.name}',
          (WidgetTester tester) async {
            tester.view.physicalSize = Size(surface.width * 2, 2400);
            tester.view.devicePixelRatio = 2.0;
            addTearDown(tester.view.reset);

            await tester.pumpWidget(
              MaterialApp(
                theme: galleryTheme(brightness),
                home: Scaffold(
                  body: SizedBox(
                    width: surface.width,
                    child: SingleChildScrollView(
                      child: gallerySectionFor(
                        tester.element(find.byType(Scaffold)),
                        section,
                      ),
                    ),
                  ),
                ),
              ),
            );
            await tester.pump();

            expect(
              tester.takeException(),
              isNull,
              reason:
                  '${section.slug} 섹션이 ${surface.name}/${brightness.name}에서 예외를 던졌습니다',
            );
          },
        );
      }
    }
  }

  // 등록부가 비면 위 섹션 루프가 0번 돌아 이 파일이 조용히 통과합니다.
  // 그 조용한 통과를 막으려고 등록부가 채워졌는지 확인합니다. 통합 전에는
  // 등록부가 비어 있는 것이 정상이므로(각 웨이브 끝에 통합 스크립트가 채웁니다)
  // 실패가 아니라 건너뛰기로 표시합니다.
  test(
    'the registry is populated so the render sweep covers every component',
    () {
      expect(
        gallerySections,
        isNotEmpty,
        reason:
            '등록부가 비었습니다. packages/flutter/scripts/integrate.mjs를 실행해야 '
            '섹션 렌더 확인이 의미를 갖습니다.',
      );
    },
    skip: gallerySections.isEmpty
        ? '등록부가 아직 비었습니다(통합 전). scripts/integrate.mjs 실행 뒤 활성화됩니다.'
        : false,
  );
}
