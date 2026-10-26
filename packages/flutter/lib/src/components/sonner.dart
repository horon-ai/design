import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'spinner.dart';

/// sonner 카드가 스스로 닫히는 기본 시간입니다.
///
/// `sonner` 라이브러리의 `duration` 기본값 4000ms입니다. 이 값이 0이면 카드가
/// 스스로 닫히지 않으므로, 계약은 0을 기본값으로 두지 못하게 합니다.
const Duration horonSonnerDefaultDuration = Duration(milliseconds: 4000);

/// sonner 카드의 폭입니다. sonner CSS의 `--width: 356px`입니다.
const double _sonnerWidth = 356.0;

/// 화면 가장자리와 스택 사이의 여백입니다. sonner CSS의 `--offset: 32px`입니다.
const double _sonnerOffset = HoronSpace.s8;

/// 겹친 카드 사이에서 뒤 카드가 비켜나는 거리입니다. sonner의 14px입니다.
const double _sonnerPeek = HoronSpace.s3_5;

/// 뒤로 갈수록 줄어드는 비율입니다. sonner의 접힌 스택과 같은 0.05입니다.
const double _sonnerScaleStep = 0.05;

/// 카드 안쪽 여백입니다. sonner CSS의 `padding: 16px`입니다.
const double _sonnerPadding = HoronSpace.s4;

/// 아이콘과 글자 사이의 간격입니다. sonner CSS의 `gap: 6px`입니다.
const double _sonnerGap = HoronSpace.s1_5;

/// 제목과 설명 사이의 간격입니다.
const double _sonnerTitleGap = HoronSpace.s0_5;

/// `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값입니다.
const double _sonnerFontSize = 13.0;

/// 상태 표시의 지름입니다.
const double _sonnerIconSize = 16.0;

/// 스와이프로 닫히는 거리입니다. sonner가 쓰는 45px입니다.
const double _sonnerSwipeThreshold = 45.0;

/// 이 속도를 넘기면 짧게 밀어도 닫힙니다.
const double _sonnerSwipeVelocity = 400.0;

/// 스택에 한 번에 보이는 카드 수입니다. sonner의 `visibleToasts` 기본값 3입니다.
const int _sonnerStackLimit = 3;

/// sonner 카드가 보여 주는 상태입니다.
///
/// `sonner.tsx`에는 `variants:` 블록이 없습니다. 이 값은 cva 변형이 아니라
/// promise의 상태 기계(loading → success/error)이고, 계획이 그 세 상태를 이름으로
/// 지정했습니다. 그래서 변형 어휘 게이트는 sonner를 비교 대상에서 건너뜁니다.
enum HoronSonnerToastState {
  /// 상태 표시가 없는 보통 카드입니다.
  normal,

  /// promise가 아직 끝나지 않았습니다. 스피너가 돌고 스스로 닫히지 않습니다.
  loading,

  /// promise가 성공했습니다. 체크 표시가 붙습니다.
  success,

  /// promise가 실패했습니다. X 표시가 붙습니다.
  error,
}

/// 카드가 화면 어느 모서리에 쌓이는지 나타냅니다.
///
/// sonner의 `position` prop과 같은 여섯 값입니다. React `sonner.tsx`에는
/// `variants:` 블록이 없으므로 변형 어휘가 아니라 배치 값입니다.
enum HoronSonnerPosition {
  /// 왼쪽 위.
  topLeft,

  /// 가운데 위.
  topCenter,

  /// 오른쪽 위.
  topRight,

  /// 왼쪽 아래.
  bottomLeft,

  /// 가운데 아래.
  bottomCenter,

  /// 오른쪽 아래. sonner의 기본값입니다.
  bottomRight;

  /// 카드를 위에서부터 쌓는지 여부입니다.
  bool get anchorsTop =>
      this == HoronSonnerPosition.topLeft ||
      this == HoronSonnerPosition.topCenter ||
      this == HoronSonnerPosition.topRight;

  /// 스택의 정렬입니다.
  Alignment get alignment => switch (this) {
    HoronSonnerPosition.topLeft => Alignment.topLeft,
    HoronSonnerPosition.topCenter => Alignment.topCenter,
    HoronSonnerPosition.topRight => Alignment.topRight,
    HoronSonnerPosition.bottomLeft => Alignment.bottomLeft,
    HoronSonnerPosition.bottomCenter => Alignment.bottomCenter,
    HoronSonnerPosition.bottomRight => Alignment.bottomRight,
  };
}

/// sonner 카드 하나가 보여 줄 내용입니다.
///
/// [duration]의 기본값은 [horonSonnerDefaultDuration](4000ms)이고, null이면
/// 스스로 닫히지 않습니다. [HoronSonnerToastState.loading]인 카드는 값이 있어도
/// 닫히지 않습니다. promise가 끝나 [HoronSonnerToastState.success]나
/// [HoronSonnerToastState.error]로 바뀌는 순간부터 시간이 흐릅니다.
///
/// ```dart
/// const HoronSonnerToastData(
///   title: '동기화했습니다',
///   description: '마지막 변경 3건을 올렸습니다.',
///   state: HoronSonnerToastState.success,
/// );
/// ```
@immutable
class HoronSonnerToastData {
  /// 카드 하나의 내용을 만듭니다.
  const HoronSonnerToastData({
    this.title,
    this.description,
    this.state = HoronSonnerToastState.normal,
    this.icon,
    this.actionLabel,
    this.onAction,
    this.duration = horonSonnerDefaultDuration,
  });

  /// 제목입니다. `text-[13px] font-semibold`입니다.
  final String? title;

  /// 설명입니다. `text-[13px] text-muted-foreground`입니다.
  final String? description;

  /// 상태입니다. 아이콘과 자동 닫힘 여부를 정합니다.
  final HoronSonnerToastState state;

  /// 상태 표시 대신 쓸 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 액션 버튼의 글자입니다. null이면 버튼을 그리지 않습니다.
  final String? actionLabel;

  /// 액션 버튼을 눌렀을 때 부르는 콜백입니다.
  final VoidCallback? onAction;

  /// 자동 닫힘까지의 시간입니다. null이면 닫히지 않습니다.
  final Duration? duration;
}

/// 목록에 들어간 sonner 카드 하나입니다.
@immutable
class HoronSonnerToastEntry {
  /// 목록 항목 하나를 만듭니다.
  const HoronSonnerToastEntry({required this.id, required this.data});

  /// 컨트롤러가 붙인 식별자입니다.
  final String id;

  /// 보여 줄 내용입니다.
  final HoronSonnerToastData data;
}

/// sonner 카드 목록을 들고 있는 컨트롤러입니다.
///
/// `sonner.tsx`가 내보내는 `sonnerToast` 함수의 자리입니다. React는 모듈 전역
/// 함수를 쓰지만, Flutter에서는 호스트가 인스턴스를 만들어
/// [HoronSonnerToaster]에 넘깁니다.
///
/// ```dart
/// final HoronSonnerController controller = HoronSonnerController();
/// controller.show(const HoronSonnerToastData(title: '저장했습니다'));
/// unawaited(
///   controller.promise<int>(
///     upload(),
///     loading: '올리는 중',
///     success: (int count) => '$count건을 올렸습니다',
///     error: (Object error) => '올리지 못했습니다',
///   ),
/// );
/// ```
class HoronSonnerController extends ChangeNotifier {
  final List<HoronSonnerToastEntry> _entries = <HoronSonnerToastEntry>[];
  int _nextId = 0;

  /// 지금 보이는 카드입니다. 먼저 넣은 것이 앞에 옵니다.
  List<HoronSonnerToastEntry> get toasts => List<HoronSonnerToastEntry>.unmodifiable(_entries);

  /// 카드 하나를 넣고 그 식별자를 돌려줍니다.
  String show(HoronSonnerToastData data) {
    assert(
      data.duration == null || data.duration! > Duration.zero,
      'HoronSonnerController.show: duration must be null or greater than zero; '
      'zero would close the card the moment it appears.',
    );
    final String id = 'horon-sonner-${_nextId++}';
    _entries.add(HoronSonnerToastEntry(id: id, data: data));
    // 스택 상한을 넘으면 가장 오래된 카드를 목록에서 뺍니다. 화면에서도 빠지므로
    // 그 카드의 자동 닫힘 타이머도 함께 정리됩니다.
    while (_entries.length > _sonnerStackLimit) {
      _entries.removeAt(0);
    }
    notifyListeners();
    return id;
  }

  /// [id]의 카드 내용을 바꿉니다. 없는 식별자면 아무 일도 하지 않습니다.
  ///
  /// promise가 끝났을 때 로딩 카드를 성공·실패 카드로 바꾸는 자리입니다.
  void update(String id, HoronSonnerToastData data) {
    assert(
      data.duration == null || data.duration! > Duration.zero,
      'HoronSonnerController.update: duration must be null or greater than zero.',
    );
    final int index = _entries.indexWhere((HoronSonnerToastEntry entry) => entry.id == id);
    if (index < 0) return;
    _entries[index] = HoronSonnerToastEntry(id: id, data: data);
    notifyListeners();
  }

  /// [id]의 카드를 닫습니다. 없는 식별자면 아무 일도 하지 않습니다.
  void dismiss(String id) {
    final int index = _entries.indexWhere((HoronSonnerToastEntry entry) => entry.id == id);
    if (index < 0) return;
    _entries.removeAt(index);
    notifyListeners();
  }

  /// 목록을 비웁니다.
  void clear() {
    if (_entries.isEmpty) return;
    _entries.clear();
    notifyListeners();
  }

  /// promise 하나를 `loading` → `success`/`error`로 옮기는 카드를 띄웁니다.
  ///
  /// sonner의 `toast.promise(promise, { loading, success, error })`를 옮긴 것입니다.
  /// 로딩 카드는 promise가 끝날 때까지 닫히지 않고, 끝나면 성공·실패 문구로 바뀌며
  /// 그때부터 [horonSonnerDefaultDuration]이 흐릅니다. promise의 오류는 삼키지 않고
  /// 그대로 다시 던집니다.
  ///
  /// 카드가 promise보다 먼저 닫히면(사용자가 스와이프로 지운 경우) 결과는 목록에
  /// 다시 나타나지 않습니다.
  Future<T> promise<T>(
    Future<T> future, {
    required String loading,
    required String Function(T value) success,
    required String Function(Object error) error,
    String? loadingDescription,
    Duration? duration = horonSonnerDefaultDuration,
  }) async {
    final String id = show(
      HoronSonnerToastData(
        title: loading,
        description: loadingDescription,
        state: HoronSonnerToastState.loading,
        duration: duration,
      ),
    );
    try {
      final T value = await future;
      update(id, HoronSonnerToastData(title: success(value), state: HoronSonnerToastState.success, duration: duration));
      return value;
    } catch (exception) {
      update(id, HoronSonnerToastData(title: error(exception), state: HoronSonnerToastState.error, duration: duration));
      rethrow;
    }
  }
}

/// sonner 카드를 화면 모서리에 겹쳐 쌓는 토스터입니다.
///
/// `sonner.tsx`의 `SonnerToaster`를 옮긴 것입니다. 폭 356, 가장자리 여백 32,
/// 뒤 카드가 14만큼 비켜나며 0.05씩 작아지는 접힌 스택입니다. 표면은 유리가 아니라
/// `--normal-bg: var(--popover)`입니다. React가 지정한 그대로 popover 채움과
/// `border` 테두리, `rounded-md`를 씁니다.
///
/// 화면 전체를 덮는 `Stack`의 자식으로 놓습니다. 토스터는 남는 공간을 다 쓰고
/// 카드를 고른 모서리에 붙이므로, `Positioned.fill` 안에 넣으면 화면 기준으로
/// 자리 잡습니다.
///
/// ```dart
/// Stack(children: <Widget>[
///   const Screen(),
///   Positioned.fill(child: HoronSonnerToaster(controller: controller)),
/// ]);
/// ```
class HoronSonnerToaster extends StatelessWidget {
  /// 토스터 하나를 만듭니다.
  const HoronSonnerToaster({
    super.key,
    required this.controller,
    this.position = HoronSonnerPosition.bottomRight,
    this.width = _sonnerWidth,
    this.offset = _sonnerOffset,
  });

  /// [id]의 카드를 찾는 키를 만듭니다.
  static Key cardKeyFor(String id) => ValueKey<String>('horon-sonner-$id');

  /// 목록을 들고 있는 컨트롤러입니다.
  final HoronSonnerController controller;

  /// 쌓이는 모서리입니다.
  final HoronSonnerPosition position;

  /// 카드의 폭입니다. 기본값은 sonner의 356입니다.
  final double width;

  /// 화면 가장자리와 스택 사이의 여백입니다. 기본값은 sonner의 32입니다.
  final double offset;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: controller,
      builder: (BuildContext context, Widget? child) {
        final List<HoronSonnerToastEntry> entries = controller.toasts;
        if (entries.isEmpty) return const SizedBox.shrink();

        final List<HoronSonnerToastEntry> newestFirst = entries.reversed.toList();
        final int count = math.min(newestFirst.length, _sonnerStackLimit);
        final Alignment alignment = position.alignment;
        final bool top = position.anchorsTop;

        // 뒤에 있는 카드부터 그립니다. 마지막에 그린 카드가 맨 앞입니다.
        final List<Widget> cards = <Widget>[
          for (int index = count - 1; index >= 0; index--)
            Transform.translate(
              offset: Offset(0, (top ? 1 : -1) * index * _sonnerPeek),
              child: Transform.scale(
                scale: math.max(0.0, 1 - index * _sonnerScaleStep),
                alignment: alignment,
                child: HoronSonnerToast(
                  key: cardKeyFor(newestFirst[index].id),
                  data: newestFirst[index].data,
                  onDismiss: () => controller.dismiss(newestFirst[index].id),
                ),
              ),
            ),
        ];

        return Align(
          alignment: alignment,
          child: Padding(
            padding: EdgeInsets.all(offset),
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: width),
              child: SizedBox(
                width: double.infinity,
                child: Stack(alignment: alignment, clipBehavior: Clip.none, children: cards),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// sonner 카드 하나입니다.
///
/// sonner의 토스트 한 장입니다. popover 표면 위에 상태 표시·제목·설명·닫기를
/// 놓고, 가로로 밀면 닫힙니다. 닫힘 거리는 45px이고, 그보다 짧아도 400px/s보다
/// 빠르면 닫힙니다.
///
/// [HoronSonnerToastData.duration]이 지나면 스스로 닫힙니다. 로딩 상태는 예외로,
/// promise가 끝날 때까지 남습니다.
class HoronSonnerToast extends StatefulWidget {
  /// 카드 하나를 만듭니다.
  const HoronSonnerToast({super.key, required this.data, this.onDismiss, this.closeIcon});

  /// 로딩 표시를 찾는 테스트용 키입니다.
  static const Key loadingKey = ValueKey<String>('horon-sonner-loading');

  /// 성공 표시를 찾는 테스트용 키입니다.
  static const Key successKey = ValueKey<String>('horon-sonner-success');

  /// 실패 표시를 찾는 테스트용 키입니다.
  static const Key errorKey = ValueKey<String>('horon-sonner-error');

  /// 닫기 버튼을 찾는 테스트용 키입니다.
  static const Key closeKey = ValueKey<String>('horon-sonner-close');

  /// 보여 줄 내용입니다.
  final HoronSonnerToastData data;

  /// 카드를 닫을 때 부르는 콜백입니다. null이면 닫기 버튼과 스와이프를 끕니다.
  final VoidCallback? onDismiss;

  /// 닫기 버튼의 아이콘입니다. 없으면 이 패키지가 X를 직접 그립니다.
  final Widget? closeIcon;

  @override
  State<HoronSonnerToast> createState() => _HoronSonnerToastState();
}

class _HoronSonnerToastState extends State<HoronSonnerToast> {
  Timer? _timer;
  double _dragOffset = 0;
  bool _dragging = false;

  @override
  void initState() {
    super.initState();
    _restartTimer();
  }

  @override
  void didUpdateWidget(covariant HoronSonnerToast oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.data.duration != oldWidget.data.duration || widget.data.state != oldWidget.data.state) {
      _restartTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _restartTimer() {
    _timer?.cancel();
    _timer = null;
    // 로딩 카드는 promise가 끝날 때까지 남습니다. sonner도 같은 규칙입니다.
    if (widget.data.state == HoronSonnerToastState.loading) return;
    final Duration? duration = widget.data.duration;
    if (duration == null) return;
    _timer = Timer(duration, () {
      if (mounted) widget.onDismiss?.call();
    });
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    setState(() {
      _dragging = true;
      _dragOffset += details.delta.dx;
    });
  }

  void _handleDragEnd(DragEndDetails details) {
    final bool farEnough = _dragOffset.abs() > _sonnerSwipeThreshold;
    final bool fastEnough = details.velocity.pixelsPerSecond.dx.abs() > _sonnerSwipeVelocity;
    // 어느 쪽으로 밀어도 닫힙니다. 손가락이 가는 쪽을 막으면 제스처가 실패한 것처럼
    // 느껴지고, sonner도 위치에 따라 한 방향만 받지 않습니다.
    if (farEnough || fastEnough) {
      widget.onDismiss?.call();
      return;
    }
    setState(() {
      _dragging = false;
      _dragOffset = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Widget? status = _statusIndicator(context);
    final VoidCallback? onDismiss = widget.onDismiss;

    final Widget card = DecoratedBox(
      decoration: BoxDecoration(
        // sonner의 `--normal-bg: var(--popover)`입니다. 테마는 popover를
        // `surfaceContainerHigh`에 매핑합니다.
        color: scheme.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
        border: Border.all(color: scheme.outline),
        boxShadow: HoronShadow.md,
      ),
      child: Padding(
        padding: const EdgeInsets.all(_sonnerPadding),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            if (status != null) ...<Widget>[status, const SizedBox(width: _sonnerGap)],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  if (widget.data.title != null) HoronSonnerTitle(widget.data.title!),
                  if (widget.data.title != null && widget.data.description != null)
                    const SizedBox(height: _sonnerTitleGap),
                  if (widget.data.description != null) HoronSonnerDescription(widget.data.description!),
                  if (widget.data.actionLabel != null) ...<Widget>[
                    const SizedBox(height: HoronSpace.s2),
                    HoronButton(
                      label: widget.data.actionLabel!,
                      size: HoronButtonSize.sm,
                      onPressed: widget.data.onAction,
                    ),
                  ],
                ],
              ),
            ),
            if (onDismiss != null) ...<Widget>[
              const SizedBox(width: _sonnerGap),
              HoronSonnerClose(key: HoronSonnerToast.closeKey, icon: widget.closeIcon, onPressed: onDismiss),
            ],
          ],
        ),
      ),
    );

    final Widget interactive = onDismiss == null
        ? card
        : GestureDetector(
            behavior: HitTestBehavior.opaque,
            onHorizontalDragUpdate: _handleDragUpdate,
            onHorizontalDragEnd: _handleDragEnd,
            child: card,
          );

    return AnimatedContainer(
      duration: _dragging ? Duration.zero : Duration(milliseconds: HoronDuration.normal),
      curve: HoronEasing.outCubic,
      transform: Matrix4.translationValues(_dragOffset, 0, 0),
      child: interactive,
    );
  }

  /// 상태 표시를 만듭니다. 로딩은 스피너, 성공·실패는 직접 그린 표시입니다.
  Widget? _statusIndicator(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final Widget? custom = widget.data.icon;
    final Widget? glyph = switch (widget.data.state) {
      HoronSonnerToastState.normal => null,
      HoronSonnerToastState.loading => HoronSpinner(
        key: HoronSonnerToast.loadingKey,
        size: _sonnerIconSize,
        color: scheme.onSurfaceVariant,
      ),
      HoronSonnerToastState.success => CustomPaint(
        key: HoronSonnerToast.successKey,
        size: const Size.square(_sonnerIconSize),
        painter: HoronSonnerGlyphPainter(kind: HoronSonnerGlyph.check, color: horon.success),
      ),
      HoronSonnerToastState.error => CustomPaint(
        key: HoronSonnerToast.errorKey,
        size: const Size.square(_sonnerIconSize),
        painter: HoronSonnerGlyphPainter(kind: HoronSonnerGlyph.cross, color: scheme.error),
      ),
    };
    final Widget? resolved = custom ?? glyph;
    if (resolved == null) return null;
    return SizedBox.square(
      dimension: _sonnerIconSize,
      child: Center(child: ExcludeSemantics(child: resolved)),
    );
  }
}

/// sonner 카드의 제목입니다. `text-[13px] font-semibold`입니다.
class HoronSonnerTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronSonnerTitle(this.title, {super.key});

  /// 제목 글자입니다.
  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _sonnerFontSize,
        fontWeight: HoronFontWeight.semibold,
        height: HoronLineHeight.snug,
        color: Theme.of(context).colorScheme.onSurface,
      ),
    );
  }
}

/// sonner 카드의 설명입니다. `text-[13px] text-muted-foreground`입니다.
class HoronSonnerDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronSonnerDescription(this.description, {super.key});

  /// 설명 글자입니다.
  final String description;

  @override
  Widget build(BuildContext context) {
    return Text(
      description,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _sonnerFontSize,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.snug,
        color: Theme.of(context).colorScheme.onSurfaceVariant,
      ),
    );
  }
}

/// sonner 카드의 닫기 버튼입니다.
///
/// sonner의 `closeButton`은 `bg-popover text-muted-foreground`입니다. 이 패키지는
/// 아이콘 폰트를 번들하지 않으므로 X를 직접 그리고, 호스트가 [icon]을 넘기면
/// 그것을 씁니다.
class HoronSonnerClose extends StatelessWidget {
  /// 닫기 버튼 하나를 만듭니다.
  const HoronSonnerClose({super.key, this.onPressed, this.icon});

  /// 닫기 글리프의 기본 크기입니다.
  static const double glyphSize = _sonnerIconSize;

  /// 누르면 부르는 콜백입니다.
  final VoidCallback? onPressed;

  /// X 대신 쓸 아이콘입니다.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final Color color = Theme.of(context).colorScheme.onSurfaceVariant;
    return _SonnerIconButton(
      onPressed: onPressed,
      icon:
          icon ??
          CustomPaint(
            size: const Size.square(glyphSize),
            painter: HoronSonnerGlyphPainter(kind: HoronSonnerGlyph.cross, color: color),
          ),
    );
  }
}

/// 닫기 버튼의 표면입니다. sonner는 버튼 테두리와 배경을 따로 두지 않으므로
/// 24px 정사각형에 아이콘만 놓고, 누르면 배경이 옅게 깔립니다.
class _SonnerIconButton extends StatelessWidget {
  const _SonnerIconButton({required this.onPressed, required this.icon});

  final VoidCallback? onPressed;
  final Widget icon;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Semantics(
      button: true,
      label: HoronTheme.of(context).strings.close,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onPressed,
        child: SizedBox.square(
          dimension: HoronSpace.s6,
          child: Center(
            child: IconTheme.merge(
              data: IconThemeData(size: _sonnerIconSize, color: scheme.onSurfaceVariant),
              child: icon,
            ),
          ),
        ),
      ),
    );
  }
}

/// 직접 그리는 상태 표시의 종류입니다.
enum HoronSonnerGlyph {
  /// 원 안의 체크입니다.
  check,

  /// X입니다.
  cross,
}

/// 상태 표시를 선으로 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않으므로(`icon_slot.dart`), sonner가 쓰는
/// lucide `circle-check`과 `x`를 같은 두께의 선으로 옮겨 그립니다.
class HoronSonnerGlyphPainter extends CustomPainter {
  /// 표시 하나를 그리는 페인터를 만듭니다.
  const HoronSonnerGlyphPainter({required this.kind, required this.color});

  /// 그릴 표시입니다.
  final HoronSonnerGlyph kind;

  /// 선 색입니다.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 2 / 24
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    if (kind == HoronSonnerGlyph.cross) {
      final double inset = size.width * 6 / 24;
      canvas.drawLine(Offset(inset, inset), Offset(size.width - inset, size.height - inset), stroke);
      canvas.drawLine(Offset(size.width - inset, inset), Offset(inset, size.height - inset), stroke);
      return;
    }

    canvas.drawCircle(size.center(Offset.zero), size.shortestSide * 10 / 24, stroke);
    canvas.drawPath(
      Path()
        ..moveTo(size.width * 7.5 / 24, size.height * 12.5 / 24)
        ..lineTo(size.width * 10.5 / 24, size.height * 15.5 / 24)
        ..lineTo(size.width * 16.5 / 24, size.height * 9 / 24),
      stroke,
    );
  }

  @override
  bool shouldRepaint(HoronSonnerGlyphPainter oldDelegate) => color != oldDelegate.color || kind != oldDelegate.kind;
}
