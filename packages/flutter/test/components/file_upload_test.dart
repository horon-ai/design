import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/button.dart';
import 'package:horon_ui/src/components/file_upload.dart';
import 'package:horon_ui/src/components/progress.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 파일 업로드의 주입식 선택 콜백·다섯 상태·크기 포맷·제거·재시도를 확인합니다.
///
/// React `file-upload.tsx`는 숨은 `<input type="file">`을 씁니다. 이식본은 플러그인을
/// 의존하지 않고 호스트 콜백으로 파일을 받으므로, 콜백의 호출 여부와 콜백이 없을 때의
/// 비활성 상태를 이 테스트가 지킵니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(HoronSpace.s6),
        child: SizedBox(width: 420, child: child),
      ),
    ),
  );

  const HoronFileUploadFile sample = HoronFileUploadFile(name: 'report.pdf', sizeBytes: 1536);

  test('formatBytes reads B, KB and MB the way React does', () {
    expect(formatBytes(0), '0 B');
    expect(formatBytes(512), '512 B');
    expect(formatBytes(1023), '1023 B');
    expect(formatBytes(1024), '1.0 KB');
    expect(formatBytes(1536), '1.5 KB');
    expect(formatBytes(10240), '10 KB');
    expect(formatBytes(1048576), '1.0 MB');
    expect(formatBytes(1310720), '1.3 MB');
    expect(formatBytes(15728640), '15 MB');
    expect(formatBytes(1073741824), '1.0 GB');
  });

  test('HoronFileUploadFile formats its own size and copies state', () {
    expect(sample.formattedSize, '1.5 KB');
    expect(const HoronFileUploadFile(name: 'x').formattedSize, isNull);

    final HoronFileUploadFile uploading = sample.copyWith(status: HoronFileUploadStatus.uploading, progress: 0.4);
    expect(uploading.name, 'report.pdf');
    expect(uploading.sizeBytes, 1536);
    expect(uploading.status, HoronFileUploadStatus.uploading);
    expect(uploading.progress, 0.4);
  });

  testWidgets('file upload: the dropzone and the trigger call the injected picker', (WidgetTester tester) async {
    int picks = 0;
    await tester.pumpWidget(
      harness(
        HoronFileUpload(
          onPickFiles: () async {
            picks += 1;
            return <HoronFileUploadFile>[sample];
          },
          children: const <Widget>[HoronFileUploadDropzone(), HoronFileUploadTrigger(), HoronFileUploadList()],
        ),
      ),
    );

    await tester.tap(find.byKey(HoronFileUploadDropzone.dropzoneKey));
    await tester.pumpAndSettle();
    expect(picks, 1);
    expect(find.text('report.pdf'), findsOneWidget);
    expect(find.text('1.5 KB'), findsOneWidget);

    await tester.tap(find.byKey(HoronFileUploadTrigger.buttonKey));
    await tester.pumpAndSettle();
    expect(picks, 2);
    // 기본이 multiple이라 두 번째 선택이 목록에 더해집니다.
    expect(find.text('report.pdf'), findsNWidgets(2));
  });

  testWidgets('file upload: a null picker disables the dropzone and the trigger', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronFileUpload(
          children: <Widget>[HoronFileUploadDropzone(), HoronFileUploadTrigger(), HoronFileUploadList()],
        ),
      ),
    );

    // 드롭존은 눌러도 아무 일도 하지 않습니다.
    await tester.tap(find.byKey(HoronFileUploadDropzone.dropzoneKey));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);

    final HoronButton trigger = tester.widget<HoronButton>(find.byKey(HoronFileUploadTrigger.buttonKey));
    expect(trigger.disabled, isTrue);
    expect(trigger.onPressed, isNull);
  });

  testWidgets('file upload: multiple false keeps only the newest pick', (WidgetTester tester) async {
    int round = 0;
    await tester.pumpWidget(
      harness(
        HoronFileUpload(
          multiple: false,
          onPickFiles: () async {
            round += 1;
            return <HoronFileUploadFile>[
              HoronFileUploadFile(name: round == 1 ? 'first.png' : 'second.png', sizeBytes: 2048),
            ];
          },
          children: const <Widget>[HoronFileUploadTrigger(), HoronFileUploadList()],
        ),
      ),
    );

    await tester.tap(find.byKey(HoronFileUploadTrigger.buttonKey));
    await tester.pumpAndSettle();
    expect(find.text('first.png'), findsOneWidget);

    await tester.tap(find.byKey(HoronFileUploadTrigger.buttonKey));
    await tester.pumpAndSettle();
    expect(find.text('first.png'), findsNothing);
    expect(find.text('second.png'), findsOneWidget);
  });

  testWidgets('file upload: every status draws its own media and description', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        HoronFileUpload(
          defaultFiles: const <HoronFileUploadFile>[
            HoronFileUploadFile(name: 'idle.txt', sizeBytes: 400),
            HoronFileUploadFile(
              name: 'uploading.zip',
              sizeBytes: 2048,
              status: HoronFileUploadStatus.uploading,
              progress: 0.4,
            ),
            HoronFileUploadFile(
              name: 'processing.zip',
              sizeBytes: 4096,
              status: HoronFileUploadStatus.processing,
              progress: 1,
            ),
            HoronFileUploadFile(name: 'broken.pdf', sizeBytes: 900, status: HoronFileUploadStatus.error),
            HoronFileUploadFile(name: 'done.pdf', sizeBytes: 15728640, status: HoronFileUploadStatus.done),
          ],
          children: const <Widget>[HoronFileUploadList()],
        ),
      ),
    );

    expect(find.text('idle.txt'), findsOneWidget);
    expect(find.text('400 B'), findsOneWidget);
    expect(find.text('uploading.zip'), findsOneWidget);
    expect(find.text('processing.zip'), findsOneWidget);
    expect(find.text('done.pdf'), findsOneWidget);
    expect(find.text('15 MB'), findsOneWidget);

    // 진행률이 있는 uploading·processing 두 상태만 진행 막대를 그립니다.
    expect(find.byType(HoronProgress), findsNWidgets(2));

    // 오류 상태는 테마 문구로 실패를 알립니다.
    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronFileUploadList)));
    expect(find.text(horon.strings.uploadFailed), findsOneWidget);
  });

  testWidgets('file upload: an error item calls the retry callback', (WidgetTester tester) async {
    final List<int> retried = <int>[];
    await tester.pumpWidget(
      harness(
        HoronFileUpload(
          defaultFiles: const <HoronFileUploadFile>[
            HoronFileUploadFile(name: 'broken.pdf', status: HoronFileUploadStatus.error),
          ],
          onRetryFile: retried.add,
          children: const <Widget>[HoronFileUploadList()],
        ),
      ),
    );

    expect(find.byKey(HoronFileUploadItem.retryKey), findsOneWidget);
    await tester.tap(find.byKey(HoronFileUploadItem.retryKey));
    await tester.pumpAndSettle();
    expect(retried, <int>[0]);
  });

  testWidgets('file upload: the remove button drops that file and reports its index', (WidgetTester tester) async {
    final List<int> removed = <int>[];
    await tester.pumpWidget(
      harness(
        HoronFileUpload(
          defaultFiles: const <HoronFileUploadFile>[
            HoronFileUploadFile(name: 'a.txt'),
            HoronFileUploadFile(name: 'b.txt'),
          ],
          onRemoveFile: removed.add,
          children: const <Widget>[HoronFileUploadList()],
        ),
      ),
    );

    expect(find.byKey(HoronFileUploadItem.removeKey), findsNWidgets(2));
    await tester.tap(find.byKey(HoronFileUploadItem.removeKey).first);
    await tester.pumpAndSettle();

    expect(removed, <int>[0]);
    expect(find.text('a.txt'), findsNothing);
    expect(find.text('b.txt'), findsOneWidget);
  });

  testWidgets('file upload: a failing picker reports through onPickError', (WidgetTester tester) async {
    Object? caught;
    await tester.pumpWidget(
      harness(
        HoronFileUpload(
          onPickFiles: () async => throw StateError('picker exploded'),
          onPickError: (Object error) => caught = error,
          children: const <Widget>[HoronFileUploadTrigger(), HoronFileUploadList()],
        ),
      ),
    );

    await tester.tap(find.byKey(HoronFileUploadTrigger.buttonKey));
    await tester.pumpAndSettle();

    expect(caught, isA<StateError>());
    expect(tester.takeException(), isNull);
  });

  testWidgets('file upload: the controlled list follows the host', (WidgetTester tester) async {
    Widget build(List<HoronFileUploadFile> files) =>
        harness(HoronFileUpload(files: files, children: const <Widget>[HoronFileUploadList()]));

    await tester.pumpWidget(build(const <HoronFileUploadFile>[HoronFileUploadFile(name: 'one.txt')]));
    expect(find.text('one.txt'), findsOneWidget);

    await tester.pumpWidget(
      build(const <HoronFileUploadFile>[HoronFileUploadFile(name: 'one.txt'), HoronFileUploadFile(name: 'two.txt')]),
    );
    await tester.pumpAndSettle();
    expect(find.text('two.txt'), findsOneWidget);
  });

  testWidgets('file upload: an empty list draws the given placeholder', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(const HoronFileUpload(children: <Widget>[HoronFileUploadList(empty: Text('아직 고른 파일이 없습니다'))])),
    );
    expect(find.text('아직 고른 파일이 없습니다'), findsOneWidget);
  });

  testWidgets('file upload: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        harness(
          HoronFileUpload(
            defaultFiles: const <HoronFileUploadFile>[sample],
            onPickFiles: () async => const <HoronFileUploadFile>[],
            children: const <Widget>[HoronFileUploadDropzone(), HoronFileUploadList()],
          ),
          brightness: brightness,
        ),
      );
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.byKey(HoronFileUploadList.listKey), findsOneWidget, reason: brightness.name);
    }
  });

  testWidgets('file upload: a part outside the root reports the misuse', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronFileUploadList()));
    expect(tester.takeException(), isA<StateError>());
  });
}
