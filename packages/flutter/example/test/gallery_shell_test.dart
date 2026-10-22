import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui_example/gallery/app.dart';
import 'package:horon_ui_example/gallery/gallery_strings.dart';
import 'package:horon_ui_example/gallery/registry.dart';
import 'package:horon_ui_example/gallery/shell.dart';

/// The shell reads its sections from the widget, so the tests hand it their own
/// list instead of the (deliberately empty) registry.
const List<GallerySection> _sections = <GallerySection>[
  GallerySection(slug: 'button', title: 'Button', group: 'inputs'),
  GallerySection(slug: 'badge', title: 'Badge', group: 'display'),
  GallerySection(slug: 'card', title: 'Card', group: 'layout'),
];

/// Gives the shell a desktop-sized window. The default 800x600 test surface is
/// shorter than the preview frame needs, so the placeholder scaffold overflows.
void _sizeSurface(WidgetTester tester) {
  tester.view.physicalSize = const Size(1400, 1000);
  tester.view.devicePixelRatio = 1.0;
  addTearDown(tester.view.reset);
}

Finder _railEntries() => find.byWidgetPredicate(
  (Widget widget) =>
      widget.key is ValueKey<String> &&
      (widget.key! as ValueKey<String>).value.startsWith('gallery-rail-'),
);

void main() {
  testWidgets('brightness control switches the app theme to dark', (
    WidgetTester tester,
  ) async {
    _sizeSurface(tester);
    await tester.pumpWidget(const GalleryApp());

    expect(
      Theme.of(tester.element(find.byType(GalleryShell))).brightness,
      Brightness.light,
    );

    await tester.tap(find.byKey(galleryBrightnessKey(Brightness.dark)));
    await tester.pumpAndSettle();

    expect(
      Theme.of(tester.element(find.byType(GalleryShell))).brightness,
      Brightness.dark,
    );
  });

  testWidgets('width control resizes the preview frame', (
    WidgetTester tester,
  ) async {
    _sizeSurface(tester);
    await tester.pumpWidget(const GalleryApp());

    expect(
      tester.getSize(find.byKey(galleryPreviewFrameKey)).width,
      GalleryWidth.medium.logicalPixels,
    );

    await tester.tap(find.byKey(galleryWidthKey(GalleryWidth.wide)));
    await tester.pumpAndSettle();

    expect(
      tester.getSize(find.byKey(galleryPreviewFrameKey)).width,
      GalleryWidth.wide.logicalPixels,
    );
  });

  testWidgets('language control swaps the gallery strings', (
    WidgetTester tester,
  ) async {
    _sizeSurface(tester);
    await tester.pumpWidget(const GalleryApp());

    expect(find.text(const GalleryStrings.ko().title), findsOneWidget);
    expect(find.text(const GalleryStrings.en().title), findsNothing);

    await tester.tap(find.byKey(galleryLanguageKey(GalleryLanguage.en)));
    await tester.pumpAndSettle();

    expect(find.text(const GalleryStrings.en().title), findsOneWidget);
    expect(find.text(const GalleryStrings.ko().title), findsNothing);
  });

  testWidgets('search narrows the rail and reports an empty result', (
    WidgetTester tester,
  ) async {
    _sizeSurface(tester);
    await tester.pumpWidget(const GalleryApp());
    expect(find.text(const GalleryStrings.ko().noSections), findsWidgets);

    await tester.pumpWidget(const GalleryApp(sections: _sections));
    await tester.pumpAndSettle();
    expect(_railEntries(), findsNWidgets(_sections.length));

    await tester.enterText(find.byKey(gallerySearchFieldKey), 'bad');
    await tester.pumpAndSettle();

    expect(_railEntries(), findsOneWidget);
    expect(
      find.byKey(const ValueKey<String>('gallery-rail-badge')),
      findsOneWidget,
    );

    await tester.enterText(
      find.byKey(gallerySearchFieldKey),
      'nothing-matches',
    );
    await tester.pumpAndSettle();

    expect(_railEntries(), findsNothing);
    expect(find.text(const GalleryStrings.ko().noMatches), findsOneWidget);
  });

  testWidgets('the rail labels each group once, in registry order', (
    WidgetTester tester,
  ) async {
    // todo 24가 요구하는 그룹 헤더입니다. 등록부는 그룹 순서로 정렬되어 있고
    // 레일은 그 위에 그룹 이름을 한 번씩만 얹습니다.
    _sizeSurface(tester);
    await tester.pumpWidget(const GalleryApp(sections: _sections));
    await tester.pumpAndSettle();

    final GalleryStrings strings = const GalleryStrings.ko();
    expect(find.text(strings.groupInputs), findsOneWidget);
    expect(find.text(strings.groupDisplay), findsOneWidget);
    expect(find.text(strings.groupLayout), findsOneWidget);

    // 섹션 셋이 서로 다른 그룹이므로 헤더도 셋입니다.
    expect(find.text(strings.groupLayout), findsOneWidget);

    // 영어로 바꿔도 헤더가 따라옵니다.
    await tester.tap(find.byKey(galleryLanguageKey(GalleryLanguage.en)));
    await tester.pumpAndSettle();
    expect(find.text(const GalleryStrings.en().groupInputs), findsOneWidget);
    expect(find.text(const GalleryStrings.en().groupDisplay), findsOneWidget);
  });
}
