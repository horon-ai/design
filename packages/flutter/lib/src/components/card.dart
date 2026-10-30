import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `card.tsx`의 `p-5`입니다.
const double _cardPadding = 20;

/// `card.tsx`의 `gap-2`입니다.
const double _cardGap = 8;

/// `card.tsx`의 `rounded-xl`입니다.
const double _cardRadius = 20;

/// Figma `Card`(63:310): 320px 두꺼운 유리 카드입니다. 기본·상호작용·선택 상태가 있습니다.
///
/// `card.tsx`를 옮긴 것입니다. React의 `surface`는 props 안의 인라인 유니온이라
/// variant 어휘가 아니므로 [frost] 플래그로 받습니다. `frost`는 Paper 홈 보드
/// 카드입니다 — 서리 채움, 24px 배경 흐림, 흰 안쪽 테두리, 3% 잉크 헤어라인,
/// `0 8 24 6%` 그림자에 유리 레이어는 없습니다.
class HoronCard extends StatefulWidget {
  /// 카드를 만듭니다.
  const HoronCard({
    super.key,
    this.title,
    this.description,
    this.interactive = false,
    this.selected = false,
    this.frost = false,
    this.onTap,
    this.child,
  });

  /// 제목입니다.
  final String? title;

  /// 설명입니다.
  final String? description;

  /// 누를 수 있는 카드입니다. 오른쪽에 캐럿이 붙고 누르면 조금 줄어듭니다.
  final bool interactive;

  /// 선택된 카드입니다. 브랜드 테두리가 붙습니다.
  final bool selected;

  /// `surface="frost"` 자리입니다.
  final bool frost;

  /// 누르는 동작입니다.
  final VoidCallback? onTap;

  /// 본문입니다.
  final Widget? child;

  @override
  State<HoronCard> createState() => _HoronCardState();
}

class _HoronCardState extends State<HoronCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(_cardRadius);
    final bool selected = widget.selected;

    final Widget content = Padding(
      padding: const EdgeInsets.all(_cardPadding),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          if (widget.title != null || widget.interactive)
            Row(
              spacing: _cardGap, // gap-2 — Paper UAP-1의 제목 행 간격입니다.
              children: <Widget>[
                Expanded(
                  child: Text(widget.title ?? '', style: theme.text.titleSm.copyWith(color: theme.colors.textPrimary)),
                ),
                if (widget.interactive) Icon(Icons.chevron_right, size: 16, color: theme.colors.textSecondary),
              ],
            ),
          if (widget.description != null) ...<Widget>[
            const SizedBox(height: _cardGap),
            Text(widget.description!, style: theme.text.bodySm.copyWith(color: theme.colors.textSecondary)),
          ],
          if (widget.child != null) ...<Widget>[
            const SizedBox(height: _cardGap),
            SizedBox(width: double.infinity, child: widget.child),
          ],
        ],
      ),
    );

    final Widget surface = ClipRRect(
      borderRadius: radius,
      child: widget.frost
          ? DecoratedBox(
              decoration: BoxDecoration(
                color: theme.colors.glassFillFrost,
                borderRadius: radius,
                border: Border.all(color: theme.colors.glassRimFrost),
                boxShadow: <BoxShadow>[
                  BoxShadow(color: theme.colors.overlayInk3, spreadRadius: 1),
                  BoxShadow(
                    color: HoronPalette.neutral950.withValues(alpha: 0.06),
                    offset: const Offset(0, 8),
                    blurRadius: 24,
                  ),
                ],
              ),
              child: BackdropFilter(filter: ui.ImageFilter.blur(sigmaX: 24, sigmaY: 24), child: content),
            )
          : Stack(
              children: <Widget>[
                Positioned.fill(
                  child: HoronLiquidGlass(
                    tier: HoronGlassTier.thick,
                    borderRadius: radius,
                    child: const SizedBox.expand(),
                  ),
                ),
                content,
              ],
            ),
    );

    final Widget bordered = selected
        ? DecoratedBox(
            decoration: BoxDecoration(
              borderRadius: radius,
              border: Border.all(color: theme.colors.borderBrand),
            ),
            child: surface,
          )
        : surface;

    if (!widget.interactive && widget.onTap == null) return bordered;

    return FocusableActionDetector(
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onTap?.call();
            return null;
          },
        ),
      },
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTapDown: (_) => setState(() => _pressed = true),
          onTapCancel: () => setState(() => _pressed = false),
          onTapUp: (_) => setState(() => _pressed = false),
          onTap: widget.onTap,
          child: AnimatedScale(
            scale: _pressed ? 0.99 : 1,
            duration: const Duration(milliseconds: 120),
            child: bordered,
          ),
        ),
      ),
    );
  }
}
