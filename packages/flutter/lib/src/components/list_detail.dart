// `list-detail`의 Flutter 대응입니다.
//
// React는 Base UI `Collapsible`과 `LiquidGlass`를 씁니다. Flutter에서는 접기를
// `AnimatedSize`로, 유리를 `HoronLiquidGlass`로 옮겼습니다. 목록 항목의 선택 상태는
// React의 `data-selected` 배경(`interactive-secondary`)을, 호버는 `overlay-ink-4`를 씁니다.
//
// React는 제목·설명·값을 `ReactNode`로 받지만 화면에서는 전부 글자로 그려집니다.
// 이 파일은 그 자리를 `String`으로 좁혔습니다. 글자 굵기와 잘림은 컴포넌트가 소유합니다.

import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `max-w-201.5` — 목록과 상세를 합친 최대 폭 806px입니다.
const double _maxWidth = 806;

/// `1VMZ-0` 메타 상자의 칸 수입니다. Paper는 같은 폭의 네 칸을 한 줄에 놓습니다.
const int _metaColumns = 4;

/// 목록 항목 하나입니다. React `ListDetailItem`입니다.
@immutable
class HoronListDetailItem {
  /// 항목을 만듭니다.
  const HoronListDetailItem({required this.id, required this.title, this.meta});

  /// 선택 상태를 비교하는 키입니다.
  final String id;

  /// 목록에 보이는 제목입니다. 모노 13/18로 잘립니다.
  final String title;

  /// 제목 아래 12/16 보조 문구입니다.
  final String? meta;
}

/// 목록 그룹 하나입니다. React `ListDetailGroup`입니다.
@immutable
class HoronListDetailGroup {
  /// 그룹을 만듭니다.
  const HoronListDetailGroup({required this.id, required this.label, required this.items});

  /// 그룹 키입니다.
  final String id;

  /// 항목 위에 붙는 11/14 대문자성 라벨입니다.
  final String label;

  /// 그룹에 속한 항목입니다.
  final List<HoronListDetailItem> items;
}

/// Paper `List and detail`입니다.
///
/// 두꺼운 유리 껍데기 안에 250px 목록과 상세 패널을 나란히 둡니다. 선택한 항목은
/// 150ms 색 전환으로 채워지고, 상세 패널은 선택이 바뀔 때 220ms 상승으로 갈아 끼웁니다.
/// 폭이 `breakpoints.md`보다 좁으면 목록이 위로 올라가 세로로 쌓입니다.
class HoronListDetail extends StatefulWidget {
  /// 목록과 상세를 만듭니다.
  const HoronListDetail({
    super.key,
    required this.groups,
    required this.detailBuilder,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.listWidth = 250,
  });

  /// 그룹 목록입니다.
  final List<HoronListDetailGroup> groups;

  /// 선택한 항목의 상세 패널을 만듭니다. React의 `children` 렌더 함수 자리입니다.
  final Widget Function(HoronListDetailItem item) detailBuilder;

  /// 선택을 바깥에서 고정할 때의 항목 id입니다.
  final String? value;

  /// 처음 선택할 항목 id입니다. 없으면 첫 항목입니다.
  final String? defaultValue;

  /// 선택이 바뀔 때 항목 id를 알립니다.
  final ValueChanged<String>? onValueChange;

  /// 나란히 놓을 때의 목록 폭입니다. React `w-62.5`가 250입니다.
  final double listWidth;

  @override
  State<HoronListDetail> createState() => _HoronListDetailState();
}

class _HoronListDetailState extends State<HoronListDetail> {
  String? _inner;

  @override
  void initState() {
    super.initState();
    _inner = widget.defaultValue;
  }

  List<HoronListDetailItem> get _items => <HoronListDetailItem>[
    for (final HoronListDetailGroup group in widget.groups) ...group.items,
  ];

  /// React와 같은 규칙입니다. 값이 어떤 항목도 가리키지 않으면 첫 항목이 선택입니다.
  HoronListDetailItem? get _selected {
    final List<HoronListDetailItem> items = _items;
    if (items.isEmpty) return null;
    final String? id = widget.value ?? _inner;
    for (final HoronListDetailItem item in items) {
      if (item.id == id) return item;
    }
    return items.first;
  }

  void _select(HoronListDetailItem item) {
    setState(() => _inner = item.id);
    widget.onValueChange?.call(item.id);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronListDetailItem? selected = _selected;

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: _maxWidth),
      child: HoronLiquidGlass(
        tier: HoronGlassTier.thick,
        borderRadius: BorderRadius.circular(theme.radius.xl2), // rounded-2xl = 16
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final double available = constraints.maxWidth.isFinite
                ? math.min(constraints.maxWidth, _maxWidth)
                : _maxWidth;
            final bool sideBySide = available >= theme.breakpoints.md;
            final Widget list = _buildList(theme, selected, sideBySide: sideBySide);
            final Widget detail = _buildDetail(theme, selected);

            if (!sideBySide) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[list, detail],
              );
            }
            final double listWidth = math.min(widget.listWidth, available * 0.45);
            return IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  SizedBox(width: listWidth, child: list),
                  Expanded(child: detail),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildList(HoronThemeData theme, HoronListDetailItem? selected, {required bool sideBySide}) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: theme.colors.bgInset, // bg-bg-inset
        border: sideBySide
            ? Border(right: BorderSide(color: theme.colors.borderDefault)) // border-r
            : Border(bottom: BorderSide(color: theme.colors.borderDefault)),
      ),
      child: Padding(
        padding: EdgeInsets.all(theme.space.s2_5), // p-2.5 = 10
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: theme.space.s0_5, // Paper `1W94-0`: 목록 팬의 gap 2
          children: <Widget>[
            for (final HoronListDetailGroup group in widget.groups)
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: theme.space.s0_5, // gap-0.5
                children: <Widget>[
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: theme.space.s3, vertical: theme.space.s1), // px-3 py-1
                    child: Text(
                      group.label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      // text-[11px]/[14px] font-semibold tracking-[0.4px]
                      style: theme.text.labelSm.copyWith(
                        fontSize: 11,
                        height: 14 / 11,
                        letterSpacing: 0.4,
                        fontWeight: HoronFontWeight.semibold,
                        color: theme.colors.textPlaceholder,
                      ),
                    ),
                  ),
                  for (final HoronListDetailItem item in group.items)
                    _ListRow(item: item, selected: item.id == selected?.id, onTap: () => _select(item)),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetail(HoronThemeData theme, HoronListDetailItem? selected) {
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    final Widget content = Padding(
      padding: EdgeInsets.symmetric(
        horizontal: theme.space.s6, // px-6 = 24
        vertical: theme.space.step(5.5), // py-5.5 = 22
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: theme.space.s5, // gap-5 = 20
        children: <Widget>[if (selected != null) widget.detailBuilder(selected)],
      ),
    );
    if (reduce) return content;
    // motion-rise: 220ms 동안 4px 아래에서 올라오며 나타납니다. 선택이 바뀌면 키가
    // 바뀌어 다시 시작합니다.
    return TweenAnimationBuilder<double>(
      key: ValueKey<String?>(selected?.id),
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.riseDuration,
      curve: HoronMotion.riseCurve,
      builder: (BuildContext context, double value, Widget? child) {
        return Opacity(
          opacity: value,
          child: Transform.translate(offset: Offset(0, (1 - value) * HoronMotion.riseOffset), child: child),
        );
      },
      child: content,
    );
  }
}

/// 목록 항목 한 줄입니다. 선택·호버·누름 배경을 150ms로 바꿉니다.
class _ListRow extends StatefulWidget {
  const _ListRow({required this.item, required this.selected, required this.onTap});

  final HoronListDetailItem item;
  final bool selected;
  final VoidCallback onTap;

  @override
  State<_ListRow> createState() => _ListRowState();
}

class _ListRowState extends State<_ListRow> {
  bool _hovered = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    final Color background = widget.selected
        ? theme
              .colors
              .interactiveSecondary // data-selected:bg-interactive-secondary
        : _pressed || _hovered
        ? theme
              .colors
              .overlayInk4 // hover:bg-overlay-ink-4
        : Colors.transparent;

    return Semantics(
      button: true,
      selected: widget.selected,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
        onExit: (PointerExitEvent event) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
          onTapUp: (TapUpDetails details) => setState(() => _pressed = false),
          onTapCancel: () => setState(() => _pressed = false),
          onTap: widget.onTap,
          child: AnimatedContainer(
            duration: reduce ? Duration.zero : HoronMotion.colorsDuration, // motion-colors
            curve: HoronMotion.colorsCurve,
            padding: EdgeInsets.symmetric(horizontal: theme.space.s3, vertical: theme.space.s2_5), // px-3 py-2.5
            decoration: BoxDecoration(
              color: background,
              borderRadius: BorderRadius.circular(theme.space.s2_5), // list-detail.tsx rounded-[10px]
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: theme.space.s1, // gap-1
              children: <Widget>[
                Row(
                  spacing: theme.space.s2, // gap-2
                  children: <Widget>[
                    SizedBox(
                      width: theme.space.step(1.75), // size-1.75 = 7
                      height: theme.space.step(1.75),
                      child: const DecoratedBox(
                        decoration: BoxDecoration(color: HoronPalette.sky500, shape: BoxShape.circle),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        widget.item.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        // font-mono text-[13px]/[18px] font-medium
                        style: theme.text.code.copyWith(
                          fontSize: 13,
                          height: 18 / 13,
                          fontWeight: HoronFontWeight.medium,
                          color: theme.colors.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
                if (widget.item.meta != null)
                  Padding(
                    padding: EdgeInsets.only(left: theme.space.step(3.75)), // pl-3.75 = 15
                    child: Text(
                      widget.item.meta!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      // text-[12px]/[16px]
                      style: theme.text.caption.copyWith(height: 16 / 12, color: theme.colors.textPlaceholder),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 상세 패널 머리입니다. 40px 타일, 제목, 설명, 오른쪽 액션 묶음입니다.
class HoronListDetailHeader extends StatelessWidget {
  /// 머리를 만듭니다.
  const HoronListDetailHeader({super.key, required this.title, this.icon, this.description, this.actions});

  /// 타일 안의 18px 아이콘입니다.
  final Widget? icon;

  /// 모노 16/22 굵은 제목입니다.
  final String title;

  /// 제목 아래 13/18 보조 문구입니다.
  final String? description;

  /// 오른쪽에 붙는 상태 라벨·스위치·아이콘 버튼 묶음입니다.
  final Widget? actions;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool dark = theme.brightness == Brightness.dark;
    return Row(
      spacing: theme.space.s3, // gap-3
      children: <Widget>[
        if (icon != null)
          SizedBox(
            width: theme.space.step(10), // size-10 = 40
            height: theme.space.step(10),
            child: DecoratedBox(
              decoration: BoxDecoration(
                // bg-sky-100 dark:bg-sky-900
                color: dark ? HoronPalette.sky900 : HoronPalette.sky100,
                borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
              ),
              child: IconTheme.merge(
                // [&_svg]:size-4.5, text-sky-700 dark:text-sky-300
                data: IconThemeData(
                  size: theme.space.step(4.5),
                  color: dark ? HoronPalette.sky300 : HoronPalette.sky700,
                ),
                child: Center(child: icon),
              ),
            ),
          ),
        Expanded(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                // font-mono text-[16px]/[22px] font-semibold
                style: theme.text.code.copyWith(
                  fontSize: 16,
                  height: 22 / 16,
                  fontWeight: HoronFontWeight.semibold,
                  color: theme.colors.textPrimary,
                ),
              ),
              if (description != null)
                Text(
                  description!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  // text-[13px]/[18px]
                  style: theme.text.bodySm.copyWith(fontSize: 13, height: 18 / 13, color: theme.colors.textSecondary),
                ),
            ],
          ),
        ),
        ?actions,
      ],
    );
  }
}

/// 상세 패널의 메타 상자 한 칸입니다. React `ListDetailMeta`의 `items` 원소입니다.
@immutable
class HoronListDetailMetaItem {
  /// 칸을 만듭니다.
  const HoronListDetailMetaItem({required this.id, required this.label, required this.value});

  /// 칸 키입니다.
  final String id;

  /// 값 위의 12/16 라벨입니다.
  final String label;

  /// 14/20 값입니다. 한 줄로 잘립니다.
  final String value;
}

/// 상세 패널의 메타 상자입니다. 두 열 격자에 라벨 위·값 아래로 놓습니다.
class HoronListDetailMeta extends StatelessWidget {
  /// 상자를 만듭니다.
  const HoronListDetailMeta({super.key, required this.items});

  /// 두 열로 흐르는 칸 목록입니다.
  final List<HoronListDetailMetaItem> items;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool dark = theme.brightness == Brightness.dark;
    return DecoratedBox(
      decoration: BoxDecoration(
        // bg-neutral-50 dark:bg-neutral-800
        color: dark ? HoronPalette.neutral800 : HoronPalette.neutral50,
        borderRadius: BorderRadius.circular(theme.radius.md), // rounded-md = 12
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: theme.space.s4, // px-4
          vertical: theme.space.s3_5, // py-3.5
        ),
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final double gap = theme.space.s4; // gap-x-4
            if (!constraints.maxWidth.isFinite) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: theme.space.s3,
                children: <Widget>[for (final HoronListDetailMetaItem item in items) _cell(theme, item)],
              );
            }
            final double column = math.max(0, (constraints.maxWidth - gap * (_metaColumns - 1)) / _metaColumns);
            return Wrap(
              spacing: gap,
              runSpacing: theme.space.s3, // gap-y-3
              children: <Widget>[
                for (final HoronListDetailMetaItem item in items) SizedBox(width: column, child: _cell(theme, item)),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _cell(HoronThemeData theme, HoronListDetailMetaItem item) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s0_5,
      children: <Widget>[
        Text(
          item.label,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          // text-[12px]/[16px] font-medium
          style: theme.text.labelSm.copyWith(height: 16 / 12, color: theme.colors.textPlaceholder),
        ),
        Text(
          item.value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          // text-[14px]/[20px] font-medium
          style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
        ),
      ],
    );
  }
}

/// 지시문 블록입니다. 코드 패널과 Edit 버튼, 그리고 240ms로 열리는 편집 상자입니다.
class HoronListDetailInstructions extends StatefulWidget {
  /// 블록을 만듭니다.
  const HoronListDetailInstructions({
    super.key,
    this.title = 'Instructions',
    this.tag,
    this.value,
    this.defaultValue = '',
    this.onValueChange,
  });

  /// 패널 위 13/18 굵은 제목입니다.
  final String title;

  /// 제목 옆 파일 이름 칩입니다.
  final String? tag;

  /// 편집 값을 바깥에서 고정할 때의 본문입니다.
  final String? value;

  /// 처음 보여 줄 본문입니다.
  final String defaultValue;

  /// 편집 상자의 입력이 바뀔 때 본문을 알립니다.
  final ValueChanged<String>? onValueChange;

  @override
  State<HoronListDetailInstructions> createState() => _HoronListDetailInstructionsState();
}

class _HoronListDetailInstructionsState extends State<HoronListDetailInstructions> {
  late final TextEditingController _controller = TextEditingController(text: widget.value ?? widget.defaultValue);
  late String _inner = _controller.text;
  bool _editing = false;

  @override
  void didUpdateWidget(covariant HoronListDetailInstructions oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != null && widget.value != oldWidget.value) {
      _controller.text = widget.value!;
      _inner = widget.value!;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool dark = theme.brightness == Brightness.dark;
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    final String text = widget.value ?? _inner;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: theme.space.s2, // gap-2
      children: <Widget>[
        Row(
          children: <Widget>[
            Expanded(
              child: Row(
                spacing: theme.space.s2, // gap-2
                children: <Widget>[
                  Flexible(
                    child: Text(
                      widget.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      // text-[13px]/[18px] font-semibold
                      style: theme.text.labelSm.copyWith(
                        fontSize: 13,
                        height: 18 / 13,
                        fontWeight: HoronFontWeight.semibold,
                        color: theme.colors.textPrimary,
                      ),
                    ),
                  ),
                  if (widget.tag != null)
                    Container(
                      height: theme.space.step(5.5), // h-5.5 = 22
                      padding: EdgeInsets.symmetric(horizontal: theme.space.s2), // px-2
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: theme.colors.overlayInk6, // bg-overlay-ink-6
                        borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
                      ),
                      child: Text(
                        widget.tag!,
                        maxLines: 1,
                        style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
                      ),
                    ),
                ],
              ),
            ),
            SizedBox(width: theme.space.s2),
            _GlassButton(label: _editing ? 'Done' : 'Edit', onPressed: () => setState(() => _editing = !_editing)),
          ],
        ),
        DecoratedBox(
          decoration: BoxDecoration(
            // bg-neutral-50 dark:bg-neutral-800
            color: dark ? HoronPalette.neutral800 : HoronPalette.neutral50,
            borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
            border: Border.all(color: theme.colors.borderDefault),
          ),
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: theme.space.s4, // px-4
              vertical: theme.space.s3_5, // py-3.5
            ),
            child: SizedBox(
              width: double.infinity,
              child: Text.rich(
                TextSpan(children: _instructionSpans(text, theme.colors.syntaxKey)),
                // font-mono text-[12px]/[19px] text-syntax-string
                style: theme.text.code.copyWith(fontSize: 12, height: 19 / 12, color: theme.colors.syntaxString),
              ),
            ),
          ),
        ),
        AnimatedSize(
          duration: reduce ? Duration.zero : HoronMotion.collapseDuration, // motion-collapse 240ms
          curve: HoronMotion.collapseCurve,
          alignment: Alignment.topCenter,
          child: !_editing
              ? const SizedBox(width: double.infinity)
              : Padding(
                  padding: EdgeInsets.only(top: theme.space.s1), // mt-1
                  child: TextField(
                    controller: _controller,
                    minLines: 6,
                    maxLines: null, // rows={6} + resize-y: 여섯 줄에서 시작해 내용만큼 자랍니다
                    keyboardType: TextInputType.multiline,
                    style: theme.text.code.copyWith(fontSize: 12, height: 19 / 12, color: theme.colors.textPrimary),
                    onChanged: (String value) {
                      setState(() => _inner = value);
                      widget.onValueChange?.call(value);
                    },
                    decoration: InputDecoration(
                      isDense: true,
                      filled: true,
                      fillColor: theme.colors.bgInset, // bg-bg-inset
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: theme.space.s4, // px-4
                        vertical: theme.space.s3, // py-3
                      ),
                      border: _fieldBorder(theme, theme.colors.borderDefault),
                      enabledBorder: _fieldBorder(theme, theme.colors.borderDefault),
                      focusedBorder: _fieldBorder(theme, theme.colors.borderFocus, width: 2),
                    ),
                  ),
                ),
        ),
      ],
    );
  }
}

/// 지시문 한 줄의 키(`name:`)만 문법 키 색으로 나눕니다. React `renderInstructions`와 같습니다.
List<InlineSpan> _instructionSpans(String text, Color keyColor) {
  final List<String> lines = text.split('\n');
  final RegExp keyPattern = RegExp(r'^([\w-]+:)(.*)$');
  final List<InlineSpan> spans = <InlineSpan>[];
  int fences = 0;
  for (int index = 0; index < lines.length; index++) {
    final String line = lines[index];
    if (line.trim() == '---') fences += 1;
    final RegExpMatch? match = fences == 1 ? keyPattern.firstMatch(line) : null;
    if (match != null) {
      spans
        ..add(
          TextSpan(
            text: match.group(1),
            style: TextStyle(color: keyColor),
          ),
        )
        ..add(TextSpan(text: match.group(2)));
    } else {
      spans.add(TextSpan(text: line));
    }
    if (index < lines.length - 1) spans.add(const TextSpan(text: '\n'));
  }
  return spans;
}

OutlineInputBorder _fieldBorder(HoronThemeData theme, Color color, {double width = 1}) {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
    borderSide: BorderSide(color: color, width: width),
  );
}

/// 파일 줄입니다. 13/18 라벨 아래 32px 유리 칩을 6px 간격으로 흘립니다.
class HoronListDetailFiles extends StatelessWidget {
  /// 파일 줄을 만듭니다.
  const HoronListDetailFiles({super.key, this.label = 'Files', this.children = const <Widget>[]});

  /// 줄 위의 라벨입니다.
  final String label;

  /// 보통 `Button`의 `glass` 변형인 칩입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s2, // gap-2
      children: <Widget>[
        Text(
          label,
          style: theme.text.labelSm.copyWith(
            fontSize: 13,
            height: 18 / 13,
            fontWeight: HoronFontWeight.semibold,
            color: theme.colors.textPrimary,
          ),
        ),
        Wrap(
          spacing: theme.space.s1_5, // gap-1.5
          runSpacing: theme.space.s1_5,
          children: children,
        ),
      ],
    );
  }
}

/// 상세 패널 바닥입니다. 1px 위쪽 괘선과 8px 간격의 버튼 줄입니다.
///
/// React는 `<span className="flex-1" />`을 스페이서로 끼웁니다. Flutter에서는
/// `OverflowBar`가 폭이 모자랄 때 다음 줄로 흘리므로, 좁은 화면에서도 넘치지 않습니다.
class HoronListDetailFooter extends StatelessWidget {
  /// 바닥을 만듭니다.
  const HoronListDetailFooter({super.key, this.children = const <Widget>[]});

  /// 8px 간격으로 놓는 버튼입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: theme.colors.borderDefault)), // border-t
      ),
      child: Padding(
        padding: EdgeInsets.only(top: theme.space.s3_5), // pt-3.5
        child: OverflowBar(
          spacing: theme.space.s2, // gap-2
          overflowSpacing: theme.space.s2,
          alignment: MainAxisAlignment.start,
          children: children,
        ),
      ),
    );
  }
}

/// `button.tsx`의 `glass`·`sm` 변형입니다.
///
/// `button`은 다른 레인의 컴포넌트라 이 파일이 그 자리를 직접 그립니다. 보이는 값은
/// `h-8`, `px-3`, `text-label-md`, `rounded-full`, `bg-glass-clear`입니다.
class _GlassButton extends StatelessWidget {
  const _GlassButton({required this.label, this.onPressed});

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      button: true,
      enabled: onPressed != null,
      child: _PressScale(
        enabled: onPressed != null,
        onTap: onPressed,
        child: HoronLiquidGlass(
          borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
          child: SizedBox(
            height: theme.space.step(8), // sm h-8 = 32
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: theme.space.s3), // px-3
              child: Center(
                widthFactor: 1,
                child: Text(label, maxLines: 1, style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `motion-press`(누르면 0.97로 줄어드는 150ms)를 옮긴 껍데기입니다.
class _PressScale extends StatefulWidget {
  const _PressScale({required this.child, this.onTap, this.enabled = true});

  final Widget child;
  final VoidCallback? onTap;
  final bool enabled;

  @override
  State<_PressScale> createState() => _PressScaleState();
}

class _PressScaleState extends State<_PressScale> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: widget.enabled ? (TapDownDetails details) => setState(() => _pressed = true) : null,
      onTapUp: widget.enabled ? (TapUpDetails details) => setState(() => _pressed = false) : null,
      onTapCancel: widget.enabled ? () => setState(() => _pressed = false) : null,
      onTap: widget.enabled ? widget.onTap : null,
      child: AnimatedScale(
        scale: _pressed && !reduce ? HoronMotion.pressScale : 1,
        duration: reduce ? Duration.zero : HoronMotion.pressDuration,
        curve: HoronMotion.pressCurve,
        child: widget.child,
      ),
    );
  }
}
