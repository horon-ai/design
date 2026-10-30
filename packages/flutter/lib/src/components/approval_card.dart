import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_theme.dart';
import 'button.dart';

/// `approval-card.tsx`의 `ApprovalState`입니다.
enum HoronApprovalState {
  /// `state="pending"` — 브랜드 테두리와 두 동작이 남습니다.
  pending,

  /// `state="approved"` — 회색 점과 보조 글자입니다.
  approved,

  /// `state="declined"` — 위험 점과 위험 글자입니다.
  declined,
}

/// `approval-card.tsx`의 `w-90`입니다.
const double _approvalWidth = 360;

/// `approval-card.tsx`의 `p-4`입니다.
const double _approvalPadding = 16;

/// `approval-card.tsx`의 `gap-3`입니다.
const double _approvalGap = 12;

/// Figma `Approval card`(64:398): 대화에서 유일하게 유리로 그리는 카드입니다. 동작을 묻기 때문입니다.
///
/// `approval-card.tsx`를 옮긴 것입니다. `pending`만 브랜드 테두리와 승인·나중에 두
/// 동작을 남기고, 나머지는 상태 줄만 보여 줍니다. 첨부가 있으면 5% 잉크 알약에
/// 클립 아이콘과 함께 놓입니다.
class HoronApprovalCard extends StatelessWidget {
  /// 승인 카드를 만듭니다.
  const HoronApprovalCard({
    super.key,
    required this.title,
    this.state = HoronApprovalState.pending,
    this.status,
    this.attachment,
    this.onApprove,
    this.onLater,
    this.approveLabel = 'Approve',
    this.laterLabel = 'Later',
  });

  /// 상태입니다.
  final HoronApprovalState state;

  /// 상태 줄 문구입니다. 없으면 상태에 맞는 기본 문구를 씁니다.
  final String? status;

  /// 질문입니다.
  final String title;

  /// 첨부 이름입니다.
  final String? attachment;

  /// 승인을 눌렀을 때입니다.
  final VoidCallback? onApprove;

  /// 나중에를 눌렀을 때입니다.
  final VoidCallback? onLater;

  /// 승인 버튼 글자입니다.
  final String approveLabel;

  /// 나중에 버튼 글자입니다.
  final String laterLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl);
    final (Color dot, Color text, String label) = switch (state) {
      HoronApprovalState.pending => (theme.colors.statusLive, theme.colors.textBrand, 'Needs your yes'),
      HoronApprovalState.approved => (theme.colors.textSecondary, theme.colors.textSecondary, 'Approved'),
      HoronApprovalState.declined => (theme.colors.textDanger, theme.colors.textDanger, 'Declined'),
    };
    final bool pending = state == HoronApprovalState.pending;

    return SizedBox(
      width: _approvalWidth,
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: const SizedBox.expand()),
            ),
            Container(
              decoration: BoxDecoration(
                borderRadius: radius,
                border: pending ? Border.all(color: theme.colors.borderBrand) : null,
              ),
              padding: const EdgeInsets.all(_approvalPadding),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: _approvalGap,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 6),
                      Text(status ?? label, style: theme.text.labelSm.copyWith(color: text)),
                    ],
                  ),
                  Text(title, style: theme.text.labelLg.copyWith(color: theme.colors.textPrimary)),
                  if (attachment != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: theme.colors.overlayInk5,
                        borderRadius: BorderRadius.circular(theme.radius.md),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Icon(Icons.attach_file, size: 14, color: theme.colors.textSecondary),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text(
                              attachment!,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.text.bodySm.copyWith(color: theme.colors.textPrimary),
                            ),
                          ),
                        ],
                      ),
                    ),
                  if (pending)
                    Row(
                      children: <Widget>[
                        HoronButton(label: approveLabel, size: HoronButtonSize.sm, onPressed: onApprove),
                        const SizedBox(width: 8),
                        HoronButton(
                          label: laterLabel,
                          size: HoronButtonSize.sm,
                          variant: HoronButtonVariant.glass,
                          onPressed: onLater,
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
