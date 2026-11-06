import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
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

/// `approval-card.tsx`의 `ApprovalCardSurface`입니다.
enum HoronApprovalCardSurface {
  /// `surface="solid"` — 불투명 `bg-surface`에 1px 테두리. 기본값입니다.
  solid,

  /// `surface="glass"` — 이미지나 유리 패널 위의 유리 표면입니다.
  glass,
}

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
    this.surface = HoronApprovalCardSurface.solid,
  });

  /// 표면입니다. 기본값은 [HoronApprovalCardSurface.solid]입니다.
  final HoronApprovalCardSurface surface;

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
      // `bg-accent-red-500-90 text-text-danger`.
      HoronApprovalState.declined => (theme.colors.accentRed500_90, theme.colors.textDanger, 'Declined'),
    };
    final bool pending = state == HoronApprovalState.pending;

    final Widget body = Padding(
      padding: const EdgeInsets.all(_approvalPadding),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
              ),
              const SizedBox(width: 6),
              // `key={state}` + `animate-fade-in` — 상태가 바뀌면 라벨이 제자리에서
              // 160ms로 다시 나타납니다.
              _FadeIn(
                key: ValueKey<HoronApprovalState>(state),
                child: Text(status ?? label, style: theme.text.labelSm.copyWith(color: text)),
              ),
            ],
          ),
          const SizedBox(height: _approvalGap), // mt-3
          Text(title, style: theme.text.labelLg.copyWith(color: theme.colors.textPrimary)),
          if (attachment != null) ...<Widget>[
            const SizedBox(height: _approvalGap), // mt-3
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
          ],
          // `motion-reveal` — 대기 중에만 펼쳐지고, 아니면 높이 0으로 접힙니다.
          // 접힌 동안에도 버튼은 트리에 남아 있지만 눌리지 않습니다(React `inert`).
          HoronReveal(
            collapsed: !pending,
            child: IgnorePointer(
              ignoring: !pending,
              child: ExcludeSemantics(
                excluding: !pending,
                child: ExcludeFocus(
                  excluding: !pending,
                  child: Padding(
                    padding: const EdgeInsets.only(top: _approvalGap), // pt-3
                    // `flex w-full justify-end` — 나중에가 먼저, 승인이 오른쪽 끝입니다.
                    child: SizedBox(
                      width: double.infinity,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: <Widget>[
                          HoronButton(
                            label: laterLabel,
                            size: HoronButtonSize.sm,
                            variant: HoronButtonVariant.glass,
                            onPressed: onLater,
                          ),
                          const SizedBox(width: 8),
                          HoronButton(label: approveLabel, size: HoronButtonSize.sm, onPressed: onApprove),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );

    if (surface == HoronApprovalCardSurface.glass) {
      return SizedBox(
        width: _approvalWidth,
        child: ClipRRect(
          borderRadius: radius,
          child: Stack(
            children: <Widget>[
              Positioned.fill(
                child: HoronLiquidGlass(
                  tier: HoronGlassTier.thick,
                  borderRadius: radius,
                  edgeColor: pending ? theme.colors.borderBrand : null,
                  child: const SizedBox.expand(),
                ),
              ),
              body,
            ],
          ),
        ),
      );
    }
    return SizedBox(
      width: _approvalWidth,
      child: Container(
        decoration: BoxDecoration(
          color: theme.colors.bgSurface,
          borderRadius: radius,
          border: Border.all(color: pending ? theme.colors.borderBrand : theme.colors.borderDefault),
        ),
        child: body,
      ),
    );
  }
}

/// `animate-fade-in` — 상태 라벨이 제자리에서 160ms로 나타납니다.
///
/// React는 상태마다 `key`를 바꿔 `animate-fade-in`을 다시 재생합니다. Flutter는
/// 위젯을 새로 만들 때 [TweenAnimationBuilder]가 0에서 1로 불투명도를 올립니다.
class _FadeIn extends StatelessWidget {
  const _FadeIn({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.fadeInDuration,
      curve: HoronMotion.fadeInCurve,
      builder: (BuildContext context, double value, Widget? child) => Opacity(opacity: value, child: child),
      child: child,
    );
  }
}
