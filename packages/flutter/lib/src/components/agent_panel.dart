import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import 'kbd.dart';

/// `agent-panel.tsx`의 `rounded-[24px]`입니다.
const double _panelRadius = 24;

/// `agent-panel.tsx`의 `px-5`입니다.
const double _panelPaddingX = 20;

/// `agent-panel.tsx`의 `rounded-[5px]`입니다. 봇 타일의 반경입니다.
const double _chipTileRadius = 5;

/// `agent-panel.tsx`의 `h-7.5`입니다. 칩 높이입니다.
const double _chipHeight = 30;

/// `agent-panel.tsx`의 `max-h-40`입니다. 작성 상자가 자라는 한계 높이 160입니다.
const double _composerMaxHeight = 160;

/// `agent-panel.tsx`의 `min-h-5.5`입니다. 작성 상자의 한 줄 높이 22입니다.
const double _composerLineHeight = 22;

/// 작성 상자가 자랄 수 있는 줄 수입니다. 160을 22로 나눈 몫입니다(7줄).
const int _composerMaxLines = _composerMaxHeight ~/ _composerLineHeight;

/// Figma `Agent panel`(Agent tasks 112:797): 표면 채움과 24 반경의 단단한 판입니다.
///
/// `agent-panel.tsx`를 옮긴 것입니다. 위쪽에 필터 슬롯을 두고, 아래에 에이전트
/// 블록(작업 행, 계획 카드)을 세로로 쌓습니다.
class HoronAgentPanel extends StatelessWidget {
  /// 판을 만듭니다.
  const HoronAgentPanel({super.key, this.filter, required this.children});

  /// 판 위쪽 필터 슬롯입니다. 보통 `HoronFilterBar`입니다.
  final Widget? filter;

  /// 판에 담을 블록입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      padding: const EdgeInsets.only(left: _panelPaddingX, right: _panelPaddingX, top: _panelPaddingX, bottom: 8),
      decoration: BoxDecoration(
        color: theme.colors.bgSurface,
        borderRadius: BorderRadius.circular(_panelRadius),
        border: Border.all(color: theme.colors.borderDefault),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 12,
        children: <Widget>[
          // React는 `filter`를 폭 채우는 `div`로 감쌉니다.
          if (filter case final Widget filter) SizedBox(width: double.infinity, child: filter),
          ...children,
        ],
      ),
    );
  }
}

/// 30px 5% 잉크 칩입니다. 봇은 16px 타일 이니셜, 프로젝트는 14px 아이콘을 씁니다.
class HoronComposerChip extends StatelessWidget {
  /// 칩을 만듭니다.
  const HoronComposerChip({super.key, required this.label, this.initial, this.icon, this.onTap});

  /// 칩 글자입니다.
  final String label;

  /// 봇 타일 이니셜입니다. 넘기면 타일을 그립니다.
  final String? initial;

  /// 프로젝트 아이콘입니다. [initial]이 없을 때 쓰입니다.
  final Widget? icon;

  /// 누르는 동작입니다.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      button: true,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: _chipHeight,
          padding: const EdgeInsets.only(left: 8, right: 10),
          decoration: BoxDecoration(
            color: theme.colors.overlayInk5,
            borderRadius: BorderRadius.circular(theme.radius.full),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: 6,
            children: <Widget>[
              if (initial != null)
                Container(
                  width: 16,
                  height: 16,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: theme.colors.interactivePrimary,
                    borderRadius: BorderRadius.circular(_chipTileRadius),
                  ),
                  child: Text(initial!, style: theme.text.labelSm.copyWith(color: theme.colors.textInverse)),
                )
              else if (icon != null)
                IconTheme.merge(
                  data: IconThemeData(size: 14, color: theme.colors.textSecondary),
                  child: icon!,
                ),
              Text(label, style: theme.text.labelSm.copyWith(color: theme.colors.textPrimary)),
              Icon(Icons.keyboard_arrow_down, size: 12, color: theme.colors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}

/// Figma task `Composer`(Agent tasks 112:797): 4% 잉크 상자에 선택 칩, ⌘↵ 힌트, Start 버튼이 놓입니다.
class HoronTaskComposer extends StatefulWidget {
  /// 작성 상자를 만듭니다.
  const HoronTaskComposer({
    super.key,
    this.placeholder = 'Describe a task for a bot',
    this.initialValue,
    this.onValueChange,
    this.pickers = const <Widget>[],
    this.onStart,
    this.startLabel = 'Start',
  });

  /// 안내 문구입니다.
  final String placeholder;

  /// 처음 값입니다.
  final String? initialValue;

  /// 값이 바뀔 때 부릅니다.
  final ValueChanged<String>? onValueChange;

  /// 왼쪽 선택 칩입니다.
  final List<Widget> pickers;

  /// Start를 눌렀을 때입니다.
  final VoidCallback? onStart;

  /// 시작 버튼 글자입니다.
  final String startLabel;

  @override
  State<HoronTaskComposer> createState() => _HoronTaskComposerState();
}

class _HoronTaskComposerState extends State<HoronTaskComposer> {
  late final TextEditingController _controller = TextEditingController(text: widget.initialValue ?? '');
  final FocusNode _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller.addListener(() => widget.onValueChange?.call(_controller.text));
    _focus.addListener(_onFocusChange);
  }

  void _onFocusChange() => setState(() {});

  @override
  void dispose() {
    _focus
      ..removeListener(_onFocusChange)
      ..dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    // `focus-within:outline-2 outline-offset-2 outline-text-brand` — 쓰는 동안 상자
    // 바깥 2px에 브랜드 테두리를 두릅니다.
    final double ringOffset = theme.space.step(0.5);
    final bool focused = _focus.hasFocus;
    final Widget box = Container(
      // `rounded-xl px-4 pt-3.5 pb-2.5`.
      padding: const EdgeInsets.only(left: 16, right: 16, top: 14, bottom: 10),
      decoration: BoxDecoration(color: theme.colors.overlayInk4, borderRadius: BorderRadius.circular(theme.radius.xl)),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 14,
        children: <Widget>[
          TextField(
            controller: _controller,
            focusNode: _focus,
            minLines: 1,
            // `field-sizing-content max-h-40 min-h-5.5` — 내용만큼 자라고 160px에서
            // 멈춥니다. bodySm의 줄 높이가 22라서 7줄이 160 안에 들어갑니다.
            maxLines: _composerMaxLines,
            style: theme.text.bodySm.copyWith(color: theme.colors.textPrimary),
            decoration: InputDecoration(
              isCollapsed: true,
              border: InputBorder.none,
              hintText: widget.placeholder,
              hintStyle: theme.text.bodySm.copyWith(color: theme.colors.textSecondary),
            ),
            onSubmitted: (_) => widget.onStart?.call(),
          ),
          Wrap(
            spacing: 6,
            runSpacing: 8,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: <Widget>[
              ...widget.pickers,
              const HoronKbd(label: '⌘'),
              const HoronKbd(label: '↵'),
              Semantics(
                button: true,
                child: GestureDetector(
                  onTap: widget.onStart,
                  child: Container(
                    // `h-7.5 px-3.5`.
                    height: theme.space.step(7.5),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: theme.colors.interactivePrimary,
                      borderRadius: BorderRadius.circular(theme.radius.full),
                    ),
                    child: Text(widget.startLabel, style: theme.text.labelSm.copyWith(color: theme.colors.textInverse)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );

    if (!focused) return box;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        box,
        Positioned(
          left: -ringOffset,
          top: -ringOffset,
          right: -ringOffset,
          bottom: -ringOffset,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(theme.radius.xl + ringOffset),
                border: Border.all(color: theme.colors.textBrand, width: 2),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
