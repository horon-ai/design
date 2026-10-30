import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'switch.dart';

/// `bot-memory-panel.tsx`의 `rounded-[24px]`입니다. 토큰 반경 단계에 24가 없습니다.
const double _panelRadius = 24;

/// `max-w-140` — 560. 좁은 화면에서는 폭을 따라 줄어듭니다.
const double _maxWidth = 560;

/// `h-1.25` — 메모리 미터의 높이 5입니다.
const double _meterHeight = 5;

/// `w-20` — 메모리 미터의 폭 80입니다.
const double _meterWidth = 80;

/// `transition-[width] duration-400` — 미터가 채워지는 시간입니다.
const Duration _meterDuration = Duration(milliseconds: 400);

/// `h-7` — 알약 탭의 높이 28입니다.
const double _pillHeight = 28;

/// `p-[3px]` — 알약 트랙의 안쪽 여백입니다.
const double _trackInset = 3;

/// `size-7.5` — 검색 버튼 30입니다.
const double _searchButtonSize = 30;

/// `size-4` — 검색 아이콘 16입니다.
const double _searchIconSize = 16;

/// `size-3.5` — 북마크와 더하기 아이콘 14입니다.
const double _iconSize = 14;

/// `h-8` — "Memory updated" 알약의 높이 32입니다.
const double _toastHeight = 32;

/// `size-3` — 토스트 닫기 단추와 X 아이콘 12입니다.
const double _toastCloseSize = 12;

/// `h-px` — 구분선 두께 1입니다.
const double _hairline = 1;

/// `motion-rise`의 행마다 늘어나는 지연입니다(`animationDelay: rowIndex * 30ms`).
const int _staggerMs = 30;

/// `outline-2` — 포커스 테두리 두께입니다.
const double _focusWidth = 2;

/// `bot-memory-panel.tsx`의 `BotMemorySetting`입니다.
///
/// 기억 사용 설정 한 줄입니다. 스위치의 처음 상태는 [defaultChecked]입니다.
class HoronBotMemorySetting {
  /// 설정 한 줄을 만듭니다.
  const HoronBotMemorySetting({required this.id, required this.label, this.description, this.defaultChecked = false});

  /// 설정을 가리키는 키입니다. [HoronBotMemoryPanel.onSettingChange]로 돌아옵니다.
  final String id;

  /// 설정 이름입니다.
  final String label;

  /// 이름 아래의 설명입니다.
  final String? description;

  /// 스위치의 처음 상태입니다. React `defaultChecked`입니다.
  final bool defaultChecked;
}

/// `bot-memory-panel.tsx`의 `BotMemoryItem`입니다.
///
/// 기억 한 줄입니다. [group]이 필터 탭을 만들고, [fresh]는 방금 추가된 기억을 강조합니다.
class HoronBotMemoryItem {
  /// 기억 한 줄을 만듭니다.
  const HoronBotMemoryItem({
    required this.id,
    required this.text,
    required this.source,
    required this.group,
    this.fresh = false,
  });

  /// 기억을 가리키는 키입니다.
  final String id;

  /// 기억 본문입니다.
  final String text;

  /// 어디서 왔는지입니다(예: `채팅에서 · 10월 8일`).
  final String source;

  /// 묶음 이름입니다. 필터 탭은 나타난 순서대로 이 값에서 만들어집니다.
  final String group;

  /// 방금 추가된 기억이면 하늘색 바탕을 깝니다.
  final bool fresh;
}

/// `bot-memory-panel.tsx`의 `BotMemoryToast`입니다.
///
/// "기억이 갱신되었습니다" 알약의 내용입니다.
class HoronBotMemoryToast {
  /// 알약 내용을 만듭니다.
  const HoronBotMemoryToast({required this.title, this.message});

  /// 알약의 굵은 글자입니다.
  final String title;

  /// 뒤에 붙는 흐린 설명입니다.
  final String? message;
}

/// Figma `Bot memory`(Paper `ZO2-1` / `HPY-0`)입니다.
///
/// `bot-memory-panel.tsx`를 옮긴 것입니다. 24px 반경 표면 위에 메모리 미터, 설정
/// 스위치 줄, 필터 알약 탭, 방금 갱신을 알리는 알약, 묶음별 기억을 차례로 놓습니다.
///
/// React는 `<section className="… overflow-clip">`이라 자식이 패널 밖으로 나가지
/// 않습니다. Flutter 판은 `Container`의 `clipBehavior`로 같은 일을 합니다.
///
/// React의 `PanelPillTabs`(bot-instructions-panel.tsx가 내보내는 공용 알약 탭)를
/// 이 파일 안에 [_PillTabs]로 옮겼습니다. 슬라이드 표시자 대신 선택된 알약이 자기
/// 10% 잉크 바탕을 칠합니다. React의 트랙은 넘칠 때 잘리지만, 이 판은 좁은 폭에서
/// 알약을 다음 줄로 넘겨 필터를 모두 누를 수 있게 합니다.
class HoronBotMemoryPanel extends StatefulWidget {
  /// 메모리 패널을 만듭니다.
  const HoronBotMemoryPanel({
    super.key,
    this.title = 'Memory',
    this.subtitle,
    required this.usage,
    this.settings,
    required this.memories,
    this.toast,
    this.onToastDismiss,
    this.onAdd,
    this.onSettingChange,
    this.onSearch,
  });

  /// 패널 제목입니다.
  final String title;

  /// 제목 아래의 흐린 설명입니다.
  final String? subtitle;

  /// 메모리 미터의 채움입니다. 0에서 100 사이로 자르고, 넘는 값은 100입니다.
  final int usage;

  /// 기억 사용 설정 줄입니다. 스위치는 처음에 [HoronBotMemorySetting.defaultChecked]입니다.
  final List<HoronBotMemorySetting>? settings;

  /// 기억 목록입니다. 필터 탭은 나타난 순서의 [HoronBotMemoryItem.group]입니다.
  final List<HoronBotMemoryItem> memories;

  /// 방금 갱신을 알리는 알약입니다. 닫기 단추로 스스로 빠져나갑니다.
  final HoronBotMemoryToast? toast;

  /// 알약이 빠져나간 뒤 호출됩니다. React `onToastDismiss`입니다.
  final VoidCallback? onToastDismiss;

  /// "Add memory" 단추를 눌렀을 때 호출됩니다.
  final VoidCallback? onAdd;

  /// 설정 스위치가 바뀔 때 호출됩니다. React `onSettingChange`입니다.
  final void Function(String id, bool checked)? onSettingChange;

  /// 오른쪽 검색 단추를 눌렀을 때 호출됩니다.
  ///
  /// React의 단추에는 핸들러가 없어 시각만 있습니다. 이 판은 호스트가 붙일 자리를
  /// [onSearch]로 열어 두고, 넘기지 않으면 누를 수 없는 단추로 그립니다.
  final VoidCallback? onSearch;

  @override
  State<HoronBotMemoryPanel> createState() => _HoronBotMemoryPanelState();
}

class _HoronBotMemoryPanelState extends State<HoronBotMemoryPanel> {
  String _filter = 'all';
  bool _toastDismissed = false;
  late final Map<String, bool> _checked = <String, bool>{
    for (final HoronBotMemorySetting setting in widget.settings ?? const <HoronBotMemorySetting>[])
      setting.id: setting.defaultChecked,
  };

  @override
  void didUpdateWidget(HoronBotMemoryPanel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!identical(widget.toast, oldWidget.toast)) _toastDismissed = false;
    for (final HoronBotMemorySetting setting in widget.settings ?? const <HoronBotMemorySetting>[]) {
      _checked.putIfAbsent(setting.id, () => setting.defaultChecked);
    }
  }

  /// 나타난 순서대로 중복을 뺀 묶음 이름입니다.
  List<String> get _groups {
    final List<String> groups = <String>[];
    for (final HoronBotMemoryItem memory in widget.memories) {
      if (!groups.contains(memory.group)) groups.add(memory.group);
    }
    return groups;
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final int percent = widget.usage.clamp(0, 100);
    final List<String> groups = _groups;
    final List<String> visible = _filter == 'all' ? groups : groups.where((String group) => group == _filter).toList();

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite ? math.min(constraints.maxWidth, _maxWidth) : _maxWidth;
        return SizedBox(
          width: width,
          child: Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: colors.bgSurface, // bg-bg-surface
              borderRadius: BorderRadius.circular(_panelRadius), // rounded-[24px]
              border: Border.all(color: colors.borderDefault), // border-border-default
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Padding(
                  // px-4.5 pt-4 pb-3
                  padding: EdgeInsets.fromLTRB(space.step(4.5), space.s4, space.step(4.5), space.s3),
                  child: Row(
                    spacing: space.s2_5, // gap-2.5
                    children: <Widget>[
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          spacing: space.s0_5, // gap-0.5
                          children: <Widget>[
                            Text(widget.title, style: theme.text.labelLg.copyWith(color: colors.textPrimary)),
                            if (widget.subtitle != null)
                              Text(
                                widget.subtitle!,
                                style: theme.text.caption.copyWith(color: colors.textSecondary),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                          ],
                        ),
                      ),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        spacing: space.s1, // gap-1
                        children: <Widget>[
                          Text('$percent% full', style: theme.text.caption.copyWith(color: colors.textSecondary)),
                          _MemoryMeter(percent: percent),
                        ],
                      ),
                    ],
                  ),
                ),
                for (int index = 0; index < (widget.settings?.length ?? 0); index++) ...<Widget>[
                  if (index > 0) const _Hairline(inset: true),
                  _settingRow(theme, widget.settings![index]),
                ],
                const _Hairline(),
                Padding(
                  // pt-3 pr-3.5 pb-1.5 pl-3.5
                  padding: EdgeInsets.fromLTRB(space.s3_5, space.s3, space.s3_5, space.s1_5),
                  child: Row(
                    spacing: space.s2, // gap-2
                    children: <Widget>[
                      Flexible(
                        child: _PillTabs(
                          semanticLabel: 'Memory filter',
                          items: <({String value, String label})>[
                            (value: 'all', label: 'All'),
                            for (final String group in groups) (value: group, label: group),
                          ],
                          value: _filter,
                          onChanged: (String next) => setState(() => _filter = next),
                        ),
                      ),
                      const Spacer(),
                      _IconAction(
                        label: 'Search memories',
                        icon: Icons.search,
                        iconSize: _searchIconSize,
                        size: _searchButtonSize,
                        onPressed: widget.onSearch,
                      ),
                    ],
                  ),
                ),
                if (widget.toast != null && !_toastDismissed)
                  Padding(
                    // px-3.5 py-1.5
                    padding: EdgeInsets.symmetric(horizontal: space.s3_5, vertical: space.s1_5),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: _MemoryToast(
                        key: ObjectKey(widget.toast),
                        toast: widget.toast!,
                        onDismissed: () {
                          if (!mounted) return;
                          setState(() => _toastDismissed = true);
                          widget.onToastDismiss?.call();
                        },
                      ),
                    ),
                  ),
                KeyedSubtree(
                  key: ValueKey<String>('memory-groups-$_filter'),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: _memoryRows(theme, visible),
                  ),
                ),
                _AddMemoryButton(onPressed: widget.onAdd),
              ],
            ),
          ),
        );
      },
    );
  }

  /// 묶음 머리와 기억 행입니다. `motion-rise`의 지연은 앞 묶음의 행까지 세어 이어집니다.
  List<Widget> _memoryRows(HoronThemeData theme, List<String> visible) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final List<Widget> rows = <Widget>[];
    int rowIndex = 0;
    for (final String group in visible) {
      final List<HoronBotMemoryItem> items = widget.memories
          .where((HoronBotMemoryItem memory) => memory.group == group)
          .toList();
      rows.add(
        Padding(
          // px-4.5 pt-3 pb-1
          padding: EdgeInsets.fromLTRB(space.step(4.5), space.s3, space.step(4.5), space.s1),
          child: Row(
            spacing: space.s1_5, // gap-1.5
            children: <Widget>[
              Text(group, style: theme.text.labelSm.copyWith(color: colors.textSecondary)),
              Text('${items.length}', style: theme.text.caption.copyWith(color: colors.textSecondary)),
            ],
          ),
        ),
      );
      for (final HoronBotMemoryItem memory in items) {
        rows.add(
          _Rise(
            index: rowIndex,
            child: Container(
              // px-4.5 py-2
              padding: EdgeInsets.symmetric(horizontal: space.step(4.5), vertical: space.s2),
              color: memory.fresh ? colors.accentSky500_10 : Colors.transparent,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: space.s0_5, // gap-0.5
                children: <Widget>[
                  Text(memory.text, style: theme.text.bodySm.copyWith(color: colors.textPrimary)),
                  Text(memory.source, style: theme.text.caption.copyWith(color: colors.textSecondary)),
                ],
              ),
            ),
          ),
        );
        rowIndex++;
      }
    }
    return rows;
  }

  Widget _settingRow(HoronThemeData theme, HoronBotMemorySetting setting) {
    final HoronSpaceSpec space = theme.space;
    final HoronColors colors = theme.colors;
    return Padding(
      // px-4.5 py-2.5
      padding: EdgeInsets.symmetric(horizontal: space.step(4.5), vertical: space.s2_5),
      child: Row(
        spacing: space.s3, // gap-3
        children: <Widget>[
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: space.s0_5, // gap-0.5
              children: <Widget>[
                Text(setting.label, style: theme.text.labelMd.copyWith(color: colors.textPrimary)),
                if (setting.description != null)
                  Text(setting.description!, style: theme.text.caption.copyWith(color: colors.textSecondary)),
              ],
            ),
          ),
          Semantics(
            label: setting.label,
            child: HoronSwitch(
              size: HoronSwitchSize.compact,
              value: _checked[setting.id] ?? false,
              onChanged: (bool checked) {
                setState(() => _checked[setting.id] = checked);
                widget.onSettingChange?.call(setting.id, checked);
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// `h-1.25 w-20 shrink-0 overflow-clip rounded-full bg-overlay-ink-8` 미터입니다.
///
/// 채움은 `bg-interactive-primary`이고 폭이 400ms에 걸쳐 늘어납니다.
class _MemoryMeter extends StatelessWidget {
  const _MemoryMeter({required this.percent});

  final int percent;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      label: 'Memory used',
      value: '$percent%',
      child: Container(
        width: _meterWidth,
        height: _meterHeight,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(color: colors.overlayInk8, borderRadius: BorderRadius.circular(theme.radius.full)),
        child: TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: 0, end: percent / 100),
          duration: reduceMotion ? Duration.zero : _meterDuration,
          curve: HoronMotion.easeOutQuint,
          builder: (BuildContext context, double value, Widget? child) => Align(
            alignment: Alignment.centerLeft,
            child: FractionallySizedBox(
              widthFactor: value,
              heightFactor: 1,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: colors.interactivePrimary, // bg-interactive-primary
                  borderRadius: BorderRadius.circular(theme.radius.full),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `flex self-stretch` + `h-px bg-overlay-ink-8` 구분선입니다.
class _Hairline extends StatelessWidget {
  const _Hairline({this.inset = false});

  final bool inset;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: inset ? theme.space.step(4.5) : 0), // inset && px-4.5
      child: SizedBox(
        height: _hairline,
        child: ColoredBox(color: theme.colors.overlayInk8),
      ),
    );
  }
}

/// `bot-instructions-panel.tsx`의 `PanelPillTabs` 트랙입니다.
class _PillTabs extends StatelessWidget {
  const _PillTabs({required this.items, required this.value, required this.onChanged, this.semanticLabel});

  final List<({String value, String label})> items;
  final String value;
  final ValueChanged<String> onChanged;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      container: true,
      label: semanticLabel,
      child: Container(
        padding: const EdgeInsets.all(_trackInset), // p-[3px]
        decoration: BoxDecoration(
          color: theme.colors.overlayInk5, // bg-overlay-ink-5
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
        child: Wrap(
          spacing: theme.space.s0_5, // gap-0.5
          runSpacing: theme.space.s0_5,
          children: <Widget>[
            for (final ({String value, String label}) item in items)
              _PillTab(label: item.label, selected: item.value == value, onTap: () => onChanged(item.value)),
          ],
        ),
      ),
    );
  }
}

/// `h-7 rounded-full px-3 text-label-md` 알약 하나입니다.
class _PillTab extends StatefulWidget {
  const _PillTab({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  State<_PillTab> createState() => _PillTabState();
}

class _PillTabState extends State<_PillTab> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color foreground = widget.selected || _hovered ? colors.textPrimary : colors.textSecondary;

    return Semantics(
      button: true,
      selected: widget.selected,
      inMutuallyExclusiveGroup: true,
      label: widget.label,
      child: FocusableActionDetector(
        mouseCursor: SystemMouseCursors.click,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onTap();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onTap,
          child: _FocusRing(
            visible: _focused,
            radius: theme.radius.full,
            color: colors.textBrand,
            child: AnimatedContainer(
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              height: _pillHeight, // h-7
              padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: widget.selected ? colors.overlayInk10 : Colors.transparent, // bg-overlay-ink-10
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
              child: Text(
                widget.label,
                style: theme.text.labelMd.copyWith(color: foreground),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `size-7.5 rounded-full` 아이콘 단추입니다. hover에서 8% 잉크를 깝니다.
class _IconAction extends StatefulWidget {
  const _IconAction({
    required this.label,
    required this.icon,
    required this.iconSize,
    required this.size,
    this.onPressed,
  });

  final String label;
  final IconData icon;
  final double iconSize;
  final double size;
  final VoidCallback? onPressed;

  @override
  State<_IconAction> createState() => _IconActionState();
}

class _IconActionState extends State<_IconAction> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool interactive = widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color foreground = _hovered ? colors.textPrimary : colors.textSecondary;

    return Semantics(
      button: true,
      enabled: interactive,
      label: widget.label,
      child: FocusableActionDetector(
        enabled: interactive,
        mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onPressed,
          child: _FocusRing(
            visible: _focused && interactive,
            radius: theme.radius.full,
            color: colors.textBrand,
            child: AnimatedContainer(
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              width: widget.size,
              height: widget.size,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: _hovered ? colors.overlayInk8 : Colors.transparent, // hover:bg-overlay-ink-8
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
              child: Icon(widget.icon, size: widget.iconSize, color: foreground),
            ),
          ),
        ),
      ),
    );
  }
}

/// `bg-accent-sky-500-16` 알약입니다. 들어올 때 `animate-pop-in`, 나갈 때 `animate-pop-out`입니다.
class _MemoryToast extends StatefulWidget {
  const _MemoryToast({super.key, required this.toast, this.onDismissed});

  final HoronBotMemoryToast toast;
  final VoidCallback? onDismissed;

  @override
  State<_MemoryToast> createState() => _MemoryToastState();
}

class _MemoryToastState extends State<_MemoryToast> with TickerProviderStateMixin {
  late final AnimationController _in = AnimationController(vsync: this, duration: HoronMotion.popInDuration);
  late final AnimationController _out = AnimationController(vsync: this, duration: HoronMotion.popOutDuration);
  late final Animation<double> _inCurve = CurvedAnimation(parent: _in, curve: HoronMotion.popInCurve);

  @override
  void initState() {
    super.initState();
    _in.forward();
    _out.addStatusListener((AnimationStatus status) {
      if (status == AnimationStatus.completed) widget.onDismissed?.call();
    });
  }

  @override
  void dispose() {
    _in.dispose();
    _out.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    final Widget pill = Container(
      height: _toastHeight, // h-8
      padding: EdgeInsets.only(left: space.s2_5, right: space.s3), // pl-2.5 pr-3
      decoration: BoxDecoration(
        color: colors.accentSky500_16, // bg-accent-sky-500-16
        borderRadius: BorderRadius.circular(theme.radius.full),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s2, // gap-2
        children: <Widget>[
          Icon(Icons.bookmark_border, size: _iconSize, color: colors.textPrimary), // BookmarkSimple size-3.5
          Text(widget.toast.title, style: theme.text.labelSm.copyWith(color: colors.textPrimary), maxLines: 1),
          if (widget.toast.message != null)
            Flexible(
              child: Text(
                widget.toast.message!,
                style: theme.text.caption.copyWith(color: colors.textSecondary),
                maxLines: 1,
                overflow: TextOverflow.ellipsis, // truncate
              ),
            ),
          _ToastCloseButton(onPressed: _dismiss),
        ],
      ),
    );

    if (MediaQuery.disableAnimationsOf(context)) {
      return _out.isAnimating || _out.isCompleted ? const SizedBox.shrink() : pill;
    }

    return AnimatedBuilder(
      animation: Listenable.merge(<Listenable>[_in, _out]),
      builder: (BuildContext context, Widget? child) {
        final bool leaving = _out.isAnimating || _out.isCompleted;
        final double scale = leaving
            ? 1 + (HoronMotion.popOutScale - 1) * Curves.easeIn.transform(_out.value)
            : HoronMotion.popInScale + (1 - HoronMotion.popInScale) * _inCurve.value;
        final double opacity = leaving ? 1 - _out.value : _inCurve.value;
        return Opacity(
          opacity: opacity.clamp(0, 1),
          child: Transform.scale(scale: scale, child: child),
        );
      },
      child: pill,
    );
  }

  void _dismiss() {
    if (_out.isAnimating || _out.isCompleted) return;
    _out.forward();
  }
}

/// `size-3` 닫기 단추입니다. hover에서 글자가 진해집니다.
class _ToastCloseButton extends StatefulWidget {
  const _ToastCloseButton({this.onPressed});

  final VoidCallback? onPressed;

  @override
  State<_ToastCloseButton> createState() => _ToastCloseButtonState();
}

class _ToastCloseButtonState extends State<_ToastCloseButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      label: 'Dismiss',
      child: FocusableActionDetector(
        mouseCursor: SystemMouseCursors.click,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onPressed,
          child: _FocusRing(
            visible: _focused,
            radius: theme.radius.xs,
            color: colors.textBrand,
            child: AnimatedContainer(
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              width: _toastCloseSize,
              height: _toastCloseSize,
              alignment: Alignment.center,
              child: Icon(
                Icons.close,
                size: _toastCloseSize, // size-3
                color: _hovered ? colors.textPrimary : colors.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `flex items-center gap-2 px-4.5 pt-3 pb-4 text-label-md` 더하기 줄입니다.
class _AddMemoryButton extends StatefulWidget {
  const _AddMemoryButton({this.onPressed});

  final VoidCallback? onPressed;

  @override
  State<_AddMemoryButton> createState() => _AddMemoryButtonState();
}

class _AddMemoryButtonState extends State<_AddMemoryButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color foreground = _hovered ? colors.textPrimary : colors.textSecondary;

    return Semantics(
      button: true,
      enabled: interactive,
      label: 'Add memory',
      child: FocusableActionDetector(
        enabled: interactive,
        mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onPressed,
          child: Padding(
            // px-4.5 pt-3 pb-4
            padding: EdgeInsets.fromLTRB(space.step(4.5), space.s3, space.step(4.5), space.s4),
            child: _FocusRing(
              visible: _focused && interactive,
              radius: theme.radius.sm,
              color: colors.textBrand,
              child: AnimatedDefaultTextStyle(
                duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                curve: HoronMotion.colorsCurve,
                style: theme.text.labelMd.copyWith(color: foreground),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: space.s2, // gap-2
                  children: <Widget>[
                    Icon(Icons.add, size: _iconSize, color: foreground), // Plus size-3.5
                    Text('Add memory'),
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

/// `motion-rise` — opacity 0→1, translate 0 4px→0을 220ms에 재생합니다.
///
/// React는 `animationDelay: index * 30ms`로 행을 차례로 띄웁니다. 타이머 대신
/// 컨트롤러 길이를 지연만큼 늘리고 `Interval`로 뒤쪽 구간만 움직입니다.
class _Rise extends StatefulWidget {
  const _Rise({required this.child, this.index = 0});

  final Widget child;
  final int index;

  @override
  State<_Rise> createState() => _RiseState();
}

class _RiseState extends State<_Rise> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _curve;

  @override
  void initState() {
    super.initState();
    final int delayMs = widget.index * _staggerMs;
    final int totalMs = delayMs + HoronMotion.riseDuration.inMilliseconds;
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: totalMs),
    );
    _curve = CurvedAnimation(
      parent: _controller,
      curve: Interval(delayMs / totalMs, 1, curve: HoronMotion.riseCurve),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return widget.child;
    return AnimatedBuilder(
      animation: _curve,
      builder: (BuildContext context, Widget? child) => Opacity(
        opacity: _curve.value,
        child: Transform.translate(offset: Offset(0, HoronMotion.riseOffset * (1 - _curve.value)), child: child),
      ),
      child: widget.child,
    );
  }
}

/// `focus-visible:outline-2 outline-text-brand`을 그립니다.
class _FocusRing extends StatelessWidget {
  const _FocusRing({required this.visible, required this.radius, required this.color, required this.child});

  final bool visible;
  final double radius;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    final double offset = HoronTheme.of(context).space.s0_5;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -offset,
          top: -offset,
          right: -offset,
          bottom: -offset,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + offset),
                border: Border.all(color: color, width: _focusWidth),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
