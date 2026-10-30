import 'dart:convert';

import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';
import 'spinner.dart';

/// `tool-call.tsx`의 `ToolCallStatus`입니다.
enum HoronToolCallStatus {
  /// `status="running"` — 머리에 스피너가 돌고 결과 자리에 기다리는 문구가 놓입니다.
  running,

  /// `status="done"` — 머리에 하늘색 체크가 놓입니다.
  done,

  /// `status="failed"` — 테두리가 위험색이 되고 결과 자리에 오류 상자가 놓입니다.
  failed,
}

/// `tool-call.tsx`의 `[&>svg]:size-4`입니다. 도구 칩 아이콘·상태 아이콘·캐럿 16px.
const double _iconSize = 16;

/// `tool-call.tsx`의 `size-3.5`입니다. 복사 아이콘과 재시도 아이콘 14px.
const double _smallIconSize = 14;

/// `tool-call.tsx`의 `py-[3px]`입니다. 도구 칩의 위아래 여백입니다.
const double _chipPaddingY = 3;

/// `tool-call.tsx`의 `rounded-[10px]`입니다. 오류 상자와 섹션 본문의 반경입니다.
const double _boxRadius = 10;

/// `tool-call.tsx`의 `Failed`입니다.
const String _failedLabel = 'Failed';

/// `tool-call.tsx`의 `Waiting for result…`입니다.
const String _waitingLabel = 'Waiting for result…';

/// `tool-call.tsx`의 `Arguments`입니다.
const String _argumentsLabel = 'Arguments';

/// `tool-call.tsx`의 `Result`입니다.
const String _resultLabel = 'Result';

/// `tool-call.tsx`의 `Show all`입니다.
const String _showAllLabel = 'Show all';

/// Figma `Tool call`(Tool call card 186:7811): 불투명 카드가 인자와 결과로 펼쳐집니다.
///
/// `tool-call.tsx`를 옮긴 것입니다. 머리에 도구 칩·요약·상태·경과 시간·캐럿이 한 줄로
/// 놓이고, 누르면 아래 패널이 React의 `motion-collapse`(240ms)로 열립니다. 실패 상태는
/// 테두리가 위험색이 되고 오류 상자와 재시도 버튼이 붙습니다.
class HoronToolCall extends StatefulWidget {
  /// 도구 호출 카드를 만듭니다.
  const HoronToolCall({
    super.key,
    required this.status,
    required this.toolName,
    required this.summary,
    this.toolIcon,
    this.elapsed,
    this.args,
    this.result,
    this.error,
    this.onRetry,
    this.truncated = false,
    this.onShowAll,
    this.initiallyOpen = false,
  });

  /// 호출 상태입니다.
  final HoronToolCallStatus status;

  /// 도구 이름입니다. 예: `Web search`.
  final String toolName;

  /// 한 줄 요약입니다. 폭이 모자라면 말줄임됩니다.
  final String summary;

  /// 도구 이름 앞 아이콘입니다. 크기와 색은 이 위젯이 정합니다.
  final Widget? toolIcon;

  /// 오른쪽 경과 시간입니다. 예: `1.2s`.
  final String? elapsed;

  /// 인자입니다. null이면 인자 섹션을 그리지 않습니다(React의 `args === undefined`).
  ///
  /// 최상위 JSON `null`은 React의 `undefined`와 구분되지 않으므로 인자를 감춥니다.
  /// 중첩된 `null`은 그대로 `null`로 그려집니다.
  final Object? args;

  /// 결과입니다. null이면 결과 자리에 기다리는 문구가 놓입니다.
  final Object? result;

  /// 실패 사유입니다. 실패 상태에서만 보입니다.
  final String? error;

  /// 재시도를 눌렀을 때입니다. 실패 상태에서만 보입니다.
  final VoidCallback? onRetry;

  /// 결과가 잘렸습니다. 결과 아래에 `Show all` 링크를 놓습니다.
  final bool truncated;

  /// `Show all`을 눌렀을 때입니다.
  final VoidCallback? onShowAll;

  /// 처음 열림 상태입니다. React의 `defaultOpen`입니다.
  final bool initiallyOpen;

  @override
  State<HoronToolCall> createState() => _HoronToolCallState();
}

class _HoronToolCallState extends State<HoronToolCall> {
  late bool _open = widget.initiallyOpen;

  void _toggle() => setState(() => _open = !_open);

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool failed = widget.status == HoronToolCallStatus.failed;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Container(
      // rounded-lg border bg-bg-surface, 실패만 border-border-danger
      decoration: BoxDecoration(
        color: colors.bgSurface,
        borderRadius: BorderRadius.circular(theme.radius.lg),
        border: Border.all(color: failed ? colors.borderDanger : colors.borderDefault),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          _trigger(theme),
          AnimatedSize(
            duration: reduceMotion ? Duration.zero : HoronMotion.collapseDuration,
            curve: HoronMotion.collapseCurve,
            alignment: Alignment.topCenter,
            child: _open ? _panel(theme) : const SizedBox(width: double.infinity),
          ),
        ],
      ),
    );
  }

  Widget _trigger(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      expanded: _open,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _toggle,
        child: Padding(
          // px-4 py-3.5
          padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3_5),
          child: Row(
            spacing: space.s2_5, // gap-2.5 = 10
            children: <Widget>[
              Flexible(child: _toolChip(theme)),
              Expanded(
                child: Text(
                  widget.summary,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis, // truncate
                  style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                ),
              ),
              ?_statusMark(theme),
              if (widget.elapsed != null)
                Text(widget.elapsed!, maxLines: 1, style: theme.text.caption.copyWith(color: colors.textSecondary)),
              AnimatedRotation(
                // group-data-panel-open:rotate-180, duration-200 ease-out-quint
                turns: _open ? 0.5 : 0,
                duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
                curve: HoronMotion.easeOutQuint,
                child: Icon(Icons.expand_more, size: _iconSize, color: colors.textSecondary),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _toolChip(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      // py-[3px] pr-2.5 pl-2 rounded-full bg-overlay-ink-6
      padding: EdgeInsets.fromLTRB(space.s2, _chipPaddingY, space.s2_5, _chipPaddingY),
      decoration: BoxDecoration(color: colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s1_5, // gap-1.5 = 6
        children: <Widget>[
          if (widget.toolIcon != null)
            IconTheme.merge(
              data: IconThemeData(size: _iconSize, color: colors.textSecondary),
              child: widget.toolIcon!,
            ),
          Flexible(
            child: Text(
              widget.toolName,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.labelMd.copyWith(color: colors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  Widget? _statusMark(HoronThemeData theme) {
    return switch (widget.status) {
      HoronToolCallStatus.running => const HoronSpinner(), // size="sm" = 16
      HoronToolCallStatus.done => Icon(Icons.check_circle, size: _iconSize, color: theme.colors.statusLive),
      HoronToolCallStatus.failed => Text(
        _failedLabel,
        style: theme.text.labelSm.copyWith(color: theme.colors.textDanger),
      ),
    };
  }

  Widget _panel(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool failed = widget.status == HoronToolCallStatus.failed;
    final bool waiting = widget.status == HoronToolCallStatus.running || widget.result == null;

    return Padding(
      // px-4 pb-4
      padding: EdgeInsets.fromLTRB(space.s4, 0, space.s4, space.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: space.s3_5, // gap-3.5 = 14
        children: <Widget>[
          if (failed && widget.error != null) _errorBox(theme),
          if (widget.args != null)
            _Section(
              label: _argumentsLabel,
              child: HoronJsonCode(value: widget.args),
            ),
          if (!failed)
            _Section(
              label: _resultLabel,
              child: waiting
                  ? Text(_waitingLabel, style: theme.text.bodySm.copyWith(color: colors.textSecondary))
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: space.s2, // gap-2 = 8
                      children: <Widget>[
                        HoronJsonCode(value: widget.result),
                        if (widget.truncated)
                          HoronButton(
                            variant: HoronButtonVariant.link,
                            label: _showAllLabel,
                            onPressed: widget.onShowAll,
                          ),
                      ],
                    ),
            ),
        ],
      ),
    );
  }

  Widget _errorBox(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      // rounded-[10px] bg-bg-danger px-3.5 py-3
      padding: EdgeInsets.fromLTRB(space.s3_5, space.s3, space.s3_5, space.s3),
      decoration: BoxDecoration(color: colors.bgDanger, borderRadius: BorderRadius.circular(_boxRadius)),
      child: Row(
        spacing: space.s2_5, // gap-2.5 = 10
        children: <Widget>[
          Icon(Icons.error_outline, size: _iconSize, color: colors.textDanger),
          Expanded(
            child: Text(widget.error!, style: theme.text.bodySm.copyWith(color: colors.textDanger)),
          ),
          if (widget.onRetry != null) _retryButton(theme),
        ],
      ),
    );
  }

  Widget _retryButton(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return TextButton.icon(
      onPressed: widget.onRetry,
      style: TextButton.styleFrom(
        // px-2.5 py-1.5 rounded-sm border-border-default bg-bg-surface
        padding: EdgeInsets.symmetric(horizontal: space.s2_5, vertical: space.s1_5),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        foregroundColor: colors.textPrimary,
        backgroundColor: colors.bgSurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(theme.radius.sm),
          side: BorderSide(color: colors.borderDefault),
        ),
      ),
      icon: const Icon(Icons.refresh, size: _smallIconSize),
      label: Text(theme.strings.retry, style: theme.text.labelSm),
    );
  }
}

/// `tool-call.tsx`의 `Section`입니다. 라벨 줄과 본문 상자입니다.
class _Section extends StatelessWidget {
  const _Section({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: space.s1_5, // gap-1.5 = 6
      children: <Widget>[
        Row(
          children: <Widget>[
            Expanded(
              child: Text(
                label.toUpperCase(), // uppercase
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.labelSm.copyWith(color: colors.textSecondary),
              ),
            ),
            Icon(Icons.content_copy, size: _smallIconSize, color: colors.textSecondary),
          ],
        ),
        Container(
          // rounded-[10px] bg-bg-subtle px-3.5 py-3
          padding: EdgeInsets.fromLTRB(space.s3_5, space.s3, space.s3_5, space.s3),
          decoration: BoxDecoration(color: colors.bgSubtle, borderRadius: BorderRadius.circular(_boxRadius)),
          child: child,
        ),
      ],
    );
  }
}

/// `tool-call.tsx`의 `JsonCode`입니다. Geist Mono 코드 스타일과 구문 색으로 JSON을 그립니다.
///
/// React는 `pre`에 `overflow-x-auto`를 두지만, 이 패키지는 컨트롤을 가로로 스크롤하지
/// 않습니다. 그래서 `whitespace-pre-wrap`처럼 긴 줄이 접혀 다음 줄로 이어집니다.
class HoronJsonCode extends StatelessWidget {
  /// 값을 그리는 코드 블록을 만듭니다.
  const HoronJsonCode({super.key, required this.value});

  /// 그릴 값입니다. `Map<String, Object?>`, `List<Object?>`, 문자열, 숫자, 불리언, null.
  final Object? value;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final TextStyle base = theme.text.code.copyWith(color: theme.colors.syntaxString);

    return Text.rich(
      TextSpan(style: base, children: _jsonSpans(value, 0, theme.colors, base)),
      softWrap: true, // whitespace-pre-wrap
    );
  }
}

/// [value]를 `renderJson`과 같은 모양의 span 목록으로 만듭니다.
List<InlineSpan> _jsonSpans(Object? value, int indent, HoronColors colors, TextStyle base) {
  final TextStyle punctuation = base.copyWith(color: colors.syntaxPunctuation);

  if (value == null || value is num || value is bool) {
    final String text = value is double && value == value.truncateToDouble() ? value.toInt().toString() : '$value';
    return <InlineSpan>[
      TextSpan(
        text: text,
        style: base.copyWith(color: colors.syntaxNumber),
      ),
    ];
  }
  if (value is String) {
    return <InlineSpan>[TextSpan(text: jsonEncode(value))];
  }

  final List<(String?, Object?)> entries;
  final String open;
  final String close;
  if (value is Map) {
    entries = <(String?, Object?)>[
      for (final MapEntry<Object?, Object?> entry in value.entries) (entry.key.toString(), entry.value),
    ];
    open = '{';
    close = '}';
  } else if (value is List) {
    entries = <(String?, Object?)>[for (final Object? item in value) (null, item)];
    open = '[';
    close = ']';
  } else {
    return <InlineSpan>[TextSpan(text: jsonEncode(value.toString()))];
  }

  final String pad = '  ' * indent;
  return <InlineSpan>[
    TextSpan(text: open, style: punctuation),
    for (int index = 0; index < entries.length; index++) ...<InlineSpan>[
      TextSpan(text: '\n$pad  '),
      if (entries[index].$1 != null) ...<InlineSpan>[
        TextSpan(
          text: jsonEncode(entries[index].$1),
          style: base.copyWith(color: colors.syntaxKey),
        ),
        TextSpan(text: ':', style: punctuation),
        const TextSpan(text: ' '),
      ],
      ..._jsonSpans(entries[index].$2, indent + 1, colors, base),
      if (index < entries.length - 1) TextSpan(text: ',', style: punctuation),
    ],
    TextSpan(text: '\n$pad$close', style: punctuation),
  ];
}
