import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// React `Field`(Figma 58:163)를 옮긴 라벨·컨트롤·도움말 묶음입니다.
///
/// 세로로 쌓고 사이를 8px(`gap-2`) 띄웁니다. [disabled]가 참이면 안쪽 라벨이
/// `text-disabled`로 흐려집니다. React는 `Field.Root`의 문맥으로 그 값을 내려 주고,
/// 여기서는 비공개 상속 위젯이 같은 일을 합니다.
class HoronField extends StatelessWidget {
  /// 필드 묶음을 만듭니다.
  const HoronField({super.key, this.disabled = false, required this.children});

  /// 비활성 상태입니다. 라벨 색을 흐리게 만듭니다.
  final bool disabled;

  /// 라벨·컨트롤·설명을 순서대로 담습니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return _HoronFieldScope(
      disabled: disabled,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: horon.space.s2,
        children: children,
      ),
    );
  }
}

/// React `FieldLabel`을 옮긴 라벨입니다.
///
/// `label-md`에 `text-primary`를 입히고, 비활성 필드 안에서는 `text-disabled`가 됩니다.
class HoronFieldLabel extends StatelessWidget {
  /// 라벨을 만듭니다.
  const HoronFieldLabel(this.label, {super.key});

  /// 라벨 문구입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final bool disabled = _HoronFieldScope.disabledOf(context);
    return Text(
      label,
      style: horon.text.labelMd.copyWith(color: disabled ? horon.colors.textDisabled : horon.colors.textPrimary),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );
  }
}

/// React `FieldDescription`를 옮긴 도움말입니다.
class HoronFieldDescription extends StatelessWidget {
  /// 도움말을 만듭니다.
  const HoronFieldDescription(this.description, {super.key});

  /// 도움말 문구입니다.
  final String description;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return Text(description, style: horon.text.caption.copyWith(color: horon.colors.textSecondary));
  }
}

/// React `FieldError`를 옮긴 오류 문구입니다.
///
/// 웹의 `animate-[tab-panel-in_160ms_var(--ease-out-quint)]`와 같이 투명도 0과
/// 4px 아래에서 들어옵니다. 애니메이션을 줄이는 설정에서는 한 번에 나타납니다.
class HoronFieldError extends StatelessWidget {
  /// 오류 문구를 만듭니다.
  const HoronFieldError(this.error, {super.key});

  /// 오류 문구입니다.
  final String error;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: reduceMotion ? Duration.zero : _enterDuration,
      curve: HoronMotion.easeOutQuint,
      builder: (BuildContext context, double value, Widget? child) {
        return Opacity(
          opacity: value,
          child: Transform.translate(offset: Offset(0, (1 - value) * _enterOffset), child: child),
        );
      },
      child: Text(error, style: horon.text.caption.copyWith(color: horon.colors.textDanger)),
    );
  }
}

/// `tab-panel-in`의 160ms입니다.
const Duration _enterDuration = Duration(milliseconds: 160);

/// `translate: 0 4px`입니다.
const double _enterOffset = 4;

/// [HoronField]가 비활성 상태를 안쪽 라벨로 내려 주는 문맥입니다.
class _HoronFieldScope extends InheritedWidget {
  const _HoronFieldScope({required this.disabled, required super.child});

  final bool disabled;

  static bool disabledOf(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<_HoronFieldScope>()?.disabled ?? false;
  }

  @override
  bool updateShouldNotify(_HoronFieldScope oldWidget) => disabled != oldWidget.disabled;
}
