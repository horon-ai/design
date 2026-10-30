import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 도구 하나에 대한 권한 선택지입니다.
///
/// React `tool-permissions.tsx`의 `ToolPermission` 유니온(`allow` | `ask` | `off`)을
/// 값 그대로 옮겼습니다. 순서도 React의 `options` 배열과 같습니다.
enum HoronToolPermissionsToolPermission {
  /// 항상 허용합니다. React `allow`.
  allow,

  /// 매번 물어봅니다. React `ask`.
  ask,

  /// 사용하지 않습니다. React `off`.
  off,
}

/// 목록의 한 줄이 설명하는 도구입니다.
///
/// React `ToolPermissionItem`을 옮겼습니다. [description]은 React에서 `ReactNode`이므로
/// 위젯을 받고, 그 안의 글자는 목록이 정한 작은 스타일을 물려받습니다.
@immutable
class HoronToolPermissionItem {
  /// 도구 이름과 선택적으로 설명·기본값을 받습니다.
  const HoronToolPermissionItem({
    required this.name,
    this.description,
    this.defaultValue = HoronToolPermissionsToolPermission.ask,
  });

  /// 화면에 고정폭으로 보이는 도구 이름입니다. React `name`.
  final String name;

  /// 이름 아래 한 줄 설명입니다. React `description`.
  final Widget? description;

  /// 제어되지 않을 때의 시작 값입니다. React `defaultValue`(기본 `ask`).
  final HoronToolPermissionsToolPermission defaultValue;
}

/// 도구별 권한을 고르는 목록입니다.
///
/// React `ToolPermissions`: 중립 배경의 그룹 헤더(제목, 개수 알약, "Allow all" 텍스트 버튼)와
/// 도구마다 한 줄(고정폭 이름, 설명, Allow / Ask / Off 세그먼트)로 이루어집니다.
class HoronToolPermissions extends StatefulWidget {
  /// 제목과 도구 목록을 받습니다.
  const HoronToolPermissions({
    super.key,
    required this.title,
    required this.tools,
    this.values,
    this.onValuesChange,
    this.allowAllLabel,
  });

  /// 그룹 헤더의 제목입니다. React `title`(`ReactNode`).
  final Widget title;

  /// 권한을 고를 도구 목록입니다. React `tools`.
  final List<HoronToolPermissionItem> tools;

  /// 도구 이름별 선택 값입니다. 주면 제어 컴포넌트가 됩니다. React `values`.
  final Map<String, HoronToolPermissionsToolPermission>? values;

  /// 선택이 바뀔 때마다 새 사본을 돌려줍니다. React `onValuesChange`.
  final ValueChanged<Map<String, HoronToolPermissionsToolPermission>>? onValuesChange;

  /// 모든 도구를 허용으로 바꾸는 텍스트 버튼의 이름입니다.
  /// React `allowAllLabel`(기본 "Allow all").
  final Widget? allowAllLabel;

  /// `max-w-130.25` — 목록이 더 넓어지지 않는 폭 521입니다.
  static const double _maxWidth = 521;

  /// 이 폭보다 좁으면 세그먼트를 이름 아래로 내립니다. React에는 없는 분기이며,
  /// 320px 화면에서 세그먼트 세 칸과 이름 칸이 한 줄에 들어가지 않기 때문에 둡니다.
  static const double _wrapBelow = 360;

  @override
  State<HoronToolPermissions> createState() => _HoronToolPermissionsState();
}

class _HoronToolPermissionsState extends State<HoronToolPermissions> {
  /// 제어되지 않을 때의 선택 값입니다. React의 `useState` 초기화와 같이 한 번만 채웁니다.
  late final Map<String, HoronToolPermissionsToolPermission> _inner = <String, HoronToolPermissionsToolPermission>{
    for (final HoronToolPermissionItem tool in widget.tools) tool.name: tool.defaultValue,
  };

  Map<String, HoronToolPermissionsToolPermission> get _current => widget.values ?? _inner;

  void _update(Map<String, HoronToolPermissionsToolPermission> next) {
    setState(
      () => _inner
        ..clear()
        ..addAll(next),
    );
    widget.onValuesChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final Map<String, HoronToolPermissionsToolPermission> current = _current;

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: HoronToolPermissions._maxWidth),
      child: SizedBox(
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            _GroupHeader(
              title: widget.title,
              count: widget.tools.length,
              allowAllLabel: widget.allowAllLabel,
              onAllowAll: () => _update(<String, HoronToolPermissionsToolPermission>{
                for (final HoronToolPermissionItem tool in widget.tools)
                  tool.name: HoronToolPermissionsToolPermission.allow,
              }),
            ),
            for (int index = 0; index < widget.tools.length; index++)
              _ToolRow(
                tool: widget.tools[index],
                value: current[widget.tools[index].name] ?? HoronToolPermissionsToolPermission.ask,
                isLast: index == widget.tools.length - 1,
                nameStyle: _nameStyle(theme, colors),
                descriptionStyle: _descriptionStyle(theme, colors),
                onChanged: (HoronToolPermissionsToolPermission value) =>
                    _update(<String, HoronToolPermissionsToolPermission>{...current, widget.tools[index].name: value}),
                wrapBelow: HoronToolPermissions._wrapBelow,
                space: space,
                colors: colors,
              ),
          ],
        ),
      ),
    );
  }
}

/// `text-[13px]/[18px] font-semibold text-text-primary` — 헤더 제목.
TextStyle _titleStyle(HoronThemeData theme, HoronColors colors) => theme.text.labelSm.copyWith(
  fontSize: _titleFontSize,
  height: _titleLineHeight / _titleFontSize,
  fontWeight: HoronFontWeight.semibold,
  color: colors.textPrimary,
);

/// `font-mono text-[13px]/[18px] font-medium text-text-primary` — 도구 이름.
TextStyle _nameStyle(HoronThemeData theme, HoronColors colors) => theme.text.code.copyWith(
  fontSize: _toolNameFontSize,
  height: _toolNameLineHeight / _toolNameFontSize,
  fontWeight: HoronFontWeight.medium,
  color: colors.textPrimary,
);

/// `text-[12px]/[16px] text-text-placeholder` — 도구 설명.
TextStyle _descriptionStyle(HoronThemeData theme, HoronColors colors) =>
    theme.text.labelSm.copyWith(fontWeight: HoronFontWeight.regular, color: colors.textPlaceholder);

/// `text-[13px]/[18px]` — 토큰의 13px 단계는 `text.code`(13/20)뿐이라 줄 높이만 바꿉니다.
const double _titleFontSize = 13;

/// 위 글자 크기에 대응하는 줄 높이 18입니다.
const double _titleLineHeight = 18;

/// `text-[13px]/[18px]`.
const double _toolNameFontSize = 13;

/// 위 글자 크기에 대응하는 줄 높이 18입니다.
const double _toolNameLineHeight = 18;

/// 그룹 헤더 한 줄입니다.
class _GroupHeader extends StatelessWidget {
  const _GroupHeader({required this.title, required this.count, required this.allowAllLabel, required this.onAllowAll});

  final Widget title;
  final int count;
  final Widget? allowAllLabel;
  final VoidCallback onAllowAll;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    // `bg-neutral-50` / `dark:bg-neutral-800` — React가 원시 단계를 직접 지목합니다.
    final Color fill = theme.brightness == Brightness.dark ? HoronPalette.neutral800 : HoronPalette.neutral50;

    return Container(
      padding: EdgeInsets.symmetric(horizontal: space.s3, vertical: space.s2),
      decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(theme.radius.sm)),
      child: Row(
        children: <Widget>[
          Flexible(
            child: DefaultTextStyle.merge(
              style: _titleStyle(theme, colors),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              child: title,
            ),
          ),
          SizedBox(width: space.s2),
          Container(
            height: space.step(5.5),
            padding: EdgeInsets.symmetric(horizontal: space.s2),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: colors.overlayInk6,
              borderRadius: BorderRadius.circular(theme.radius.full),
            ),
            child: Text('$count', style: theme.text.labelSm.copyWith(color: colors.textSecondary)),
          ),
          const Spacer(),
          _AllowAllButton(label: allowAllLabel, onPressed: onAllowAll),
        ],
      ),
    );
  }
}

/// `text-[12px]/[16px] font-medium text-text-placeholder hover:text-text-primary`.
class _AllowAllButton extends StatefulWidget {
  const _AllowAllButton({required this.label, required this.onPressed});

  final Widget? label;
  final VoidCallback onPressed;

  @override
  State<_AllowAllButton> createState() => _AllowAllButtonState();
}

class _AllowAllButtonState extends State<_AllowAllButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    final TextStyle style = theme.text.labelSm.copyWith(color: _hovered ? colors.textPrimary : colors.textPlaceholder);

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: InkWell(
        onTap: widget.onPressed,
        borderRadius: BorderRadius.circular(theme.radius.sm),
        focusColor: colors.textBrand.withValues(alpha: 0.12),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: theme.space.s1, vertical: theme.space.s1),
          child: AnimatedDefaultTextStyle(
            style: style,
            duration: animate ? HoronMotion.colorsDuration : Duration.zero,
            curve: HoronMotion.colorsCurve,
            child: widget.label ?? const Text('Allow all'),
          ),
        ),
      ),
    );
  }
}

/// 도구 한 줄입니다. 좁은 폭에서는 세그먼트가 이름 아래로 내려갑니다.
class _ToolRow extends StatelessWidget {
  const _ToolRow({
    required this.tool,
    required this.value,
    required this.isLast,
    required this.nameStyle,
    required this.descriptionStyle,
    required this.onChanged,
    required this.wrapBelow,
    required this.space,
    required this.colors,
  });

  final HoronToolPermissionItem tool;
  final HoronToolPermissionsToolPermission value;
  final bool isLast;
  final TextStyle nameStyle;
  final TextStyle descriptionStyle;
  final ValueChanged<HoronToolPermissionsToolPermission> onChanged;
  final double wrapBelow;
  final HoronSpaceSpec space;
  final HoronColors colors;

  @override
  Widget build(BuildContext context) {
    final Widget text = _ToolText(tool: tool, nameStyle: nameStyle, descriptionStyle: descriptionStyle);
    final Widget segments = _PermissionSegments(value: value, labelSuffix: tool.name, onChanged: onChanged);

    return Container(
      // `py-[11px] pr-1 pl-3`와 `border-b border-border-default last:border-b-0`.
      padding: EdgeInsets.fromLTRB(space.s3, space.step(11), space.s1, space.step(11)),
      decoration: BoxDecoration(
        border: isLast ? null : Border(bottom: BorderSide(color: colors.borderDefault)),
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          if (constraints.maxWidth < wrapBelow) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                text,
                SizedBox(height: space.s2),
                segments,
              ],
            );
          }
          return Row(
            children: <Widget>[
              Expanded(child: text),
              SizedBox(width: space.s3),
              segments,
            ],
          );
        },
      ),
    );
  }
}

/// 이름과 설명 묶음입니다. 이름만 한 줄로 줄여 넘침을 막습니다.
class _ToolText extends StatelessWidget {
  const _ToolText({required this.tool, required this.nameStyle, required this.descriptionStyle});

  final HoronToolPermissionItem tool;
  final TextStyle nameStyle;
  final TextStyle descriptionStyle;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(tool.name, style: nameStyle, maxLines: 1, overflow: TextOverflow.ellipsis),
        if (tool.description != null) ...<Widget>[
          SizedBox(height: space.s0_5),
          DefaultTextStyle.merge(style: descriptionStyle, child: tool.description!),
        ],
      ],
    );
  }
}

/// React `SegmentedControl`(size `md`, surface `glass`, `fill=false`)를 이 컴포넌트 안에
/// 옮긴 private 구현입니다.
///
/// 세그먼트 컴포넌트는 다른 레인이 소유하므로 여기서는 필요한 모양만 다시 그립니다.
/// React는 선택 알약이 옆으로 미끄러지지만(`motion-indicator`), 폭이 다른 세 칸에서
/// 이동 거리를 계산하려면 자식을 재야 하므로 선택 칸에 알약을 직접 그립니다.
class _PermissionSegments extends StatelessWidget {
  const _PermissionSegments({required this.value, required this.labelSuffix, required this.onChanged});

  final HoronToolPermissionsToolPermission value;
  final String labelSuffix;
  final ValueChanged<HoronToolPermissionsToolPermission> onChanged;

  static const Map<HoronToolPermissionsToolPermission, String> _labels = <HoronToolPermissionsToolPermission, String>{
    HoronToolPermissionsToolPermission.allow: 'Allow',
    HoronToolPermissionsToolPermission.ask: 'Ask',
    HoronToolPermissionsToolPermission.off: 'Off',
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      key: const Key('horon-tool-permissions-track'),
      // `h-9 p-[3px] gap-0.5 rounded-full bg-glass-regular` — 36px 트랙.
      height: space.step(9),
      padding: EdgeInsets.all(space.step(3)),
      decoration: BoxDecoration(color: colors.glassRegular, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.step(0.5),
        children: <Widget>[
          for (final HoronToolPermissionsToolPermission option in HoronToolPermissionsToolPermission.values)
            _Segment(
              label: _labels[option]!,
              selected: option == value,
              semanticsLabel: '$labelSuffix ${_labels[option]}',
              onTap: () => onChanged(option),
            ),
        ],
      ),
    );
  }
}

/// 세그먼트 한 칸입니다. 선택되면 유리 알약이 그 칸을 채웁니다.
class _Segment extends StatelessWidget {
  const _Segment({required this.label, required this.selected, required this.semanticsLabel, required this.onTap});

  final String label;
  final bool selected;
  final String semanticsLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      selected: selected,
      label: semanticsLabel,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: AnimatedContainer(
          // `h-7.5 px-4 rounded-full` — 30px 칸.
          duration: animate ? HoronMotion.colorsDuration : Duration.zero,
          curve: HoronMotion.colorsCurve,
          height: space.step(7.5),
          padding: EdgeInsets.symmetric(horizontal: space.s4),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            // 선택 알약: `border border-glass-rim-strong bg-glass-thick
            // shadow-[0_1px_3px_rgba(0,0,0,0.08)]`. 다크의 `dark:bg-overlay-ink-10`은
            // glassThick이 이미 같은 값(#17181acc)이라 따로 분기하지 않습니다.
            color: selected ? colors.glassThick : Colors.transparent,
            borderRadius: BorderRadius.circular(theme.radius.full),
            border: Border.all(color: selected ? colors.glassRimStrong : Colors.transparent),
            boxShadow: selected
                ? <BoxShadow>[
                    BoxShadow(
                      // shadow-[0_1px_3px_rgba(0,0,0,0.08)] — 색은 스크림 토큰에서 알파만 낮춥니다.
                      color: colors.bgScrim.withValues(alpha: 0.08),
                      offset: const Offset(0, 1),
                      blurRadius: 3,
                    ),
                  ]
                : null,
          ),
          child: Text(
            label,
            style: theme.text.labelMd.copyWith(color: selected ? colors.textPrimary : colors.textSecondary),
            maxLines: 1,
          ),
        ),
      ),
    );
  }
}
