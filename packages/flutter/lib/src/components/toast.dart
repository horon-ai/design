import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
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

/// `w-90` — 토스트 카드가 더 넓어지지 않는 폭 360입니다.
const double _toastMaxWidth = 360;

/// `data-starting-style:translate-y-4` — 나타날 때 아래에서 올라오는 거리 16입니다.
const double _enterOffsetY = 16;

/// `[&_svg]:size-5` — 톤 아이콘 20입니다.
const double _toneIconSize = 20;

/// `[&_svg]:size-4` — 닫기 아이콘 16입니다.
const double _closeIconSize = 16;

/// `duration-260` — 나타나는 시간입니다.
const Duration _enterDuration = Duration(milliseconds: 260);

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
  void dismiss(int id) {
    _timers.remove(id)?.cancel();
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
/// 넓어지는 `regular` 유리 카드이고, 톤 아이콘 20px, `label-lg` 제목,
/// `body-sm` 설명, 16px 닫기 아이콘으로 이루어집니다.
class HoronToast extends StatelessWidget {
  /// 카드 하나를 만듭니다.
  const HoronToast({
    super.key,
    required this.title,
    this.description,
    this.tone = HoronToastTone.neutral,
    this.onDismiss,
  });

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
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(theme.radius.lg); // rounded-lg

    final (IconData icon, Color iconColor) = switch (tone) {
      HoronToastTone.neutral => (Icons.info_outline, colors.textSecondary),
      HoronToastTone.success => (Icons.check_circle_outline, colors.textBrand),
      HoronToastTone.danger => (Icons.error_outline, colors.textDanger),
    };

    return ClipRRect(
      borderRadius: radius,
      child: Stack(
        children: <Widget>[
          // bg-glass-regular — 유리는 내용 뒤에 깔립니다.
          Positioned.fill(
            child: HoronLiquidGlass(tier: HoronGlassTier.regular, borderRadius: radius, child: const SizedBox.expand()),
          ),
          Padding(
            // px-4 py-3.5
            padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3_5),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s3, // gap-3
              children: <Widget>[
                Icon(icon, size: _toneIconSize, color: iconColor),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: space.s0_5, // gap-0.5
                    children: <Widget>[
                      Text(title, style: theme.text.labelLg.copyWith(color: colors.textPrimary)),
                      if (description != null)
                        Text(description!, style: theme.text.bodySm.copyWith(color: colors.textSecondary)),
                    ],
                  ),
                ),
                _ToastClose(onTap: onDismiss),
              ],
            ),
          ),
        ],
      ),
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
  const HoronToaster({super.key, this.controller, required this.child});

  /// 쓸 컨트롤러입니다. 없으면 이 위젯이 하나 만들어 스스로 정리합니다.
  final HoronToastController? controller;

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
          Positioned(left: space.s6, right: space.s6, bottom: space.s6, child: const _ToastList()),
        ],
      ),
    );
  }
}

/// 컨트롤러의 목록을 화면 오른쪽 아래에 그립니다. React `Toast.Viewport`입니다.
class _ToastList extends StatelessWidget {
  const _ToastList();

  @override
  Widget build(BuildContext context) {
    final HoronToastController controller = HoronToastScope.of(context);
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    if (controller.toasts.isEmpty) return const SizedBox.shrink();

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // 화면이 360보다 좁으면 남는 폭에 맞춰 줄입니다.
        final double width = constraints.maxWidth.isFinite
            ? math.min(_toastMaxWidth, constraints.maxWidth)
            : _toastMaxWidth;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          spacing: space.s3, // gap-3
          children: <Widget>[
            for (final HoronToastData toast in controller.toasts)
              SizedBox(
                width: width,
                child: _ToastEntrance(
                  child: HoronToast(
                    title: toast.title,
                    description: toast.description,
                    tone: toast.tone,
                    onDismiss: () => controller.dismiss(toast.id),
                  ),
                ),
              ),
          ],
        );
      },
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
  const _ToastClose({this.onTap});

  final VoidCallback? onTap;

  @override
  State<_ToastClose> createState() => _ToastCloseState();
}

class _ToastCloseState extends State<_ToastClose> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return AnimatedScale(
      scale: _pressed && widget.onTap != null ? HoronMotion.pressScale : 1,
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.pressDuration,
      curve: HoronMotion.pressCurve,
      child: Semantics(
        button: true,
        label: theme.strings.close,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onTap,
          onTapDown: (TapDownDetails details) {
            if (widget.onTap != null) setState(() => _pressed = true);
          },
          onTapUp: (TapUpDetails details) {
            if (_pressed) setState(() => _pressed = false);
          },
          onTapCancel: () {
            if (_pressed) setState(() => _pressed = false);
          },
          child: Icon(Icons.close, size: _closeIconSize, color: theme.colors.textSecondary),
        ),
      ),
    );
  }
}
