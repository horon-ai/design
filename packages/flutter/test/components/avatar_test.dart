import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/avatar.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 1×1 투명 PNG입니다. 성공 경로의 이미지로 씁니다.
final Uint8List _tinyPng = base64Decode(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
);

/// 디코딩이 실패하는 바이트입니다. 실패 경로의 이미지로 씁니다.
final Uint8List _brokenBytes = Uint8List.fromList(<int>[1, 2, 3, 4, 5, 6, 7, 8]);

void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    key: ValueKey<Brightness>(brightness),
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  testWidgets('avatar: the three sizes draw 24, 32 and 40', (WidgetTester tester) async {
    for (final HoronAvatarSize size in HoronAvatarSize.values) {
      await tester.pumpWidget(harness(HoronAvatar(size: size, name: '민열 김')));
      final double expected = switch (size) {
        HoronAvatarSize.sm => 24,
        HoronAvatarSize.defaultValue => 32,
        HoronAvatarSize.lg => 40,
      };
      expect(tester.getSize(find.byType(HoronAvatar)).width, expected, reason: size.name);
    }
  });

  testWidgets('avatar: initials come from the name', (WidgetTester tester) async {
    expect(HoronAvatar.initials('민열 김'), '민김');
    expect(HoronAvatar.initials('Minyeol Kim'), 'MK');
    expect(HoronAvatar.initials('Minyeol'), 'MI');
    expect(HoronAvatar.initials(''), '');
    expect(HoronAvatar.initials(null), '');

    await tester.pumpWidget(harness(const HoronAvatar(name: 'Minyeol Kim')));
    expect(find.text('MK'), findsOneWidget);
  });

  testWidgets('avatar: a failing image falls back to the initials', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        HoronAvatar(
          name: 'Minyeol Kim',
          image: HoronAvatarImage(image: MemoryImage(_brokenBytes)),
        ),
      ),
    );

    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 50)));
    await tester.pump();

    expect(find.text('MK'), findsOneWidget, reason: '이미지가 실패하면 이니셜이 그려져야 합니다');
    expect(find.byType(RawImage), findsNothing);
  });

  testWidgets('avatar: a loaded image replaces the fallback', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        HoronAvatar(
          name: 'Minyeol Kim',
          image: HoronAvatarImage(image: MemoryImage(_tinyPng)),
        ),
      ),
    );

    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 50)));
    await tester.pump();

    expect(find.byType(RawImage), findsOneWidget);
    expect(find.text('MK'), findsNothing);
  });

  testWidgets('avatar: an explicit fallback widget wins over the initials', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        HoronAvatar(
          name: 'Minyeol Kim',
          image: HoronAvatarImage(image: MemoryImage(_brokenBytes), fallback: const Icon(Icons.person)),
        ),
      ),
    );

    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 50)));
    await tester.pump();

    expect(find.byIcon(Icons.person), findsOneWidget);
    expect(find.text('MK'), findsNothing);
  });

  testWidgets('avatar: the badge sits at the bottom right and follows the size', (WidgetTester tester) async {
    for (final HoronAvatarSize size in HoronAvatarSize.values) {
      await tester.pumpWidget(harness(HoronAvatar(size: size, name: 'Minyeol Kim', badge: const HoronAvatarBadge())));
      final Rect avatar = tester.getRect(find.byType(HoronAvatar));
      final Rect badge = tester.getRect(find.byType(HoronAvatarBadge));
      final double expected = switch (size) {
        HoronAvatarSize.sm => 8,
        HoronAvatarSize.defaultValue => 10,
        HoronAvatarSize.lg => 12,
      };
      expect(badge.width, expected, reason: size.name);
      expect(badge.right, closeTo(avatar.right, 0.5), reason: size.name);
      expect(badge.bottom, closeTo(avatar.bottom, 0.5), reason: size.name);
    }
  });

  testWidgets('avatar: the group overlaps its members by 8px and counts the rest', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        HoronAvatarGroup(
          children: <Widget>[
            const HoronAvatar(name: 'A B'),
            const HoronAvatar(name: 'C D'),
            HoronAvatarGroupCount(count: 3),
          ],
        ),
      ),
    );

    expect(find.text('AB'), findsOneWidget);
    expect(find.text('CD'), findsOneWidget);
    expect(find.text('+3'), findsOneWidget);

    final Rect first = tester.getRect(find.byType(HoronAvatar).first);
    final Rect second = tester.getRect(find.byType(HoronAvatar).at(1));
    expect(second.left - first.left, closeTo(32 - 8, 0.5), reason: '이웃한 아바타는 8px 겹칩니다');
  });

  testWidgets('avatar: the group count follows the group size', (WidgetTester tester) async {
    for (final HoronAvatarSize size in HoronAvatarSize.values) {
      await tester.pumpWidget(
        harness(
          HoronAvatarGroup(
            size: size,
            children: <Widget>[
              const HoronAvatar(name: 'A B'),
              HoronAvatarGroupCount(count: 2),
            ],
          ),
        ),
      );
      final double expected = switch (size) {
        HoronAvatarSize.sm => 24,
        HoronAvatarSize.defaultValue => 32,
        HoronAvatarSize.lg => 40,
      };
      expect(tester.getSize(find.byType(HoronAvatarGroupCount)).width, expected, reason: size.name);
    }
  });

  testWidgets('avatar: both brightnesses render their own fallback surface', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(harness(const HoronAvatar(name: 'A B'), brightness: brightness));
      expect(tester.takeException(), isNull, reason: brightness.name);
      final DecoratedBox box = tester.widget<DecoratedBox>(
        find.descendant(of: find.byType(HoronAvatarFallback), matching: find.byType(DecoratedBox)).first,
      );
      final Color expected = brightness == Brightness.dark ? HoronDarkColors.muted : HoronLightColors.muted;
      expect((box.decoration as BoxDecoration).color, expected);
    }
  });
}
