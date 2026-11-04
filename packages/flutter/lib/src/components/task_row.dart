import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'spinner.dart';

/// `task-row.tsx`의 `TaskStatus`입니다.
enum HoronTaskStatus {
  /// `status="running"` — 스피너와 취소 버튼입니다.
  running,

  /// `status="review"` — 체크와 Review 버튼, 아카이브가 붙습니다.
  review,

  /// `status="failed"` — 경고와 재시도 버튼입니다.
  failed,

  /// `status="done"` — 보조색 체크와 아카이브입니다.
  done,
}

/// `task-row.tsx`의 `px-4`입니다.
const double _rowPaddingX = 16;

/// `task-row.tsx`의 `py-3.5`입니다.
const double _rowPaddingY = 14;

/// `task-row.tsx`의 `size-4.5`입니다. 봇 타일입니다.
const double _botTile = 18;

/// `task-row.tsx`의 `rounded-[5px]`입니다. 봇 타일의 반경입니다.
const double _botTileRadius = 5;

/// `task-row.tsx`의 `h-7.5`입니다. 동작 알약 높이입니다.
const double _pillHeight = 30;

/// `task-row.tsx`의 `after:h-px`입니다. 목록 변형의 행 구분선 두께입니다.
const double _dividerHeight = 1;

/// Figma `Task row`(Agent tasks 112:939): 16 반경의 평평한 행에 네 상태가 살아 움직이는 작업 카드입니다.
///
/// `task-row.tsx`를 옮긴 것입니다. `card`는 기본 테두리가 있는 불투명 표면,
/// `list`는 아래 1px 구분선만 있는 투명 행입니다. 상태마다 오른쪽 동작(취소·재시도·검토)과 아카이브가 달라집니다.
class HoronTaskRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronTaskRow({
    super.key,
    required this.status,
    required this.title,
    required this.botInitial,
    required this.botName,
    required this.message,
    this.elapsed,
    this.project,
    this.detail,
    this.onCancel,
    this.onRetry,
    this.onReview,
    this.onArchive,
    this.card = true,
    this.last = false,
  });

  /// 상태입니다.
  final HoronTaskStatus status;

  /// 작업 제목입니다.
  final String title;

  /// 봇 이니셜입니다.
  final String botInitial;

  /// 봇 이름입니다.
  final String botName;

  /// 상태 줄입니다. 지금 단계, 결과 또는 오류입니다.
  final String message;

  /// 경과 시간입니다.
  final String? elapsed;

  /// 프로젝트 이름입니다.
  final String? project;

  /// 메시지 뒤 캡션입니다.
  final String? detail;

  /// 취소를 눌렀을 때입니다.
  final VoidCallback? onCancel;

  /// 재시도를 눌렀을 때입니다.
  final VoidCallback? onRetry;

  /// 검토를 눌렀을 때입니다.
  final VoidCallback? onReview;

  /// 아카이브를 눌렀을 때입니다.
  final VoidCallback? onArchive;

  /// `variant="card"` 자리입니다. 거짓이면 목록 변형입니다.
  final bool card;

  /// 목록 변형에서 마지막 행이면 구분선을 감춥니다.
  final bool last;

  /// `botTile`: 바탕과 글자색을 함께 정합니다. React dev가 상태별 글자색을 더했습니다.
  (Color, Color) _tile(HoronThemeData theme) => switch (status) {
    HoronTaskStatus.running => (theme.colors.interactivePrimary, theme.colors.interactiveOnPrimary),
    HoronTaskStatus.done => (theme.colors.interactivePrimary, theme.colors.interactiveOnPrimary),
    HoronTaskStatus.review => (HoronPalette.sky500, HoronPalette.sky50),
    HoronTaskStatus.failed => (HoronPalette.sky700, HoronPalette.sky50),
  };

  /// 상태 아이콘입니다. React dev는 모두 `animate-pop-in`으로 나타납니다.
  Widget _statusIcon(HoronThemeData theme) {
    final Widget icon = switch (status) {
      HoronTaskStatus.running => const HoronSpinner(pixelSize: 15),
      HoronTaskStatus.review => Icon(Icons.check_circle, size: 16, color: theme.colors.textPrimary),
      HoronTaskStatus.done => Icon(Icons.check_circle, size: 16, color: theme.colors.textSecondary),
      HoronTaskStatus.failed => Icon(Icons.error, size: 16, color: theme.colors.textDanger),
    };
    return _PopIn(key: ValueKey<HoronTaskStatus>(status), child: icon);
  }

  Color _messageColor(HoronThemeData theme) => switch (status) {
    HoronTaskStatus.failed => theme.colors.textDanger,
    HoronTaskStatus.done => theme.colors.textSecondary,
    _ => theme.colors.textPrimary,
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);

    return Container(
      // `variant="card"`는 `rounded-2xl border border-border-default bg-bg-surface`이고,
      // `variant="list"`는 투명 행이라 반경이 없습니다.
      decoration: card
          ? BoxDecoration(
              color: theme.colors.bgSurface,
              borderRadius: BorderRadius.circular(theme.radius.xl2),
              border: Border.all(color: theme.colors.borderDefault),
            )
          : null,
      child: Stack(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: _rowPaddingX, vertical: _rowPaddingY),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 8,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.labelLg.copyWith(color: theme.colors.textPrimary),
                      ),
                    ),
                    if (elapsed != null) ...<Widget>[
                      const SizedBox(width: 8),
                      Text(
                        elapsed!,
                        maxLines: 1,
                        softWrap: false,
                        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                      ),
                    ],
                  ],
                ),
                Row(
                  children: <Widget>[
                    Container(
                      width: _botTile,
                      height: _botTile,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: _tile(theme).$1,
                        borderRadius: BorderRadius.circular(_botTileRadius),
                      ),
                      // `text-trim` — 18px 타일 안에서 이니셜 위아래 여백을 잘라 냅니다.
                      child: Text(
                        botInitial,
                        style: theme.text.labelSm.copyWith(color: _tile(theme).$2),
                        textHeightBehavior: const TextHeightBehavior(
                          applyHeightToFirstAscent: false,
                          applyHeightToLastDescent: false,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        botName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                      ),
                    ),
                    if (project != null) ...<Widget>[
                      const SizedBox(width: 6),
                      Text('·', style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
                      const SizedBox(width: 6),
                      Icon(Icons.folder_outlined, size: theme.space.step(3.5), color: theme.colors.textSecondary),
                      const SizedBox(width: 4),
                      Flexible(
                        child: Text(
                          project!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                        ),
                      ),
                    ],
                  ],
                ),
                Row(
                  children: <Widget>[
                    // `flex size-4` 슬롯 — 상태가 바뀌어도 아이콘 자리가 흔들리지 않습니다.
                    SizedBox(
                      width: theme.space.step(4),
                      height: theme.space.step(4),
                      child: Center(child: _statusIcon(theme)),
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      // `key={status}` + `animate-fade-in` — 상태가 바뀌면 라벨이 새로 나타납니다.
                      child: AnimatedSwitcher(
                        duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.fadeInDuration,
                        switchInCurve: HoronMotion.fadeInCurve,
                        child: Text(
                          message,
                          key: ValueKey<HoronTaskStatus>(status),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.labelMd.copyWith(color: _messageColor(theme)),
                        ),
                      ),
                    ),
                    if (detail != null) ...<Widget>[
                      const SizedBox(width: 8),
                      Text('·', maxLines: 1, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text(
                          detail!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                        ),
                      ),
                    ],
                    const Spacer(),
                    // `animate-pop-in` — 동작 알약이 상태와 함께 자라납니다.
                    if (status == HoronTaskStatus.running)
                      _PopIn(
                        key: const ValueKey<String>('cancel'),
                        child: _RowPill(label: 'Cancel', icon: Icons.stop, onPressed: onCancel),
                      ),
                    if (status == HoronTaskStatus.failed)
                      _PopIn(
                        key: const ValueKey<String>('retry'),
                        child: _RowPill(label: 'Retry', icon: Icons.refresh, onPressed: onRetry),
                      ),
                    if (status == HoronTaskStatus.review)
                      _PopIn(
                        key: const ValueKey<String>('review'),
                        child: _RowPill(label: 'Review', icon: Icons.check, primary: true, onPressed: onReview),
                      ),
                    if (status == HoronTaskStatus.review || status == HoronTaskStatus.done) ...<Widget>[
                      const SizedBox(width: 4),
                      Semantics(
                        button: true,
                        label: 'Archive',
                        child: GestureDetector(
                          onTap: onArchive,
                          child: SizedBox(
                            width: _pillHeight,
                            height: _pillHeight,
                            child: Icon(Icons.archive_outlined, size: 16, color: theme.colors.textSecondary),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          // `after:inset-x-4 after:bottom-0 after:h-px` — 목록 변형은 행 아래 모서리에
          // 좌우 16을 들여쓴 1px 구분선을 긋습니다.
          if (!card && !last)
            Positioned(
              left: _rowPaddingX,
              right: _rowPaddingX,
              bottom: 0,
              height: _dividerHeight,
              child: ColoredBox(key: const Key('horon-task-row-divider'), color: theme.colors.overlayInk8),
            ),
        ],
      ),
    );
  }
}

/// `animate-pop-in` — 0.6에서 1로 자라며 나타나는 래퍼입니다.
class _PopIn extends StatelessWidget {
  const _PopIn({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: child,
    );
  }
}

/// 행 안의 작은 동작 알약입니다.
class _RowPill extends StatelessWidget {
  const _RowPill({required this.label, required this.icon, this.onPressed, this.primary = false});

  final String label;
  final IconData icon;
  final VoidCallback? onPressed;
  final bool primary;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final Color background = primary ? theme.colors.interactivePrimary : theme.colors.overlayInk6;
    final Color foreground = primary ? theme.colors.textInverse : theme.colors.textPrimary;

    return Semantics(
      button: true,
      child: GestureDetector(
        onTap: onPressed,
        child: Container(
          height: _pillHeight,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          alignment: Alignment.center,
          decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(theme.radius.full)),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            spacing: 6,
            children: <Widget>[
              Icon(icon, size: 14, color: foreground),
              Text(label, style: theme.text.labelSm.copyWith(color: foreground)),
            ],
          ),
        ),
      ),
    );
  }
}
