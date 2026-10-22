import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/bubble.dart';
import 'package:horon_ui/src/components/message.dart';

/// [child]를 horon 테마 아래 고정 폭 상자에 띄웁니다.
Future<void> pumpMessage(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  TextDirection textDirection = TextDirection.ltr,
  double width = 360,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Directionality(
        textDirection: textDirection,
        child: Scaffold(
          body: Align(
            alignment: Alignment.topLeft,
            child: SizedBox(width: width, child: child),
          ),
        ),
      ),
    ),
  );
}

/// 아바타의 실제 그림 영역입니다.
///
/// [HoronMessageAvatar]의 `Transform` 노드 자체는 레이아웃 상자를 옮기지 않으므로
/// (변환은 자식에게만 적용됩니다) 안쪽 `ClipOval`을 잽니다.
Rect avatarRect(WidgetTester tester) =>
    tester.getRect(find.descendant(of: find.byType(HoronMessageAvatar), matching: find.byType(ClipOval)));

/// 메시지 하나를 만듭니다.
Widget message({bool alignEnd = false, bool withHeader = false, bool withFooter = false}) {
  return HoronMessage(
    alignEnd: alignEnd,
    children: <Widget>[
      const HoronMessageAvatar(child: Text('민')),
      HoronMessageContent(
        children: <Widget>[
          if (withHeader) const HoronMessageHeader(child: Text('민열')),
          HoronBubble(children: <Widget>[HoronBubbleContent(child: Text('메시지 본문'))]),
          if (withFooter) const HoronMessageFooter(child: Text('오후 3:12')),
        ],
      ),
    ],
  );
}

void main() {
  testWidgets('message: align=end reverses the row so the avatar sits on the far edge', (WidgetTester tester) async {
    await pumpMessage(tester, message());
    Rect avatar = avatarRect(tester);
    Rect content = tester.getRect(find.byType(HoronMessageContent));
    Rect box = tester.getRect(find.byType(HoronMessage));
    expect(avatar.left, moreOrLessEquals(box.left), reason: 'start alignment puts the avatar on the leading edge');
    expect(avatar.right, lessThan(content.left), reason: 'content follows the avatar');

    await pumpMessage(tester, message(alignEnd: true));
    avatar = avatarRect(tester);
    content = tester.getRect(find.byType(HoronMessageContent));
    box = tester.getRect(find.byType(HoronMessage));
    expect(avatar.right, moreOrLessEquals(box.right), reason: 'align=end moves the avatar to the trailing edge');
    expect(avatar.left, greaterThan(content.right), reason: '`flex-row-reverse`: content comes first');
  });

  testWidgets('message: RTL mirrors which edge each alignment uses', (WidgetTester tester) async {
    // 실패 경로: 오른쪽에서 왼쪽 화면에서는 start가 오른쪽, end가 왼쪽이어야 합니다.
    await pumpMessage(tester, message(), textDirection: TextDirection.rtl);
    Rect avatar = avatarRect(tester);
    Rect box = tester.getRect(find.byType(HoronMessage));
    expect(avatar.right, moreOrLessEquals(box.right), reason: 'RTL start alignment is the right edge');

    await pumpMessage(tester, message(alignEnd: true), textDirection: TextDirection.rtl);
    avatar = avatarRect(tester);
    box = tester.getRect(find.byType(HoronMessage));
    expect(avatar.left, moreOrLessEquals(box.left), reason: 'RTL end alignment is the left edge');
  });

  testWidgets('message: the avatar rises 32px when the content carries a footer', (WidgetTester tester) async {
    await pumpMessage(tester, message());
    final Rect plainAvatar = avatarRect(tester);
    final Rect plainContent = tester.getRect(find.byType(HoronMessageContent));
    expect(plainAvatar.bottom, moreOrLessEquals(plainContent.bottom), reason: 'no footer, no lift');

    await pumpMessage(tester, message(withFooter: true));
    final Rect avatar = avatarRect(tester);
    final Rect content = tester.getRect(find.byType(HoronMessageContent));
    expect(
      avatar.bottom,
      moreOrLessEquals(content.bottom - HoronSpace.s8),
      reason: '`-translate-y-8` lifts the avatar 32px off the row bottom',
    );
  });

  testWidgets('message: the footer sits at the end when the message is end aligned', (WidgetTester tester) async {
    await pumpMessage(tester, message(withFooter: true));
    Rect footer = tester.getRect(find.text('오후 3:12'));
    Rect content = tester.getRect(find.byType(HoronMessageContent));
    expect(footer.left, lessThan(content.center.dx), reason: 'start alignment keeps the footer at the start');

    await pumpMessage(tester, message(alignEnd: true, withFooter: true));
    footer = tester.getRect(find.text('오후 3:12'));
    content = tester.getRect(find.byType(HoronMessageContent));
    expect(
      footer.right,
      moreOrLessEquals(content.right - HoronSpace.s3),
      reason: 'align=end pushes the footer to the end, less the `px-3` inset',
    );
  });

  testWidgets('message: the header uses the muted caption style and 12px side padding', (WidgetTester tester) async {
    await pumpMessage(tester, message(withHeader: true));
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronMessage))).colorScheme;

    final DefaultTextStyle header = DefaultTextStyle.of(tester.element(find.text('민열')));
    expect(header.style.fontSize, HoronText.caption, reason: '`text-xs`');
    expect(header.style.fontWeight, HoronFontWeight.medium, reason: '`font-medium`');
    expect(header.style.color, scheme.onSurfaceVariant, reason: '`text-muted-foreground`');

    final Finder padding = find.ancestor(
      of: find.text('민열'),
      matching: find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding is EdgeInsets),
    );
    expect((tester.widget<Padding>(padding.first).padding as EdgeInsets).left, HoronSpace.s3, reason: '`px-3`');
  });

  testWidgets('message: flush removes the meta side padding for ghost bubbles', (WidgetTester tester) async {
    await pumpMessage(
      tester,
      const HoronMessage(
        children: <Widget>[
          HoronMessageContent(children: <Widget>[HoronMessageHeader(flush: true, child: Text('머리말'))]),
        ],
      ),
    );
    final Finder padding = find.ancestor(
      of: find.text('머리말'),
      matching: find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding is EdgeInsets),
    );
    expect((tester.widget<Padding>(padding.first).padding as EdgeInsets).left, HoronSpace.s0);
  });

  testWidgets('message: the avatar is at least 32px, round, and 8px from the content', (WidgetTester tester) async {
    await pumpMessage(tester, message());
    final Rect avatar = avatarRect(tester);
    expect(avatar.width, greaterThanOrEqualTo(HoronSpace.s8), reason: '`min-w-8`');
    expect(avatar.height, greaterThanOrEqualTo(HoronSpace.s8));

    final ClipOval clip = tester.widget<ClipOval>(
      find.descendant(of: find.byType(HoronMessageAvatar), matching: find.byType(ClipOval)),
    );
    expect(clip.clipBehavior, Clip.antiAlias, reason: 'React `rounded-full overflow-hidden`');

    final Rect content = tester.getRect(find.byType(HoronMessageContent));
    expect(content.left - avatar.right, moreOrLessEquals(HoronSpace.s2), reason: '`gap-2`');
  });

  testWidgets('message: the content stack is 10px apart', (WidgetTester tester) async {
    await pumpMessage(tester, message(withHeader: true, withFooter: true));
    final Rect header = tester.getRect(find.byType(HoronMessageHeader));
    final Rect bubble = tester.getRect(find.byType(HoronBubble));
    final Rect footer = tester.getRect(find.byType(HoronMessageFooter));
    expect(bubble.top - header.bottom, moreOrLessEquals(HoronSpace.s2_5), reason: '`gap-2.5`');
    expect(footer.top - bubble.bottom, moreOrLessEquals(HoronSpace.s2_5));
  });

  testWidgets('message: both brightnesses and both alignments render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final bool alignEnd in <bool>[false, true]) {
        await pumpMessage(
          tester,
          message(alignEnd: alignEnd, withHeader: true, withFooter: true),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} $alignEnd');
      }
    }
  });
}
