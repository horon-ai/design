// `plugin-row`의 Flutter 대응입니다.
//
// React는 `Button`, `Switch`, `IconButton`, `Menu`를 다른 파일에서 가져다 씁니다.
// Update는 [HoronButton]의 `primary`·`sm`, 오버플로는 [HoronIconButton]의 `ghost`·`sm`을
// 그대로 쓰고, `switch.tsx`는 [HoronSwitch]와 값이 같아 `_ToggleSwitch`로 옮겼습니다.
// `menu`는 메뉴 노드 대신 `onMenuPressed` 콜백으로 바꿨습니다. 메뉴 본문은 호출자가 엽니다.

import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'icon_button.dart';

/// 역량 칩 하나입니다. React `chips` 원소입니다.
@immutable
class HoronPluginRowChip {
  /// 칩을 만듭니다.
  const HoronPluginRowChip({required this.id, required this.label, this.icon});

  /// 칩 키입니다.
  final String id;

  /// 12/16 보조 색 글자입니다.
  final String label;

  /// 앞에 붙는 11px 아이콘입니다.
  final Widget? icon;
}

/// Paper `Plugin row`입니다.
///
/// 40px 타일, 이름·버전·업데이트 알약, 작성자와 인증 표시, 역량 칩, 그리고
/// Update·Switch·오버플로 세 액션을 한 줄에 놓습니다. 폭이 `breakpoints.sm`보다 좁으면
/// 액션이 글자 아래 오른쪽으로 내려갑니다.
class HoronPluginRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronPluginRow({
    super.key,
    required this.initials,
    required this.name,
    this.version,
    this.updateBadge,
    this.author,
    this.verified = false,
    this.chips,
    this.enabled = false,
    this.onEnabledChange,
    this.onUpdate,
    this.updateLabel = 'Update',
    this.toggleLabel = 'Enabled',
    this.overflowLabel = 'More',
    this.onMenuPressed,
  });

  /// 40px 타일에 보이는 두 글자입니다.
  final String initials;

  /// 14/20 이름입니다. 한 줄로 잘립니다.
  final String name;

  /// 이름 옆 모노 `label-sm` 버전입니다.
  final String? version;

  /// 버전 옆 업데이트 알약 글자입니다. 최신이면 생략합니다.
  final String? updateBadge;

  /// 작성자 줄 `label-sm` 글자입니다.
  final String? author;

  /// 작성자 옆에 인증 배지를 붙입니다.
  final bool verified;

  /// 역량 칩 목록입니다.
  final List<HoronPluginRowChip>? chips;

  /// 스위치가 켜져 있는지 여부입니다.
  final bool enabled;

  /// 스위치가 바뀔 때 새 값을 알립니다.
  final ValueChanged<bool>? onEnabledChange;

  /// 값이 있으면 Update 버튼을 그립니다.
  final VoidCallback? onUpdate;

  /// Update 버튼의 글자입니다.
  final String updateLabel;

  /// 스위치의 접근성 이름입니다.
  final String toggleLabel;

  /// 오버플로 버튼의 접근성 이름입니다.
  final String overflowLabel;

  /// 값이 있으면 오버플로 버튼을 그립니다. React의 `menu` 자리입니다.
  final VoidCallback? onMenuPressed;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final Widget tile = _initialsTile(theme);
    final Widget text = _textColumn(theme);
    final Widget actions = _actions(theme);

    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: theme.colors.borderDefault)), // border-b
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: theme.space.s4), // py-4
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool wide = !constraints.maxWidth.isFinite || constraints.maxWidth >= theme.breakpoints.sm;
            if (wide) {
              return Row(
                spacing: theme.space.s3_5, // gap-3.5
                children: <Widget>[
                  tile,
                  Expanded(child: text),
                  actions,
                ],
              );
            }
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: theme.space.s3,
              children: <Widget>[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: theme.space.s3_5,
                  children: <Widget>[
                    tile,
                    Expanded(child: text),
                  ],
                ),
                Align(alignment: Alignment.centerRight, child: actions),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _initialsTile(HoronThemeData theme) {
    return SizedBox(
      width: theme.space.step(10), // size-10 = 40
      height: theme.space.step(10),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: HoronPalette.sky500, // bg-sky-500
          borderRadius: BorderRadius.circular(theme.radius.md), // rounded-md
        ),
        child: Center(
          child: Text(
            initials,
            maxLines: 1,
            // text-label-md text-neutral-50 — Paper `1VKS-0`: 14/20 600
            style: theme.text.labelMd.copyWith(fontWeight: HoronFontWeight.semibold, color: HoronPalette.neutral50),
          ),
        ),
      ),
    );
  }

  Widget _textColumn(HoronThemeData theme) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s1_5, // gap-1.5
      children: <Widget>[
        Row(
          spacing: theme.space.s2, // gap-2
          children: <Widget>[
            Flexible(
              child: Text(
                name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis, // truncate
                // Paper `1VKS-0`: 이름 14/20 600 text-primary
                style: theme.text.labelMd.copyWith(
                  fontWeight: HoronFontWeight.semibold,
                  color: theme.colors.textPrimary,
                ),
              ),
            ),
            if (version != null)
              Text(
                version!,
                maxLines: 1,
                // font-mono text-label-sm text-text-secondary
                style: theme.text.labelSm.copyWith(
                  fontFamily: theme.text.code.fontFamily,
                  fontFamilyFallback: theme.text.code.fontFamilyFallback,
                  color: theme.colors.textSecondary,
                ),
              ),
            if (updateBadge != null)
              Container(
                height: theme.space.step(5.5), // h-5.5 = 22
                padding: EdgeInsets.symmetric(horizontal: theme.space.s2), // px-2
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: theme.colors.accentSky500_18, // bg-accent-sky-500-18
                  borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
                ),
                child: Text(
                  updateBadge!,
                  maxLines: 1,
                  style: theme.text.labelSm.copyWith(color: theme.colors.textBrand),
                ),
              ),
          ],
        ),
        if (author != null)
          Row(
            spacing: theme.space.s1, // gap-1
            children: <Widget>[
              Flexible(
                child: Text(
                  author!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  // text-label-sm text-text-secondary
                  style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
                ),
              ),
              if (verified)
                SizedBox(
                  width: theme.space.step(3.5), // size-3.5 = 14
                  height: theme.space.step(3.5),
                  child: DecoratedBox(
                    decoration: const BoxDecoration(color: HoronPalette.sky500, shape: BoxShape.circle),
                    child: Center(
                      child: Icon(
                        Icons.check,
                        size: theme.space.step(2), // size-2 = 8
                        color: HoronPalette.neutral50,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        if (chips != null && chips!.isNotEmpty)
          Wrap(
            spacing: theme.space.s1_5, // gap-1.5
            runSpacing: theme.space.s1_5,
            children: <Widget>[
              for (final HoronPluginRowChip chip in chips!)
                Container(
                  height: theme.space.step(5.5),
                  padding: EdgeInsets.symmetric(horizontal: theme.space.s2),
                  decoration: BoxDecoration(
                    color: theme.colors.overlayInk6, // bg-overlay-ink-6
                    borderRadius: BorderRadius.circular(theme.radius.full),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    spacing: theme.space.s1,
                    children: <Widget>[
                      if (chip.icon != null)
                        IconTheme.merge(
                          data: IconThemeData(
                            size: theme.space.step(2.75), // [&_svg]:size-2.75 = 11
                            color: theme.colors.textSecondary,
                          ),
                          child: chip.icon!,
                        ),
                      Text(
                        chip.label,
                        maxLines: 1,
                        style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
                      ),
                    ],
                  ),
                ),
            ],
          ),
      ],
    );
  }

  Widget _actions(HoronThemeData theme) {
    return Wrap(
      spacing: theme.space.s2, // gap-2
      runSpacing: theme.space.s2,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        // `motion-reveal-x` — 업데이트가 생기면 버튼이 가로로 자리를 열며 나타납니다.
        HoronReveal(
          axis: Axis.horizontal,
          collapsed: onUpdate == null,
          child: IgnorePointer(
            ignoring: onUpdate == null,
            child: ExcludeFocus(
              excluding: onUpdate == null,
              child: HoronButton(
                label: updateLabel,
                variant: HoronButtonVariant.solid, // variant="solid"
                size: HoronButtonSize.sm, // size="sm"
                icon: const Icon(Icons.arrow_upward, size: 14), // ArrowUp size-3.5
                onPressed: onUpdate,
              ),
            ),
          ),
        ),
        _ToggleSwitch(checked: enabled, label: toggleLabel, onChanged: onEnabledChange),
        if (onMenuPressed != null)
          HoronIconButton(
            icon: const Icon(Icons.more_horiz),
            label: overflowLabel,
            variant: HoronIconButtonVariant.ghost, // variant="ghost"
            size: HoronIconButtonSize.sm, // size="sm"
            onPressed: onMenuPressed,
          ),
      ],
    );
  }
}

/// `switch.tsx`의 기본 `md` 크기입니다. 44x26 트랙, 22px 썸, 안쪽 2px입니다.
class _ToggleSwitch extends StatelessWidget {
  const _ToggleSwitch({required this.checked, this.onChanged, this.label});

  final bool checked;
  final ValueChanged<bool>? onChanged;
  final String? label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool dark = theme.brightness == Brightness.dark;
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    final Duration duration = reduce ? Duration.zero : HoronMotion.colorsDuration;
    final Color thumb = dark
        ? theme
              .colors
              .bgDefault // dark:bg-bg-default (양쪽)
        : checked
        ? theme.colors.interactiveOnPrimary
        : theme.colors.textOnInk;

    return Semantics(
      toggled: checked,
      label: label,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onChanged == null ? null : () => onChanged!(!checked),
        child: AnimatedContainer(
          duration: duration,
          curve: HoronMotion.colorsCurve,
          width: theme.space.step(11), // w-11 = 44
          height: theme.space.step(6.5), // h-6.5 = 26
          padding: EdgeInsets.all(theme.space.s0_5), // p-0.5 = 2
          decoration: BoxDecoration(
            color: checked
                ? theme
                      .colors
                      .interactivePrimary // data-checked:bg-interactive-primary
                : theme.colors.borderStrong, // bg-border-strong
            borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
          ),
          child: AnimatedAlign(
            duration: duration,
            curve: HoronMotion.colorsCurve,
            alignment: checked ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              width: theme.space.step(5.5), // size-5.5 = 22
              height: theme.space.step(5.5),
              decoration: BoxDecoration(color: thumb, shape: BoxShape.circle),
            ),
          ),
        ),
      ),
    );
  }
}
