import 'dart:math' as math;
import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `knowledge-base-panel.tsx`의 `rounded-[24px]`입니다. 토큰 반경 단계에 24가 없습니다.
const double _panelRadius = 24;

/// `max-w-200` — 800. 좁은 화면에서는 폭을 따라 줄어듭니다.
const double _maxWidth = 800;

/// `p-0.75` — 알약 트랙의 안쪽 여백 3입니다.
const double _trayInset = 3;

/// `h-7.5` — 트랙 안 탭의 높이 30입니다.
const double _tabHeight = 30;

/// `size-8.5` — 설정 단추와 "Add source" 단추의 높이 34입니다.
const double _headerControlSize = 34;

/// `[&>svg]:size-4` — 설정 단추의 아이콘 16입니다.
const double _settingsIconSize = 16;

/// `size-3.5` — "Add source"의 더하기 아이콘 14입니다.
const double _smallIconSize = 14;

/// `size-3` — "Add source"의 캐럿 아이콘 12입니다.
const double _caretSize = 12;

/// `w-11` — 표 머리의 단계 칸 폭 44입니다.
const double _stageWidth = 44;

/// `h-4` — 표 머리의 단계 칸 높이 16입니다.
const double _stageHeight = 16;

/// `w-18` — 표 머리 오른쪽 빈 칸 폭 72입니다.
const double _rowTailWidth = 72;

/// `size-4.5` — 드롭존의 업로드 아이콘 18입니다.
const double _dropIconSize = 18;

/// `px-1.5 py-px` 류의 1px 테두리를 그리는 두께입니다.
const double _dropBorderWidth = 1;

/// `border-dashed`의 점선 한 칸 길이입니다.
const double _dashLength = 5;

/// 점선 사이의 빈 길이입니다.
const double _dashGap = 4;

/// `outline-2` — 포커스 테두리 두께입니다.
const double _focusWidth = 2;

/// `knowledge-base-panel.tsx`의 `KnowledgeBaseTab`입니다.
///
/// 탭 하나입니다. [count]가 있으면 탭 이름 뒤에 흐린 숫자로 붙습니다.
class HoronKnowledgeBaseTab {
  /// 탭을 만듭니다.
  const HoronKnowledgeBaseTab({required this.id, required this.label, this.count});

  /// 탭을 가리키는 값입니다. [HoronKnowledgeBasePanel.onValueChange]로 돌아옵니다.
  final String id;

  /// 탭에 보이는 이름입니다.
  final String label;

  /// 이름 뒤의 개수입니다.
  final int? count;
}

/// Paper `Knowledge base`(XVM-1) 패널입니다.
///
/// `knowledge-base-panel.tsx`를 옮긴 것입니다. 24px 반경 표면 위에 제목 줄, 알약 탭
/// 쟁반, 표 머리, 나눈 목록([children])과 점선 드롭존이 차례로 놓입니다.
///
/// React는 탭 표시자의 사각형을 DOM에서 재서 280ms에 밀어 옮깁니다. Flutter 판은
/// 탭을 [Wrap]으로 두어 좁은 폭에서 다음 줄로 넘기고, 표시자 대신 선택된 탭이 자기
/// 10% 잉크 바탕을 칠합니다(React의 쟁반은 넘치면 잘립니다).
///
/// 파일은 Flutter가 직접 고를 수 없습니다. React가 숨은 `<input type="file">`을
/// 품은 드롭존은, 이 판에서 [onFiles](끌어다 놓은 자료)와 [onBrowse](호스트가 자기
/// 선택 창을 엶) 두 자리로 나뉩니다. 둘 다 없으면 드롭존은 그려지지 않습니다.
class HoronKnowledgeBasePanel extends StatefulWidget {
  /// 지식 베이스 패널을 만듭니다.
  const HoronKnowledgeBasePanel({
    super.key,
    required this.title,
    this.meta,
    required this.tabs,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.indexing = 0,
    this.onSettings,
    this.onAddSource,
    this.onFiles,
    this.onBrowse,
    this.dropTitle = 'Drop files here, or browse',
    this.dropHint = 'PDF, DOCX, Markdown or TXT · Notion, Google Drive and websites from Add source',
    this.stages = _defaultStages,
    this.children = const <Widget>[],
  });

  /// `stages`의 기본값입니다(React `defaultStages`).
  static const List<String> _defaultStages = <String>['Parse', 'Chunk', 'Embed', 'Index'];

  /// 패널 제목입니다. 좁으면 말줄임합니다.
  final String title;

  /// 제목 아래 12/18 줄입니다(자료 수, 청크 수, 봇 수).
  final String? meta;

  /// 탭 목록입니다.
  final List<HoronKnowledgeBaseTab> tabs;

  /// 선택된 탭 값입니다. 지정하면 호스트가 값을 소유합니다.
  final String? value;

  /// 처음 선택할 탭 값입니다. 없으면 첫 탭입니다.
  final String? defaultValue;

  /// 선택이 바뀔 때 호출됩니다. React `onValueChange`입니다.
  final ValueChanged<String>? onValueChange;

  /// 0보다 크면 탭 줄 오른쪽에 진행 표시와 `N indexing`이 붙습니다.
  final int indexing;

  /// 설정 단추를 눌렀을 때 호출됩니다.
  final VoidCallback? onSettings;

  /// "Add source" 단추를 눌렀을 때 호출됩니다.
  final VoidCallback? onAddSource;

  /// 드롭존에 끌어다 놓은 자료를 받습니다. React `onFiles`의 끌어다 놓기 쪽입니다.
  ///
  /// 자료의 타입은 끌어온 쪽이 정합니다. 넘기지 않으면 드롭존은 그려지지 않습니다.
  final ValueChanged<Object>? onFiles;

  /// 드롭존을 눌렀을 때 호출됩니다. 호스트가 자기 파일 선택 창을 엽니다.
  ///
  /// React의 숨은 파일 입력이 하던 일입니다. 선택한 파일은 호스트가 [onFiles]로
  /// 돌려주면 됩니다.
  final VoidCallback? onBrowse;

  /// 드롭존의 굵은 문구입니다.
  final String dropTitle;

  /// 드롭존의 흐린 설명입니다.
  final String dropHint;

  /// 목록 위에 붙는 처리 단계 이름입니다. 좁은 폭(sm 미만)에서는 숨깁니다.
  final List<String> stages;

  /// 목록 행입니다. 보통 [HoronSourceRow]를 `card: false`로 넘깁니다.
  final List<Widget> children;

  @override
  State<HoronKnowledgeBasePanel> createState() => _HoronKnowledgeBasePanelState();
}

class _HoronKnowledgeBasePanelState extends State<HoronKnowledgeBasePanel> {
  String? _inner;

  String? get _selected => widget.value ?? _inner;

  @override
  void initState() {
    super.initState();
    _inner = widget.defaultValue ?? (widget.tabs.isEmpty ? null : widget.tabs.first.id);
  }

  void _select(String id) {
    if (widget.value == null) setState(() => _inner = id);
    widget.onValueChange?.call(id);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

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
            // px-5 py-4.5
            padding: EdgeInsets.symmetric(horizontal: space.s5, vertical: space.step(4.5)),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: space.s3, // gap-3
              children: <Widget>[
                Row(
                  spacing: space.s2, // gap-2
                  children: <Widget>[
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: space.s0_5, // gap-0.5
                        children: <Widget>[
                          Text(
                            widget.title,
                            style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis, // truncate
                          ),
                          if (widget.meta != null)
                            Text(
                              widget.meta!,
                              style: theme.text.caption.copyWith(color: colors.textSecondary),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                        ],
                      ),
                    ),
                    _RoundIconButton(
                      label: 'Knowledge base settings',
                      icon: Icons.tune, // SlidersHorizontal
                      iconSize: _settingsIconSize,
                      onPressed: widget.onSettings,
                    ),
                    _AddSourceButton(onPressed: widget.onAddSource),
                  ],
                ),
                _tabRow(theme),
                _TableHead(stages: widget.stages, visible: constraints.maxWidth >= theme.breakpoints.sm),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: widget.children,
                ),
                if (widget.onFiles != null)
                  _DropZone(
                    title: widget.dropTitle,
                    hint: widget.dropHint,
                    onFiles: widget.onFiles!,
                    onBrowse: widget.onBrowse,
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// 탭 쟁반과 진행 표시 줄입니다.
  Widget _tabRow(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return Row(
      spacing: space.s2, // gap-2
      children: <Widget>[
        Flexible(
          child: _PillTray(
            semanticLabel: 'Knowledge base view',
            selected: _selected,
            onSelected: _select,
            tabs: widget.tabs,
          ),
        ),
        const Spacer(),
        if (widget.indexing > 0)
          Row(
            spacing: space.s2, // gap-2
            children: <Widget>[
              const HoronSpinner(pixelSize: 13),
              Text('${widget.indexing} indexing', style: theme.text.caption.copyWith(color: colors.textSecondary)),
            ],
          ),
      ],
    );
  }
}

/// `role="tablist"` 쟁반입니다.
///
/// `rounded-full bg-overlay-ink-5 p-0.75` 트랙에 `h-7.5 px-3` 탭을 담습니다.
class _PillTray extends StatelessWidget {
  const _PillTray({required this.tabs, required this.selected, required this.onSelected, this.semanticLabel});

  final List<HoronKnowledgeBaseTab> tabs;
  final String? selected;
  final ValueChanged<String> onSelected;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      container: true,
      label: semanticLabel,
      child: Container(
        padding: const EdgeInsets.all(_trayInset), // p-0.75
        decoration: BoxDecoration(
          color: theme.colors.overlayInk5, // bg-overlay-ink-5
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
        child: Wrap(
          spacing: theme.space.s0_5, // gap-0.5
          runSpacing: theme.space.s0_5,
          children: <Widget>[
            for (final HoronKnowledgeBaseTab tab in tabs)
              _TrayTab(tab: tab, selected: tab.id == selected, onTap: () => onSelected(tab.id)),
          ],
        ),
      ),
    );
  }
}

/// `h-7.5 rounded-full px-3 text-label-md` 탭 하나입니다.
class _TrayTab extends StatefulWidget {
  const _TrayTab({required this.tab, required this.selected, required this.onTap});

  final HoronKnowledgeBaseTab tab;
  final bool selected;
  final VoidCallback onTap;

  @override
  State<_TrayTab> createState() => _TrayTabState();
}

class _TrayTabState extends State<_TrayTab> {
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
      label: widget.tab.count == null ? widget.tab.label : '${widget.tab.label} ${widget.tab.count}',
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
              key: ValueKey<String>('kb-tab-${widget.tab.id}'),
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              height: _tabHeight, // h-7.5
              padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3
              decoration: BoxDecoration(
                // 선택된 탭이 칠하는 bg-overlay-ink-10 입니다.
                color: widget.selected ? colors.overlayInk10 : Colors.transparent,
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                spacing: space.s1_5, // gap-1.5
                children: <Widget>[
                  Flexible(
                    child: Text(
                      widget.tab.label,
                      style: theme.text.labelMd.copyWith(color: foreground),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (widget.tab.count != null)
                    Text('${widget.tab.count}', style: theme.text.caption.copyWith(color: colors.textSecondary)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `size-8.5 rounded-full bg-overlay-ink-5` 아이콘 단추입니다.
class _RoundIconButton extends StatefulWidget {
  const _RoundIconButton({required this.label, required this.icon, required this.iconSize, this.onPressed});

  final String label;
  final IconData icon;
  final double iconSize;
  final VoidCallback? onPressed;

  @override
  State<_RoundIconButton> createState() => _RoundIconButtonState();
}

class _RoundIconButtonState extends State<_RoundIconButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool interactive = widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      enabled: interactive,
      label: widget.label,
      child: _pressable(
        enabled: interactive,
        hovered: _hovered,
        focused: _focused,
        onHover: (bool value) => setState(() => _hovered = value),
        onFocus: (bool value) => setState(() => _focused = value),
        onPressed: widget.onPressed,
        radius: theme.radius.full,
        ringColor: colors.textBrand,
        child: AnimatedContainer(
          duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
          curve: HoronMotion.colorsCurve,
          width: _headerControlSize,
          height: _headerControlSize,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            // bg-overlay-ink-5, hover:bg-overlay-ink-8
            color: _hovered && interactive ? colors.overlayInk8 : colors.overlayInk5,
            borderRadius: BorderRadius.circular(theme.radius.full),
          ),
          child: Icon(widget.icon, size: widget.iconSize, color: colors.textPrimary),
        ),
      ),
    );
  }
}

/// `h-8.5 rounded-full bg-overlay-ink-5` "Add source" 단추입니다.
class _AddSourceButton extends StatefulWidget {
  const _AddSourceButton({this.onPressed});

  final VoidCallback? onPressed;

  @override
  State<_AddSourceButton> createState() => _AddSourceButtonState();
}

class _AddSourceButtonState extends State<_AddSourceButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      enabled: interactive,
      label: 'Add source',
      child: _pressable(
        enabled: interactive,
        hovered: _hovered,
        focused: _focused,
        onHover: (bool value) => setState(() => _hovered = value),
        onFocus: (bool value) => setState(() => _focused = value),
        onPressed: widget.onPressed,
        radius: theme.radius.full,
        ringColor: colors.textBrand,
        child: AnimatedContainer(
          duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
          curve: HoronMotion.colorsCurve,
          height: _headerControlSize, // h-8.5
          padding: EdgeInsets.only(left: space.s2_5, right: space.s3), // pl-2.5 pr-3
          // hover:bg-overlay-ink-8
          decoration: BoxDecoration(
            color: _hovered && interactive ? colors.overlayInk8 : colors.overlayInk5,
            borderRadius: BorderRadius.circular(theme.radius.full),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: space.s1_5, // gap-1.5
            children: <Widget>[
              Icon(Icons.add, size: _smallIconSize, color: colors.textPrimary), // Plus size-3.5
              Text('Add source', style: theme.text.labelSm.copyWith(color: colors.textPrimary)),
              Icon(Icons.arrow_drop_down, size: _caretSize, color: colors.textSecondary), // CaretDown size-3
            ],
          ),
        ),
      ),
    );
  }
}

/// `sm:flex` 표 머리입니다. 좁은 폭에서는 숨깁니다.
class _TableHead extends StatelessWidget {
  const _TableHead({required this.stages, required this.visible});

  final List<String> stages;

  /// 폭이 [HoronBreakpoints.sm] 이상이면 참입니다. React `hidden sm:flex`입니다.
  final bool visible;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    if (!visible) return const SizedBox.shrink();
    final TextStyle style = theme.text.caption.copyWith(color: colors.textSecondary);

    return ExcludeSemantics(
      // px-2 pt-2 pb-1
      child: Padding(
        padding: EdgeInsets.fromLTRB(space.s2, space.s2, space.s2, space.s1),
        child: Row(
          spacing: space.s3, // gap-3
          children: <Widget>[
            Expanded(
              child: Text('Source', style: style, maxLines: 1, overflow: TextOverflow.ellipsis),
            ),
            Row(
              spacing: space.s1, // gap-1
              children: <Widget>[
                for (final String stage in stages)
                  SizedBox(
                    width: _stageWidth, // w-11
                    height: _stageHeight, // h-4
                    child: Text(stage, style: style, maxLines: 1, overflow: TextOverflow.ellipsis),
                  ),
              ],
            ),
            SizedBox(width: _rowTailWidth), // w-18
          ],
        ),
      ),
    );
  }
}

/// 둥근 점선 드롭존입니다.
///
/// React `<label onDragOver>`입니다. 끌어오는 동안 `border-border-focus bg-bg-brand`로
/// 바뀌고, 그 밖에는 `border-overlay-ink-18`에 채움이 없습니다.
class _DropZone extends StatefulWidget {
  const _DropZone({required this.title, required this.hint, required this.onFiles, this.onBrowse});

  final String title;
  final String hint;
  final ValueChanged<Object> onFiles;
  final VoidCallback? onBrowse;

  @override
  State<_DropZone> createState() => _DropZoneState();
}

class _DropZoneState extends State<_DropZone> {
  bool _dragging = false;
  bool _focused = false;

  void _setDragging(bool value) {
    if (_dragging == value) return;
    setState(() => _dragging = value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    final BoxDecoration body = BoxDecoration(
      // border-border-focus bg-bg-brand / border-overlay-ink-18 bg-transparent
      color: _dragging ? colors.bgBrand : Colors.transparent,
      borderRadius: BorderRadius.circular(theme.radius.xl2), // rounded-2xl
    );

    return DragTarget<Object>(
      onWillAcceptWithDetails: (DragTargetDetails<Object> details) => true,
      onMove: (DragTargetDetails<Object> details) => _setDragging(true),
      onLeave: (Object? data) => _setDragging(false),
      onAcceptWithDetails: (DragTargetDetails<Object> details) {
        _setDragging(false);
        widget.onFiles(details.data);
      },
      builder: (BuildContext context, List<Object?> candidate, List<Object?> rejected) {
        final Widget content = Row(
          spacing: space.s3, // gap-3
          children: <Widget>[
            Icon(Icons.upload_file, size: _dropIconSize, color: colors.textSecondary), // UploadSimple size-4.5
            Flexible(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: space.s0_5, // gap-0.5
                children: <Widget>[
                  Text(widget.title, style: theme.text.labelMd.copyWith(color: colors.textPrimary)),
                  Text(widget.hint, style: theme.text.caption.copyWith(color: colors.textSecondary)),
                ],
              ),
            ),
          ],
        );

        return Semantics(
          button: widget.onBrowse != null,
          label: widget.title,
          hint: widget.hint,
          child: FocusableActionDetector(
            mouseCursor: SystemMouseCursors.click,
            onShowFocusHighlight: (bool value) => setState(() => _focused = value),
            shortcuts: const <ShortcutActivator, Intent>{
              SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
              SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
            },
            actions: <Type, Action<Intent>>{
              ActivateIntent: CallbackAction<ActivateIntent>(
                onInvoke: (ActivateIntent intent) {
                  widget.onBrowse?.call();
                  return null;
                },
              ),
            },
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: widget.onBrowse,
              child: _FocusRing(
                visible: _focused,
                radius: theme.radius.xl2,
                color: colors.textBrand,
                child: AnimatedContainer(
                  duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
                  curve: HoronMotion.colorsCurve,
                  decoration: body,
                  child: CustomPaint(
                    painter: _DashedBorderPainter(
                      color: _dragging ? colors.borderFocus : colors.overlayInk18,
                      radius: theme.radius.xl2,
                    ),
                    // px-4.5 py-4
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: space.step(4.5), vertical: space.s4),
                      child: content,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// `border-dashed`를 그립니다. Flutter에는 점선 테두리가 없어 직접 긋습니다.
class _DashedBorderPainter extends CustomPainter {
  const _DashedBorderPainter({required this.color, required this.radius});

  final Color color;
  final double radius;

  @override
  void paint(Canvas canvas, Size size) {
    final double inset = _dropBorderWidth / 2;
    final RRect rrect = RRect.fromRectAndRadius((Offset.zero & size).deflate(inset), Radius.circular(radius));
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = _dropBorderWidth
      ..color = color;

    final Path path = Path()..addRRect(rrect);
    for (final PathMetric metric in path.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double end = math.min(distance + _dashLength, metric.length);
        canvas.drawPath(metric.extractPath(distance, end), paint);
        distance = end + _dashGap;
      }
    }
  }

  @override
  bool shouldRepaint(_DashedBorderPainter oldDelegate) => oldDelegate.color != color || oldDelegate.radius != radius;
}

/// 누르기·호버·포커스를 한 곳에서 묶은 표면입니다.
Widget _pressable({
  required bool enabled,
  required bool hovered,
  required bool focused,
  required ValueChanged<bool> onHover,
  required ValueChanged<bool> onFocus,
  required VoidCallback? onPressed,
  required double radius,
  required Color ringColor,
  required Widget child,
}) {
  return FocusableActionDetector(
    enabled: enabled,
    mouseCursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
    onShowHoverHighlight: onHover,
    onShowFocusHighlight: onFocus,
    shortcuts: const <ShortcutActivator, Intent>{
      SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
      SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
    },
    actions: <Type, Action<Intent>>{
      ActivateIntent: CallbackAction<ActivateIntent>(
        onInvoke: (ActivateIntent intent) {
          onPressed?.call();
          return null;
        },
      ),
    },
    child: GestureDetector(
      onTap: onPressed,
      child: _FocusRing(visible: focused && enabled, radius: radius, color: ringColor, child: child),
    ),
  );
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
