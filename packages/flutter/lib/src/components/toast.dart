import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'glass_surface.dart';

/// 토스트가 스스로 닫히는 기본 시간입니다.
///
/// `toast.tsx`는 Base UI `Toast.Provider`의 `timeout`을 그대로 씁니다. 이 패키지는
/// 그 자리에 5000ms를 두고, 0을 기본값으로 두지 않습니다. 스스로 닫히지 않는
/// 토스트는 [HoronToastData.duration]에 `null`을 넘겨 명시합니다.
const Duration horonToastDefaultDuration = Duration(milliseconds: 5000);

/// `toast.tsx`의 `inset-x-4`·`bottom-4`입니다.
const double _viewportInset = HoronSpace.s4;

/// `toast.tsx`의 `max-w-sm`(384px)입니다.
const double _viewportMaxWidth = 384.0;

/// `toast.tsx`의 `--peek: 0.75rem`입니다. 뒤 카드가 비켜나는 거리입니다.
const double _toastPeek = HoronSpace.s3;

/// `toast.tsx`의 `--scale: calc(max(0, 1-(var(--toast-index)*0.1)))`입니다.
const double _toastScaleStep = 0.1;

/// `toast.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값입니다.
const double _toastFontSize = 13.0;

/// `toast.tsx`의 `[&_svg]:size-[15px]`입니다.
const double _toastIconSize = 15.0;

/// `toast.tsx`의 `gap-2.5`입니다.
const double _toastRowGap = HoronSpace.s2_5;

/// `toast.tsx`의 `gap-1`입니다.
const double _toastColumnGap = HoronSpace.s1;

/// `toast.tsx`의 `p-3`입니다.
const double _toastPadding = HoronSpace.s3;

/// 뷰포트가 카드를 쌓는 쪽입니다.
///
/// `toast.tsx`에는 `variants:` 블록이 없으므로 공개 enum을 두지 않습니다.
/// [HoronToastViewport]와 [HoronToastViewport.top]이 이 값을 고릅니다.
enum _HoronToastEdge { top, bottom }

/// 토스트 하나가 보여 줄 내용입니다.
///
/// 아이콘은 호스트가 [icon]으로 넘깁니다. `toast.tsx`는 `type`(`success`·`info`·
/// `warning`·`error`·`loading`)에 따라 lucide 아이콘을 고르지만, 이 패키지는
/// 아이콘 폰트를 번들하지 않으므로(계약: `icon_slot.dart`) 기본 아이콘을 강제하지
/// 않습니다.
///
/// [duration]의 기본값은 [horonToastDefaultDuration](5000ms)이고, `null`이면
/// 스스로 닫히지 않습니다. 값이 있으면 0보다 커야 합니다. 0은 "닫히지 않음"이
/// 아니라 "즉시 닫힘"이라 계획이 기본값으로 두지 못하게 한 값입니다.
///
/// ```dart
/// const HoronToastData(
///   title: '일정을 저장했습니다',
///   description: '오후 3시에 알려 드립니다.',
///   actionLabel: '되돌리기',
/// );
/// ```
@immutable
class HoronToastData {
  /// 토스트 하나의 내용을 만듭니다.
  const HoronToastData({
    this.title,
    this.description,
    this.icon,
    this.actionLabel,
    this.onAction,
    this.duration = horonToastDefaultDuration,
  });

  /// 제목입니다. `text-[13px] font-semibold`입니다.
  final String? title;

  /// 설명입니다. `text-[13px] text-muted-foreground`입니다.
  final String? description;

  /// 제목 앞에 놓는 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 액션 버튼의 글자입니다. null이면 버튼을 그리지 않습니다.
  final String? actionLabel;

  /// 액션 버튼을 눌렀을 때 부르는 콜백입니다.
  ///
  /// 액션을 누르면 자동 닫힘이 취소됩니다(계획의 실패 시나리오).
  final VoidCallback? onAction;

  /// 자동 닫힘까지의 시간입니다. null이면 닫히지 않습니다.
  final Duration? duration;
}

/// 목록에 들어간 토스트 하나입니다.
///
/// [id]는 컨트롤러가 붙입니다. 같은 토스트를 닫을 때 쓰는 손잡이입니다.
@immutable
class HoronToastEntry {
  /// 목록 항목 하나를 만듭니다.
  const HoronToastEntry({required this.id, required this.data});

  /// 컨트롤러가 붙인 식별자입니다.
  final String id;

  /// 보여 줄 내용입니다.
  final HoronToastData data;
}

/// 토스트 목록을 들고 있는 컨트롤러입니다.
///
/// `toast.tsx`의 `createToastManager()`가 만드는 매니저를 옮긴 것입니다. React는
/// 모듈 전역 매니저를 쓰지만, Flutter에서는 호스트가 인스턴스를 만들어
/// [HoronToastProvider]에 넘깁니다. 화면마다 다른 목록을 가질 수 있고, 테스트가
/// 같은 목록을 직접 검사할 수 있습니다.
///
/// ```dart
/// final HoronToastController controller = HoronToastController();
/// controller.show(const HoronToastData(title: '저장했습니다'));
/// ```
class HoronToastController extends ChangeNotifier {
  final List<HoronToastEntry> _entries = <HoronToastEntry>[];
  int _nextId = 0;

  /// 지금 보이는 토스트입니다. 먼저 넣은 것이 앞에 옵니다.
  List<HoronToastEntry> get toasts => List<HoronToastEntry>.unmodifiable(_entries);

  /// 토스트 하나를 넣고 그 식별자를 돌려줍니다.
  String show(HoronToastData data) {
    assert(
      data.duration == null || data.duration! > Duration.zero,
      'HoronToastController.show: duration must be null or greater than zero; '
      'zero would close the toast the moment it appears.',
    );
    final String id = 'horon-toast-${_nextId++}';
    _entries.add(HoronToastEntry(id: id, data: data));
    notifyListeners();
    return id;
  }

  /// [id]의 토스트를 닫습니다. 없는 식별자면 아무 일도 하지 않습니다.
  void dismiss(String id) {
    final int index = _entries.indexWhere((HoronToastEntry entry) => entry.id == id);
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
}

/// 컨트롤러를 아래 위젯에 내려 주는 범위입니다.
///
/// `toast.tsx`의 `ToastProvider` 자리입니다. React는 자식 트리 전체를 감싸고
/// 포털을 따로 두지만, Flutter에서는 화면의 `Stack` 위에 [HoronToastViewport]를
/// 한 장 얹는 쪽이 자연스럽습니다.
class HoronToastProvider extends InheritedNotifier<HoronToastController> {
  /// 컨트롤러를 내려 주는 범위를 만듭니다.
  const HoronToastProvider({super.key, required HoronToastController controller, required super.child})
    : super(notifier: controller);

  /// 가장 가까운 컨트롤러를 돌려줍니다.
  static HoronToastController of(BuildContext context) {
    final HoronToastController? controller = maybeOf(context);
    if (controller == null) {
      throw StateError(
        'No HoronToastController in the widget tree. Wrap the screen in '
        'HoronToastProvider(controller: ...) before using HoronToastViewport.',
      );
    }
    return controller;
  }

  /// 가장 가까운 컨트롤러를 돌려줍니다. 없으면 null입니다.
  static HoronToastController? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HoronToastProvider>()?.notifier;
}

/// 토스트를 화면 가장자리에 쌓아 보여 주는 뷰포트입니다.
///
/// `toast.tsx`의 `ToastViewport` + `ToastPortal` + `ToastList`를 합친 자리입니다.
/// 폭은 `max-w-sm`(384)이고 여백은 `inset-x-4`·`bottom-4`(16)입니다. 카드는
/// 아래(또는 위)에서부터 `--peek`(12)만큼 비켜나며 0.1씩 작아집니다.
///
/// 화면 전체를 덮는 `Stack`의 자식으로 놓습니다. 뷰포트는 남는 공간을 다 쓰고
/// 카드를 고른 가장자리에 붙이므로, `Positioned.fill` 안에 넣으면 화면 기준으로
/// 자리 잡습니다.
///
/// ```dart
/// Stack(children: <Widget>[
///   const Screen(),
///   Positioned.fill(
///     child: HoronToastProvider(
///       controller: controller,
///       child: const HoronToastViewport(),
///     ),
///   ),
/// ]);
/// ```
class HoronToastViewport extends StatelessWidget {
  /// 아래쪽에 쌓는 뷰포트를 만듭니다(`bottom-4`).
  const HoronToastViewport({
    super.key,
    this.maxWidth = _viewportMaxWidth,
    this.padding = const EdgeInsets.all(_viewportInset),
  }) : _edge = _HoronToastEdge.bottom;

  /// 위쪽에 쌓는 뷰포트를 만듭니다. 계획의 "위·아래 배치" 중 위쪽입니다.
  const HoronToastViewport.top({
    super.key,
    this.maxWidth = _viewportMaxWidth,
    this.padding = const EdgeInsets.all(_viewportInset),
  }) : _edge = _HoronToastEdge.top;

  /// 스택의 폭 상한입니다. `max-w-sm`의 384입니다.
  final double maxWidth;

  /// 화면 가장자리와 스택 사이의 여백입니다.
  final EdgeInsetsGeometry padding;

  final _HoronToastEdge _edge;

  @override
  Widget build(BuildContext context) {
    final HoronToastController controller = HoronToastProvider.of(context);
    final List<HoronToastEntry> entries = controller.toasts;
    if (entries.isEmpty) return const SizedBox.shrink();

    final bool bottom = _edge == _HoronToastEdge.bottom;
    final Alignment alignment = bottom ? Alignment.bottomCenter : Alignment.topCenter;
    final List<HoronToastEntry> newestFirst = entries.reversed.toList();

    // 뒤에 있는 카드부터 그립니다. 마지막에 그린 카드가 맨 앞입니다.
    final List<Widget> cards = <Widget>[
      for (int index = newestFirst.length - 1; index >= 0; index--)
        _HoronStackedCard(
          index: index,
          peek: _toastPeek,
          scale: math.max(0.0, 1 - index * _toastScaleStep),
          anchorAtBottom: bottom,
          child: HoronToastRoot(
            key: HoronToastRoot.keyFor(newestFirst[index].id),
            data: newestFirst[index].data,
            // React의 `data-behind:opacity-0`입니다. 뒤 카드는 표면만 남기고
            // 내용을 그리지 않아, 맨 앞 카드 높이에 맞춰도 글이 넘치지 않습니다.
            behind: index > 0,
            stacked: newestFirst.length > 1,
            onDismiss: () => controller.dismiss(newestFirst[index].id),
          ),
        ),
    ];

    return Align(
      alignment: alignment,
      child: Padding(
        padding: padding,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: SizedBox(
            width: double.infinity,
            child: _HoronToastStack(children: cards),
          ),
        ),
      ),
    );
  }
}

/// 겹친 토스트 카드를 같은 높이로 쌓는 상자입니다.
///
/// `toast.tsx`는 모든 카드에 `h-(--height)`(맨 앞 카드의 높이)를 줍니다. 그래서
/// 짧은 카드가 뒤에 있어도 가장자리가 드러납니다. Flutter의 `Stack`은 자식마다
/// 제 높이를 쓰므로, 맨 앞(마지막 자식) 카드의 높이를 재서 나머지를 그 높이에
/// 맞춥니다.
class _HoronToastStack extends MultiChildRenderObjectWidget {
  const _HoronToastStack({required super.children});

  @override
  _RenderToastStack createRenderObject(BuildContext context) => _RenderToastStack();
}

class _RenderToastStack extends RenderBox
    with
        ContainerRenderObjectMixin<RenderBox, StackParentData>,
        RenderBoxContainerDefaultsMixin<RenderBox, StackParentData> {
  @override
  void setupParentData(RenderBox child) {
    if (child.parentData is! StackParentData) child.parentData = StackParentData();
  }

  @override
  void performLayout() {
    final RenderBox? front = lastChild;
    if (front == null) {
      size = constraints.smallest;
      return;
    }
    front.layout(BoxConstraints(maxWidth: constraints.maxWidth), parentUsesSize: true);
    final Size frontSize = front.size;
    for (RenderBox? child = firstChild; child != null && child != front; child = childAfter(child)) {
      child.layout(BoxConstraints.tight(frontSize));
    }
    size = constraints.constrain(frontSize);
  }

  @override
  void paint(PaintingContext context, Offset offset) => defaultPaint(context, offset);

  @override
  bool hitTestChildren(BoxHitTestResult result, {required Offset position}) =>
      defaultHitTestChildren(result, position: position);
}

/// 스택의 [index]번째 카드를 [peek] × [index]만큼 비켜 놓고 [scale]만큼 줄입니다.
///
/// `toast.tsx`의 `translateY(calc(-1 * index * var(--peek) - var(--shrink) * var(--height)))
/// scale(var(--scale))`을 옮긴 것입니다. React는 축소 기준점을 카드의 바깥
/// 가장자리에 두고, 축소로 안쪽으로 들어온 높이(`(1 - scale) * height`)를 따로
/// 빼 줍니다. 그 보정이 없으면 뒤 카드의 윗변이 [peek]보다 적게 드러나 겹친
/// 카드가 보이지 않습니다.
class _HoronStackedCard extends SingleChildRenderObjectWidget {
  const _HoronStackedCard({
    required this.index,
    required this.peek,
    required this.scale,
    required this.anchorAtBottom,
    required Widget super.child,
  });

  final int index;
  final double peek;
  final double scale;
  final bool anchorAtBottom;

  @override
  _RenderStackedCard createRenderObject(BuildContext context) =>
      _RenderStackedCard(index: index, peek: peek, scale: scale, anchorAtBottom: anchorAtBottom);

  @override
  void updateRenderObject(BuildContext context, _RenderStackedCard renderObject) {
    renderObject
      ..index = index
      ..peek = peek
      ..scale = scale
      ..anchorAtBottom = anchorAtBottom;
  }
}

/// [_HoronStackedCard]의 배치와 그리기를 맡는 렌더 객체입니다.
///
/// 자식의 높이를 알아야 보정값을 계산할 수 있으므로 레이아웃 뒤에 도는
/// `paint`에서 변환을 만듭니다. 자식의 레이아웃 크기는 바꾸지 않습니다.
class _RenderStackedCard extends RenderProxyBox {
  _RenderStackedCard({required this.index, required this.peek, required this.scale, required this.anchorAtBottom});

  int index;
  double peek;
  double scale;
  bool anchorAtBottom;

  Matrix4 get _transform {
    // 축소 기준점은 카드가 붙은 가장자리의 가운데입니다(React의 `origin-bottom`).
    // React의 `translateY(calc(-index*peek - shrink*height)) scale(scale)`처럼,
    // 축소로 안쪽으로 들어온 높이까지 더해 밀어야 뒤 카드의 가장자리가 정확히
    // index × peek만큼 드러납니다.
    final Offset origin = Offset(size.width / 2, anchorAtBottom ? size.height : 0);
    final double shift = index * peek + (1 - scale) * size.height;
    return Matrix4.identity()
      ..translateByDouble(0, anchorAtBottom ? -shift : shift, 0, 1)
      ..translateByDouble(origin.dx, origin.dy, 0, 1)
      ..scaleByDouble(scale, scale, 1, 1)
      ..translateByDouble(-origin.dx, -origin.dy, 0, 1);
  }

  @override
  void paint(PaintingContext context, Offset offset) {
    if (child == null) return;
    context.pushTransform(needsCompositing, offset, _transform, super.paint);
  }

  @override
  void applyPaintTransform(RenderBox child, Matrix4 transform) {
    transform.multiply(_transform);
  }
}

/// 토스트 카드 하나입니다.
///
/// `toast.tsx`의 `Toast.Root` + `Toast.Content`입니다. `.glass-strong` 표면
/// (`rounded-md`, 12) 위에 아이콘·제목·설명·액션·닫기를 한 줄로 놓고,
/// [HoronToastData.duration]이 지나면 스스로 닫힙니다. 액션 버튼을 누르면 타이머를
/// 취소하고 [HoronToastData.onAction]을 부릅니다.
///
/// [HoronToastViewport]가 이 위젯을 스택에 넣습니다. 한 장만 그리고 싶으면 직접
/// 놓아도 됩니다.
class HoronToastRoot extends StatefulWidget {
  /// 카드 하나를 만듭니다.
  const HoronToastRoot({
    super.key,
    required this.data,
    this.onDismiss,
    this.closeIcon,
    this.behind = false,
    this.stacked = false,
  });

  /// [id]의 카드를 찾는 키를 만듭니다. React의 `data-slot="toast"` 자리입니다.
  static Key keyFor(String id) => ValueKey<String>('horon-toast-$id');

  /// 액션 버튼을 찾는 테스트용 키입니다.
  static const Key actionKey = ValueKey<String>('horon-toast-action');

  /// 닫기 버튼을 찾는 테스트용 키입니다.
  static const Key closeKey = ValueKey<String>('horon-toast-close');

  /// 보여 줄 내용입니다.
  final HoronToastData data;

  /// 카드를 닫을 때 부르는 콜백입니다. null이면 닫기 버튼을 그리지 않습니다.
  final VoidCallback? onDismiss;

  /// 닫기 버튼의 아이콘입니다. 없으면 이 패키지가 X를 직접 그립니다.
  final Widget? closeIcon;

  /// 스택에 다른 카드와 함께 놓였는지 여부입니다.
  ///
  /// 참이면 유리 대신 서리 단계로 그립니다. 겹친 유리는 Flutter에서 블러가 카드
  /// 밖으로 번져 이웃 카드의 가장자리를 지우기 때문입니다.
  final bool stacked;

  /// 스택에서 뒤에 깔린 카드인지 여부입니다.
  ///
  /// 참이면 표면만 그립니다. React의 `data-behind:opacity-0`과 같은 자리로,
  /// 뒤 카드는 맨 앞 카드 높이에 맞춰지므로 내용까지 그리면 넘칩니다.
  final bool behind;

  @override
  State<HoronToastRoot> createState() => _HoronToastRootState();
}

class _HoronToastRootState extends State<HoronToastRoot> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void didUpdateWidget(covariant HoronToastRoot oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.data.duration != oldWidget.data.duration) {
      _timer?.cancel();
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    final Duration? duration = widget.data.duration;
    if (duration == null) return;
    _timer = Timer(duration, () {
      if (mounted) widget.onDismiss?.call();
    });
  }

  void _handleAction() {
    // 계획의 실패 시나리오: 액션을 누르면 자동 닫힘이 취소됩니다.
    _timer?.cancel();
    _timer = null;
    widget.data.onAction?.call();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Widget? icon = widget.data.icon;
    final String? actionLabel = widget.data.actionLabel;
    final VoidCallback? onDismiss = widget.onDismiss;

    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: const Duration(milliseconds: HoronDuration.slower),
      curve: HoronEasing.outCubic,
      builder: (BuildContext context, double value, Widget? child) => Opacity(
        opacity: value,
        child: Transform.translate(offset: Offset(0, (1 - value) * HoronSpace.s2), child: child),
      ),
      // 겹친 카드에서는 유리 표면의 `BackdropFilter`를 걷고 서리 단계(불투명도 90%,
      // 블러 없음)를 씁니다. Flutter의 블러는 CSS의 `backdrop-filter`와 달리 자기
      // 상자에 잘리지 않아 32px가 카드 밖으로 번지고, 그러면 뒤 카드의 12px
      // 가장자리가 지워집니다. 겹친 유리 위에 유리를 또 얹으면 카드 안에도
      // 이음매가 생깁니다. 웹이 `prefers-reduced-transparency`에서 서리로
      // 내려가는 것과 같은 단계이고, 한 장만 있을 때는 유리 그대로입니다.
      child: _surface(
        stacked: widget.stacked,
        child: widget.behind
            ? const SizedBox.expand()
            : Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  if (icon != null) ...<Widget>[
                    IconTheme.merge(
                      data: IconThemeData(size: _toastIconSize, color: scheme.onSurfaceVariant),
                      child: icon,
                    ),
                    const SizedBox(width: _toastRowGap),
                  ],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        if (widget.data.title != null) HoronToastTitle(widget.data.title!),
                        if (widget.data.title != null && widget.data.description != null)
                          const SizedBox(height: _toastColumnGap),
                        if (widget.data.description != null) HoronToastDescription(widget.data.description!),
                      ],
                    ),
                  ),
                  if (actionLabel != null) ...<Widget>[
                    const SizedBox(width: _toastRowGap),
                    HoronToastAction(key: HoronToastRoot.actionKey, label: actionLabel, onPressed: _handleAction),
                  ],
                  if (onDismiss != null) ...<Widget>[
                    const SizedBox(width: _toastRowGap),
                    HoronToastClose(key: HoronToastRoot.closeKey, icon: widget.closeIcon, onPressed: onDismiss),
                  ],
                ],
              ),
      ),
    );
  }

  /// 카드의 표면을 만듭니다.
  ///
  /// [stacked]가 참이면 유리 대신 불투명 단계([HoronThemeData.glassFillSolid])를
  /// 씁니다. 웹이 `@supports not (backdrop-filter)`에서 내려가는 그 단계이고,
  /// 겹친 카드에서는 이 단계가 필수입니다. Flutter의 `BackdropFilter`는 자기
  /// 상자에 잘리지 않아 32px 블러가 카드 밖으로 번지므로, 유리로 두면 앞 카드의
  /// 블러가 뒤 카드의 12px 가장자리를 지웁니다. 반대로 반투명 채움으로 두면 뒤
  /// 카드의 가장자리가 앞 카드 안에 비쳐 이음매처럼 보입니다. 불투명이 둘 다를
  /// 없애고, 겹친 스택은 웹에서도 같은 이유로 블러를 못 쓰는 자리입니다.
  Widget _surface({required bool stacked, required Widget child}) {
    if (!stacked) {
      // CSS의 `backdrop-filter`는 요소의 테두리 상자 안에서만 번집니다. Flutter의
      // `BackdropFilter`는 클립이 없으면 레이어 전체를 흐리게 하므로, 같은 반경으로
      // 잘라 CSS와 같은 범위에서만 블러가 걸리게 합니다.
      return ClipRRect(
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
        child: HoronGlassSurface.strong(
          padding: const EdgeInsets.all(_toastPadding),
          borderRadius: BorderRadius.circular(HoronRadiusRole.card),
          child: child,
        ),
      );
    }
    final HoronThemeData horon = HoronTheme.of(context);
    return DecoratedBox(
      decoration: BoxDecoration(
        color: horon.glassFillSolid,
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
        border: Border.all(color: horon.glassBorder),
      ),
      child: Padding(padding: const EdgeInsets.all(_toastPadding), child: child),
    );
  }
}

/// 토스트의 제목입니다. `text-[13px] font-semibold`입니다.
class HoronToastTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronToastTitle(this.title, {super.key});

  /// 제목 글자입니다.
  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _toastFontSize,
        fontWeight: HoronFontWeight.semibold,
        height: HoronLineHeight.snug,
        color: Theme.of(context).colorScheme.onSurface,
      ),
    );
  }
}

/// 토스트의 설명입니다. `text-[13px] text-muted-foreground`입니다.
class HoronToastDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronToastDescription(this.description, {super.key});

  /// 설명 글자입니다.
  final String description;

  @override
  Widget build(BuildContext context) {
    return Text(
      description,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _toastFontSize,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.snug,
        color: Theme.of(context).colorScheme.onSurfaceVariant,
      ),
    );
  }
}

/// 토스트의 액션 버튼입니다.
///
/// `toast.tsx`의 `ToastAction`은 기본 렌더로 `<Button variant="outline" size="sm">`을
/// 씁니다. 그대로 [HoronButton]의 `outline`/`sm`입니다.
class HoronToastAction extends StatelessWidget {
  /// 액션 버튼 하나를 만듭니다.
  const HoronToastAction({super.key, required this.label, this.onPressed});

  /// 버튼 글자입니다.
  final String label;

  /// 누르면 부르는 콜백입니다.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return HoronButton(
      label: label,
      variant: HoronButtonVariant.outline,
      size: HoronButtonSize.sm,
      onPressed: onPressed,
    );
  }
}

/// 토스트의 닫기 버튼입니다.
///
/// `toast.tsx`의 `ToastClose`는 기본 렌더로 `<Button variant="ghost" size="icon-sm">`과
/// lucide `x`를 씁니다. 이 패키지는 아이콘 폰트를 번들하지 않으므로 X를 직접
/// 그리고, 호스트가 [icon]을 넘기면 그것을 씁니다.
class HoronToastClose extends StatelessWidget {
  /// 닫기 버튼 하나를 만듭니다.
  const HoronToastClose({super.key, this.onPressed, this.icon});

  /// 닫기 글리프의 기본 크기입니다. `size-[15px]`입니다.
  static const double glyphSize = _toastIconSize;

  /// 누르면 부르는 콜백입니다.
  final VoidCallback? onPressed;

  /// X 대신 쓸 아이콘입니다.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final Color color = Theme.of(context).colorScheme.onSurfaceVariant;
    return HoronButton(
      variant: HoronButtonVariant.ghost,
      size: HoronButtonSize.iconSm,
      semanticLabel: HoronTheme.of(context).strings.close,
      onPressed: onPressed,
      leading: icon ?? CustomPaint(size: const Size.square(glyphSize), painter: HoronToastClosePainter(color)),
    );
  }
}

/// 닫기 아이콘(lucide `x`)을 선 두 개로 그립니다.
class HoronToastClosePainter extends CustomPainter {
  /// 닫기 글리프를 그리는 페인터를 만듭니다.
  const HoronToastClosePainter(this.color);

  /// 선 색입니다.
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
  bool shouldRepaint(HoronToastClosePainter oldDelegate) => color != oldDelegate.color;
}

/// [child] 위에 토스트 뷰포트 한 장을 얹는 편의 위젯입니다.
///
/// `toast.tsx`의 `Toaster`(Provider + Portal + Viewport + List)를 옮긴 것입니다.
/// 컨트롤러를 스스로 만들고 싶으면 이 위젯을, 이미 가진 컨트롤러를 쓰려면
/// [HoronToastProvider]와 [HoronToastViewport]를 따로 놓습니다.
class HoronToaster extends StatefulWidget {
  /// 아래 가장자리에 쌓는 토스터를 만듭니다.
  const HoronToaster({super.key, required this.child, this.controller}) : _top = false;

  /// 위 가장자리에 쌓는 토스터를 만듭니다.
  const HoronToaster.top({super.key, required this.child, this.controller}) : _top = true;

  /// 토스트 위에 놓을 화면입니다.
  final Widget child;

  /// 쓸 컨트롤러입니다. 없으면 이 위젯이 하나 만들어 소유합니다.
  final HoronToastController? controller;

  final bool _top;

  @override
  State<HoronToaster> createState() => _HoronToasterState();
}

class _HoronToasterState extends State<HoronToaster> {
  HoronToastController? _owned;

  HoronToastController get _controller => widget.controller ?? (_owned ??= HoronToastController());

  @override
  void dispose() {
    _owned?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return HoronToastProvider(
      controller: _controller,
      child: Stack(
        children: <Widget>[
          widget.child,
          Positioned.fill(child: widget._top ? const HoronToastViewport.top() : const HoronToastViewport()),
        ],
      ),
    );
  }
}
