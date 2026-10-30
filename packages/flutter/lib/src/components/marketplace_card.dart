// `marketplace-card`의 Flutter 대응입니다.
//
// React는 두꺼운 유리 카드에 40px 잉크 타일 머리, 설명, 역량 칩, 그리고 별점과
// Install이 있는 바닥을 세로로 쌓습니다. Install은 `button.tsx`(`glass`·`sm`) 자리라
// 이 파일의 private 위젯이 같은 값으로 그립니다.
//
// React는 별점·설치 수를 `ReactNode`로 받지만 화면에서는 글자로 그려집니다. 이 파일은
// 그 자리를 `String`으로 좁혔습니다.

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 역량 칩 하나입니다. React `chips` 원소입니다.
@immutable
class HoronMarketplaceCardChip {
  /// 칩을 만듭니다.
  const HoronMarketplaceCardChip({required this.id, required this.label, this.icon});

  /// 칩 키입니다.
  final String id;

  /// 12/16 보조 색 글자입니다.
  final String label;

  /// 앞에 붙는 11px 아이콘입니다.
  final Widget? icon;
}

/// Paper `Marketplace card`입니다.
///
/// 두꺼운 유리 위에 40px 잉크 타일과 이름·작성자, 설명, 역량 칩, 별점·설치 수·Install이
/// 있는 바닥을 세로로 쌓습니다. 폭은 부모를 따르고, 좁아지면 글자가 잘리거나 바닥의
/// 글자가 다음 줄로 흐릅니다.
class HoronMarketplaceCard extends StatelessWidget {
  /// 카드를 만듭니다.
  const HoronMarketplaceCard({
    super.key,
    required this.initials,
    required this.name,
    this.author,
    this.description,
    this.chips,
    this.score,
    this.installs,
    this.onInstall,
    this.installLabel = 'Install',
  });

  /// 40px 잉크 타일에 보이는 두 글자입니다.
  final String initials;

  /// 14/20 이름입니다. 한 줄로 잘립니다.
  final String name;

  /// 이름 아래 12/16 작성자입니다.
  final String? author;

  /// 13/18 설명입니다.
  final String? description;

  /// 역량 칩 목록입니다.
  final List<HoronMarketplaceCardChip>? chips;

  /// 별 옆 별점 글자입니다.
  final String? score;

  /// `·` 뒤에 붙는 설치 수입니다.
  final String? installs;

  /// Install 버튼을 누를 때 부릅니다.
  final VoidCallback? onInstall;

  /// Install 버튼의 글자입니다.
  final String installLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return HoronLiquidGlass(
      tier: HoronGlassTier.thick,
      borderRadius: BorderRadius.circular(theme.radius.xl), // rounded-[20px]
      child: Padding(
        padding: EdgeInsets.all(theme.space.s4), // p-4
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: theme.space.s3, // gap-3
          children: <Widget>[
            Row(
              spacing: theme.space.s3, // gap-3
              children: <Widget>[
                _initialsTile(theme),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: theme.space.s0_5, // gap-0.5
                    children: <Widget>[
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis, // truncate
                        // Paper `1VMY-0`: 이름 14/20 600 text-primary
                        style: theme.text.labelMd.copyWith(
                          fontWeight: HoronFontWeight.semibold,
                          color: theme.colors.textPrimary,
                        ),
                      ),
                      if (author != null)
                        Text(
                          author!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          // text-[12px]/[16px] text-text-placeholder
                          style: theme.text.caption.copyWith(height: 16 / 12, color: theme.colors.textPlaceholder),
                        ),
                    ],
                  ),
                ),
              ],
            ),
            if (description != null)
              Text(
                description!,
                // text-[13px]/[18px] text-text-secondary
                style: theme.text.bodySm.copyWith(fontSize: 13, height: 18 / 13, color: theme.colors.textSecondary),
              ),
            if (chips != null && chips!.isNotEmpty)
              Wrap(
                spacing: theme.space.s1_5, // gap-1.5
                runSpacing: theme.space.s1_5,
                children: <Widget>[for (final HoronMarketplaceCardChip chip in chips!) _chip(theme, chip)],
              ),
            _footer(theme),
          ],
        ),
      ),
    );
  }

  Widget _initialsTile(HoronThemeData theme) {
    return SizedBox(
      width: theme.space.step(10), // size-10 = 40
      height: theme.space.step(10),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: HoronPalette.neutral900, // bg-neutral-900 (양쪽 밝기에서 같은 값)
          borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
        ),
        child: Center(
          child: Text(
            initials,
            maxLines: 1,
            // text-label-md text-neutral-50 — Paper `1VMY-0`: 14/20 600
            style: theme.text.labelMd.copyWith(fontWeight: HoronFontWeight.semibold, color: HoronPalette.neutral50),
          ),
        ),
      ),
    );
  }

  Widget _chip(HoronThemeData theme, HoronMarketplaceCardChip chip) {
    return Container(
      height: theme.space.step(5.5), // h-5.5 = 22
      padding: EdgeInsets.symmetric(horizontal: theme.space.s2), // px-2
      decoration: BoxDecoration(
        color: theme.colors.overlayInk6, // bg-overlay-ink-6
        borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s1, // gap-1
        children: <Widget>[
          if (chip.icon != null)
            IconTheme.merge(
              data: IconThemeData(
                size: theme.space.step(2.75), // [&_svg]:size-2.75 = 11
                color: theme.colors.textSecondary,
              ),
              child: chip.icon!,
            ),
          Text(chip.label, maxLines: 1, style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary)),
        ],
      ),
    );
  }

  Widget _footer(HoronThemeData theme) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: theme.colors.borderDefault)), // border-t
      ),
      child: Padding(
        padding: EdgeInsets.only(top: theme.space.s2_5), // pt-2.5
        child: Row(
          spacing: theme.space.s1_5, // gap-1.5
          children: <Widget>[
            Expanded(
              child: Wrap(
                spacing: theme.space.s1_5,
                runSpacing: theme.space.s2,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  if (score != null) ...<Widget>[
                    Icon(
                      Icons.star,
                      size: theme.space.step(3.25), // size-3.25 = 13
                      color: HoronPalette.mascotGold, // text-mascot-gold
                    ),
                    Text(score!, maxLines: 1, style: theme.text.labelSm.copyWith(color: theme.colors.textPrimary)),
                  ],
                  if (installs != null)
                    Text(
                      '· $installs',
                      maxLines: 1,
                      // text-[12px]/[16px] text-text-placeholder
                      style: theme.text.caption.copyWith(height: 16 / 12, color: theme.colors.textPlaceholder),
                    ),
                ],
              ),
            ),
            _GlassButton(label: installLabel, onPressed: onInstall),
          ],
        ),
      ),
    );
  }
}

/// `button.tsx`의 `glass`·`sm` 변형입니다. `h-8`, `px-3`, `text-label-md`입니다.
class _GlassButton extends StatefulWidget {
  const _GlassButton({required this.label, this.onPressed});

  final String label;
  final VoidCallback? onPressed;

  @override
  State<_GlassButton> createState() => _GlassButtonState();
}

class _GlassButtonState extends State<_GlassButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      enabled: widget.onPressed != null,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: widget.onPressed == null ? null : (TapDownDetails details) => setState(() => _pressed = true),
        onTapUp: widget.onPressed == null ? null : (TapUpDetails details) => setState(() => _pressed = false),
        onTapCancel: widget.onPressed == null ? null : () => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: AnimatedScale(
          scale: _pressed && !reduce ? HoronMotion.pressScale : 1, // motion-press
          duration: reduce ? Duration.zero : HoronMotion.pressDuration,
          curve: HoronMotion.pressCurve,
          child: HoronLiquidGlass(
            borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
            child: SizedBox(
              height: theme.space.step(8), // h-8 = 32
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: theme.space.s3), // px-3
                child: Center(
                  widthFactor: 1,
                  child: Text(
                    widget.label,
                    maxLines: 1,
                    style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
