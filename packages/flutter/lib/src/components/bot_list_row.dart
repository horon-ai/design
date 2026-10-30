import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import 'avatar.dart';

/// `bot-list-row.tsx`의 `p-3`입니다.
const double _rowPadding = 12;

/// `bot-list-row.tsx`의 `gap-3`입니다.
const double _rowGap = 12;

/// Figma `Bot list row`(64:456): 12px 여백의 평평한 행입니다. hover는 5% 잉크, 선택은 10% 잉크입니다.
///
/// `bot-list-row.tsx`를 옮긴 것입니다. 앞에는 `bot` 아바타(lg)가 서고, 이름 줄에는
/// 오른쪽에 시각이 붙으며, 아래에는 최근 활동 미리보기가 한 줄로 잘립니다.
class HoronBotListRow extends StatefulWidget {
  /// 행을 만듭니다.
  const HoronBotListRow({
    super.key,
    required this.name,
    this.time,
    this.preview,
    this.live = false,
    this.selected = false,
    this.onTap,
  });

  /// 봇 이름입니다.
  final String name;

  /// 마지막 활동 시각입니다. 예: `8:41 AM`.
  final String? time;

  /// 최근 활동 미리보기입니다.
  final String? preview;

  /// 돌고 있는 봇이면 아바타에 상태 점을 붙입니다.
  final bool live;

  /// 선택된 행입니다.
  final bool selected;

  /// 누르는 동작입니다.
  final VoidCallback? onTap;

  @override
  State<HoronBotListRow> createState() => _HoronBotListRowState();
}

class _HoronBotListRowState extends State<HoronBotListRow> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.lg);
    final Color background = widget.selected
        ? theme.colors.overlayInk10
        : _hovered
        ? theme.colors.overlayInk5
        : Colors.transparent;

    return Semantics(
      button: true,
      selected: widget.selected,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onTap,
          child: Container(
            padding: const EdgeInsets.all(_rowPadding),
            decoration: BoxDecoration(color: background, borderRadius: radius),
            child: Row(
              children: <Widget>[
                HoronAvatar.bot(size: HoronAvatarSize.lg, live: widget.live),
                const SizedBox(width: _rowGap),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          Expanded(
                            child: Text(
                              widget.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.text.labelLg.copyWith(color: theme.colors.textPrimary),
                            ),
                          ),
                          if (widget.time != null)
                            Text(
                              widget.time!,
                              maxLines: 1,
                              softWrap: false,
                              style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                            ),
                        ],
                      ),
                      if (widget.preview != null)
                        Text(
                          widget.preview!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary),
                        ),
                    ],
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
