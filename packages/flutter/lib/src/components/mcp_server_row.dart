// `mcp-server-row`의 Flutter 대응입니다.
//
// React는 `Button`, `IconButton`, `Menu`를 다른 파일에서 가져다 씁니다. 이 레인에는 그
// 컴포넌트가 아직 없으므로 Configure 버튼과 오버플로 버튼을 이 파일의 private 위젯이
// `button.tsx`(`glass`·`sm`)와 `icon-button.tsx`(`ghost`·`sm`)와 같은 값으로 그립니다.
// `menu`는 `onMenuPressed` 콜백으로 바꿨습니다.
//
// React의 `withKeys`는 같은 태그가 겹쳐도 React key가 겹치지 않게 접미사를 붙이는
// 장치입니다. Flutter에는 key가 필요 없으므로 값만 그립니다.

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// Paper `MCP server row`입니다.
///
/// 40px 타일, 이름과 태그 알약, 설명, `·`로 이은 메타 줄, 오른쪽 상태 알약과
/// Configure·오버플로 액션을 한 줄에 놓습니다. 폭이 `breakpoints.sm`보다 좁으면 액션이
/// 글자 아래로 내려갑니다.
class HoronMcpServerRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronMcpServerRow({
    super.key,
    required this.name,
    this.initials,
    this.tags,
    this.brandTags,
    this.description,
    this.meta,
    this.statusLabel = 'Connected',
    this.configureLabel = 'Configure',
    this.onConfigure,
    this.menuLabel = 'More',
    this.onMenuPressed,
  });

  /// 서버 이름입니다. 타일 글자는 `initials`가 없으면 앞 두 글자를 대문자로 씁니다.
  final String name;

  /// 40px 타일의 두 글자입니다.
  final String? initials;

  /// 이름 옆 보조 태그입니다.
  final List<String>? tags;

  /// 이름 옆 브랜드 색 태그입니다.
  final List<String>? brandTags;

  /// 13/18 설명입니다.
  final String? description;

  /// `·`로 이어 붙이는 12/16 메타 값입니다.
  final List<String>? meta;

  /// 오른쪽 상태 알약 글자입니다.
  final String statusLabel;

  /// Configure 버튼 글자입니다.
  final String configureLabel;

  /// Configure 버튼을 누를 때 부릅니다.
  final VoidCallback? onConfigure;

  /// 오버플로 버튼의 접근성 이름입니다.
  final String menuLabel;

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
    final String letters = initials ?? name.substring(0, name.length < 2 ? name.length : 2).toUpperCase();
    return SizedBox(
      width: theme.space.step(10), // size-10 = 40
      height: theme.space.step(10),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: theme.colors.interactivePrimary, // bg-interactive-primary
          borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
        ),
        child: Center(
          child: Text(
            letters,
            maxLines: 1,
            // text-[14px]/[20px] font-semibold text-interactive-on-primary
            style: theme.text.labelMd.copyWith(
              fontWeight: HoronFontWeight.semibold,
              color: theme.colors.interactiveOnPrimary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _textColumn(HoronThemeData theme) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.step(0.75), // gap-[3px]
      children: <Widget>[
        Wrap(
          spacing: theme.space.s2, // gap-2
          runSpacing: theme.space.s2,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: <Widget>[
            Text(
              name,
              // text-[14px]/[20px] font-semibold text-text-primary
              style: theme.text.labelMd.copyWith(fontWeight: HoronFontWeight.semibold, color: theme.colors.textPrimary),
            ),
            for (final String tag in tags ?? const <String>[])
              _pill(
                theme,
                // bg-overlay-ink-6 dark:bg-bg-surface-6
                background: theme.brightness == Brightness.dark ? theme.colors.bgSurface6 : theme.colors.overlayInk6,
                foreground: theme.colors.textSecondary,
                label: tag,
              ),
            for (final String tag in brandTags ?? const <String>[])
              _pill(
                theme,
                background: theme.colors.accentSky500_18, // bg-accent-sky-500-18
                foreground: theme.colors.textBrand,
                label: tag,
              ),
          ],
        ),
        if (description != null)
          Text(
            description!,
            // text-[13px]/[18px] text-text-secondary
            style: theme.text.bodySm.copyWith(fontSize: 13, height: 18 / 13, color: theme.colors.textSecondary),
          ),
        if (meta != null && meta!.isNotEmpty)
          Wrap(
            spacing: theme.space.s1_5, // gap-1.5
            runSpacing: theme.space.s1_5,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: <Widget>[
              for (int index = 0; index < meta!.length; index++) ...<Widget>[
                if (index > 0)
                  Text(
                    '·',
                    style: theme.text.caption.copyWith(height: 16 / 12, color: theme.colors.textPlaceholder),
                  ),
                Text(
                  meta![index],
                  // text-[12px]/[16px] text-text-placeholder
                  style: theme.text.caption.copyWith(height: 16 / 12, color: theme.colors.textPlaceholder),
                ),
              ],
            ],
          ),
      ],
    );
  }

  Widget _actions(HoronThemeData theme) {
    return Wrap(
      spacing: theme.space.s3_5, // gap-3.5
      runSpacing: theme.space.s3_5,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        _pill(theme, background: theme.colors.accentSky500_18, foreground: theme.colors.textBrand, label: statusLabel),
        _GlassButton(label: configureLabel, icon: const Icon(Icons.settings_outlined), onPressed: onConfigure),
        if (onMenuPressed != null) _GhostIconButton(label: menuLabel, onPressed: onMenuPressed!),
      ],
    );
  }

  Widget _pill(HoronThemeData theme, {required Color background, required Color foreground, required String label}) {
    return Container(
      height: theme.space.step(5.5), // h-5.5 = 22
      padding: EdgeInsets.symmetric(horizontal: theme.space.s2), // px-2
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
      ),
      child: Text(
        label,
        maxLines: 1,
        // text-[12px]/[16px] font-medium
        style: theme.text.labelSm.copyWith(height: 16 / 12, color: foreground),
      ),
    );
  }
}

/// `button.tsx`의 `glass`·`sm` 변형입니다. `h-8`, `px-3`, `text-label-md`, 14px 아이콘입니다.
class _GlassButton extends StatefulWidget {
  const _GlassButton({required this.label, this.onPressed, this.icon});

  final String label;
  final VoidCallback? onPressed;
  final Widget? icon;

  @override
  State<_GlassButton> createState() => _GlassButtonState();
}

class _GlassButtonState extends State<_GlassButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      enabled: widget.onPressed != null,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: widget.onPressed == null ? null : (TapDownDetails details) => setState(() => _pressed = true),
        onTapUp: widget.onPressed == null ? null : (TapUpDetails details) => setState(() => _pressed = false),
        onTapCancel: widget.onPressed == null ? null : () => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: AnimatedScale(
          scale: _pressed && !reduce ? HoronMotion.pressScale : 1, // motion-press
          duration: reduce ? Duration.zero : HoronMotion.pressDuration,
          curve: HoronMotion.pressCurve,
          child: HoronLiquidGlass(
            borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
            child: SizedBox(
              height: theme.space.step(8), // h-8 = 32
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: theme.space.s3), // px-3
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: theme.space.s1_5, // gap-1.5
                  children: <Widget>[
                    if (widget.icon != null)
                      IconTheme.merge(
                        // GearSix size-3.5 = 14
                        data: IconThemeData(size: theme.space.s3_5, color: theme.colors.textPrimary),
                        child: widget.icon!,
                      ),
                    Text(
                      widget.label,
                      maxLines: 1,
                      style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `icon-button.tsx`의 `ghost`·`sm` 변형입니다. 32px 원, 16px 아이콘입니다.
class _GhostIconButton extends StatefulWidget {
  const _GhostIconButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  State<_GhostIconButton> createState() => _GhostIconButtonState();
}

class _GhostIconButtonState extends State<_GhostIconButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      label: widget.label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onPressed,
          child: AnimatedContainer(
            duration: reduce ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            width: theme.space.step(8), // size-8 = 32
            height: theme.space.step(8),
            decoration: BoxDecoration(
              color: _hovered ? theme.colors.overlayInk6 : Colors.transparent, // hover:bg-overlay-ink-6
              shape: BoxShape.circle, // rounded-full
            ),
            child: Center(
              child: Icon(
                Icons.more_horiz,
                size: theme.space.s4, // IconButton sm [&_svg]:size-4 = 16
                color: theme.colors.textPrimary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
