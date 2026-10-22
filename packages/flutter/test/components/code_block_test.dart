import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/code_block.dart';

const String _code = 'dart format --set-exit-if-changed lib test';

Widget _block({String code = _code, Widget? header, Brightness brightness = Brightness.light}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(
        child: SizedBox(
          width: 420,
          child: HoronCodeBlock(
            code: code,
            children: <Widget>[
              header ?? const HoronCodeBlockHeader(title: 'bash', trailing: HoronCodeBlockCopyButton()),
              const HoronCodeBlockContent(),
            ],
          ),
        ),
      ),
    ),
  );
}

void main() {
  late List<MethodCall> platformCalls;

  setUp(() {
    platformCalls = <MethodCall>[];
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (MethodCall call) async {
        platformCalls.add(call);
        return null;
      },
    );
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      null,
    );
  });

  testWidgets('code block: the copy button calls Clipboard.setData with the block code', (WidgetTester tester) async {
    await tester.pumpWidget(_block());
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(HoronCodeBlockCopyButton.buttonKey));
    await tester.pump();

    // The Flutter counterpart of React's navigator.clipboard.writeText.
    final Iterable<MethodCall> copies = platformCalls.where((MethodCall call) => call.method == 'Clipboard.setData');
    expect(copies, hasLength(1));
    expect((copies.single.arguments as Map<Object?, Object?>)['text'], _code);
  });

  testWidgets('code block: the button flips to the copied state and back', (WidgetTester tester) async {
    await tester.pumpWidget(_block());
    await tester.pumpAndSettle();
    expect(find.bySemanticsLabel('Copy code'), findsOneWidget);

    await tester.tap(find.byKey(HoronCodeBlockCopyButton.buttonKey));
    await tester.pump();
    expect(find.bySemanticsLabel('Copied'), findsOneWidget);

    // React's `timeout = 2000` returns the button to idle.
    await tester.pump(const Duration(milliseconds: 2000));
    expect(find.bySemanticsLabel('Copy code'), findsOneWidget);
  });

  testWidgets('code block: an explicit value wins over the block code', (WidgetTester tester) async {
    await tester.pumpWidget(
      _block(
        header: const HoronCodeBlockHeader(trailing: HoronCodeBlockCopyButton(value: 'only this')),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(HoronCodeBlockCopyButton.buttonKey));
    await tester.pump();

    final MethodCall copy = platformCalls.singleWhere((MethodCall call) => call.method == 'Clipboard.setData');
    expect((copy.arguments as Map<Object?, Object?>)['text'], 'only this');
  });

  testWidgets('code block: the body is selectable and the header shows its title', (WidgetTester tester) async {
    await tester.pumpWidget(_block());
    await tester.pumpAndSettle();

    expect(find.byType(SelectableText), findsOneWidget);
    expect(find.text(_code), findsOneWidget);
    expect(find.text('bash'), findsOneWidget);
  });

  testWidgets('code block: a failed copy keeps the idle state', (WidgetTester tester) async {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (MethodCall call) async {
        if (call.method == 'Clipboard.setData') {
          throw PlatformException(code: 'copy_failed');
        }
        return null;
      },
    );
    await tester.pumpWidget(_block());
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(HoronCodeBlockCopyButton.buttonKey));
    await tester.pump();

    // React also falls back to `setCopied(false)` in its catch block.
    expect(find.bySemanticsLabel('Copy code'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('code block: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_block(brightness: brightness));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
