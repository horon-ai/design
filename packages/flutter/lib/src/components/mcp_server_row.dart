// `mcp-server-row`의 Flutter 대응입니다.
//
// React는 `Button`, `IconButton`, `Menu`를 다른 파일에서 가져다 씁니다. Configure는
// [HoronButton]의 `solid`·`sm`, 오버플로는 [HoronIconButton]의 `ghost`·`sm`을 그대로
// 씁니다. `menu`는 메뉴 노드 대신 `onMenuPressed` 콜백으로 바꿨습니다.
//
// React의 `withKeys`는 같은 태그가 겹쳐도 React key가 겹치지 않게 접미사를 붙이는
// 장치입니다. Flutter에는 key가 필요 없으므로 값만 그립니다.

import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'icon_button.dart';

/// `mcp-server-row.tsx`의 `McpServerStatusTone`입니다.
///
/// 상태 알약의 바탕색과 점 색을 고릅니다.
enum HoronMcpServerStatusTone {
  /// `connected` — 잉크 바탕에 기본 글자, 파란 라이브 점입니다. 기본값입니다.
  connected,

  /// `warning` — 붉은 기운의 바탕에 위험 글자와 점입니다.
  warning,

  /// `neutral` — 잉크 바탕에 보조 글자와 흐린 점입니다.
  neutral,
}

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
    this.statusTone = HoronMcpServerStatusTone.connected,
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

  /// `body-sm` 설명입니다.
  final String? description;

  /// `·`로 이어 붙이는 `label-sm` 메타 값입니다.
  final List<String>? meta;

  /// 오른쪽 상태 알약 글자입니다.
  final String statusLabel;

  /// 상태 알약의 색입니다. 기본값은 [HoronMcpServerStatusTone.connected]입니다.
  final HoronMcpServerStatusTone statusTone;

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
          color: HoronPalette.sky500, // bg-sky-500
          borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
        ),
        child: Center(
          child: Text(
            letters,
            maxLines: 1,
            // text-label-md text-neutral-50
            style: theme.text.labelMd.copyWith(color: HoronPalette.neutral50),
          ),
        ),
      ),
    );
  }

  Widget _textColumn(HoronThemeData theme) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s1, // gap-1
      children: <Widget>[
        Wrap(
          spacing: theme.space.s2, // gap-2
          runSpacing: theme.space.s2,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: <Widget>[
            Text(
              name,
              // text-label-md font-semibold text-text-primary
              style: theme.text.labelMd.copyWith(fontWeight: HoronFontWeight.semibold, color: theme.colors.textPrimary),
            ),
            for (final String tag in tags ?? const <String>[])
              _pill(
                theme,
                background: theme.colors.overlayInk6, // bg-overlay-ink-6
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
            // text-body-sm text-text-secondary
            style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary),
          ),
        if (meta != null && meta!.isNotEmpty)
          Wrap(
            spacing: theme.space.s1_5, // gap-1.5
            runSpacing: theme.space.s1_5,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: <Widget>[
              for (int index = 0; index < meta!.length; index++) ...<Widget>[
                if (index > 0) Text('·', style: theme.text.labelSm.copyWith(color: theme.colors.textPlaceholder)),
                Text(
                  meta![index],
                  // text-label-sm text-text-placeholder
                  style: theme.text.labelSm.copyWith(color: theme.colors.textPlaceholder),
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
        _statusPill(theme),
        HoronButton(
          label: configureLabel,
          variant: HoronButtonVariant.solid, // variant="solid"
          size: HoronButtonSize.sm, // size="sm"
          icon: const Icon(Icons.settings_outlined, size: 14), // GearSix size-3.5
          onPressed: onConfigure,
        ),
        if (onMenuPressed != null)
          HoronIconButton(
            icon: const Icon(Icons.more_horiz),
            label: menuLabel,
            variant: HoronIconButtonVariant.ghost, // variant="ghost"
            size: HoronIconButtonSize.sm, // size="sm"
            onPressed: onMenuPressed,
          ),
      ],
    );
  }

  /// `statusToneClass`: 알약 바탕·글자와 6px 점 색을 함께 고릅니다.
  Widget _statusPill(HoronThemeData theme) {
    final (Color background, Color foreground, Color dot) = switch (statusTone) {
      HoronMcpServerStatusTone.connected => (
        theme.colors.overlayInk6, // bg-overlay-ink-6
        theme.colors.textPrimary,
        theme.colors.statusLive, // bg-status-live
      ),
      HoronMcpServerStatusTone.warning => (
        theme.colors.accentRed500_14, // bg-accent-red-500-14
        theme.colors.textDanger,
        theme.colors.textDanger, // bg-text-danger
      ),
      HoronMcpServerStatusTone.neutral => (
        theme.colors.overlayInk6,
        theme.colors.textSecondary,
        theme.colors.textPlaceholder, // bg-text-placeholder
      ),
    };
    return Container(
      height: theme.space.step(5.5), // h-5.5 = 22
      padding: EdgeInsets.symmetric(horizontal: theme.space.s2), // px-2
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s1_5, // gap-1.5
        children: <Widget>[
          SizedBox(
            width: theme.space.step(1.5), // size-1.5 = 6
            height: theme.space.step(1.5),
            child: DecoratedBox(
              decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
            ),
          ),
          Text(
            statusLabel,
            maxLines: 1,
            // text-[12px]/[16px] font-medium
            style: theme.text.labelSm.copyWith(height: 16 / 12, color: foreground),
          ),
        ],
      ),
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
        // text-label-sm
        style: theme.text.labelSm.copyWith(color: foreground),
      ),
    );
  }
}
