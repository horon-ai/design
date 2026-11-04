import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../contracts/surface.dart';
import '../glass/glass_geometry.dart';
import '../glass/horon_surface.dart';
import '../glass/horon_veil.dart';
import '../overlay/horon_menu_anchor.dart';
import '../overlay/horon_overlay.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 고를 수 있는 목록 항목 하나입니다. React `PickerFieldProps.items`의 한 줄.
@immutable
class HoronPickerItem {
  /// 값을 만들고 보여 줄 라벨을 받습니다.
  const HoronPickerItem({required this.value, required this.label});

  /// 목록에서 이 항목을 가리키는 값입니다. React `value`.
  final String value;

  /// 줄에 그릴 라벨입니다. React `label`(`ReactNode`).
  final Widget label;
}

/// 요일 하나입니다. React `WeekdayPickerProps.days`의 한 줄.
@immutable
class HoronWeekday {
  /// 요일을 만듭니다.
  const HoronWeekday({required this.value, required this.label, required this.name});

  /// 요일을 가리키는 값입니다. 예: `mon`. React `value`.
  final String value;

  /// 버튼에 보이는 짧은 글자입니다. 예: `M`. React `label`.
  final String label;

  /// 화면 읽기 프로그램이 읽을 이름입니다. 예: `Monday`. React `name`.
  final String name;
}

/// 값 하나를 고르는 필드입니다.
///
/// React `PickerField`(Figma `Time field` 110:765): 40px 높이, 12 반경, 8 간격,
/// 16px 앞 아이콘과 14px 캐럿입니다. 누르면 최대 288px까지 자라는 유리 목록이
/// 8px 아래에 열립니다.
///
/// React의 `surface: "glass" | "inset"`은 `export type`이 아닌 인라인 유니온이라
/// 공개 enum이 될 수 없습니다. variant 게이트가 React에 없는 공개 enum을 거부하므로
/// [glass] 불리언으로 옮겼습니다. 거짓이면 스케줄 카드 안의 4% 잉크 필드가 됩니다.
/// `schedule.tsx`의 `PickerFieldSize`(`ControlSize`)입니다.
enum HoronPickerFieldSize {
  /// `size="sm"` — 높이 32, 폭 144, 목록 줄 32.
  sm,

  /// `size="md"` — 높이 40, 폭 160, 목록 줄 40. 기본값입니다.
  md,

  /// `size="lg"` — 높이 48, 폭 176, 목록 줄 48.
  lg,
}

/// `schedule.tsx`의 `WeekdayPickerSize`(`ControlSize`)입니다.
enum HoronWeekdayPickerSize {
  /// `size="sm"` — 토글 32, `label-sm`, 간격 4.
  sm,

  /// `size="md"` — 토글 36, `label-md`, 간격 6. 기본값입니다.
  md,

  /// `size="lg"` — 토글 44, `label-lg`, 간격 8.
  lg,
}

typedef _PickerMetrics = ({
  double width,
  double height,
  double icon,
  double caret,
  double check,
  double triggerPaddingX,
  double itemHeight,
  double itemGap,
  double itemPaddingX,
  double popupPadding,
  TextStyle value,
  TextStyle item,
});

_PickerMetrics _metricsOf(HoronPickerFieldSize size, HoronThemeData theme) => switch (size) {
  HoronPickerFieldSize.sm => (
    width: theme.space.step(36),
    height: theme.space.step(8),
    icon: 16,
    caret: 16,
    check: 16,
    triggerPaddingX: theme.space.s3,
    itemHeight: theme.space.step(8),
    itemGap: theme.space.s2,
    itemPaddingX: theme.space.s2_5,
    popupPadding: theme.space.s1,
    value: theme.text.bodySm,
    item: theme.text.labelSm,
  ),
  HoronPickerFieldSize.md => (
    width: theme.space.step(40),
    height: theme.space.step(10),
    icon: 16,
    caret: 16,
    check: 16,
    triggerPaddingX: theme.space.s3_5,
    itemHeight: theme.space.step(10),
    itemGap: theme.space.s2_5,
    itemPaddingX: theme.space.s3,
    popupPadding: theme.space.s1_5,
    value: theme.text.bodyMd,
    item: theme.text.labelMd,
  ),
  HoronPickerFieldSize.lg => (
    width: theme.space.step(44),
    height: theme.space.step(12),
    icon: 20,
    caret: 20,
    check: 20,
    triggerPaddingX: theme.space.s5,
    itemHeight: theme.space.step(12),
    itemGap: theme.space.s3,
    itemPaddingX: theme.space.s4,
    popupPadding: theme.space.s2,
    value: theme.text.bodyLg,
    item: theme.text.labelLg,
  ),
};

class HoronPickerField extends StatefulWidget {
  /// 필드를 만듭니다.
  const HoronPickerField({
    super.key,
    required this.items,
    this.value,
    this.defaultValue,
    this.onChanged,
    this.icon,
    this.surface = HoronPickerSurface.solid,
    this.size = HoronPickerFieldSize.md,
    this.label,
  });

  /// 고를 수 있는 항목입니다. React `items`.
  final List<HoronPickerItem> items;

  /// 지금 고른 값입니다. React `value`.
  final String? value;

  /// 처음 고른 값입니다. React `defaultValue`.
  final String? defaultValue;

  /// 값을 골랐을 때 호출됩니다. React `onValueChange`.
  final ValueChanged<String?>? onChanged;

  /// 앞에 놓을 16px 아이콘입니다. 생략하면 시계입니다. React `icon`.
  final Widget? icon;

  /// 표면입니다. 기본값은 [HoronPickerSurface.solid]입니다.
  final HoronPickerSurface surface;

  /// 크기입니다. 기본값은 [HoronPickerFieldSize.md]입니다.
  final HoronPickerFieldSize size;

  /// 필드의 이름입니다. React `aria-label`.
  final String? label;

  @override
  State<HoronPickerField> createState() => _HoronPickerFieldState();
}

class _HoronPickerFieldState extends State<HoronPickerField> {
  /// `max-h-72` — 목록의 최대 높이입니다.
  static const double _maxPopupHeight = 288;

  /// `transition-transform duration-200` — 캐럿이 도는 시간입니다.
  static const Duration _caretTurn = Duration(milliseconds: 200);

  late String? _value;
  final LayerLink _link = LayerLink();
  final MenuController _menu = MenuController();

  /// 트리거가 키보드 포커스를 받았는지입니다.
  bool _focused = false;

  /// 트리거에 포인터가 올라와 있는지입니다(`hover` 테두리).
  bool _hovered = false;

  /// 패널의 실제 크기를 오버레이가 한 번 재었는지입니다.
  ///
  /// [HoronOverlayBody]는 재기 전까지 패널 크기를 0으로 보고 배치를 계산합니다.
  /// 그 첫 계산 결과로 패널을 줄여 버리면, 줄어든 크기가 다시 측정되어 "이 방향에
  /// 들어간다"고 판단되고 뒤집힘이 사라집니다. 그래서 첫 프레임은 줄이지 않고
  /// 실제 높이를 재게 두고, 측정이 끝난 다음부터 배치가 준 높이로 자릅니다.
  bool _panelMeasured = false;

  @override
  void initState() {
    super.initState();
    _value = widget.value ?? widget.defaultValue;
  }

  @override
  void didUpdateWidget(covariant HoronPickerField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) _value = widget.value;
  }

  void _select(HoronPickerItem item) {
    setState(() => _value = item.value);
    widget.onChanged?.call(item.value);
    _menu.close();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    HoronPickerItem? selected;
    for (final HoronPickerItem item in widget.items) {
      if (item.value == _value) {
        selected = item;
        break;
      }
    }

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final _PickerMetrics metrics = _metricsOf(widget.size, theme);
        final double width = constraints.maxWidth.isFinite
            ? math.min(metrics.width, constraints.maxWidth)
            : metrics.width;
        return HoronMenuAnchor(
          controller: _menu,
          child: SizedBox(
            width: width,
            child: CompositedTransformTarget(
              link: _link,
              child: Builder(
                builder: (BuildContext context) {
                  final bool open = MenuController.maybeIsOpenOf(context) ?? false;
                  // 닫히면 다음에 열 때 다시 실제 크기부터 잽니다.
                  if (!open) _panelMeasured = false;
                  return _trigger(theme, metrics, animate, selected, _menu, open);
                },
              ),
            ),
          ),
          overlayBuilder: (BuildContext context, RawMenuOverlayInfo info) => HoronOverlayBody(
            link: _link,
            anchor: info.anchorRect,
            screen: MediaQuery.sizeOf(context),
            safeArea: MediaQuery.paddingOf(context),
            // `sideOffset={8}` — 목록은 필드 8px 아래에 열립니다. 배치가 이미 넣는
            // 기본 간격을 뺀 나머지를 더해, 뒤집혀도 같은 거리를 유지합니다.
            position: HoronOverlayPosition(offset: Offset(0, space.s2 - HoronOverlayPosition.gap)),
            panelBuilder: (BuildContext context, HoronOverlayPlacement placement) {
              // 첫 프레임은 오버레이가 패널 크기를 모르는 채로 배치를 계산합니다.
              // 그 결과로 바로 자르면 줄어든 크기가 측정되어 뒤집힘이 사라지므로,
              // 측정이 끝난 다음 프레임부터 배치가 준 한도로 자릅니다.
              final Widget panel = _panel(theme, metrics, width, _panelMeasured ? placement : null, selected);
              _panelMeasured = true;
              return panel;
            },
          ),
        );
      },
    );
  }

  /// 목록을 열 때 포커스를 받을 줄의 자리입니다. 지금 값이 있으면 그 줄, 없으면 첫
  /// 줄입니다(React Base UI Select의 초기 강조와 같습니다).
  int _initialFocusIndex(HoronPickerItem? selected) {
    if (selected == null) return 0;
    for (final (int index, HoronPickerItem item) in widget.items.indexed) {
      if (item.value == selected.value) return index;
    }
    return 0;
  }

  /// 목록 패널입니다. 배경·패딩·반경·테두리를 테마 토큰으로 직접 그립니다.
  ///
  /// 배치가 고른 쪽에 들어가는 높이([HoronOverlayPlacement.maxHeight])를 넘으면
  /// 목록만 줄여 스크롤합니다. Material 메뉴가 하던 화면 안 밀어 넣기를 오버레이
  /// 배치가 계산하므로, 패널도 그 결과를 따라야 화면 밖으로 나가지 않습니다.
  Widget _panel(
    HoronThemeData theme,
    _PickerMetrics metrics,
    double width,
    HoronOverlayPlacement? placement,
    HoronPickerItem? selected,
  ) {
    final HoronColors colors = theme.colors;
    // 배치가 아직 패널 크기를 모르는 첫 프레임에는 한도를 두지 않습니다.
    final double panelMaxWidth = placement?.maxWidth ?? double.infinity;
    final double panelMaxHeight = placement?.maxHeight ?? double.infinity;
    // 배치 높이는 트리거에서 `gap`만큼 떨어진 자리를 기준으로 셉니다. 이 패널은
    // 그 위에 `s2 - gap`을 더 띄우므로, 그만큼을 빼야 화면 여백 안에서 끝납니다.
    final double extraOffset = math.max(theme.space.s2 - HoronOverlayPosition.gap, 0);
    // 테두리와 패딩도 배치가 준 높이 안에 들어와야 합니다.
    final double contentMaxHeight = math.max(panelMaxHeight - metrics.popupPadding * 2 - extraOffset, 0);
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);
    final Widget list = Padding(
      padding: EdgeInsets.all(metrics.popupPadding),
      child: SizedBox(
        width: math.min(width, panelMaxWidth),
        child: ConstrainedBox(
          // `max-h-72 overflow-y-auto`. 자리가 모자라면 목록이 그 안에서
          // 스크롤합니다.
          constraints: BoxConstraints(maxHeight: math.min(_maxPopupHeight, contentMaxHeight)),
          // Tab이 목록 안에서만 읽기 순서로 돌도록 묶습니다. React는 Base UI
          // Select가 목록을 포커스 스코프 하나로 다루는 것과 같습니다.
          child: FocusTraversalGroup(
            policy: ReadingOrderTraversalPolicy(),
            child: SingleChildScrollView(
              // 패널이 포커스를 받을 때 스크롤 위치를 바꾸지 않도록 자체
              // 컨트롤러를 씁니다.
              primary: false,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                // `gap-0.5`.
                spacing: theme.space.s0_5,
                children: <Widget>[
                  for (final (int index, HoronPickerItem item) in widget.items.indexed)
                    _PickerRow(
                      key: ValueKey<String>('horon-picker-item-${item.value}'),
                      height: metrics.itemHeight,
                      paddingX: metrics.itemPaddingX,
                      gap: metrics.itemGap,
                      checkSize: metrics.check,
                      style: metrics.item,
                      selected: item.value == _value,
                      // React는 목록을 열 때 지금 값(없으면 첫 줄)에 강조를 둡니다.
                      // 그래야 열자마자 Enter가 그 값을 고릅니다.
                      autofocus: index == _initialFocusIndex(selected),
                      onActivate: () => _select(item),
                      label: item.label,
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: panelMaxWidth, maxHeight: panelMaxHeight),
      child: widget.surface == HoronPickerSurface.solid
          // React `border border-border-default bg-bg-surface shadow-popover`.
          ? DecoratedBox(
              decoration: BoxDecoration(
                color: colors.bgSurface,
                borderRadius: radius,
                border: Border.all(color: colors.borderDefault),
                boxShadow: theme.shadows.popover,
              ),
              child: ClipRRect(borderRadius: radius, child: list),
            )
          // React `veil-overlay` — glass·inset 모두 떠 있는 목록은 veil입니다.
          : HoronVeil(kind: HoronVeilKind.overlay, borderRadius: radius, child: list),
    );
  }

  Widget _trigger(
    HoronThemeData theme,
    _PickerMetrics metrics,
    bool animate,
    HoronPickerItem? selected,
    MenuController controller,
    bool open,
  ) {
    final HoronColors colors = theme.colors;
    final BorderRadius radius = BorderRadius.circular(theme.radius.md);

    final Widget content = Padding(
      padding: EdgeInsets.symmetric(horizontal: metrics.triggerPaddingX),
      child: Row(
        spacing: metrics.itemGap,
        children: <Widget>[
          IconTheme.merge(
            data: IconThemeData(size: metrics.icon, color: colors.textSecondary),
            child: SizedBox(
              width: metrics.icon,
              height: metrics.icon,
              child: widget.icon ?? const Icon(Icons.schedule),
            ),
          ),
          Expanded(
            child: DefaultTextStyle.merge(
              key: const Key('horon-picker-value'),
              // `text-body-sm text-text-primary`.
              style: metrics.value.copyWith(color: colors.textPrimary),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              child: selected?.label ?? const SizedBox.shrink(),
            ),
          ),
          AnimatedRotation(
            // `group-data-popup-open:rotate-180`.
            turns: open ? 0.5 : 0,
            duration: animate ? _caretTurn : Duration.zero,
            curve: HoronMotion.easeOutQuint,
            child: Icon(Icons.keyboard_arrow_down, size: metrics.caret, color: colors.textSecondary),
          ),
        ],
      ),
    );

    final Widget body = SizedBox(height: metrics.height, child: content);
    final Widget surface = switch (widget.surface) {
      // React `veil-field` — 필드 상자의 유리 자리를 veil이 대신합니다.
      HoronPickerSurface.glass => HoronVeil(kind: HoronVeilKind.field, borderRadius: radius, child: body),
      // React `bg-overlay-ink-4`.
      HoronPickerSurface.inset => DecoratedBox(
        decoration: BoxDecoration(color: colors.overlayInk4, borderRadius: radius),
        child: body,
      ),
      // React `border border-border-default bg-bg-surface hover:border-border-strong`.
      HoronPickerSurface.solid => DecoratedBox(
        decoration: BoxDecoration(
          color: colors.bgSurface,
          borderRadius: radius,
          border: Border.all(color: _hovered ? colors.borderStrong : colors.borderDefault),
        ),
        child: body,
      ),
    };

    Widget trigger = surface;
    if (_focused) {
      // `focus-within:outline-2 outline-offset-2 outline-text-brand`.
      final double gap = theme.space.s0_5;
      trigger = Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          Positioned(
            left: -gap,
            top: -gap,
            right: -gap,
            bottom: -gap,
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(theme.radius.md + gap),
                  border: Border.all(color: colors.textBrand, width: 2),
                ),
              ),
            ),
          ),
          surface,
        ],
      );
    }

    return Semantics(
      button: true,
      label: widget.label,
      child: FocusableActionDetector(
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              controller.isOpen ? controller.close() : controller.open();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          onEnter: (_) => setState(() => _hovered = true),
          onExit: (_) => setState(() => _hovered = false),
          child: GestureDetector(
            key: const Key('horon-picker-trigger'),
            behavior: HitTestBehavior.opaque,
            onTap: () => controller.isOpen ? controller.close() : controller.open(),
            child: trigger,
          ),
        ),
      ),
    );
  }
}

/// 목록의 한 줄입니다. 호버·포커스·눌림을 직접 그리고 Enter·Space로 값을 고릅니다.
///
/// Material 메뉴 버튼을 걷어내면서도 포커스 이동과 Enter 선택은 유지해야 하므로
/// [FocusableActionDetector]에 [ActivateIntent]를 걸어 둡니다.
class _PickerRow extends StatefulWidget {
  const _PickerRow({
    super.key,
    required this.height,
    required this.paddingX,
    required this.gap,
    required this.checkSize,
    required this.style,
    required this.selected,
    required this.autofocus,
    required this.onActivate,
    required this.label,
  });

  /// 줄 높이입니다. `h-10` 같은 토큰 값입니다.
  final double height;

  /// 좌우 여백입니다.
  final double paddingX;

  /// 라벨과 체크 사이 간격입니다.
  final double gap;

  /// 체크 아이콘 크기입니다.
  final double checkSize;

  /// 라벨 글자 스타일입니다.
  final TextStyle style;

  /// 지금 고른 줄인지 정합니다.
  final bool selected;

  /// 목록을 열 때 이 줄이 포커스를 받는지 정합니다.
  final bool autofocus;

  /// 줄을 누르거나 활성화했을 때 부릅니다.
  final VoidCallback onActivate;

  /// 줄에 그릴 라벨입니다.
  final Widget label;

  @override
  State<_PickerRow> createState() => _PickerRowState();
}

class _PickerRowState extends State<_PickerRow> {
  bool _hovered = false;
  bool _focused = false;
  bool _pressed = false;

  /// 이 줄의 포커스 노드입니다. 첫 줄(또는 지금 값)은 목록이 열린 프레임 뒤에 직접
  /// 포커스를 받습니다. React도 Base UI Select가 목록을 열 때 그 항목으로 이동합니다.
  late final FocusNode _node = FocusNode(debugLabel: 'horon-picker-row');

  @override
  void initState() {
    super.initState();
    if (widget.autofocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _node.requestFocus();
      });
    }
  }

  @override
  void dispose() {
    _node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    // `data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6`.
    final bool lit = _hovered || _focused || _pressed;

    return FocusableActionDetector(
      focusNode: _node,
      onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
      onShowFocusHighlight: (bool value) => setState(() => _focused = value),
      shortcuts: const <ShortcutActivator, Intent>{
        SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
      },
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onActivate();
            return null;
          },
        ),
      },
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onActivate,
          onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
          onTapUp: (TapUpDetails details) {
            if (_pressed) setState(() => _pressed = false);
          },
          onTapCancel: () {
            if (_pressed) setState(() => _pressed = false);
          },
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            height: widget.height,
            padding: EdgeInsets.symmetric(horizontal: widget.paddingX),
            // `rounded-md`.
            decoration: BoxDecoration(
              color: lit ? colors.overlayInk6 : Colors.transparent,
              borderRadius: BorderRadius.circular(theme.radius.md),
            ),
            child: Row(
              spacing: widget.gap,
              children: <Widget>[
                Expanded(
                  child: DefaultTextStyle.merge(
                    // `text-label-md text-text-primary`.
                    style: widget.style.copyWith(color: colors.textPrimary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    child: widget.label,
                  ),
                ),
                if (widget.selected)
                  _PickerCheck(reduceMotion: reduceMotion, size: widget.checkSize, color: colors.textPrimary),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 요일을 여러 개 고르는 36px 둥근 토글 줄입니다.
///
/// React `WeekdayPicker`(Figma `Weekday picker` 110:765): 켜지면 잉크색 바탕에
/// 밝은 글자, 꺼지면 6% 잉크 바탕에 보조 글자입니다. 폭이 모자라면 다음 줄로
/// 넘어갑니다.
class HoronWeekdayPicker extends StatefulWidget {
  /// 요일 줄을 만듭니다.
  const HoronWeekdayPicker({
    super.key,
    required this.days,
    this.value,
    this.defaultValue,
    this.onChanged,
    this.size = HoronWeekdayPickerSize.md,
    this.label,
  });

  /// 표시 순서대로 놓을 요일입니다. React `days`.
  final List<HoronWeekday> days;

  /// 지금 켜진 요일 값입니다. React `value`.
  final List<String>? value;

  /// 처음 켜진 요일 값입니다. React `defaultValue`.
  final List<String>? defaultValue;

  /// 켜진 요일이 바뀔 때 호출됩니다. React `onValueChange`.
  final ValueChanged<List<String>>? onChanged;

  /// 크기입니다. 기본값은 [HoronWeekdayPickerSize.md]입니다.
  final HoronWeekdayPickerSize size;

  /// 줄의 이름입니다. React `aria-label`(기본 `Days`).
  final String? label;

  @override
  State<HoronWeekdayPicker> createState() => _HoronWeekdayPickerState();
}

class _HoronWeekdayPickerState extends State<HoronWeekdayPicker> {
  late List<String> _selected;

  @override
  void initState() {
    super.initState();
    _selected = <String>[...?widget.value ?? widget.defaultValue];
  }

  @override
  void didUpdateWidget(covariant HoronWeekdayPicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value && widget.value != null) {
      _selected = <String>[...widget.value!];
    }
  }

  void _toggle(String value) {
    final Set<String> next = _selected.toSet();
    if (!next.remove(value)) next.add(value);
    // React `ToggleGroup`은 표시 순서대로 값을 돌려줍니다.
    final List<String> ordered = <String>[
      for (final HoronWeekday day in widget.days)
        if (next.contains(day.value)) day.value,
    ];
    setState(() => _selected = ordered);
    widget.onChanged?.call(ordered);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final (double gap, double toggle) = switch (widget.size) {
      HoronWeekdayPickerSize.sm => (space.s1, space.step(8)),
      HoronWeekdayPickerSize.md => (space.s1_5, space.step(9)),
      HoronWeekdayPickerSize.lg => (space.s2, space.step(11)),
    };
    return Semantics(
      container: true,
      label: widget.label ?? 'Days',
      child: Wrap(
        spacing: gap,
        runSpacing: gap,
        children: <Widget>[
          for (final HoronWeekday day in widget.days)
            _WeekdayToggle(
              key: ValueKey<String>('horon-weekday-${day.value}'),
              label: day.label,
              name: day.name,
              selected: _selected.contains(day.value),
              size: toggle,
              textStyle: switch (widget.size) {
                HoronWeekdayPickerSize.sm => theme.text.labelSm,
                HoronWeekdayPickerSize.md => theme.text.labelMd,
                HoronWeekdayPickerSize.lg => theme.text.labelLg,
              },
              onTap: () => _toggle(day.value),
            ),
        ],
      ),
    );
  }
}

/// 요일 토글 하나입니다. React `Toggle`과 같은 눌림 배율을 씁니다.
class _WeekdayToggle extends StatefulWidget {
  const _WeekdayToggle({
    super.key,
    required this.label,
    required this.name,
    required this.selected,
    required this.size,
    required this.textStyle,
    required this.onTap,
  });

  final String label;
  final String name;
  final bool selected;
  final double size;
  final TextStyle textStyle;
  final VoidCallback onTap;

  @override
  State<_WeekdayToggle> createState() => _WeekdayToggleState();
}

class _WeekdayToggleState extends State<_WeekdayToggle> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      toggled: widget.selected,
      label: widget.name,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
        onTapUp: (TapUpDetails details) => setState(() => _pressed = false),
        onTapCancel: () => setState(() => _pressed = false),
        onTap: widget.onTap,
        child: AnimatedScale(
          // `motion-press` — 누르면 0.97.
          scale: _pressed ? HoronMotion.pressScale : 1,
          duration: animate ? HoronMotion.pressDuration : Duration.zero,
          curve: HoronMotion.pressCurve,
          child: AnimatedContainer(
            duration: animate ? HoronMotion.colorsDuration : Duration.zero,
            curve: HoronMotion.colorsCurve,
            width: widget.size,
            height: widget.size,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              // `bg-overlay-ink-6` / `data-pressed:bg-interactive-primary`.
              color: widget.selected ? colors.interactivePrimary : colors.overlayInk6,
            ),
            // `text-label-md text-text-secondary` / `data-pressed:text-text-inverse`.
            child: Text(
              widget.label,
              maxLines: 1,
              // `data-pressed:text-interactive-on-primary`.
              style: widget.textStyle.copyWith(
                color: widget.selected ? colors.interactiveOnPrimary : colors.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 스케줄 카드입니다.
///
/// React `ScheduleCard`(Figma `Routine schedule card` 110:765): 380px 유리 카드에
/// 18px 여백과 14px 간격을 씁니다. 제목 줄에는 반복 아이콘이, 아래쪽에는 "다음
/// 실행" 줄이 하늘색 16% 바탕으로 들어갑니다.
class HoronScheduleCard extends StatelessWidget {
  /// 카드를 만듭니다.
  const HoronScheduleCard({
    super.key,
    required this.title,
    required this.children,
    this.nextRun,
    this.surface = HoronSurface.solid,
  });

  /// 표면입니다. 기본값은 [HoronSurface.solid]입니다.
  final HoronSurface surface;

  /// 카드의 제목입니다. React `title`(`ReactNode`).
  final Widget title;

  /// 제목 아래에 14px 간격으로 쌓을 내용입니다. React `children`.
  final List<Widget> children;

  /// 카드 맨 아래의 "다음 실행" 줄입니다. React `nextRun`.
  final Widget? nextRun;

  /// `w-95` — 카드의 폭입니다. 부모가 더 좁으면 그 폭을 따릅니다.
  static const double _width = 380;

  /// `size-4` — 제목 줄의 반복 아이콘입니다.
  static const double _repeatIcon = 16;

  /// `size-4` — "다음 실행" 줄의 달력 아이콘입니다.
  static const double _nextRunIcon = 16;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite ? math.min(_width, constraints.maxWidth) : _width;
        return SizedBox(
          width: width,
          child: HoronSurfaceLayer(
            surface: surface,
            tier: HoronGlassTier.thick,
            borderRadius: radius,
            child: DecoratedBox(
              key: const Key('horon-schedule-card-surface'),
              decoration: BoxDecoration(
                borderRadius: radius,
                border: Border.all(color: colors.glassRimStrong),
              ),
              child: Padding(
                // `p-5` — md 카드의 20px 여백입니다.
                padding: EdgeInsets.all(space.s5),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  // `gap-4`.
                  spacing: space.s4,
                  children: <Widget>[
                    Row(
                      // `gap-2.5`.
                      spacing: space.s2_5,
                      children: <Widget>[
                        Icon(Icons.repeat, size: _repeatIcon, color: colors.textPrimary),
                        Expanded(
                          child: DefaultTextStyle.merge(
                            // `text-label-lg text-text-primary`.
                            style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                            child: title,
                          ),
                        ),
                      ],
                    ),
                    ...children,
                    if (nextRun != null)
                      Container(
                        key: const Key('horon-schedule-card-next-run'),
                        // `rounded-md bg-accent-sky-500-16 px-3 py-2`.
                        padding: EdgeInsets.symmetric(horizontal: space.s3, vertical: space.s2),
                        decoration: BoxDecoration(
                          color: colors.accentSky500_16,
                          borderRadius: BorderRadius.circular(theme.radius.md),
                        ),
                        child: Row(
                          spacing: space.s2,
                          children: <Widget>[
                            Icon(Icons.calendar_today_outlined, size: _nextRunIcon, color: colors.textPrimary),
                            Expanded(
                              child: DefaultTextStyle.merge(
                                // `text-label-md text-text-primary`.
                                style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                                child: nextRun!,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// 스케줄 카드 안의 캡션 붙은 묶음입니다. 예: "Repeat", "Days".
///
/// React `ScheduleSection`: 작은 보조 글자 캡션 아래에 6px 간격으로 내용을
/// 쌓습니다.
class HoronScheduleSection extends StatelessWidget {
  /// 묶음을 만듭니다.
  const HoronScheduleSection({super.key, required this.label, required this.children});

  /// 묶음의 캡션입니다. React `label`(`ReactNode`).
  final Widget label;

  /// 캡션 아래에 쌓을 내용입니다. React `children`.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    return Column(
      mainAxisSize: MainAxisSize.min,
      // React `flex-col`의 stretch 대신 start를 씁니다. React는 필드에 `w-40`을
      // 직접 적어 stretch를 막으므로, 자식이 자기 폭을 유지하는 쪽이 같은 그림입니다.
      crossAxisAlignment: CrossAxisAlignment.start,
      // `gap-2`.
      spacing: space.s2,
      children: <Widget>[
        DefaultTextStyle.merge(
          // `text-caption text-text-secondary`.
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
          child: label,
        ),
        ...children,
      ],
    );
  }
}

/// 고른 줄의 체크입니다. React `Check className="animate-pop-in"`.
///
/// 줄이 열릴 때 체크가 0.6배에서 제 크기로 커지며 나타납니다. 목록을 다시 열어도
/// 체크는 새로 만들어지므로 같은 동작이 한 번 더 보입니다.
class _PickerCheck extends StatelessWidget {
  const _PickerCheck({required this.reduceMotion, required this.size, required this.color});

  final bool reduceMotion;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: Icon(Icons.check, size: size, color: color),
    );
  }
}
