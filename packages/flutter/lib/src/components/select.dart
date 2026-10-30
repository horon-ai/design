import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// React `SelectItemData`를 옮긴 항목입니다.
class HoronSelectItem {
  /// 항목을 만듭니다.
  const HoronSelectItem({required this.value, required this.label, this.disabled = false});

  /// 항목의 값입니다.
  final String value;

  /// 목록과 트리거에 보이는 문구입니다.
  final String label;

  /// 고를 수 없는 항목인지 여부입니다.
  final bool disabled;
}

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
    this.surface = HoronInputSurface.glass,
    this.invalid = false,
    this.chip = false,
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

  /// 트리거 표면입니다. `chip`이면 무시합니다.
  final HoronInputSurface surface;

  /// 오류 상태입니다. 테두리가 `border-danger`가 됩니다.
  final bool invalid;

  /// 32px `bg-subtle` 알약 트리거를 쓸지 여부입니다.
  final bool chip;

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
  final OverlayPortalController _portal = OverlayPortalController();
  final LayerLink _link = LayerLink();
  final GlobalKey _triggerKey = GlobalKey();
  final Object _tapGroup = Object();

  String? _internalValue;
  double _anchorWidth = 0;
  bool _open = false;

  String? get _value => widget.value ?? _internalValue;

  @override
  void initState() {
    super.initState();
    _scheduleMeasure();
  }

  void _scheduleMeasure() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final RenderBox? box = _triggerKey.currentContext?.findRenderObject() as RenderBox?;
      if (box == null || !box.hasSize) return;
      if (box.size.width == _anchorWidth) return;
      setState(() => _anchorWidth = box.size.width);
    });
  }

  void _toggle() {
    if (widget.disabled) return;
    if (_open) {
      _close();
    } else {
      _portal.show();
      _scheduleMeasure();
      setState(() => _open = true);
    }
  }

  void _close() {
    if (!_open) return;
    _portal.hide();
    setState(() => _open = false);
  }

  void _select(HoronSelectItem item) {
    if (item.disabled) return;
    if (widget.value == null) setState(() => _internalValue = item.value);
    _close();
    widget.onChanged?.call(item.value);
  }

  @override
  Widget build(BuildContext context) {
    return OverlayPortal(
      controller: _portal,
      overlayChildBuilder: _buildPopup,
      child: CompositedTransformTarget(
        link: _link,
        child: TapRegion(
          groupId: _tapGroup,
          child: Semantics(
            button: true,
            label: widget.semanticLabel,
            value: _labelOf(_value) ?? widget.placeholder,
            child: GestureDetector(
              key: _triggerKey,
              behavior: HitTestBehavior.opaque,
              onTap: _toggle,
              child: widget.chip ? _buildChipTrigger(context) : _buildFieldTrigger(context),
            ),
          ),
        ),
      ),
    );
  }

  String? _labelOf(String? value) {
    if (value == null) return null;
    for (final HoronSelectItem item in widget.items) {
      if (item.value == value) return item.label;
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
    final TextStyle base = widget.surface == HoronInputSurface.solid ? horon.text.bodyLg : horon.text.bodyMd;
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

  Widget _caret(HoronThemeData horon) {
    return AnimatedRotation(
      turns: _open ? 0.5 : 0,
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : _caretDuration,
      curve: HoronMotion.easeOutQuint,
      child: IconTheme.merge(
        data: IconThemeData(size: _caretSize, color: horon.colors.textSecondary),
        child: const Icon(Icons.keyboard_arrow_down),
      ),
    );
  }

  Widget _buildFieldTrigger(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      height: _fieldHeight,
      child: HoronFieldBox(
        surface: widget.surface,
        invalid: widget.invalid,
        enabled: !widget.disabled,
        child: Row(
          spacing: horon.space.s2,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Expanded(child: _valueText(horon)),
            if (widget.showIndicator) _caret(horon),
          ],
        ),
      ),
    );
  }

  Widget _buildChipTrigger(BuildContext context) {
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
          if (widget.showIndicator) _caret(horon),
        ],
      ),
    );
  }

  Widget _buildPopup(BuildContext context) {
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
        child: TapRegion(
          groupId: _tapGroup,
          onTapOutside: (_) => _close(),
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
              width: math.max(_anchorWidth, _minPopupWidth),
              child: ClipRRect(
                borderRadius: radius,
                child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: list),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _row(HoronThemeData horon, HoronSelectItem item) {
    final HoronColors colors = horon.colors;
    final bool selected = _value == item.value;
    final Color background = selected ? colors.overlayInk6 : Colors.transparent;
    final Widget content = AnimatedContainer(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: _rowHeight,
      padding: EdgeInsets.symmetric(horizontal: horon.space.s3),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.all(Radius.circular(horon.radius.md))),
      child: Row(
        spacing: horon.space.s2_5,
        children: <Widget>[
          Expanded(
            child: Text(
              item.label,
              style: horon.text.labelMd.copyWith(color: colors.textPrimary),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (selected)
            IconTheme.merge(
              data: IconThemeData(size: _checkSize, color: colors.textPrimary),
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

/// `h-10` — 트리거 높이입니다.
const double _fieldHeight = 40;

/// `h-10` — 목록 행 높이입니다.
const double _rowHeight = 40;

/// `h-8` — 칩 트리거 높이입니다.
const double _chipHeight = 32;

/// `[&_svg]:size-4` — 캐럿 크기입니다.
const double _caretSize = 16;

/// `[&_svg]:size-4.5` — 선택 표시 크기입니다.
const double _checkSize = 18;

/// `sideOffset={8}` — 팝업이 트리거에서 떨어지는 거리입니다.
const double _popupOffset = 8;

/// 목록이 트리거 폭을 못 재었을 때 쓰는 최소 폭입니다.
const double _minPopupWidth = 160;

/// `duration-200` — 캐럿 회전 시간입니다.
const Duration _caretDuration = Duration(milliseconds: 200);
