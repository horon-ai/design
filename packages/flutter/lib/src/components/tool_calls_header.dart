import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `tool-calls-header.tsx`의 `size-7`입니다. 도구 칩 한 개의 크기입니다.
const double _chipSide = 28;

/// `tool-calls-header.tsx`의 `not-first:-ml-1.5`입니다. 칩이 겹치는 정도입니다.
const double _chipOverlap = 6;

/// `tool-calls-header.tsx`의 `[&>svg]:size-3.5`입니다.
const double _chipIconSize = 14;

/// `tool-calls-header.tsx`의 `gap-2.5`입니다.
const double _headerGap = 10;

/// 도구 호출 묶음의 머리입니다. 겹친 도구 칩, 제목, 경과 시간, 아래 카드를 접는 캐럿입니다.
///
/// `tool-calls-header.tsx`를 옮긴 것입니다. 칩은 최대 세 개까지 28px 원형 타일에
/// 14px 아이콘으로 그리고 6px씩 겹쳐 놓습니다. 캐럿은 열림 상태에서 180도 돌고,
/// 패널은 React의 `motion-collapse`와 같은 240ms로 펼쳐집니다.
class HoronToolCallsHeader extends StatefulWidget {
  /// 머리를 만듭니다.
  const HoronToolCallsHeader({
    super.key,
    this.toolIcons = const <Widget>[],
    this.title = 'Using tools…',
    this.elapsed,
    this.children = const <Widget>[],
    this.initiallyOpen = true,
    this.open,
    this.onOpenChange,
  });

  /// 최대 세 개까지 그리는 도구 아이콘입니다.
  final List<Widget> toolIcons;

  /// 제목입니다.
  final String title;

  /// 경과 시간입니다. 예: `4.0s`.
  final String? elapsed;

  /// 접히는 아래 카드들입니다.
  final List<Widget> children;

  /// 처음 열림 상태입니다.
  final bool initiallyOpen;

  /// 바깥에서 정하는 열림 상태입니다.
  final bool? open;

  /// 열림 상태가 바뀔 때 부릅니다.
  final ValueChanged<bool>? onOpenChange;

  @override
  State<HoronToolCallsHeader> createState() => _HoronToolCallsHeaderState();
}

class _HoronToolCallsHeaderState extends State<HoronToolCallsHeader> {
  late bool _inner = widget.initiallyOpen;

  bool get _isOpen => widget.open ?? _inner;

  void _toggle() {
    final bool next = !_isOpen;
    if (widget.open == null) setState(() => _inner = next);
    widget.onOpenChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final List<Widget> chips = widget.toolIcons.take(3).toList();

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Semantics(
          button: true,
          expanded: _isOpen,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _toggle,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                children: <Widget>[
                  if (chips.isNotEmpty)
                    SizedBox(
                      height: _chipSide,
                      width: _chipSide + (chips.length - 1) * (_chipSide - _chipOverlap),
                      child: Stack(
                        children: <Widget>[
                          for (int index = 0; index < chips.length; index++)
                            Positioned(
                              left: index * (_chipSide - _chipOverlap),
                              child: Container(
                                width: _chipSide,
                                height: _chipSide,
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                  color: theme.colors.bgSurface,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: theme.colors.borderDefault),
                                ),
                                child: IconTheme.merge(
                                  data: IconThemeData(size: _chipIconSize, color: theme.colors.textSecondary),
                                  child: chips[index],
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  if (chips.isNotEmpty) const SizedBox(width: _headerGap),
                  Text(widget.title, style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary)),
                  if (widget.elapsed != null) ...<Widget>[
                    const SizedBox(width: _headerGap),
                    Text('· ${widget.elapsed}', style: theme.text.labelMd.copyWith(color: theme.colors.textSecondary)),
                  ],
                  const Spacer(),
                  AnimatedRotation(
                    turns: _isOpen ? 0.5 : 0,
                    duration: HoronMotion.popupEnterDuration,
                    curve: HoronMotion.easeOutQuint,
                    child: Icon(Icons.expand_more, size: 14, color: theme.colors.textSecondary),
                  ),
                ],
              ),
            ),
          ),
        ),
        AnimatedSize(
          duration: HoronMotion.collapseDuration,
          curve: HoronMotion.collapseCurve,
          alignment: Alignment.topCenter,
          child: _isOpen
              ? Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: 8,
                    children: widget.children,
                  ),
                )
              : const SizedBox(width: double.infinity),
        ),
      ],
    );
  }
}
