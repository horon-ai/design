import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `research-run-panel.tsx`의 `max-w-150`입니다. 판의 최대 폭 600입니다.
const double _maxWidth = 600;

/// `research-run-panel.tsx`의 `size-4`입니다. 머리 아이콘과 보내기 아이콘 16px.
const double _iconSize = 16;

/// `research-run-panel.tsx`의 `size-3.5`입니다. 더하기·체크·정지 아이콘 14px.
const double _smallIconSize = 14;

/// `research-run-panel.tsx`의 `size-3`입니다. 상태 줄과 출처 알약의 캐럿 12px.
const double _caretSize = 12;

/// `research-run-panel.tsx`의 `h-px`입니다. 머리 아래 구분선 두께입니다.
const double _hairline = 1;

/// `research-run-panel.tsx`의 `w-[1.5px]`입니다. 질의 목록의 세로 레일 두께입니다.
const double _railWidth = 1.5;

/// `research-run-panel.tsx`의 `w-0.5`입니다. 깜빡이는 캐럿 막대의 두께입니다.
const double _caretBarWidth = 2;

/// `research-run-panel.tsx`의 `h-3`입니다. 깜빡이는 캐럿 막대의 높이입니다.
const double _caretBarHeight = 12;

/// `research-run-panel.tsx`의 `rounded-[1px]`입니다. 캐럿 막대 끝의 반경입니다.
const double _caretBarRadius = 1;

/// `research-run-panel.tsx`의 `max-w-[85%]`입니다. 질문 말풍선의 최대 폭 비율입니다.
const double _questionWidthFactor = 0.85;

/// `research-run-panel.tsx`의 `-ml-2`입니다. 출처 아바타가 겹치는 정도입니다.
const double _avatarOverlap = 8;

/// `research-run-panel.tsx`의 `ring-2`입니다. 출처 아바타의 테두리 두께입니다.
const double _avatarRing = 2;

/// `research-run-panel.tsx`의 `animation-delay: calc(var(--i) * 30ms)`입니다.
const Duration _staggerStep = Duration(milliseconds: 30);

/// `research-run-panel.tsx`의 `ResearchQuery`입니다.
///
/// React는 `state?: "done" | "searching"`을 인라인 유니온으로 두므로 공개 enum을
/// 만들지 않고 [searching] 참·거짓으로 옮겼습니다.
class HoronResearchQuery {
  /// 질의 한 줄을 만듭니다.
  const HoronResearchQuery({required this.id, required this.text, this.searching = false, this.results});

  /// 목록에서 쓰는 식별자입니다.
  final String id;

  /// 질의 문구입니다. 폭이 모자라면 말줄임됩니다.
  final String text;

  /// `state === "searching"`입니다. 참이면 스피너와 흐린 문구, 거짓이면 체크가 붙습니다.
  final bool searching;

  /// 줄 끝에 붙는 결과 수입니다. 예: `8 results`.
  final String? results;
}

/// Paper `Research run`(Agents N10): 머리·질문·상태 줄·읽은 질의를 담은 24px 판입니다.
///
/// `research-run-panel.tsx`를 옮긴 것입니다. 질문은 오른쪽에 붙은 잉크 말풍선이고,
/// 실행 중에는 스피너·상태 문구·깜빡이는 캐럿이, 질의가 있으면 세로 레일 위의 목록이
/// 놓입니다. 아래 입력은 실행 중이면 정지 버튼, 끝나면 보내기 버튼을 답니다.
class HoronResearchRunPanel extends StatefulWidget {
  /// 연구 실행 판을 만듭니다.
  const HoronResearchRunPanel({
    super.key,
    required this.question,
    this.title = 'Research',
    this.newLabel = 'New research',
    this.onNewResearch,
    this.running = true,
    this.statusLabel = 'Researching',
    this.elapsed,
    this.read,
    this.total,
    this.queries = const <HoronResearchQuery>[],
    this.sources = const <String>[],
    this.onStop,
    this.followUpPlaceholder = 'Ask a follow-up',
    this.onFollowUp,
  });

  /// 머리 제목입니다.
  final String title;

  /// 새 연구 버튼의 문구입니다.
  final String newLabel;

  /// 새 연구 버튼을 눌렀을 때입니다.
  final VoidCallback? onNewResearch;

  /// 질문 말풍선 문구입니다.
  final String question;

  /// 참이면 스피너·상태 줄·캐럿을 그리고 보내기 버튼이 정지 버튼이 됩니다.
  final bool running;

  /// 상태 문구입니다. 예: `Researching`.
  final String statusLabel;

  /// 상태 줄의 경과 시간입니다. 예: `12s`.
  final String? elapsed;

  /// 읽은 자료 수입니다. [total]과 함께 있을 때 `n of m read`로 그려집니다.
  final int? read;

  /// 전체 자료 수입니다.
  final int? total;

  /// 지금까지 읽은 질의입니다.
  final List<HoronResearchQuery> queries;

  /// 질의 아래 아바타에 놓을 이니셜입니다.
  final List<String> sources;

  /// 정지 버튼을 눌렀을 때입니다.
  final VoidCallback? onStop;

  /// 후속 질문 입력의 안내 문구입니다.
  final String followUpPlaceholder;

  /// 후속 질문을 보냈을 때입니다. 보낸 뒤 입력은 비워집니다.
  final ValueChanged<String>? onFollowUp;

  @override
  State<HoronResearchRunPanel> createState() => _HoronResearchRunPanelState();
}

class _HoronResearchRunPanelState extends State<HoronResearchRunPanel> with SingleTickerProviderStateMixin {
  final TextEditingController _field = TextEditingController();
  final FocusNode _focus = FocusNode();

  /// `animate-caret` — `caret-blink 1s steps(1, end) infinite`.
  late final AnimationController _caret = AnimationController(vsync: this, duration: const Duration(seconds: 1));

  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    if (_focused != _focus.hasFocus) setState(() => _focused = _focus.hasFocus);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _caret
        ..stop()
        ..value = 0;
    } else if (!_caret.isAnimating) {
      _caret.repeat();
    }
  }

  @override
  void dispose() {
    _focus.removeListener(_onFocusChange);
    _focus.dispose();
    _field.dispose();
    _caret.dispose();
    super.dispose();
  }

  void _submit() {
    final String value = _field.text;
    _field.clear();
    widget.onFollowUp?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: _maxWidth),
      child: SizedBox(
        width: double.infinity, // w-full
        child: Container(
          decoration: BoxDecoration(
            color: colors.bgSurface, // bg-bg-surface
            borderRadius: BorderRadius.circular(space.s6), // rounded-[24px]
            border: Border.all(color: colors.borderDefault), // border-border-default
          ),
          clipBehavior: Clip.antiAlias, // overflow-clip
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              _header(theme),
              Container(height: _hairline, color: colors.overlayInk8), // h-px bg-overlay-ink-8
              _body(theme),
              _composer(theme),
            ],
          ),
        ),
      ),
    );
  }

  Widget _header(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // px-5 pt-4 pb-3.5
      padding: EdgeInsets.fromLTRB(space.s5, space.s4, space.s5, space.s3_5),
      child: Row(
        spacing: space.s2, // gap-2 = 8
        children: <Widget>[
          Icon(Icons.search, size: _iconSize, color: colors.textPrimary),
          Expanded(
            child: Text(
              widget.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis, // truncate
              style: theme.text.labelLg.copyWith(color: colors.textPrimary), // text-[16px]/[22px] font-medium
            ),
          ),
          _Pressable(
            onTap: widget.onNewResearch,
            builder: (bool pressed, bool hovered) => AnimatedContainer(
              duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              height: space.step(7.5), // h-7.5 = 30
              padding: EdgeInsets.only(left: space.s3, right: space.s3_5), // pl-3 pr-3.5
              decoration: BoxDecoration(
                color: hovered ? colors.overlayInk10 : colors.overlayInk6, // hover:bg-overlay-ink-10
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                spacing: space.s1_5, // gap-1.5 = 6
                children: <Widget>[
                  Text(
                    widget.newLabel,
                    maxLines: 1,
                    style: theme.text.labelSm.copyWith(color: colors.textPrimary), // text-[12px]/[16px] font-medium
                  ),
                  Icon(Icons.add, size: _smallIconSize, color: colors.textPrimary),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _body(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final String? count = widget.read != null && widget.total != null ? '${widget.read} of ${widget.total} read' : null;

    return Padding(
      // px-5 pt-4.5 pb-4
      padding: EdgeInsets.fromLTRB(space.s5, space.step(4.5), space.s5, space.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: space.s3, // gap-3 = 12
        children: <Widget>[
          LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              return Align(
                alignment: Alignment.centerRight, // self-end
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: constraints.maxWidth * _questionWidthFactor),
                  child: Container(
                    // px-3.5 py-2.5 rounded-2xl bg-interactive-primary
                    padding: EdgeInsets.symmetric(horizontal: space.s3_5, vertical: space.s2_5),
                    decoration: BoxDecoration(
                      color: colors.interactivePrimary,
                      borderRadius: BorderRadius.circular(theme.radius.xl2),
                    ),
                    child: Text(widget.question, style: theme.text.bodySm.copyWith(color: colors.textInverse)),
                  ),
                ),
              );
            },
          ),
          if (widget.running) _statusLine(theme, count),
          if (widget.queries.isNotEmpty) _queries(theme),
          if (widget.sources.isNotEmpty) _sources(theme),
        ],
      ),
    );
  }

  Widget _statusLine(HoronThemeData theme, String? count) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final List<String> trailing = <String>[
      if (widget.elapsed != null) '· ${widget.elapsed}',
      if (count != null) ' · $count',
    ];

    return Row(
      spacing: space.s1_5, // gap-1.5 = 6
      children: <Widget>[
        const HoronSpinner(pixelSize: 14),
        Flexible(
          child: Text(
            widget.statusLabel,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.text.labelMd.copyWith(color: colors.textPrimary), // text-[14px]/[20px] font-medium
          ),
        ),
        if (trailing.isNotEmpty)
          Flexible(
            child: Text(
              trailing.join(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.caption.copyWith(color: colors.textSecondary), // text-[12px]/[18px]
            ),
          ),
        Icon(Icons.expand_more, size: _caretSize, color: colors.textSecondary),
        AnimatedBuilder(
          animation: _caret,
          builder: (BuildContext context, Widget? child) =>
              Opacity(opacity: _caret.value < 0.5 ? 1 : 0, child: child), // caret-blink 50%
          child: Container(
            width: _caretBarWidth,
            height: _caretBarHeight,
            decoration: BoxDecoration(
              color: colors.interactivePrimary,
              borderRadius: BorderRadius.circular(_caretBarRadius),
            ),
          ),
        ),
      ],
    );
  }

  Widget _queries(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // py-0.5
      padding: EdgeInsets.symmetric(vertical: space.s0_5),
      child: Stack(
        children: <Widget>[
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(
              // w-[1.5px] rounded-full bg-overlay-ink-14
              width: _railWidth,
              decoration: BoxDecoration(
                color: colors.overlayInk14,
                borderRadius: BorderRadius.circular(theme.radius.full),
              ),
            ),
          ),
          Padding(
            // pl-3.5
            padding: EdgeInsets.only(left: space.s3_5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: space.s2_5, // gap-2.5 = 10
              children: <Widget>[
                for (int index = 0; index < widget.queries.length; index++)
                  _RiseIn(index: index, child: _queryRow(theme, widget.queries[index])),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _queryRow(HoronThemeData theme, HoronResearchQuery query) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Row(
      spacing: space.s2_5, // gap-2.5 = 10
      children: <Widget>[
        if (query.searching)
          const HoronSpinner(pixelSize: 14)
        else
          Icon(Icons.check, size: _smallIconSize, color: colors.textSecondary),
        Expanded(
          child: Text(
            query.text,
            maxLines: 1,
            overflow: TextOverflow.ellipsis, // truncate
            style: theme.text.bodySm.copyWith(color: query.searching ? colors.textSecondary : colors.textPrimary),
          ),
        ),
        if (query.results != null)
          Text(
            query.results!,
            maxLines: 1,
            style: theme.text.caption.copyWith(color: colors.textSecondary), // text-[12px]/[18px]
          ),
      ],
    );
  }

  Widget _sources(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Align(
      alignment: Alignment.centerLeft, // w-fit
      child: Container(
        height: space.step(9), // h-9 = 36
        padding: EdgeInsets.only(left: space.s1, right: space.s3), // pl-1 pr-3
        decoration: BoxDecoration(
          color: colors.overlayInk5, // bg-overlay-ink-5
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: space.s2, // gap-2 = 8
          children: <Widget>[
            _avatarStack(theme),
            Flexible(
              child: Text(
                '${widget.read ?? 0} of ${widget.total ?? 0} sources read',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.labelSm.copyWith(
                  fontSize: 13, // text-[13px]
                  height: 18 / 13, // /[18px]
                  color: colors.textPrimary,
                ),
              ),
            ),
            Icon(Icons.expand_more, size: _caretSize, color: colors.textSecondary),
          ],
        ),
      ),
    );
  }

  /// `not-first:-ml-2`로 겹친 출처 아바타 묶음입니다.
  ///
  /// Flutter의 [Container] 여백은 음수를 받지 않으므로, 겹침은 [Stack]의 위치로
  /// 그립니다. 그래야 폭도 겹친 만큼 줄어듭니다.
  Widget _avatarStack(HoronThemeData theme) {
    final HoronSpaceSpec space = theme.space;
    final double side = space.step(6.5); // size-6.5 = 26
    final double step = side - _avatarOverlap;

    return SizedBox(
      width: side + (widget.sources.length - 1) * step,
      height: side,
      child: Stack(
        children: <Widget>[
          for (int index = 0; index < widget.sources.length; index++)
            Positioned(left: index * step, child: _avatar(theme, widget.sources[index])),
        ],
      ),
    );
  }

  Widget _avatar(HoronThemeData theme, String initial) {
    final HoronSpaceSpec space = theme.space;

    return Container(
      width: space.step(6.5),
      height: space.step(6.5),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: HoronPalette.sky700, // bg-sky-700
        shape: BoxShape.circle,
        border: Border.all(color: theme.colors.bgSurface, width: _avatarRing), // ring-2 ring-bg-surface
      ),
      child: Text(
        initial,
        maxLines: 1,
        style: theme.text.labelSm.copyWith(
          fontSize: 11, // text-[11px]
          height: 16 / 11, // /[16px]
          color: HoronPalette.baseWhite, // text-white
        ),
      ),
    );
  }

  Widget _composer(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // px-4 pt-1 pb-4
      padding: EdgeInsets.fromLTRB(space.s4, space.s1, space.s4, space.s4),
      child: AnimatedContainer(
        duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        height: space.step(11.5), // h-11.5 = 46
        padding: EdgeInsets.only(left: space.s4, right: space.s1_5), // pl-4 pr-1.5
        decoration: BoxDecoration(
          color: _focused ? colors.overlayInk8 : colors.overlayInk5, // focus-within:bg-overlay-ink-8
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
        child: Row(
          spacing: space.s2, // gap-2 = 8
          children: <Widget>[
            Expanded(
              child: TextField(
                controller: _field,
                focusNode: _focus,
                style: theme.text.bodySm.copyWith(color: colors.textPrimary),
                cursorColor: colors.textPrimary,
                textInputAction: TextInputAction.send,
                onSubmitted: (String value) => _submit(),
                decoration: InputDecoration.collapsed(
                  hintText: widget.followUpPlaceholder,
                  hintStyle: theme.text.bodySm.copyWith(color: colors.textSecondary),
                ),
              ),
            ),
            _Pressable(
              onTap: widget.running ? widget.onStop : _submit,
              semanticLabel: widget.running ? 'Stop' : 'Send',
              builder: (bool pressed, bool hovered) => Container(
                width: space.step(8.5), // size-8.5 = 34
                height: space.step(8.5),
                decoration: BoxDecoration(color: colors.interactivePrimary, shape: BoxShape.circle),
                child: widget.running
                    ? Icon(Icons.stop, size: _smallIconSize, color: colors.textInverse) // size-3.5
                    : Icon(Icons.arrow_upward, size: _iconSize, color: colors.textInverse), // size-4
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// `motion-press`의 배율과 hover·pressed 상태를 입힌 누름 영역입니다.
class _Pressable extends StatefulWidget {
  const _Pressable({required this.onTap, required this.builder, this.semanticLabel});

  final VoidCallback? onTap;
  final Widget Function(bool pressed, bool hovered) builder;
  final String? semanticLabel;

  @override
  State<_Pressable> createState() => _PressableState();
}

class _PressableState extends State<_Pressable> {
  bool _hovered = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final bool enabled = widget.onTap != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.semanticLabel,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTapDown: (TapDownDetails details) {
            if (enabled) setState(() => _pressed = true);
          },
          onTapUp: (TapUpDetails details) {
            if (_pressed) setState(() => _pressed = false);
          },
          onTapCancel: () {
            if (_pressed) setState(() => _pressed = false);
          },
          onTap: widget.onTap,
          child: AnimatedScale(
            scale: _pressed && enabled ? HoronMotion.pressScale : 1, // motion-press: scale .97
            duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
            curve: HoronMotion.pressCurve,
            child: widget.builder(_pressed, _hovered),
          ),
        ),
      ),
    );
  }
}

/// `motion-rise` — 4px 올라오며 나타나는 입장입니다. 항목마다 30ms씩 늦습니다.
class _RiseIn extends StatelessWidget {
  const _RiseIn({required this.index, required this.child});

  final int index;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;

    final Duration delay = _staggerStep * index;
    final Duration total = HoronMotion.riseDuration + delay;
    final double start = delay.inMicroseconds / total.inMicroseconds;

    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: total,
      curve: Interval(start, 1, curve: HoronMotion.riseCurve),
      builder: (BuildContext context, double value, Widget? child) => Opacity(
        opacity: value,
        child: Transform.translate(offset: Offset(0, HoronMotion.riseOffset * (1 - value)), child: child),
      ),
      child: child,
    );
  }
}
