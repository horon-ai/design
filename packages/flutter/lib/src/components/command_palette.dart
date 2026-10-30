import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `rounded-[24px]` — 토큰 반경 단계에 없는 팔레트 전용 반경입니다.
const double _popupRadius = 24;

/// `w-140` — 560. 화면이 좁으면 이 값보다 작아집니다.
const double _popupMaxWidth = 560;

/// `max-h-[min(60dvh,24rem)]`의 `24rem` — 384px 상한입니다.
const double _listMaxHeight = 384;

/// `max-h-[min(60dvh,24rem)]`의 `60dvh` — 호스트 높이의 60%입니다.
const double _listViewportShare = 0.6;

/// `opacity-40` — 스크림 불투명도입니다.
const double _scrimOpacity = 0.4;

/// `size-5` — 검색 아이콘 20px입니다.
const double _searchIconSize = 20;

/// `[&>svg]:size-4` — 결과 타일 안 아이콘 16px입니다.
const double _tileIconSize = 16;

/// `h-px`와 `py-px` — 1px 선과 여백입니다.
const double _hairline = 1;

/// 팔레트 결과 한 줄입니다. React `CommandItem`입니다.
class HoronCommandItem {
  /// 결과 한 줄을 만듭니다.
  const HoronCommandItem({
    required this.value,
    required this.label,
    this.keywords,
    this.tile,
    this.tileBackground,
    this.tileForeground,
    this.meta,
    this.hint,
    this.onSelect,
  });

  /// 결과를 구별하는 값입니다(React `value`).
  final String value;

  /// 결과의 문구입니다(React `label`).
  final String label;

  /// 검색어가 이 문자열에도 걸리게 하는 보조 키워드입니다(React `keywords`).
  final String? keywords;

  /// 28px 앞 타일의 내용입니다. 이니셜이나 16px 아이콘을 넣습니다.
  final Widget? tile;

  /// 타일 바탕입니다(React `tileClassName`). 없으면 `interactivePrimary`입니다.
  final Color? tileBackground;

  /// 타일 전경입니다. 없으면 `interactiveOnPrimary`입니다.
  final Color? tileForeground;

  /// 라벨 뒤에 붙는 설명입니다(React `meta`). 보통 워크스페이스 이름입니다.
  final Widget? meta;

  /// 오른쪽 힌트입니다(React `hint`). 보통 단축키 표시입니다.
  final Widget? hint;

  /// 이 결과를 고를 때 부를 콜백입니다(React `onSelect`).
  final VoidCallback? onSelect;
}

/// 결과 묶음입니다. React `CommandGroup`입니다.
class HoronCommandGroup {
  /// 묶음을 만듭니다.
  const HoronCommandGroup({required this.label, required this.items});

  /// 묶음 제목입니다(React `label`).
  final String label;

  /// 묶음에 속한 결과입니다(React `items`).
  final List<HoronCommandItem> items;
}

/// Figma `Command palette`(110:676)입니다.
///
/// 560px 서리 유리 대화상자에 48px 검색 줄, 44px 결과 줄, 키 힌트 바닥을 그립니다.
/// React는 `Dialog.Portal`로 화면 전체에 얹습니다. Flutter에는 포털이 없으므로 이
/// 위젯은 **자기 상자가 화면 역할을 하는 오버레이 층**입니다. 전체 화면에 띄우려면
/// 부모를 화면 크기의 `Stack`으로 두고, `open`이 거짓이면 [trigger]만 그립니다.
class HoronCommandPalette extends StatelessWidget {
  /// 팔레트를 만듭니다.
  const HoronCommandPalette({
    super.key,
    required this.groups,
    this.open = false,
    this.onOpenChange,
    this.placeholder = 'Search',
    this.hints,
    this.trigger,
  });

  /// 팔레트의 결과 묶음입니다(React `groups`).
  final List<HoronCommandGroup> groups;

  /// 팔레트가 열려 있는지 여부입니다(React `open`).
  final bool open;

  /// 열림이 바뀔 때 부를 콜백입니다(React `onOpenChange`).
  final ValueChanged<bool>? onOpenChange;

  /// 검색 입력의 안내 문구입니다(React `placeholder`).
  final String placeholder;

  /// 바닥의 키 힌트입니다(React `hints`). 각 항목은 (키 표시 위젯, 설명)입니다.
  final List<(Widget, String)>? hints;

  /// `open`이 거짓일 때 그리는 요소입니다(React `trigger`).
  final Widget? trigger;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final Widget? triggerWidget = trigger;
    if (!open) return triggerWidget ?? const SizedBox.shrink();

    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    void dismiss() => onOpenChange?.call(false);

    return Stack(
      children: <Widget>[
        // Dialog.Backdrop: `fixed inset-0 bg-bg-scrim motion-fade opacity-40`.
        Positioned.fill(
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: dismiss,
            child: ColoredBox(color: theme.colors.bgScrim.withValues(alpha: _scrimOpacity)),
          ),
        ),
        // Dialog.Viewport: `fixed inset-0 flex items-start justify-center px-2 pt-24`.
        Positioned(
          top: theme.space.step(24),
          left: theme.space.s2,
          right: theme.space.s2,
          child: Align(
            alignment: Alignment.topCenter,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _popupMaxWidth),
              child: TweenAnimationBuilder<double>(
                tween: Tween<double>(begin: 0, end: 1),
                duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
                curve: HoronMotion.easeEmphasized,
                // `motion-popup` + `data-starting-style:translate-y-2`.
                builder: (BuildContext context, double t, Widget? child) => Opacity(
                  opacity: t,
                  child: Transform.translate(offset: Offset(0, theme.space.s2 * (1 - t)), child: child),
                ),
                child: _PaletteSurface(groups: groups, placeholder: placeholder, hints: hints, onDismiss: dismiss),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// 팔레트의 유리 상자입니다.
///
/// React `Dialog.Popup`의 `bg-glass-fill-frost p-1.5 shadow-palette`와 그 첫 자식인
/// `LiquidGlass tier="thick"`을 옮겼습니다. 서리 채움을 먼저 깔고 그 위에 유리
/// 레이어를 얹습니다.
class _PaletteSurface extends StatelessWidget {
  const _PaletteSurface({
    required this.groups,
    required this.placeholder,
    required this.hints,
    required this.onDismiss,
  });

  final List<HoronCommandGroup> groups;
  final String placeholder;
  final List<(Widget, String)>? hints;
  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(_popupRadius);
    final List<(Widget, String)>? hints = this.hints;

    return DecoratedBox(
      decoration: BoxDecoration(borderRadius: radius, boxShadow: theme.shadows.palette),
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(child: ColoredBox(color: theme.colors.glassFillFrost)),
            Positioned.fill(
              child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: const SizedBox.expand()),
            ),
            Padding(
              padding: EdgeInsets.all(theme.space.s1_5),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  HoronCommandPaletteBody(
                    groups: groups,
                    placeholder: placeholder,
                    closeControl: Semantics(
                      button: true,
                      label: theme.strings.close,
                      child: GestureDetector(onTap: onDismiss, child: const _Kbd('esc')),
                    ),
                    onClose: onDismiss,
                    onSelect: onDismiss,
                  ),
                  if (hints != null && hints.isNotEmpty) _hintBar(theme, hints),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _hintBar(HoronThemeData theme, List<(Widget, String)> hints) {
    return Padding(
      padding: EdgeInsets.only(
        left: theme.space.s3,
        right: theme.space.s3,
        top: theme.space.s2_5,
        bottom: theme.space.s1_5,
      ),
      child: Wrap(
        spacing: theme.space.s3_5,
        runSpacing: theme.space.s1_5,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          for (final (Widget keyLabel, String label) in hints)
            Row(
              mainAxisSize: MainAxisSize.min,
              spacing: theme.space.s1_5,
              children: <Widget>[
                keyLabel,
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

/// 팔레트의 검색·목록·바닥 부분입니다. React `CommandPaletteBody`입니다.
///
/// 검색어로 결과를 걸러 내고, 고른 결과를 [onSelect]로 알립니다. 방향키와 Enter는
/// 목록에 초점이 있을 때 움직입니다. 검색 입력을 누른 뒤에는 방향키가 커서 이동으로
/// 쓰이므로, 입력 중에는 Enter가 강조된 결과를 엽니다.
class HoronCommandPaletteBody extends StatefulWidget {
  /// 본문을 만듭니다.
  const HoronCommandPaletteBody({
    super.key,
    required this.groups,
    this.placeholder = 'Search',
    this.empty,
    this.closeLabel,
    this.closeControl,
    this.onClose,
    this.onSelect,
  });

  /// 결과 묶음입니다(React `groups`).
  final List<HoronCommandGroup> groups;

  /// 검색 입력의 안내 문구입니다(React `placeholder`).
  final String placeholder;

  /// 결과가 없을 때의 문구입니다(React `empty`). 없으면 테마 문구를 씁니다.
  final String? empty;

  /// 닫기 버튼의 이름입니다(React `closeLabel`). 없으면 테마 문구를 씁니다.
  final String? closeLabel;

  /// 준비된 닫기 요소입니다(React `closeControl`). 있으면 [onClose]보다 먼저 씁니다.
  final Widget? closeControl;

  /// 닫기를 요청할 때 부를 콜백입니다(React `onClose`).
  final VoidCallback? onClose;

  /// 결과를 골랐을 때 부를 콜백입니다(React `onSelect`).
  final VoidCallback? onSelect;

  @override
  State<HoronCommandPaletteBody> createState() => _HoronCommandPaletteBodyState();
}

class _HoronCommandPaletteBodyState extends State<HoronCommandPaletteBody> {
  final TextEditingController _controller = TextEditingController();
  String _query = '';
  int _highlighted = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  List<(HoronCommandGroup, List<HoronCommandItem>)> _visibleGroups() {
    final String query = _query.trim().toLowerCase();
    final List<(HoronCommandGroup, List<HoronCommandItem>)> visible = <(HoronCommandGroup, List<HoronCommandItem>)>[];
    for (final HoronCommandGroup group in widget.groups) {
      final List<HoronCommandItem> items = <HoronCommandItem>[
        for (final HoronCommandItem item in group.items)
          if (_matches(item, query)) item,
      ];
      if (items.isNotEmpty) visible.add((group, items));
    }
    return visible;
  }

  bool _matches(HoronCommandItem item, String query) {
    if (query.isEmpty) return true;
    if (item.label.toLowerCase().contains(query)) return true;
    return item.keywords?.toLowerCase().contains(query) ?? false;
  }

  void _activate(HoronCommandItem item) {
    item.onSelect?.call();
    widget.onSelect?.call();
  }

  KeyEventResult _onKey(KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final LogicalKeyboardKey key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape) {
      widget.onClose?.call();
      return KeyEventResult.handled;
    }
    final List<HoronCommandItem> items = <HoronCommandItem>[
      for (final (_, List<HoronCommandItem> group) in _visibleGroups()) ...group,
    ];
    if (key == LogicalKeyboardKey.arrowDown || key == LogicalKeyboardKey.arrowUp) {
      if (items.isEmpty) return KeyEventResult.handled;
      final int delta = key == LogicalKeyboardKey.arrowDown ? 1 : -1;
      // 두 프레임을 기다리지 않고 연속으로 눌러도 한 칸씩 움직이도록, 마지막 빌드의
      // 값이 아니라 지금 상태 값을 읽습니다.
      final int current = _highlighted.clamp(0, items.length - 1);
      setState(() => _highlighted = (current + delta) % items.length);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.enter || key == LogicalKeyboardKey.numpadEnter) {
      if (items.isNotEmpty) _activate(items[_highlighted.clamp(0, items.length - 1)]);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  Widget? _closeControl(HoronThemeData theme) {
    final Widget? control = widget.closeControl;
    if (control != null) return control;
    final VoidCallback? onClose = widget.onClose;
    if (onClose == null) return null;
    return Semantics(
      button: true,
      label: widget.closeLabel ?? theme.strings.close,
      child: GestureDetector(onTap: onClose, child: const _Kbd('esc')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final List<(HoronCommandGroup, List<HoronCommandItem>)> visible = _visibleGroups();
    final List<HoronCommandItem> flat = <HoronCommandItem>[
      for (final (_, List<HoronCommandItem> items) in visible) ...items,
    ];
    final int highlighted = flat.isEmpty ? -1 : _highlighted.clamp(0, flat.length - 1);
    final double listMaxHeight = math.min(MediaQuery.sizeOf(context).height * _listViewportShare, _listMaxHeight);

    return Focus(
      autofocus: true,
      onKeyEvent: (FocusNode node, KeyEvent event) => _onKey(event),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          // `relative flex h-12 items-center gap-2.5 px-3.5`.
          SizedBox(
            height: space.step(12),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: space.s3_5),
              child: Row(
                spacing: space.s2_5,
                children: <Widget>[
                  Icon(Icons.search, size: _searchIconSize, color: colors.textSecondary),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      style: theme.text.bodySm.copyWith(color: colors.textPrimary),
                      cursorColor: colors.textPrimary,
                      decoration: InputDecoration.collapsed(
                        hintText: widget.placeholder,
                        hintStyle: theme.text.bodySm.copyWith(color: colors.textSecondary),
                        filled: false,
                      ),
                      onChanged: (String value) => setState(() {
                        _query = value;
                        _highlighted = 0;
                      }),
                      onSubmitted: (_) {
                        if (highlighted >= 0 && highlighted < flat.length) _activate(flat[highlighted]);
                      },
                    ),
                  ),
                  ?_closeControl(theme),
                ],
              ),
            ),
          ),
          // `relative pt-1 pb-1.5` + `h-px bg-overlay-ink-8`.
          Padding(
            padding: EdgeInsets.only(top: space.s1, bottom: space.s1_5),
            child: SizedBox(
              height: _hairline,
              child: ColoredBox(color: colors.overlayInk8),
            ),
          ),
          if (flat.isEmpty)
            // `px-3 py-4 text-body-sm text-text-secondary`.
            Padding(
              padding: EdgeInsets.symmetric(horizontal: space.s3, vertical: space.s4),
              child: Text(
                widget.empty ?? theme.strings.noResults,
                style: theme.text.bodySm.copyWith(color: colors.textSecondary),
              ),
            )
          else
            // `flex max-h-[min(60dvh,24rem)] flex-col overflow-y-auto`.
            ConstrainedBox(
              constraints: BoxConstraints(maxHeight: listMaxHeight),
              child: SingleChildScrollView(child: _rows(theme, visible, highlighted)),
            ),
        ],
      ),
    );
  }

  Widget _rows(HoronThemeData theme, List<(HoronCommandGroup, List<HoronCommandItem>)> visible, int highlighted) {
    final HoronSpaceSpec space = theme.space;
    final List<Widget> rows = <Widget>[];
    var index = 0;
    for (final (HoronCommandGroup group, List<HoronCommandItem> items) in visible) {
      rows.add(
        // `px-3 pt-2 pb-1 text-caption text-text-secondary`.
        Padding(
          padding: EdgeInsets.only(left: space.s3, right: space.s3, top: space.s2, bottom: space.s1),
          child: Text(
            group.label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
          ),
        ),
      );
      for (final HoronCommandItem item in items) {
        final int itemIndex = index;
        rows.add(
          _CommandRow(
            item: item,
            highlighted: itemIndex == highlighted,
            onTap: () => _activate(item),
            onHover: () {
              if (_highlighted != itemIndex) setState(() => _highlighted = itemIndex);
            },
          ),
        );
        index += 1;
      }
    }
    return Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: rows);
  }
}

/// 결과 한 줄입니다.
class _CommandRow extends StatelessWidget {
  const _CommandRow({required this.item, required this.highlighted, required this.onTap, required this.onHover});

  final HoronCommandItem item;
  final bool highlighted;
  final VoidCallback onTap;
  final VoidCallback onHover;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Widget? meta = item.meta;
    final Widget? hint = item.hint;
    final Widget? metaWidget = meta == null
        ? null
        : DefaultTextStyle.merge(
            // `text-caption text-text-secondary` on the meta span.
            style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
            child: meta,
          );

    return Semantics(
      button: true,
      label: item.label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => onHover(),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onTap,
          child: AnimatedContainer(
            // `flex h-11 items-center gap-2.5 rounded-md pr-3 pl-2.5 motion-colors`.
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            height: space.step(11),
            padding: EdgeInsets.only(left: space.s2_5, right: space.s3),
            decoration: BoxDecoration(
              color: highlighted ? theme.colors.overlayInk6 : Colors.transparent,
              borderRadius: BorderRadius.circular(theme.radius.md),
            ),
            child: Row(
              spacing: space.s2_5,
              children: <Widget>[
                ?_tile(theme),
                Expanded(
                  child: Row(
                    spacing: space.s2_5,
                    children: <Widget>[
                      Flexible(
                        child: Text(
                          item.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                        ),
                      ),
                      ?metaWidget,
                    ],
                  ),
                ),
                ?hint,
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget? _tile(HoronThemeData theme) {
    final Widget? tile = item.tile;
    if (tile == null) return null;
    final Color background = item.tileBackground ?? theme.colors.interactivePrimary;
    final Color foreground = item.tileForeground ?? theme.colors.interactiveOnPrimary;
    final double size = theme.space.step(7);
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(theme.radius.sm)),
      child: IconTheme.merge(
        data: IconThemeData(size: _tileIconSize, color: foreground),
        child: DefaultTextStyle.merge(
          style: theme.text.labelSm.copyWith(color: foreground),
          child: tile,
        ),
      ),
    );
  }
}

/// 단축키 표시입니다. React `Kbd`의 모양을 이 파일 안에서만 옮긴 것입니다.
class _Kbd extends StatelessWidget {
  const _Kbd(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      // `items-center gap-1 rounded-xs bg-overlay-ink-6 px-1.5 py-px text-caption`.
      padding: EdgeInsets.symmetric(horizontal: theme.space.s1_5, vertical: _hairline),
      decoration: BoxDecoration(color: theme.colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.xs)),
      child: Text(label, maxLines: 1, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
    );
  }
}
