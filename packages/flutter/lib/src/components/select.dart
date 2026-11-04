import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../overlay/horon_menu_anchor.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';
import 'input_group.dart';

/// `select.tsx`의 `SelectSize`(`ControlSize`)입니다.
enum HoronSelectSize {
  /// `size="sm"` — 높이 32, `label-sm` 행, 아이콘 16px.
  sm,

  /// `size="md"` — 높이 40, `label-md` 행, 아이콘 18px. 기본값입니다.
  md,

  /// `size="lg"` — 높이 48, `label-lg` 행, 아이콘 20px.
  lg,
}

/// React `SelectItemData`를 옮긴 항목입니다.
class HoronSelectItem {
  /// 항목을 만듭니다.
  const HoronSelectItem({required this.value, required this.label, this.selectedLabel, this.disabled = false});

  /// 항목의 값입니다.
  final String value;

  /// 목록과 검색에 쓰는 문구입니다.
  final String label;

  /// 선택된 뒤 트리거에 보이는 짧은 문구입니다. 없으면 [label]을 씁니다.
  final String? selectedLabel;

  /// 고를 수 없는 항목인지 여부입니다.
  final bool disabled;
}

typedef _SelectMetrics = ({
  double height,
  double paddingX,
  double gap,
  double caret,
  double rowHeight,
  double rowGap,
  double rowPaddingX,
  double check,
  TextStyle rowText,
});

_SelectMetrics _metricsOf(HoronSelectSize size, HoronThemeData theme) => switch (size) {
  HoronSelectSize.sm => (
    height: theme.space.step(8),
    paddingX: theme.space.s3,
    gap: theme.space.s1_5,
    caret: 16,
    rowHeight: theme.space.step(8),
    rowGap: theme.space.s2,
    rowPaddingX: theme.space.s2_5,
    check: 16,
    rowText: theme.text.labelSm,
  ),
  HoronSelectSize.md => (
    height: theme.space.step(10),
    paddingX: theme.space.s3_5,
    gap: theme.space.s2,
    caret: 16,
    rowHeight: theme.space.step(10),
    rowGap: theme.space.s2_5,
    rowPaddingX: theme.space.s3,
    check: 18,
    rowText: theme.text.labelMd,
  ),
  HoronSelectSize.lg => (
    height: theme.space.step(12),
    paddingX: theme.space.s5,
    gap: theme.space.s2_5,
    caret: 20,
    rowHeight: theme.space.step(12),
    rowGap: theme.space.s3,
    rowPaddingX: theme.space.s4,
    check: 20,
    rowText: theme.text.labelLg,
  ),
};

/// `select.tsx`의 `SelectSize`에 대응하는 필드 텍스트입니다.
HoronInputSize _inputSizeOf(HoronSelectSize size) => switch (size) {
  HoronSelectSize.sm => HoronInputSize.sm,
  HoronSelectSize.md => HoronInputSize.md,
  HoronSelectSize.lg => HoronInputSize.lg,
};

/// `input_group.tsx`의 크기를 `select.tsx`의 크기로 옮깁니다.
HoronSelectSize _selectSizeOf(HoronInputGroupSize size) => switch (size) {
  HoronInputGroupSize.sm => HoronSelectSize.sm,
  HoronInputGroupSize.md => HoronSelectSize.md,
  HoronInputGroupSize.lg => HoronSelectSize.lg,
};

/// React `Select`(Figma 58:162 트리거 + 88:495 목록)를 옮긴 셀렉트입니다.
///
/// 트리거는 40px 필드에 16px 캐럿을 두고, Solid 표면만 `body-lg`, 나머지는
/// `body-md`로 값을 그립니다. 목록은 두꺼운 유리(반경 20, 안쪽 여백 6), 40px 행,
/// 선택·강조 행에 `overlay-ink-6`과 체크 아이콘(18px)을 씁니다.
///
/// React의 `variant="chip"`은 32px `bg-subtle` 알약입니다. 이 값을 public enum으로
/// 두면 React가 `export type`으로 선언하지 않은 어휘가 되어 variants 게이트가
/// 실패하므로, Flutter에서는 [chip] 불리언으로 받습니다.
class HoronSelect extends StatefulWidget {
  /// 셀렉트를 만듭니다.
  const HoronSelect({
    super.key,
    required this.items,
    this.value,
    this.placeholder = 'Select',
    this.surface = HoronInputSurface.solid,
    this.size = HoronSelectSize.md,
    this.invalid = false,
    this.chip = false,
    this.segment = false,
    this.showIndicator = true,
    this.disabled = false,
    this.onChanged,
    this.semanticLabel,
  });

  /// 목록에 보일 항목입니다.
  final List<HoronSelectItem> items;

  /// 선택된 값입니다. 지정하면 부모가 값을 소유합니다.
  final String? value;

  /// 값이 없을 때 트리거에 보이는 문구입니다.
  final String placeholder;

  /// 트리거 표면입니다. 기본값은 불투명 `solid`이고, 유리 패널 위에서는 `glass`를
  /// 넘깁니다. `chip`이면 무시합니다.
  final HoronInputSurface surface;

  /// 크기입니다. `segment`이면 그룹 크기를 씁니다. 기본값은 [HoronSelectSize.md]입니다.
  final HoronSelectSize size;

  /// 오류 상태입니다. 테두리가 `border-danger`가 됩니다.
  final bool invalid;

  /// 32px `bg-subtle` 알약 트리거를 쓸지 여부입니다.
  final bool chip;

  /// [HoronInputGroup]의 앞·뒤 칸으로 쓰는 표면입니다. 그룹의 크기와 비활성 상태를
  /// 따르고, 캐럿만 있는 tinted 칸으로 그립니다.
  final bool segment;

  /// 트리거의 캐럿을 그릴지 여부입니다.
  final bool showIndicator;

  /// 트리거를 누를 수 없게 합니다.
  final bool disabled;

  /// 값을 고를 때 호출됩니다.
  final ValueChanged<String>? onChanged;

  /// 접근성 이름입니다. React `aria-label`에 대응합니다.
  final String? semanticLabel;

  @override
  State<HoronSelect> createState() => _HoronSelectState();
}

class _HoronSelectState extends State<HoronSelect> {
  final MenuController _controller = MenuController();
  final LayerLink _link = LayerLink();

  String? _internalValue;

  String? get _value => widget.value ?? _internalValue;

  HoronInputGroupScope? get _group => HoronInputGroupScope.maybeOf(context);

  HoronSelectSize get _size => widget.segment && _group != null ? _selectSizeOf(_group!.size) : widget.size;

  bool get _disabled => widget.disabled || (widget.segment && (_group?.disabled ?? false));

  void _toggle() {
    if (_disabled) return;
    if (_controller.isOpen) {
      _controller.close();
    } else {
      _controller.open();
    }
  }

  void _select(HoronSelectItem item) {
    if (item.disabled) return;
    if (widget.value == null) setState(() => _internalValue = item.value);
    _controller.close();
    widget.onChanged?.call(item.value);
  }

  @override
  Widget build(BuildContext context) {
    return HoronMenuAnchor(
      controller: _controller,
      overlayBuilder: _buildPopup,
      // RawMenuAnchor의 열림 상태 스코프 안에서 빌드되므로, 열림 값을 여기서 읽어
      // 시맨틱과 캐럿에 씁니다.
      child: Builder(
        builder: (BuildContext context) {
          final bool open = MenuController.maybeIsOpenOf(context) ?? false;
          return CompositedTransformTarget(
            link: _link,
            child: Semantics(
              button: true,
              label: widget.semanticLabel,
              value: _labelOf(_value) ?? widget.placeholder,
              expanded: open,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: _toggle,
                child: widget.chip
                    ? _buildChipTrigger(context, open)
                    : widget.segment
                    ? _buildSegmentTrigger(context, open)
                    : _buildFieldTrigger(context, open),
              ),
            ),
          );
        },
      ),
    );
  }

  String? _labelOf(String? value) {
    if (value == null) return null;
    for (final HoronSelectItem item in widget.items) {
      if (item.value == value) return item.selectedLabel ?? item.label;
    }
    return null;
  }

  TextStyle _valueStyle(HoronThemeData horon) {
    final HoronColors colors = horon.colors;
    final String? value = _value;
    final Color color = widget.disabled
        ? colors.textDisabled
        : value == null
        ? colors.textPlaceholder
        : colors.textPrimary;
    if (widget.chip) {
      // React: `text-[13px]/[18px] font-medium` — 토큰에 없는 13/18만 덮어쓰고
      // 서체·굵기·자간은 `label-md`에서 가져옵니다.
      return horon.text.labelMd.copyWith(fontSize: 13, height: 18 / 13, color: color);
    }
    if (widget.segment) {
      final HoronSegmentMetrics segment = widget.segment && _group != null
          ? horonSegmentMetrics(_group!.size, horon)
          : horonSegmentMetrics(HoronInputGroupSize.md, horon);
      return segment.textStyle.copyWith(color: color);
    }
    // React는 md-solid만 body-lg를 씁니다. 나머지 크기는 필드 텍스트 단계를 따릅니다.
    final HoronFieldMetrics field = horonFieldMetrics(_inputSizeOf(widget.size), horon);
    final TextStyle base = widget.size == HoronSelectSize.md && widget.surface == HoronInputSurface.solid
        ? horon.text.bodyLg
        : field.textStyle;
    return base.copyWith(color: color);
  }

  Widget _valueText(HoronThemeData horon) {
    return Text(
      _labelOf(_value) ?? widget.placeholder,
      style: _valueStyle(horon),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _caret(HoronThemeData horon, bool open) {
    return AnimatedRotation(
      turns: open ? 0.5 : 0,
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : _caretDuration,
      curve: HoronMotion.easeOutQuint,
      child: IconTheme.merge(
        data: IconThemeData(
          size: widget.segment && _group != null
              ? horonSegmentMetrics(_group!.size, horon).icon
              : _metricsOf(_size, horon).caret,
          color: horon.colors.textSecondary,
        ),
        child: const Icon(Icons.keyboard_arrow_down),
      ),
    );
  }

  Widget _buildFieldTrigger(BuildContext context, bool open) {
    final HoronThemeData horon = HoronTheme.of(context);
    final _SelectMetrics metrics = _metricsOf(widget.size, horon);
    return SizedBox(
      height: metrics.height,
      child: HoronFieldBox(
        surface: widget.surface,
        invalid: widget.invalid,
        enabled: !_disabled,
        padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
        child: Row(
          spacing: metrics.gap,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Expanded(child: _valueText(horon)),
            if (widget.showIndicator) _caret(horon, open),
          ],
        ),
      ),
    );
  }

  Widget _buildSegmentTrigger(BuildContext context, bool open) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronInputGroupSize groupSize = _group?.size ?? HoronInputGroupSize.md;
    final HoronSegmentMetrics metrics = horonSegmentMetrics(groupSize, horon);
    return SizedBox(
      height: double.infinity,
      child: ColoredBox(
        color: horon.colors.overlayInk4,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: metrics.gap,
            children: <Widget>[
              Flexible(child: _valueText(horon)),
              if (widget.showIndicator) _caret(horon, open),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChipTrigger(BuildContext context, bool open) {
    final HoronThemeData horon = HoronTheme.of(context);
    return AnimatedContainer(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: _chipHeight,
      padding: EdgeInsets.symmetric(horizontal: horon.space.s3),
      decoration: BoxDecoration(
        color: horon.colors.bgSubtle,
        borderRadius: BorderRadius.all(Radius.circular(horon.radius.full)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: horon.space.s1,
        children: <Widget>[
          Flexible(child: _valueText(horon)),
          if (widget.showIndicator) _caret(horon, open),
        ],
      ),
    );
  }

  Widget _buildPopup(BuildContext context, RawMenuOverlayInfo info) {
    final HoronThemeData horon = HoronTheme.of(context);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final BorderRadius radius = BorderRadius.all(Radius.circular(horon.radius.xl));

    final Widget list = Padding(
      padding: EdgeInsets.all(horon.space.s1_5),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        spacing: horon.space.s0_5,
        children: <Widget>[for (final HoronSelectItem item in widget.items) _row(horon, item)],
      ),
    );

    return CompositedTransformFollower(
      link: _link,
      targetAnchor: Alignment.bottomLeft,
      followerAnchor: Alignment.topLeft,
      offset: const Offset(0, _popupOffset),
      child: Align(
        alignment: Alignment.topLeft,
        child: TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: 0, end: 1),
          duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
          curve: HoronMotion.easeOutQuint,
          builder: (BuildContext context, double value, Widget? child) {
            return Opacity(
              opacity: value,
              child: Transform.scale(
                scale: HoronMotion.popupEnterScale + (1 - HoronMotion.popupEnterScale) * value,
                alignment: Alignment.topLeft,
                child: child,
              ),
            );
          },
          child: SizedBox(
            width: math.max(info.anchorRect.width, _minPopupWidth),
            child: ClipRRect(
              borderRadius: radius,
              child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: list),
            ),
          ),
        ),
      ),
    );
  }

  Widget _row(HoronThemeData horon, HoronSelectItem item) {
    final HoronColors colors = horon.colors;
    final _SelectMetrics metrics = _metricsOf(_size, horon);
    final bool selected = _value == item.value;
    final Color background = selected ? colors.overlayInk6 : Colors.transparent;
    final Widget content = AnimatedContainer(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: metrics.rowHeight,
      padding: EdgeInsets.symmetric(horizontal: metrics.rowPaddingX),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.all(Radius.circular(horon.radius.md))),
      child: Row(
        spacing: metrics.rowGap,
        children: <Widget>[
          Expanded(
            child: Text(
              item.label,
              style: metrics.rowText.copyWith(color: colors.textPrimary),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (selected)
            IconTheme.merge(
              data: IconThemeData(size: metrics.check, color: colors.textPrimary),
              child: const Icon(Icons.check),
            ),
        ],
      ),
    );

    return Opacity(
      opacity: item.disabled ? 0.4 : 1,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: item.disabled ? null : () => _select(item),
        child: MouseRegion(cursor: item.disabled ? SystemMouseCursors.basic : SystemMouseCursors.click, child: content),
      ),
    );
  }
}

/// `h-8` — 칩 트리거 높이입니다. 칩은 크기를 갖지 않습니다.
const double _chipHeight = 32;

/// `sideOffset={8}` — 팝업이 트리거에서 떨어지는 거리입니다.
const double _popupOffset = 8;

/// 목록이 트리거 폭을 못 재었을 때 쓰는 최소 폭입니다.
const double _minPopupWidth = 160;

/// `duration-200` — 캐럿 회전 시간입니다.
const Duration _caretDuration = Duration(milliseconds: 200);
