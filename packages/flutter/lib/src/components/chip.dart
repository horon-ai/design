import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `chip.tsx`의 `variant` 옵션입니다.
enum HoronChipVariant {
  /// `bg-primary text-primary-foreground`
  defaultValue,

  /// `bg-secondary text-secondary-foreground`
  secondary,

  /// `border-border text-foreground` - 채움 없이 테두리만 있습니다.
  outline,

  /// `bg-accent text-accent-foreground`
  accent,

  /// `bg-success text-success-foreground`
  success,

  /// `bg-warning text-warning-foreground`
  warning,

  /// `bg-destructive text-destructive-foreground`
  destructive,
}

/// `chip.tsx`의 `text-[11px]`입니다. 생성 스케일의 12보다 작은 값이라 이름을 붙입니다.
const double _chipFontSize = 11.0;

/// `chip.tsx`의 `py-[3px]`입니다. 4px 스케일의 단계가 아닙니다.
const double _chipVerticalPadding = 3.0;

/// `chip.tsx`의 제거 버튼 `size-3.5`입니다.
const double _chipRemoveSize = 14.0;

/// `chip.tsx`의 `[&>svg…]:size-3`입니다.
const double _chipIconSize = 12.0;

/// 제거 버튼의 `-mr-1`(4px)입니다. 버튼을 오른쪽으로 당겨 칩 끝에 붙입니다.
const double _chipRemoveOverhang = HoronSpace.s1;

/// 짧은 라벨을 알약 모양으로 그리는 칩입니다.
///
/// `chip.tsx`를 옮긴 것입니다. [onRemove]를 넘기면 오른쪽에 닫기 버튼이 붙고, 그
/// 버튼의 접근성 이름은 [removeLabel]이 없을 때 [HoronTheme]의 `strings.remove`에서
/// 옵니다. 반경은 `rounded-full`이라 [HoronRadiusRole.pill]입니다.
///
/// ```dart
/// HoronChip(label: '디자인', variant: HoronChipVariant.accent, onRemove: () => drop('디자인'));
/// ```
class HoronChip extends StatefulWidget {
  /// 닫기 버튼을 찾는 키입니다. React의 `data-slot="chip-remove"`에 해당합니다.
  static const Key removeButtonKey = Key('horon-chip-remove');

  /// 칩 하나를 만듭니다.
  const HoronChip({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.variant = HoronChipVariant.defaultValue,
    this.onRemove,
    this.removeLabel,
  }) : assert(label != null || child != null, 'HoronChip needs a label or a child.');

  /// 칩 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  /// 변형입니다.
  final HoronChipVariant variant;

  /// 닫기 버튼을 눌렀을 때 부르는 콜백입니다. null이면 닫기 버튼이 없습니다.
  final VoidCallback? onRemove;

  /// 닫기 버튼의 접근성 이름입니다. 없으면 `strings.remove`를 씁니다.
  final String? removeLabel;

  @override
  State<HoronChip> createState() => _HoronChipState();
}

class _HoronChipState extends State<HoronChip> {
  bool _removeHovered = false;
  bool _removeFocused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);

    // variant 클래스가 고르는 (배경, 전경) 쌍입니다. `border-transparent`인 변형은
    // 배경색을 그대로 테두리로 씁니다. React도 테두리를 따로 칠하지 않습니다.
    final (Color background, Color foreground) = switch (widget.variant) {
      HoronChipVariant.defaultValue => (scheme.primary, scheme.onPrimary),
      HoronChipVariant.secondary => (scheme.secondary, scheme.onSecondary),
      HoronChipVariant.outline => (Colors.transparent, scheme.onSurface),
      HoronChipVariant.accent => (scheme.secondaryContainer, scheme.onSecondaryContainer),
      HoronChipVariant.success => (horon.success, horon.successForeground),
      HoronChipVariant.warning => (horon.warning, horon.warningForeground),
      HoronChipVariant.destructive => (scheme.error, scheme.onError),
    };
    final Color borderColor = widget.variant == HoronChipVariant.outline ? scheme.outline : background;

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _chipFontSize,
      fontWeight: HoronFontWeight.semibold,
      height: HoronLineHeight.none,
      color: foreground,
      // Material 조상이 없는 자리에서는 Flutter가 기본 `DefaultTextStyle`에 노란
      // 이중 밑줄을 넣습니다. 그 값이 merge로 새어 들어오지 않게 명시합니다.
      decoration: TextDecoration.none,
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(HoronRadiusRole.pill),
        border: Border.all(color: borderColor),
      ),
      child: Padding(
        padding: EdgeInsets.only(
          left: HoronSpace.s2_5,
          right: widget.onRemove == null ? HoronSpace.s2_5 : HoronSpace.s1_5,
          top: _chipVerticalPadding,
          bottom: _chipVerticalPadding,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            if (widget.icon != null) ...<Widget>[
              IconTheme.merge(
                data: IconThemeData(size: _chipIconSize, color: foreground),
                child: widget.icon!,
              ),
              const SizedBox(width: HoronSpace.s1),
            ],
            if (widget.label != null)
              Text(widget.label!, maxLines: 1, softWrap: false, style: textStyle)
            else
              DefaultTextStyle(style: textStyle, child: widget.child!),
            if (widget.onRemove != null) ...<Widget>[
              const SizedBox(width: HoronSpace.s1),
              _RemoveButton(
                color: foreground,
                hovered: _removeHovered,
                focused: _removeFocused,
                label: widget.removeLabel ?? horon.strings.remove,
                onTap: widget.onRemove!,
                onHoverChanged: (bool value) => setState(() => _removeHovered = value),
                onFocusChanged: (bool value) => setState(() => _removeFocused = value),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// `chip.tsx`의 `XIcon`(lucide `x`)을 선 두 개로 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않고 호스트 앱이 공급합니다. 그래서 닫기
/// 표시를 `Icons.close` 같은 글리프에 맡기면, 폰트를 싣지 않은 호스트에서 빈 네모가
/// 됩니다. 선 두 개는 어떤 환경에서도 같은 모양으로 그려집니다.
class _HoronChipClosePainter extends CustomPainter {
  const _HoronChipClosePainter(this.color);

  /// 선 색입니다. 칩의 전경 색을 그대로 씁니다.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    // lucide `x`의 24 그리드에서 `M18 6 6 18M6 6l12 12`, 굵기 2입니다.
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 2 / 24
      ..strokeCap = StrokeCap.round;
    final double inset = size.width * 6 / 24;
    canvas.drawLine(Offset(inset, inset), Offset(size.width - inset, size.height - inset), stroke);
    canvas.drawLine(Offset(size.width - inset, inset), Offset(inset, size.height - inset), stroke);
  }

  @override
  bool shouldRepaint(_HoronChipClosePainter oldDelegate) => color != oldDelegate.color;
}

/// `chip.tsx`의 닫기 버튼입니다.
///
/// React는 `-mr-1 size-3.5 rounded-full opacity-70 hover:opacity-100
/// focus-visible:ring-2 focus-visible:ring-ring/50`입니다. 반경이 알약이라 원이 되고,
/// hover에서 불투명도가 1로 올라갑니다.
class _RemoveButton extends StatelessWidget {
  const _RemoveButton({
    required this.color,
    required this.hovered,
    required this.focused,
    required this.label,
    required this.onTap,
    required this.onHoverChanged,
    required this.onFocusChanged,
  });

  final Color color;
  final bool hovered;
  final bool focused;
  final String label;
  final VoidCallback onTap;
  final ValueChanged<bool> onHoverChanged;
  final ValueChanged<bool> onFocusChanged;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return Semantics(
      button: true,
      label: label,
      child: Tooltip(
        message: label,
        child: FocusableActionDetector(
          onShowHoverHighlight: onHoverChanged,
          onShowFocusHighlight: onFocusChanged,
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                onTap();
                return null;
              },
            ),
          },
          child: GestureDetector(
            key: HoronChip.removeButtonKey,
            behavior: HitTestBehavior.opaque,
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.only(right: _chipRemoveOverhang),
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: HoronDuration.fast),
                opacity: hovered ? 1 : 0.7,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: focused
                        ? <BoxShadow>[BoxShadow(color: horon.ring.withValues(alpha: 0.5), spreadRadius: 2)]
                        : null,
                  ),
                  child: SizedBox(
                    width: _chipRemoveSize,
                    height: _chipRemoveSize,
                    child: Center(
                      child: SizedBox.square(
                        dimension: _chipIconSize,
                        child: CustomPaint(painter: _HoronChipClosePainter(color)),
                      ),
                    ),
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
