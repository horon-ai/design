import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../contracts/surface.dart';
import '../glass/horon_veil.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `toast.tsx`의 `ToastTone`입니다.
enum HoronToastTone {
  /// 정보 알림입니다. React `neutral` — `Info` 아이콘과 `text-text-secondary`입니다.
  neutral,

  /// 성공 알림입니다. React `success` — `CheckCircle` 아이콘과 `text-text-brand`입니다.
  success,

  /// 실패 알림입니다. React `danger` — `WarningCircle` 아이콘과 `text-text-danger`입니다.
  danger,
}

/// `toast.tsx`의 `ToastSize`입니다.
enum HoronToastSize {
  /// `size="sm"` — 폭 320, `label-md`/`body-sm`, 아이콘 16px.
  sm,

  /// `size="md"` — 폭 360, `label-lg`/`body-sm`, 아이콘 20px. 기본값입니다.
  md,

  /// `size="lg"` — 폭 400, `label-lg`/`body-md`, 아이콘 24px.
  lg,
}

typedef _ToastMetrics = ({
  double width,
  double paddingX,
  double paddingY,
  double gap,
  double icon,
  double close,
  double contentGap,
  TextStyle title,
  TextStyle description,
});

_ToastMetrics _metricsOf(HoronToastSize size, HoronThemeData theme) => switch (size) {
  HoronToastSize.sm => (
    width: 320,
    paddingX: theme.space.s3,
    paddingY: theme.space.s2_5,
    gap: theme.space.s2,
    icon: 16,
    close: 14,
    contentGap: theme.space.s0_5,
    title: theme.text.labelMd,
    description: theme.text.bodySm,
  ),
  HoronToastSize.md => (
    width: 360,
    paddingX: theme.space.s4,
    paddingY: theme.space.s3_5,
    gap: theme.space.s3,
    icon: 20,
    close: 16,
    contentGap: theme.space.s0_5,
    title: theme.text.labelLg,
    description: theme.text.bodySm,
  ),
  HoronToastSize.lg => (
    width: 400,
    paddingX: theme.space.s5,
    paddingY: theme.space.s4,
    gap: theme.space.s3_5,
    icon: 24,
    close: 20,
    contentGap: theme.space.s1,
    title: theme.text.labelLg,
    description: theme.text.bodyMd,
  ),
};

/// `after:-inset-2` — 닫기 아이콘 바깥으로 넓히는 히트 영역 8입니다.
const double _closeHitPadding = 8;

/// `data-starting-style:translate-y-4` — 나타날 때 아래에서 올라오는 거리 16입니다.
const double _enterOffsetY = 16;

/// `duration-240` — 나타나는 시간입니다.
const Duration _enterDuration = Duration(milliseconds: 240);

/// `data-ending-style:duration-180` — 사라지는 시간입니다.
const Duration _exitDuration = Duration(milliseconds: 180);

/// `data-ending-style:translate-x-6` — 사라질 때 오른쪽으로 밀리는 거리입니다.
const double _exitOffsetX = 24;

/// 알림 하나의 내용입니다.
///
/// React는 `useToast().add({ title, description, type })`의 값으로 토스트를 만들고,
/// Flutter에서는 그 값을 이 불변 객체로 들고 다닙니다.
@immutable
class HoronToastData {
  /// 알림 하나를 만듭니다.
  const HoronToastData({required this.id, required this.title, this.description, this.tone = HoronToastTone.neutral});

  /// 컨트롤러가 붙인 식별자입니다. React `toast.id`입니다.
  final int id;

  /// 제목입니다. React `Toast.Title`이며 `label-lg`입니다.
  final String title;

  /// 설명입니다. React `Toast.Description`이며 `body-sm`입니다.
  final String? description;

  /// 알림의 톤입니다. React `type`입니다.
  final HoronToastTone tone;
}

/// 토스트 목록을 들고 있는 컨트롤러입니다.
///
/// React `useToast()`(Base UI의 `ToastManager`)를 옮겼습니다. 호스트는
/// [HoronToastScope.of]로 이 컨트롤러를 얻어 [show]를 부릅니다.
///
/// [show]의 [duration]이 0보다 크면 그 시간 뒤에 스스로 사라집니다. React의 기본
/// 자동 닫힘과 같은 동작이며, 테스트는 긴 값을 주거나 [dispose]로 타이머를 정리합니다.
class HoronToastController extends ChangeNotifier {
  final List<HoronToastData> _toasts = <HoronToastData>[];
  final Map<int, Timer> _timers = <int, Timer>{};

  /// 퇴장 전환이 도는 중인 알림입니다. React는 종료 전환이 끝난 뒤에 항목을 지웁니다.
  final Set<int> _leaving = <int>{};
  int _nextId = 0;

  /// 지금 떠 있는 알림입니다. 오래된 것이 앞에 옵니다.
  List<HoronToastData> get toasts => List<HoronToastData>.unmodifiable(_toasts);

  /// 알림을 하나 띄웁니다.
  HoronToastData show({
    required String title,
    String? description,
    HoronToastTone tone = HoronToastTone.neutral,
    Duration duration = const Duration(seconds: 5),
  }) {
    final HoronToastData data = HoronToastData(id: _nextId, title: title, description: description, tone: tone);
    _nextId += 1;
    _toasts.add(data);
    if (duration > Duration.zero) {
      _timers[data.id] = Timer(duration, () => dismiss(data.id));
    }
    notifyListeners();
    return data;
  }

  /// 알림 하나를 닫습니다.
  ///
  /// 목록에서 바로 빼지 않고 퇴장 전환을 시작합니다. 전환이 끝나면 뷰포트가
  /// [_finishDismiss]를 불러 항목을 지웁니다.
  void dismiss(int id) {
    _timers.remove(id)?.cancel();
    if (_leaving.contains(id) || !_toasts.any((HoronToastData toast) => toast.id == id)) return;
    _leaving.add(id);
    notifyListeners();
  }

  /// [id]가 퇴장 전환 중인지 알려 줍니다.
  bool _isLeaving(int id) => _leaving.contains(id);

  /// 퇴장 전환이 끝난 알림을 목록에서 지웁니다.
  void _finishDismiss(int id) {
    if (!_leaving.remove(id)) return;
    final int before = _toasts.length;
    _toasts.removeWhere((HoronToastData toast) => toast.id == id);
    if (_toasts.length != before) notifyListeners();
  }

  /// 떠 있는 알림을 모두 닫습니다.
  void clear() {
    for (final Timer timer in _timers.values) {
      timer.cancel();
    }
    _timers.clear();
    _leaving.clear();
    if (_toasts.isEmpty) return;
    _toasts.clear();
    notifyListeners();
  }

  @override
  void dispose() {
    for (final Timer timer in _timers.values) {
      timer.cancel();
    }
    _timers.clear();
    super.dispose();
  }
}

/// 알림 카드 하나입니다. Figma `Toast`(62:307)입니다.
///
/// React의 토스트 항목(`Toast.Root` + 제목·설명·닫기)을 옮겼습니다. 360px까지
/// 넓어지는 카드이고, 톤 아이콘 20px, `label-lg` 제목, `body-sm` 설명,
/// 16px 닫기 아이콘과 32px 히트 영역으로 이루어집니다.
class HoronToast extends StatelessWidget {
  /// 카드 하나를 만듭니다.
  const HoronToast({
    super.key,
    required this.title,
    this.description,
    this.tone = HoronToastTone.neutral,
    this.onDismiss,
    this.size = HoronToastSize.md,
    this.surface = HoronSurface.solid,
  });

  /// 표면입니다. 기본값은 [HoronSurface.solid]입니다.
  final HoronSurface surface;

  /// 크기입니다. 기본값은 [HoronToastSize.md]입니다.
  final HoronToastSize size;

  /// 제목입니다. React `Toast.Title`입니다.
  final String title;

  /// 설명입니다. React `Toast.Description`입니다.
  final String? description;

  /// 알림의 톤입니다. React `type`입니다.
  final HoronToastTone tone;

  /// 닫기 버튼을 눌렀을 때 부를 콜백입니다. React `Toast.Close`입니다.
  final VoidCallback? onDismiss;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final BorderRadius radius = BorderRadius.circular(theme.radius.lg); // rounded-lg
    final _ToastMetrics metrics = _metricsOf(size, theme);

    final (IconData icon, Color iconColor) = switch (tone) {
      HoronToastTone.neutral => (Icons.info_outline, colors.textSecondary),
      HoronToastTone.success => (Icons.check_circle_outline, colors.textBrand),
      HoronToastTone.danger => (Icons.error_outline, colors.textDanger),
    };

    final Widget body = Padding(
      padding: EdgeInsets.symmetric(horizontal: metrics.paddingX, vertical: metrics.paddingY),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: metrics.gap,
        children: <Widget>[
          Icon(icon, size: metrics.icon, color: iconColor),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: metrics.contentGap,
              children: <Widget>[
                Text(title, style: metrics.title.copyWith(color: colors.textPrimary)),
                if (description != null)
                  Text(description!, style: metrics.description.copyWith(color: colors.textSecondary)),
              ],
            ),
          ),
          _ToastClose(onTap: onDismiss, size: metrics.close),
        ],
      ),
    );

    if (surface == HoronSurface.glass || surface == HoronSurface.veilOverlay) {
      // React `veil-overlay` — 그림자와 링을 veil이 스스로 그립니다.
      return HoronVeil(kind: HoronVeilKind.overlay, borderRadius: radius, child: body);
    }

    // React `border border-border-default bg-bg-surface shadow-popover`.
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.bgSurface,
        borderRadius: radius,
        border: Border.all(color: colors.borderDefault),
        boxShadow: theme.shadows.popover,
      ),
      child: ClipRRect(borderRadius: radius, child: body),
    );
  }
}

/// 토스트 컨트롤러를 자손에게 내려 주는 범위입니다.
///
/// React `Toast.Provider`의 자리입니다. [of]로 얻은 컨트롤러의 `show`를 부르면
/// 목록이 갱신됩니다.
class HoronToastScope extends InheritedNotifier<HoronToastController> {
  /// 컨트롤러와 자손을 받습니다.
  const HoronToastScope({super.key, required HoronToastController controller, required super.child})
    : super(notifier: controller);

  /// 가장 가까운 컨트롤러를 돌려줍니다.
  ///
  /// 없으면 [StateError]를 던집니다. [HoronToaster]로 감싸야 합니다.
  static HoronToastController of(BuildContext context) {
    final HoronToastController? controller = maybeOf(context);
    if (controller == null) {
      throw StateError(
        'No HoronToastScope above this context. Wrap the app in HoronToaster so toasts '
        'have a controller and a viewport.',
      );
    }
    return controller;
  }

  /// 가장 가까운 컨트롤러를 돌려줍니다. 없으면 null입니다.
  static HoronToastController? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HoronToastScope>()?.notifier;
}

/// 앱을 감싸 토스트가 뜰 자리를 만듭니다. React `Toaster`입니다.
///
/// React는 고정 위치(`right-6 bottom-6`)의 포털에 그리므로, 이 위젯도 앱 셸 전체를
/// 감싸야 화면 오른쪽 아래에 뜹니다. 목록은 12px 간격으로 아래에서 위로 쌓이고,
/// 각 카드는 새로 생길 때 아래에서 16px 올라오며 0.95배에서 자랍니다.
class HoronToaster extends StatefulWidget {
  /// 토스터를 만듭니다.
  const HoronToaster({
    super.key,
    this.controller,
    this.size = HoronToastSize.md,
    this.surface = HoronSurface.solid,
    required this.child,
  });

  /// 카드 표면입니다. 기본값은 [HoronSurface.solid]입니다.
  final HoronSurface surface;

  /// 쓸 컨트롤러입니다. 없으면 이 위젯이 하나 만들어 스스로 정리합니다.
  final HoronToastController? controller;

  /// 목록의 카드 크기입니다. 기본값은 [HoronToastSize.md]입니다.
  final HoronToastSize size;

  /// 토스트 아래에 깔리는 앱입니다. React `children`입니다.
  final Widget child;

  @override
  State<HoronToaster> createState() => _HoronToasterState();
}

class _HoronToasterState extends State<HoronToaster> {
  HoronToastController? _owned;
  late HoronToastController _controller;

  @override
  void initState() {
    super.initState();
    _adopt(widget.controller);
  }

  @override
  void didUpdateWidget(HoronToaster oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) _adopt(widget.controller);
  }

  void _adopt(HoronToastController? controller) {
    _owned?.dispose();
    _owned = controller == null ? HoronToastController() : null;
    _controller = controller ?? _owned!;
  }

  @override
  void dispose() {
    _owned?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return HoronToastScope(
      controller: _controller,
      child: Stack(
        children: <Widget>[
          widget.child,
          // fixed right-6 bottom-6
          Positioned(
            left: space.s6,
            right: space.s6,
            bottom: space.s6,
            child: _ToastList(size: widget.size, surface: widget.surface),
          ),
        ],
      ),
    );
  }
}

/// 컨트롤러의 목록을 화면 오른쪽 아래에 그립니다. React `Toast.Viewport`입니다.
class _ToastList extends StatelessWidget {
  const _ToastList({required this.size, required this.surface});

  final HoronToastSize size;
  final HoronSurface surface;

  @override
  Widget build(BuildContext context) {
    final HoronToastController controller = HoronToastScope.of(context);
    if (controller.toasts.isEmpty) return const SizedBox.shrink();

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // 화면이 카드 폭보다 좁으면 남는 폭에 맞춰 줄입니다.
        final double maxWidth = _metricsOf(size, HoronTheme.of(context)).width;
        final double width = constraints.maxWidth.isFinite ? math.min(maxWidth, constraints.maxWidth) : maxWidth;
        // React 뷰포트는 `gap-0`이고 카드마다 `mt-3`을 들고 있습니다. 카드가 닫힐 때
        // 그 여백과 높이가 함께 0으로 줄어들도록 [_ToastSlot]이 둘을 같이 전환합니다.
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: <Widget>[
            for (final HoronToastData toast in controller.toasts)
              _ToastSlot(
                key: ValueKey<int>(toast.id),
                leaving: controller._isLeaving(toast.id),
                onExited: () => controller._finishDismiss(toast.id),
                child: SizedBox(
                  width: width,
                  child: _ToastEntrance(
                    child: HoronToast(
                      size: size,
                      surface: surface,
                      title: toast.title,
                      description: toast.description,
                      tone: toast.tone,
                      onDismiss: () => controller.dismiss(toast.id),
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}

/// 카드 하나의 자리입니다. React `Toast.Root`의 `mt-3`·`h-[var(--toast-height)]`.
///
/// 닫히면 위 여백(`mt-3` → `mt-0`, 곧 margin-top 12 → 0)과 높이(카드 높이 → 0)가
/// 함께 줄고, 카드는 `translate-x-6`만큼 밀리며 사라집니다. React의
/// `transition-[height,margin-top,opacity,translate,scale]`과 같은 전환이고,
/// 전환이 끝나면 [onExited]로 컨트롤러에 알려 목록에서 지웁니다(React
/// `data-ending-style:h-0`이 끝난 뒤 항목을 지우는 자리).
class _ToastSlot extends StatelessWidget {
  const _ToastSlot({super.key, required this.leaving, required this.onExited, required this.child});

  final bool leaving;
  final VoidCallback onExited;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: leaving ? 1 : 0),
      duration: reduceMotion
          ? Duration.zero
          : leaving
          ? _exitDuration
          : Duration.zero,
      curve: Curves.easeIn, // React `ease-in`
      onEnd: () {
        if (leaving) onExited();
      },
      builder: (BuildContext context, double t, Widget? child) {
        if (t == 0 && !leaving) {
          // 제자리에 있는 카드는 여백만 들고 그대로 그립니다.
          return Padding(
            padding: EdgeInsets.only(top: space.s3),
            child: child,
          );
        }
        return IgnorePointer(
          child: Padding(
            padding: EdgeInsets.only(top: space.s3 * (1 - t)),
            child: ClipRect(
              child: Align(
                alignment: Alignment.topCenter,
                heightFactor: 1 - t,
                child: Opacity(
                  opacity: 1 - t,
                  child: Transform.translate(offset: Offset(_exitOffsetX * t, 0), child: child),
                ),
              ),
            ),
          ),
        );
      },
      child: child,
    );
  }
}

/// `motion` — 나타날 때 16px 아래에서 올라오고 0.95배에서 자랍니다.
class _ToastEntrance extends StatelessWidget {
  const _ToastEntrance({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: reduceMotion ? Duration.zero : _enterDuration,
      curve: HoronMotion.easeOutQuint,
      builder: (BuildContext context, double t, Widget? child) => Opacity(
        opacity: t,
        child: Transform.translate(
          offset: Offset(0, (1 - t) * _enterOffsetY),
          child: Transform.scale(
            scale: HoronMotion.popupEnterScale + (1 - HoronMotion.popupEnterScale) * t,
            child: child,
          ),
        ),
      ),
      child: child,
    );
  }
}

/// 토스트의 닫기 아이콘입니다. `motion-press`로 눌린 상태를 보여 줍니다.
class _ToastClose extends StatefulWidget {
  const _ToastClose({this.onTap, this.size = 16});

  final VoidCallback? onTap;
  final double size;

  @override
  State<_ToastClose> createState() => _ToastCloseState();
}

class _ToastCloseState extends State<_ToastClose> {
  bool _pressed = false;
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool enabled = widget.onTap != null;
    return AnimatedScale(
      scale: _pressed && enabled ? HoronMotion.pressScale : 1,
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
      child: Semantics(
        button: true,
        label: theme.strings.close,
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          onEnter: (_) => setState(() => _hovered = true),
          onExit: (_) => setState(() => _hovered = false),
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.onTap,
            onTapDown: (TapDownDetails details) {
              if (enabled) setState(() => _pressed = true);
            },
            onTapUp: (TapUpDetails details) {
              if (_pressed) setState(() => _pressed = false);
            },
            onTapCancel: () {
              if (_pressed) setState(() => _pressed = false);
            },
            // React `after:-inset-2` — 아이콘 16px에 좌우 8px를 더한 32px 히트 영역.
            child: SizedBox(
              width: widget.size + _closeHitPadding * 2,
              height: widget.size + _closeHitPadding * 2,
              child: Center(
                child: Icon(
                  Icons.close,
                  size: widget.size,
                  color: _hovered ? theme.colors.textPrimary : theme.colors.textSecondary,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
