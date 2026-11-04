import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'segmented_control.dart';

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
        // `rounded-2xl border border-border-default bg-bg-surface overflow-clip`.
        child: Container(
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: colors.bgSurface,
            borderRadius: BorderRadius.circular(theme.radius.xl2),
            border: Border.all(color: colors.borderDefault),
          ),
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
                  onChanged: (HoronToolPermissionsToolPermission value) => _update(
                    <String, HoronToolPermissionsToolPermission>{...current, widget.tools[index].name: value},
                  ),
                  wrapBelow: HoronToolPermissions._wrapBelow,
                  space: space,
                  colors: colors,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// `text-label-md font-semibold text-text-primary` — 헤더 제목.
TextStyle _titleStyle(HoronThemeData theme, HoronColors colors) =>
    theme.text.labelMd.copyWith(fontWeight: HoronFontWeight.semibold, color: colors.textPrimary);

/// `font-mono text-code font-medium text-text-primary` — 도구 이름.
TextStyle _nameStyle(HoronThemeData theme, HoronColors colors) =>
    theme.text.code.copyWith(fontWeight: HoronFontWeight.medium, color: colors.textPrimary);

/// `text-caption text-text-secondary` — 도구 설명.
TextStyle _descriptionStyle(HoronThemeData theme, HoronColors colors) =>
    theme.text.caption.copyWith(color: colors.textSecondary);

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
    return Container(
      // `h-11 border-b border-border-default bg-bg-subtle px-4`.
      height: space.step(11),
      padding: EdgeInsets.symmetric(horizontal: space.s4),
      decoration: BoxDecoration(
        color: colors.bgSubtle,
        border: Border(bottom: BorderSide(color: colors.borderDefault)),
      ),
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
            // `h-5 rounded-full bg-overlay-ink-6 px-1.5`.
            height: space.step(5),
            padding: EdgeInsets.symmetric(horizontal: space.s1_5),
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

/// `text-label-sm text-text-secondary hover:text-text-primary`.
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
    final TextStyle style = theme.text.labelSm.copyWith(color: _hovered ? colors.textPrimary : colors.textSecondary);

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
    final Widget segments = HoronSegmentedControl(
      semanticLabel: '${tool.name} permission',
      size: HoronSegmentedControlSize.sm,
      surface: HoronSegmentedControlSurface.solid,
      fill: false,
      value: value.name,
      onValueChange: (String next) => onChanged(
        HoronToolPermissionsToolPermission.values.firstWhere(
          (HoronToolPermissionsToolPermission option) => option.name == next,
        ),
      ),
      items: <HoronSegmentedItem>[
        for (final HoronToolPermissionsToolPermission option in HoronToolPermissionsToolPermission.values)
          HoronSegmentedItem(value: option.name, label: _segmentLabels[option]!),
      ],
    );

    return Container(
      // `px-4 py-3`와 `border-b border-border-default last:border-b-0`.
      padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3),
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
              SizedBox(width: space.s4), // gap-4 = 16
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
          SizedBox(height: space.s1), // gap-1 = 4
          DefaultTextStyle.merge(style: descriptionStyle, child: tool.description!),
        ],
      ],
    );
  }
}

/// 세그먼트에 보이는 세 이름입니다. React의 `options` 배열과 같습니다.
const Map<HoronToolPermissionsToolPermission, String> _segmentLabels = <HoronToolPermissionsToolPermission, String>{
  HoronToolPermissionsToolPermission.allow: 'Allow',
  HoronToolPermissionsToolPermission.ask: 'Ask',
  HoronToolPermissionsToolPermission.off: 'Off',
};
