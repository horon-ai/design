import 'package:flutter/material.dart';

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

/// `task-row.tsx`의 `rounded-[16px]`입니다.
const double _rowRadius = 16;

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

/// Figma `Task row`(Agent tasks 112:939): 16 반경의 평평한 행에 네 상태가 살아 움직이는 작업 카드입니다.
///
/// `task-row.tsx`를 옮긴 것입니다. `card`는 옅은 표면, `list`는 아래 1px 구분선만
/// 있는 투명 행입니다. 상태마다 오른쪽 동작(취소·재시도·검토)과 아카이브가 달라집니다.
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

  Color _tile(HoronThemeData theme) => switch (status) {
    HoronTaskStatus.running => theme.colors.interactivePrimary,
    HoronTaskStatus.done => theme.colors.interactivePrimary,
    HoronTaskStatus.review => HoronPalette.sky500,
    HoronTaskStatus.failed => HoronPalette.sky700,
  };

  Color _messageColor(HoronThemeData theme) => switch (status) {
    HoronTaskStatus.failed => theme.colors.textDanger,
    HoronTaskStatus.done => theme.colors.textSecondary,
    _ => theme.colors.textPrimary,
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: _rowPaddingX, vertical: _rowPaddingY),
      decoration: card
          ? BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(_rowRadius))
          : BoxDecoration(
              border: last ? null : Border(bottom: BorderSide(color: theme.colors.overlayInk8)),
            ),
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
              const SizedBox(width: 8),
              Icon(Icons.expand_more, size: 14, color: theme.colors.textSecondary),
            ],
          ),
          Row(
            children: <Widget>[
              Container(
                width: _botTile,
                height: _botTile,
                alignment: Alignment.center,
                decoration: BoxDecoration(color: _tile(theme), borderRadius: BorderRadius.circular(_botTileRadius)),
                child: Text(botInitial, style: theme.text.labelSm.copyWith(color: theme.colors.textInverse)),
              ),
              const SizedBox(width: 6),
              Text(
                botName,
                maxLines: 1,
                softWrap: false,
                style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
              ),
              if (project != null) ...<Widget>[
                const SizedBox(width: 6),
                Text('·', style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
                const SizedBox(width: 6),
                Icon(Icons.folder_outlined, size: 13, color: theme.colors.textSecondary),
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
              switch (status) {
                HoronTaskStatus.running => const HoronSpinner(pixelSize: 15),
                HoronTaskStatus.review => Icon(Icons.check_circle, size: 16, color: theme.colors.textPrimary),
                HoronTaskStatus.done => Icon(Icons.check_circle, size: 16, color: theme.colors.textSecondary),
                HoronTaskStatus.failed => Icon(Icons.error, size: 16, color: theme.colors.textDanger),
              },
              const SizedBox(width: 8),
              Text(
                message,
                maxLines: 1,
                softWrap: false,
                style: theme.text.labelMd.copyWith(color: _messageColor(theme)),
              ),
              if (detail != null) ...<Widget>[
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
              if (status == HoronTaskStatus.running) _RowPill(label: 'Cancel', icon: Icons.stop, onPressed: onCancel),
              if (status == HoronTaskStatus.failed) _RowPill(label: 'Retry', icon: Icons.refresh, onPressed: onRetry),
              if (status == HoronTaskStatus.review)
                _RowPill(label: 'Review', icon: Icons.check, primary: true, onPressed: onReview),
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
