import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 첨부의 세 크기·두 방향·다섯 상태·제거 콜백을 확인합니다.
///
/// React `attachment.tsx`의 cva 변형은 `size`(default/sm/xs)와
/// `orientation`(horizontal/vertical) 두 그룹이고, `state`는 cva가 아닌 prop입니다.
/// 그래서 공개 enum 두 개와 미디어 변형 enum 하나를 두고, 상태는 이름 붙은 생성자로
/// 엽니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Padding(padding: const EdgeInsets.all(HoronSpace.s6), child: child),
    ),
  );

  Widget sample({
    HoronAttachmentSize size = HoronAttachmentSize.defaultValue,
    HoronAttachmentOrientation orientation = HoronAttachmentOrientation.horizontal,
    VoidCallback? onRemove,
  }) => HoronAttachmentFile(
    name: 'report.pdf',
    sizeBytes: 1536,
    size: size,
    orientation: orientation,
    onRemove: onRemove,
  );

  BoxDecoration decorationOf(WidgetTester tester) =>
      tester
              .widget<DecoratedBox>(
                find.descendant(of: find.byType(HoronAttachment), matching: find.byType(DecoratedBox)).first,
              )
              .decoration
          as BoxDecoration;

  testWidgets('attachment: the three sizes shrink the media tile', (WidgetTester tester) async {
    for (final (HoronAttachmentSize size, double expected) in <(HoronAttachmentSize, double)>[
      (HoronAttachmentSize.defaultValue, HoronSpace.s10),
      (HoronAttachmentSize.sm, HoronSpace.s8),
      (HoronAttachmentSize.xs, HoronSpace.s7),
    ]) {
      await tester.pumpWidget(harness(sample(size: size)));
      final Finder media = find.byType(HoronAttachmentMedia);
      expect(tester.getSize(media).width, expected, reason: size.name);
      expect(tester.getSize(media).height, expected, reason: size.name);
    }
  });

  testWidgets('attachment: xs drops the radius to the 8px step', (WidgetTester tester) async {
    await tester.pumpWidget(harness(sample()));
    expect(decorationOf(tester).borderRadius, BorderRadius.circular(HoronRadius.lg));

    await tester.pumpWidget(harness(sample(size: HoronAttachmentSize.xs)));
    await tester.pumpAndSettle();
    expect(decorationOf(tester).borderRadius, BorderRadius.circular(HoronRadius.md));
  });

  testWidgets('attachment: the horizontal direction is at least 160 wide', (WidgetTester tester) async {
    await tester.pumpWidget(harness(sample()));
    expect(tester.getSize(find.byType(HoronAttachment)).width, greaterThanOrEqualTo(160));
  });

  testWidgets('attachment: the vertical direction is 120 wide and stacks media above text', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(harness(sample(orientation: HoronAttachmentOrientation.vertical)));
    await tester.pumpAndSettle();

    // React의 수직 방향은 `w-24`에 본문이 있으면 `w-30`(120)으로 늘어납니다.
    expect(tester.getSize(find.byType(HoronAttachment)).width, 120);
    expect(
      tester.getRect(find.byType(HoronAttachmentMedia)).bottom,
      lessThanOrEqualTo(tester.getRect(find.text('report.pdf')).top),
    );
  });

  testWidgets('attachment: the vertical direction is 96 wide when only the media is present', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      harness(
        const HoronAttachment(
          orientation: HoronAttachmentOrientation.vertical,
          children: <Widget>[HoronAttachmentMedia(child: Icon(Icons.description))],
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronAttachment)).width, 96);
  });

  testWidgets('attachment: the title truncates and the description shows the formatted size', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(harness(sample()));

    expect(find.text('report.pdf'), findsOneWidget);
    expect(find.text('1.5 KB'), findsOneWidget);
    final Text title = tester.widget<Text>(find.text('report.pdf'));
    expect(title.maxLines, 1);
    expect(title.overflow, TextOverflow.ellipsis);
  });

  testWidgets('attachment: the remove affordance calls onRemove', (WidgetTester tester) async {
    int removed = 0;
    await tester.pumpWidget(harness(sample(onRemove: () => removed++)));

    expect(find.byKey(HoronAttachmentFile.removeKey), findsOneWidget);
    await tester.tap(find.byKey(HoronAttachmentFile.removeKey));
    await tester.pumpAndSettle();
    expect(removed, 1);
  });

  testWidgets('attachment: without onRemove there is no remove button', (WidgetTester tester) async {
    await tester.pumpWidget(harness(sample()));
    expect(find.byKey(HoronAttachmentFile.removeKey), findsNothing);
  });

  testWidgets('attachment: the idle state draws a dashed border', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronAttachment.idle(
          children: <Widget>[
            HoronAttachmentMedia(child: Icon(Icons.description)),
            HoronAttachmentContent(children: <Widget>[HoronAttachmentTitle(text: 'queued.pdf')]),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 점선은 전경 페인터로 그립니다. 표면 테두리는 비워 두어 두 선이 겹치지 않습니다.
    expect(find.byType(CustomPaint), findsWidgets);
    expect((decorationOf(tester).border! as Border).top.color, Colors.transparent);
  });

  testWidgets('attachment: the error state paints the destructive border and description', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronAttachment.error(
          children: <Widget>[
            HoronAttachmentMedia(child: Icon(Icons.description)),
            HoronAttachmentContent(
              children: <Widget>[
                HoronAttachmentTitle(text: 'broken.pdf'),
                HoronAttachmentDescription(text: 'Upload failed'),
              ],
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    final Color expected = HoronLightColors.destructive.withValues(alpha: 0.3);
    expect((decorationOf(tester).border! as Border).top.color, expected);
  });

  testWidgets('attachment: all five states render without throwing', (WidgetTester tester) async {
    Widget row(String name) => HoronAttachmentContent(children: <Widget>[HoronAttachmentTitle(text: name)]);

    final List<Widget> states = <Widget>[
      HoronAttachment.idle(
        children: <Widget>[
          const HoronAttachmentMedia(child: Icon(Icons.description)),
          row('idle'),
        ],
      ),
      HoronAttachment.uploading(
        children: <Widget>[
          const HoronAttachmentMedia(child: Icon(Icons.description)),
          row('uploading'),
        ],
      ),
      HoronAttachment.processing(
        children: <Widget>[
          const HoronAttachmentMedia(child: Icon(Icons.description)),
          row('processing'),
        ],
      ),
      HoronAttachment.error(
        children: <Widget>[
          const HoronAttachmentMedia(child: Icon(Icons.description)),
          row('error'),
        ],
      ),
      HoronAttachment(
        children: <Widget>[
          const HoronAttachmentMedia(child: Icon(Icons.description)),
          row('done'),
        ],
      ),
    ];

    await tester.pumpWidget(harness(Wrap(spacing: HoronSpace.s3, runSpacing: HoronSpace.s3, children: states)));
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(find.byType(HoronAttachment), findsNWidgets(5));
  });

  testWidgets('attachment: the image variant fades until the file is ready', (WidgetTester tester) async {
    Widget media() => const HoronAttachmentMedia(
      variant: HoronAttachmentMediaVariant.image,
      image: ColoredBox(color: HoronLightColors.muted),
    );

    await tester.pumpWidget(harness(HoronAttachment.uploading(children: <Widget>[media()])));
    expect(find.descendant(of: find.byType(HoronAttachmentMedia), matching: find.byType(Opacity)), findsOneWidget);

    await tester.pumpWidget(harness(HoronAttachment(children: <Widget>[media()])));
    await tester.pumpAndSettle();
    expect(find.descendant(of: find.byType(HoronAttachmentMedia), matching: find.byType(Opacity)), findsNothing);
  });

  testWidgets('attachment: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        harness(
          sample(orientation: HoronAttachmentOrientation.vertical, onRemove: () {}),
          brightness: brightness,
        ),
      );
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
      final Color expected = brightness == Brightness.dark ? HoronDarkColors.card : HoronLightColors.card;
      expect(decorationOf(tester).color, expected, reason: brightness.name);
    }
  });
}
