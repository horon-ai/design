import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'progress.dart';
import 'spinner.dart';

/// 파일 하나의 상태입니다.
///
/// React `file-upload.tsx`의 `FileUploadStatus`는 `idle | uploading | done | error`
/// 네 값입니다. 이 이식본은 계획이 요구한 `processing`(업로드 뒤 서버가 처리하는
/// 구간)을 더해 다섯 값입니다. React에는 cva `variants:` 블록이 없으므로 이 enum은
/// 변형 게이트의 대조 대상이 아닙니다.
enum HoronFileUploadStatus {
  /// 아직 아무 일도 시작하지 않았습니다.
  idle,

  /// 바이트를 보내는 중입니다. [HoronFileUploadFile.progress]가 채워집니다.
  uploading,

  /// 보내기는 끝났고 서버가 처리하는 중입니다.
  processing,

  /// 실패했습니다. [HoronFileUploadFile.errorMessage]가 이유를 담습니다.
  error,

  /// 끝났습니다.
  done,
}

/// 목록에 올라온 파일 하나입니다.
///
/// React는 브라우저의 `File`을 그대로 들고 상태를 아이템 prop으로 넘깁니다. Flutter에는
/// 그런 표준 타입이 없으므로 이름·크기·상태·진행률을 이 클래스가 함께 듭니다. 호스트는
/// 파일을 고른 뒤 이 값으로 목록에 넣고, 업로드가 진행되면 [copyWith]로 상태를 갱신해
/// [HoronFileUpload.onFilesChange]로 돌려줍니다.
///
/// 이 패키지는 파일을 읽지도, 복사하지도, 올리지도 않습니다. 경로가 필요하면 호스트가
/// 자기 모델을 따로 들고 이 값에는 표시에 필요한 것만 넣습니다.
class HoronFileUploadFile {
  /// 파일 하나를 만듭니다.
  const HoronFileUploadFile({
    required this.name,
    this.sizeBytes,
    this.status = HoronFileUploadStatus.idle,
    this.progress,
    this.errorMessage,
  });

  /// 화면에 보이는 파일 이름입니다.
  final String name;

  /// 바이트 단위 크기입니다. 없으면 크기 줄을 그리지 않습니다.
  final int? sizeBytes;

  /// 지금 상태입니다.
  final HoronFileUploadStatus status;

  /// 0에서 1 사이의 진행 비율입니다. `uploading`·`processing`에서만 씁니다.
  final double? progress;

  /// 실패 이유입니다. `error` 상태에서만 씁니다.
  final String? errorMessage;

  /// 일부 값만 바꾼 사본을 만듭니다.
  HoronFileUploadFile copyWith({
    String? name,
    int? sizeBytes,
    HoronFileUploadStatus? status,
    double? progress,
    String? errorMessage,
  }) => HoronFileUploadFile(
    name: name ?? this.name,
    sizeBytes: sizeBytes ?? this.sizeBytes,
    status: status ?? this.status,
    progress: progress ?? this.progress,
    errorMessage: errorMessage ?? this.errorMessage,
  );

  /// 화면에 보이는 크기 문구입니다. 크기를 모르면 null입니다.
  String? get formattedSize => sizeBytes == null ? null : formatBytes(sizeBytes!);
}

/// 바이트 수를 사람이 읽는 크기로 바꿉니다.
///
/// `file-upload.tsx`의 `formatBytes`를 그대로 옮겼습니다. 1024 미만은 `B`, 그 위는
/// 1024로 나누며 `KB`·`MB`·`GB`·`TB`로 올라갑니다. 10 이상이면 반올림한 정수,
/// 그 아래는 소수 한 자리를 붙입니다. 그래서 `1.5 KB`와 `12 KB`가 나란히 자연스럽습니다.
///
/// ```dart
/// formatBytes(512);    // '512 B'
/// formatBytes(1536);   // '1.5 KB'
/// formatBytes(10240);  // '10 KB'
/// formatBytes(1310720); // '1.3 MB'
/// ```
String formatBytes(int bytes) {
  if (bytes < _bytesPerUnit) return '$bytes B';
  final List<String> units = <String>['KB', 'MB', 'GB', 'TB'];
  double value = bytes / _bytesPerUnit;
  int unitIndex = 0;
  while (value >= _bytesPerUnit && unitIndex < units.length - 1) {
    value /= _bytesPerUnit;
    unitIndex += 1;
  }
  final String number = value >= 10 ? '${value.round()}' : value.toStringAsFixed(1);
  return '$number ${units[unitIndex]}';
}

/// 한 단계가 오르는 기준입니다. `formatBytes`의 1024입니다.
const int _bytesPerUnit = 1024;

/// 파일을 고르는 콜백입니다. 호스트가 자기 플러그인으로 열고 고른 파일을 돌려줍니다.
///
/// 이 패키지는 `image_picker`·`file_selector`·`desktop_drop`을 의존하지 않습니다.
/// 시스템 선택기를 여는 일은 앱의 몫이고, 이 타입이 그 경계입니다.
typedef HoronFilePicker = Future<List<HoronFileUploadFile>> Function();

/// `file-upload.tsx`의 `size-9`입니다. 아이콘 타일의 한 변입니다.
const double _uploadMediaSize = HoronSpace.s9;

/// `file-upload.tsx`의 `px-6 py-8`입니다. 드롭존의 안쪽 여백입니다.
const double _uploadDropzonePaddingHorizontal = HoronSpace.s6;
const double _uploadDropzonePaddingVertical = HoronSpace.s8;

/// `file-upload.tsx`의 `gap-2`입니다. 드롭존 안쪽 간격입니다.
const double _uploadDropzoneGap = HoronSpace.s2;

/// `file-upload.tsx`의 루트 `gap-3`입니다. 파트 사이 간격입니다.
const double _uploadRootGap = HoronSpace.s3;

/// `file-upload.tsx`의 목록 `gap-2`입니다.
const double _uploadListGap = HoronSpace.s2;

/// `file-upload.tsx`의 항목 `px-3 py-2.5`입니다.
const double _uploadItemPaddingHorizontal = HoronSpace.s3;
const double _uploadItemPaddingVertical = HoronSpace.s2_5;

/// `file-upload.tsx`의 항목 `gap-3`입니다.
const double _uploadItemGap = HoronSpace.s3;

/// `file-upload.tsx`의 이름·설명 사이 `gap-0.5`입니다.
const double _uploadItemContentGap = HoronSpace.s0_5;

/// `file-upload.tsx`의 `text-sm`·`text-xs`입니다.
const double _uploadItemFontSize = HoronText.body;
const double _uploadDescriptionFontSize = HoronText.caption;

/// `file-upload.tsx`의 아이콘 `size-4`입니다.
const double _uploadIconSize = HoronSpace.s4;

/// `file-upload.tsx`의 `rounded-lg`입니다. 드롭존과 아이콘 타일의 반경입니다.
const double _uploadRadius = HoronRadius.lg;

/// `file-upload.tsx`의 `rounded-md`입니다. 항목 표면의 반경입니다.
const double _uploadItemRadius = HoronRadius.md;

/// `file-upload.tsx`의 `bg-muted/50`입니다. 드롭존 hover의 불투명도입니다.
const double _uploadHoverAlpha = 0.5;

/// `focus-visible:ring-ring/50`의 불투명도입니다.
const double _uploadRingAlpha = 0.5;

/// `focus-visible:ring-3`입니다. 링의 퍼짐입니다.
const double _uploadRingSpread = HoronSpace.s0_5;

/// `data-[status=error]:border-destructive/30`입니다.
const double _uploadErrorBorderAlpha = 0.3;

/// 점선 테두리의 한 조각 길이입니다. React의 `border-dashed`는 브라우저가 그리므로
/// 값이 토큰에 없습니다. 4px 눈금의 3과 2를 씁니다.
const double _uploadDashLength = HoronSpace.s3;
const double _uploadDashGap = HoronSpace.s2;

/// 파일 업로드 파트가 목록과 콜백을 읽는 범위입니다.
class _HoronFileUploadScope extends InheritedWidget {
  const _HoronFileUploadScope({
    required this.files,
    required this.multiple,
    required this.accept,
    required this.picker,
    required this.openPicker,
    required this.removeFile,
    required this.retryFile,
    required super.child,
  });

  /// 지금 목록입니다.
  final List<HoronFileUploadFile> files;

  /// 여러 개를 고를 수 있는지 여부입니다.
  final bool multiple;

  /// 호스트가 넘긴 선택 필터 문구입니다. 이 패키지는 해석하지 않고 그대로 보관합니다.
  final String? accept;

  /// 파일을 고르는 콜백입니다. null이면 선택 UI가 비활성입니다.
  final HoronFilePicker? picker;

  /// 선택기를 엽니다.
  final VoidCallback openPicker;

  /// [index]번 파일을 지웁니다.
  final ValueChanged<int> removeFile;

  /// [index]번 파일을 다시 시도합니다.
  final ValueChanged<int> retryFile;

  /// 선택기를 열 수 있는지 여부입니다.
  bool get canPick => picker != null;

  static _HoronFileUploadScope of(BuildContext context) {
    final _HoronFileUploadScope? scope = context.dependOnInheritedWidgetOfExactType<_HoronFileUploadScope>();
    if (scope == null) {
      throw StateError('File upload parts must be used inside a HoronFileUpload.');
    }
    return scope;
  }

  @override
  bool updateShouldNotify(_HoronFileUploadScope oldWidget) =>
      files != oldWidget.files ||
      multiple != oldWidget.multiple ||
      accept != oldWidget.accept ||
      picker != oldWidget.picker;
}

/// 드롭존과 파일 목록을 묶는 루트입니다.
///
/// `file-upload.tsx`의 `FileUpload`를 옮긴 것입니다. React는 `<input type="file">`을
/// 숨겨 두고 클릭으로 엽니다. Flutter에는 그 입력이 없고, 이 패키지는 파일 선택
/// 플러그인도 의존하지 않습니다. 대신 [onPickFiles] 콜백을 받아 호스트가 고른 파일을
/// 돌려주게 합니다. 콜백이 null이면 드롭존과 버튼이 모두 비활성입니다.
///
/// **업로드는 하지 않습니다.** 이 위젯은 목록과 상태만 그리고, 상태를 바꾸는 일은
/// 호스트가 [onFilesChange]로 합니다.
///
/// ```dart
/// HoronFileUpload(
///   onPickFiles: () async => <HoronFileUploadFile>[
///     const HoronFileUploadFile(name: 'report.pdf', sizeBytes: 1536),
///   ],
///   children: const <Widget>[
///     HoronFileUploadDropzone(),
///     HoronFileUploadList(),
///   ],
/// )
/// ```
class HoronFileUpload extends StatefulWidget {
  /// 파일 업로드 하나를 만듭니다.
  const HoronFileUpload({
    super.key,
    required this.children,
    this.files,
    this.defaultFiles = const <HoronFileUploadFile>[],
    this.onFilesChange,
    this.onPickFiles,
    this.onPickError,
    this.onRemoveFile,
    this.onRetryFile,
    this.multiple = true,
    this.accept,
  });

  /// 드롭존·버튼·목록 같은 파트입니다.
  final List<Widget> children;

  /// 목록을 호스트가 소유할 때 넘깁니다. null이면 이 위젯이 소유합니다.
  final List<HoronFileUploadFile>? files;

  /// 소유 모드에서 처음 목록입니다.
  final List<HoronFileUploadFile> defaultFiles;

  /// 목록이 바뀔 때 부르는 콜백입니다. 제어 모드에서도 불립니다.
  final ValueChanged<List<HoronFileUploadFile>>? onFilesChange;

  /// 파일을 고르는 콜백입니다. null이면 선택 UI가 비활성입니다.
  final HoronFilePicker? onPickFiles;

  /// 선택기가 실패했을 때 부르는 콜백입니다.
  ///
  /// 없으면 [FlutterError.reportError]로 보고합니다. 선택 실패를 조용히 삼키면 화면이
  /// 아무 반응 없이 멈춘 것처럼 보이기 때문입니다.
  final ValueChanged<Object>? onPickError;

  /// 파일 하나를 지울 때 부르는 콜백입니다.
  final ValueChanged<int>? onRemoveFile;

  /// 실패한 파일을 다시 시도할 때 부르는 콜백입니다.
  final ValueChanged<int>? onRetryFile;

  /// 여러 개를 고를 수 있는지 여부입니다. React의 `multiple` 기본값은 참입니다.
  final bool multiple;

  /// 호스트가 해석할 선택 필터 문구입니다(예: `image/*`).
  final String? accept;

  @override
  State<HoronFileUpload> createState() => _HoronFileUploadState();
}

class _HoronFileUploadState extends State<HoronFileUpload> {
  late List<HoronFileUploadFile> _owned = List<HoronFileUploadFile>.of(widget.defaultFiles);
  bool _picking = false;

  List<HoronFileUploadFile> get _files => widget.files ?? _owned;

  void _setFiles(List<HoronFileUploadFile> next) {
    if (widget.files == null) setState(() => _owned = next);
    widget.onFilesChange?.call(next);
  }

  Future<void> _openPicker() async {
    final HoronFilePicker? picker = widget.onPickFiles;
    if (picker == null || _picking) return;
    _picking = true;
    try {
      final List<HoronFileUploadFile> picked = await picker();
      if (!mounted || picked.isEmpty) return;
      if (widget.multiple) {
        _setFiles(<HoronFileUploadFile>[..._files, ...picked]);
      } else {
        _setFiles(picked.take(1).toList());
      }
    } catch (error, stack) {
      final ValueChanged<Object>? handler = widget.onPickError;
      if (handler != null) {
        handler(error);
      } else {
        FlutterError.reportError(FlutterErrorDetails(exception: error, stack: stack, library: 'horon_ui'));
      }
    } finally {
      _picking = false;
    }
  }

  void _removeFile(int index) {
    _setFiles(<HoronFileUploadFile>[
      for (int position = 0; position < _files.length; position++)
        if (position != index) _files[position],
    ]);
    widget.onRemoveFile?.call(index);
  }

  void _retryFile(int index) => widget.onRetryFile?.call(index);

  @override
  Widget build(BuildContext context) {
    return _HoronFileUploadScope(
      files: _files,
      multiple: widget.multiple,
      accept: widget.accept,
      picker: widget.onPickFiles,
      openPicker: _openPicker,
      removeFile: _removeFile,
      retryFile: _retryFile,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        spacing: _uploadRootGap,
        children: widget.children,
      ),
    );
  }
}

/// 파일을 끌어다 놓거나 눌러서 고르는 영역입니다.
///
/// `file-upload.tsx`의 `FileUploadDropzone`입니다. React는 `border-dashed`,
/// `rounded-lg`, `bg-card`에 hover에서 `bg-muted/50`, 끌어다 놓는 중에
/// `border-primary`와 `bg-primary/5`를 칠합니다. 이 이식본은 끌어다 놓기를 직접
/// 받지 않습니다(데스크톱 전용 플러그인을 의존하지 않기 때문입니다). 누르면
/// [HoronFileUpload.onPickFiles]를 부릅니다.
class HoronFileUploadDropzone extends StatefulWidget {
  /// 드롭존 하나를 만듭니다.
  const HoronFileUploadDropzone({super.key, this.icon, this.label, this.hint});

  /// 드롭존을 찾는 키입니다.
  static const Key dropzoneKey = ValueKey<String>('horon-file-upload-dropzone');

  /// 위에 놓는 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 안내 문구입니다. 없으면 테마의 `strings.dropFilesHere`입니다.
  final String? label;

  /// 아래에 놓는 보조 문구입니다. 없으면 그리지 않습니다.
  final String? hint;

  @override
  State<HoronFileUploadDropzone> createState() => _HoronFileUploadDropzoneState();
}

class _HoronFileUploadDropzoneState extends State<HoronFileUploadDropzone> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronFileUploadScope scope = _HoronFileUploadScope.of(context);
    final bool enabled = scope.canPick;

    final Color borderColor = _focused ? horon.ring : scheme.outline;
    final Color background = _hovered && enabled
        ? scheme.surfaceContainerHighest.withValues(alpha: _uploadHoverAlpha)
        : scheme.surfaceContainerLow;

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.label ?? horon.strings.dropFilesHere,
      child: FocusableActionDetector(
        enabled: enabled,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              scope.openPicker();
              return null;
            },
          ),
        },
        child: GestureDetector(
          key: HoronFileUploadDropzone.dropzoneKey,
          behavior: HitTestBehavior.opaque,
          onTap: enabled ? scope.openPicker : null,
          child: CustomPaint(
            // 점선은 자식 위에 그립니다. `painter`로 두면 불투명한 표면 채움이 그 위를
            // 덮어 테두리가 보이지 않습니다(2026-10-22 캡처에서 확인).
            foregroundPainter: _HoronDashedBorderPainter(
              color: borderColor,
              radius: _uploadRadius,
              dashLength: _uploadDashLength,
              gapLength: _uploadDashGap,
            ),
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: background,
                borderRadius: BorderRadius.circular(_uploadRadius),
                boxShadow: _focused && enabled
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.ring.withValues(alpha: _uploadRingAlpha),
                          spreadRadius: _uploadRingSpread,
                        ),
                      ]
                    : null,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: _uploadDropzonePaddingHorizontal,
                  vertical: _uploadDropzonePaddingVertical,
                ),
                child: Opacity(
                  opacity: enabled ? 1 : 0.5,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    spacing: _uploadDropzoneGap,
                    children: <Widget>[
                      if (widget.icon != null)
                        IconTheme.merge(
                          data: IconThemeData(size: HoronSpace.s6, color: scheme.onSurfaceVariant),
                          child: widget.icon!,
                        ),
                      Text(
                        widget.label ?? horon.strings.dropFilesHere,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: HoronFont.body,
                          fontFamilyFallback: HoronFont.fontFamilyFallback,
                          fontSize: _uploadItemFontSize,
                          height: HoronLineHeight.normal,
                          color: scheme.onSurfaceVariant,
                          decoration: TextDecoration.none,
                        ),
                      ),
                      if (widget.hint != null)
                        Text(
                          widget.hint!,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontFamily: HoronFont.body,
                            fontFamilyFallback: HoronFont.fontFamilyFallback,
                            fontSize: _uploadDescriptionFontSize,
                            height: HoronLineHeight.normal,
                            color: scheme.onSurfaceVariant,
                            decoration: TextDecoration.none,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 선택기를 여는 작은 버튼입니다.
///
/// `file-upload.tsx`의 `FileUploadTrigger`입니다. React는 `variant="outline"`,
/// `size="sm"` 버튼입니다. [HoronFileUpload.onPickFiles]가 null이면 비활성으로 그립니다.
class HoronFileUploadTrigger extends StatelessWidget {
  /// 선택 버튼 하나를 만듭니다.
  const HoronFileUploadTrigger({super.key, this.label, this.leading});

  /// 버튼을 찾는 키입니다.
  static const Key buttonKey = ValueKey<String>('horon-file-upload-trigger');

  /// 버튼 글자입니다. 없으면 테마의 `strings.browse`입니다.
  final String? label;

  /// 글자 앞 아이콘입니다.
  final Widget? leading;

  @override
  Widget build(BuildContext context) {
    final _HoronFileUploadScope scope = _HoronFileUploadScope.of(context);
    // React의 `Button`은 `inline-flex`라 내용 폭만큼만 차지합니다. Flutter에서는
    // 늘어나는 `Column` 안에서 폭을 채우므로, 여기서 시작 쪽에 붙여 같은 폭을 냅니다.
    return Align(
      alignment: AlignmentDirectional.centerStart,
      child: HoronButton(
        key: buttonKey,
        variant: HoronButtonVariant.outline,
        size: HoronButtonSize.sm,
        label: label ?? HoronTheme.of(context).strings.browse,
        leading: leading,
        disabled: !scope.canPick,
        // 선택 콜백이 없으면 누를 수 없습니다. `onPressed`를 비우면 버튼이 스스로
        // 비활성 모양을 그리고, 보조 기술에도 비활성으로 알립니다.
        onPressed: scope.canPick ? scope.openPicker : null,
      ),
    );
  }
}

/// 목록에 올라온 파일들을 세로로 늘어놓는 목록입니다.
///
/// `file-upload.tsx`의 `FileUploadList`입니다. React는 `ul`에 `flex flex-col gap-2`만
/// 주고 항목은 호스트가 넣습니다. 이 이식본은 범위의 목록을 그대로 그려, 파일마다
/// 상태·진행률·제거·재시도를 같은 모양으로 보여 줍니다.
class HoronFileUploadList extends StatelessWidget {
  /// 파일 목록 하나를 만듭니다.
  const HoronFileUploadList({super.key, this.itemBuilder, this.empty});

  /// 목록을 찾는 키입니다.
  static const Key listKey = ValueKey<String>('horon-file-upload-list');

  /// 항목을 직접 그릴 때 씁니다. 없으면 [HoronFileUploadItem]을 씁니다.
  final Widget Function(BuildContext context, HoronFileUploadFile file, int index)? itemBuilder;

  /// 목록이 비었을 때 그릴 내용입니다.
  final Widget? empty;

  @override
  Widget build(BuildContext context) {
    final _HoronFileUploadScope scope = _HoronFileUploadScope.of(context);
    if (scope.files.isEmpty) return empty ?? const SizedBox.shrink();

    return Column(
      key: listKey,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      spacing: _uploadListGap,
      children: <Widget>[
        for (int index = 0; index < scope.files.length; index++)
          itemBuilder?.call(context, scope.files[index], index) ??
              HoronFileUploadItem(
                file: scope.files[index],
                onRemove: () => scope.removeFile(index),
                onRetry: () => scope.retryFile(index),
              ),
      ],
    );
  }
}

/// 목록의 파일 한 줄입니다.
///
/// `file-upload.tsx`의 `FileUploadItem`입니다. React는 `size-9` 아이콘 타일, 이름,
/// 크기, 제거 버튼을 그립니다. 이 이식본은 상태가 다섯이라 아이콘과 오른쪽 버튼이
/// 상태를 따라갑니다: `uploading`은 도는 링, `error`는 경고 아이콘과 재시도,
/// 나머지는 문서 아이콘입니다. `uploading`·`processing`에서 진행률이 있으면 이름
/// 아래에 진행 막대를 그립니다.
class HoronFileUploadItem extends StatelessWidget {
  /// 파일 한 줄을 만듭니다.
  const HoronFileUploadItem({super.key, required this.file, this.onRemove, this.onRetry, this.icon, this.child});

  /// 항목을 찾는 키입니다.
  static const Key itemKey = ValueKey<String>('horon-file-upload-item');

  /// 제거 버튼을 찾는 키입니다.
  static const Key removeKey = ValueKey<String>('horon-file-upload-remove');

  /// 재시도 버튼을 찾는 키입니다.
  static const Key retryKey = ValueKey<String>('horon-file-upload-retry');

  /// 보여 줄 파일입니다.
  final HoronFileUploadFile file;

  /// 제거를 눌렀을 때 부르는 콜백입니다. null이면 제거 버튼이 없습니다.
  final VoidCallback? onRemove;

  /// 재시도를 눌렀을 때 부르는 콜백입니다. null이면 `error`에서도 재시도 버튼이 없습니다.
  final VoidCallback? onRetry;

  /// 아이콘 타일 내용을 직접 정합니다. 없으면 상태에 맞는 표시를 그립니다.
  final Widget? icon;

  /// 이름·크기 줄 대신 넣을 내용입니다. React의 `children` 자리입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isError = file.status == HoronFileUploadStatus.error;
    final Color descriptionColor = isError ? scheme.error.withValues(alpha: 0.8) : scheme.onSurfaceVariant;

    return Semantics(
      container: true,
      label: file.name,
      child: DecoratedBox(
        key: itemKey,
        decoration: BoxDecoration(
          color: scheme.surfaceContainerLow,
          borderRadius: BorderRadius.circular(_uploadItemRadius),
          border: Border.all(color: isError ? scheme.error.withValues(alpha: _uploadErrorBorderAlpha) : scheme.outline),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: _uploadItemPaddingHorizontal,
            vertical: _uploadItemPaddingVertical,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              _media(scheme),
              const SizedBox(width: _uploadItemGap),
              Expanded(child: child ?? _content(context, scheme, descriptionColor)),
              if (isError && onRetry != null) ...<Widget>[
                const SizedBox(width: HoronSpace.s1),
                HoronButton(
                  key: retryKey,
                  variant: HoronButtonVariant.ghost,
                  size: HoronButtonSize.xs,
                  label: horon.strings.retry,
                  onPressed: onRetry,
                ),
              ],
              if (onRemove != null) ...<Widget>[const SizedBox(width: HoronSpace.s1), _removeButton(context, horon)],
            ],
          ),
        ),
      ),
    );
  }

  Widget _media(ColorScheme scheme) {
    final bool isError = file.status == HoronFileUploadStatus.error;
    final Color foreground = isError ? scheme.error : scheme.onSurfaceVariant;
    final Widget content =
        icon ??
        switch (file.status) {
          HoronFileUploadStatus.uploading ||
          HoronFileUploadStatus.processing => HoronSpinner(size: _uploadIconSize, color: foreground),
          HoronFileUploadStatus.error => CustomPaint(
            size: const Size.square(_uploadIconSize),
            painter: _HoronAlertPainter(color: foreground),
          ),
          HoronFileUploadStatus.idle || HoronFileUploadStatus.done => CustomPaint(
            size: const Size.square(_uploadIconSize),
            painter: _HoronDocumentPainter(color: foreground),
          ),
        };

    return SizedBox.square(
      dimension: _uploadMediaSize,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: isError ? scheme.error.withValues(alpha: _uploadErrorBorderAlpha) : scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(_uploadRadius),
        ),
        child: Center(child: content),
      ),
    );
  }

  Widget _content(BuildContext context, ColorScheme scheme, Color descriptionColor) {
    final String? size = file.formattedSize;
    final String? description = switch (file.status) {
      HoronFileUploadStatus.error => file.errorMessage ?? HoronTheme.of(context).strings.uploadFailed,
      _ => size,
    };
    final bool showsProgress =
        (file.status == HoronFileUploadStatus.uploading || file.status == HoronFileUploadStatus.processing) &&
        file.progress != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: _uploadItemContentGap,
      children: <Widget>[
        Text(
          file.name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _uploadItemFontSize,
            fontWeight: HoronFontWeight.medium,
            height: HoronLineHeight.snug,
            color: scheme.onSurface,
            decoration: TextDecoration.none,
          ),
        ),
        if (description != null)
          Text(
            description,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontFamily: HoronFont.body,
              fontFamilyFallback: HoronFont.fontFamilyFallback,
              fontSize: _uploadDescriptionFontSize,
              height: HoronLineHeight.normal,
              color: descriptionColor,
              fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
              decoration: TextDecoration.none,
            ),
          ),
        if (showsProgress)
          Padding(
            padding: const EdgeInsets.only(top: HoronSpace.s1),
            child: HoronProgress(value: file.progress),
          ),
      ],
    );
  }

  /// 오른쪽 제거 버튼입니다. React는 `ghost` 변형의 `icon-xs` 버튼입니다.
  Widget _removeButton(BuildContext context, HoronThemeData horon) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Semantics(
      button: true,
      label: '${horon.strings.remove}: ${file.name}',
      child: GestureDetector(
        key: removeKey,
        behavior: HitTestBehavior.opaque,
        onTap: onRemove,
        child: SizedBox.square(
          dimension: HoronButtonMetrics.heightIconXs,
          child: Center(
            child: CustomPaint(
              size: const Size.square(HoronSpace.s3),
              painter: _HoronClosePainter(color: scheme.onSurfaceVariant),
            ),
          ),
        ),
      ),
    );
  }
}

/// 파일 아이콘(lucide `file-text`)을 선으로 그립니다.
class _HoronDocumentPainter extends CustomPainter {
  const _HoronDocumentPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 2 / 24
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    // lucide `file-text`: 페이지 윤곽과 접힌 모서리, 두 줄.
    final double inset = size.width * 4 / 24;
    final Rect page = Rect.fromLTRB(inset, inset * 0.5, size.width - inset, size.height - inset * 0.5);
    final Path outline = Path()
      ..moveTo(page.left + page.width * 0.25, page.top)
      ..lineTo(page.right - page.width * 0.2, page.top)
      ..lineTo(page.right, page.top + page.height * 0.2)
      ..lineTo(page.right, page.bottom)
      ..lineTo(page.left, page.bottom)
      ..lineTo(page.left, page.top + page.height * 0.25)
      ..close();
    canvas.drawPath(outline, stroke);

    final double lineY1 = page.top + page.height * 0.55;
    final double lineY2 = page.top + page.height * 0.75;
    canvas.drawLine(
      Offset(page.left + page.width * 0.25, lineY1),
      Offset(page.right - page.width * 0.25, lineY1),
      stroke,
    );
    canvas.drawLine(
      Offset(page.left + page.width * 0.25, lineY2),
      Offset(page.right - page.width * 0.25, lineY2),
      stroke,
    );
  }

  @override
  bool shouldRepaint(_HoronDocumentPainter oldDelegate) => color != oldDelegate.color;
}

/// 경고 아이콘(lucide `circle-alert`)을 선으로 그립니다.
class _HoronAlertPainter extends CustomPainter {
  const _HoronAlertPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 2 / 24
      ..strokeCap = StrokeCap.round;
    final double radius = size.shortestSide * 10 / 24;
    final Offset center = size.center(Offset.zero);
    canvas.drawCircle(center, radius, stroke);
    canvas.drawLine(Offset(center.dx, center.dy - radius * 0.45), Offset(center.dx, center.dy + radius * 0.1), stroke);
    canvas.drawCircle(Offset(center.dx, center.dy + radius * 0.55), stroke.strokeWidth * 0.6, Paint()..color = color);
  }

  @override
  bool shouldRepaint(_HoronAlertPainter oldDelegate) => color != oldDelegate.color;
}

/// 닫기 아이콘(lucide `x`)을 선 두 개로 그립니다.
class _HoronClosePainter extends CustomPainter {
  const _HoronClosePainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 2 / 24
      ..strokeCap = StrokeCap.round;
    final double inset = size.width * 6 / 24;
    canvas.drawLine(Offset(inset, inset), Offset(size.width - inset, size.height - inset), stroke);
    canvas.drawLine(Offset(size.width - inset, inset), Offset(inset, size.height - inset), stroke);
  }

  @override
  bool shouldRepaint(_HoronClosePainter oldDelegate) => color != oldDelegate.color;
}

/// 점선 둥근 사각 테두리를 그립니다.
///
/// React의 `border-dashed`는 브라우저가 그리므로 Flutter에는 같은 장식이 없습니다.
/// 둥근 사각 경로를 따라 조각과 틈을 번갈아 칠해 같은 모양을 만듭니다.
class _HoronDashedBorderPainter extends CustomPainter {
  const _HoronDashedBorderPainter({
    required this.color,
    required this.radius,
    required this.dashLength,
    required this.gapLength,
  });

  final Color color;
  final double radius;
  final double dashLength;
  final double gapLength;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    final Path source = Path()
      ..addRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(0.5, 0.5, size.width - 1, size.height - 1), Radius.circular(radius)),
      );

    for (final PathMetric metric in source.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double end = (distance + dashLength).clamp(0, metric.length);
        canvas.drawPath(metric.extractPath(distance, end), stroke);
        distance = end + gapLength;
      }
    }
  }

  @override
  bool shouldRepaint(_HoronDashedBorderPainter oldDelegate) =>
      color != oldDelegate.color ||
      radius != oldDelegate.radius ||
      dashLength != oldDelegate.dashLength ||
      gapLength != oldDelegate.gapLength;
}
