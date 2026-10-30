import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'icon_button.dart';

/// `directory-card.tsx`의 `size-10`입니다. 아이콘 타일입니다.
const double _tileSide = 40;

/// `directory-card.tsx`의 `rounded-[10px]`입니다.
const double _tileRadius = 10;

/// `directory-card.tsx`의 `py-3`입니다.
const double _cardPaddingY = 12;

/// `directory-card.tsx`의 `pl-3`입니다.
const double _cardPaddingLeft = 12;

/// `directory-card.tsx`의 `pr-3.5`입니다.
const double _cardPaddingRight = 14;

/// `directory-card.tsx`의 `gap-3`입니다.
const double _cardGap = 12;

/// Paper `Directory card`(Settings 1VJJ-0): 두꺼운 유리 행에 40px 타일, 이름과 한 줄 설명, 유리 추가 버튼입니다.
///
/// `directory-card.tsx`를 옮긴 것입니다. 반경은 `rounded-2xl`(16), 타일은
/// `bg-sky-500`에 반대색 20px 아이콘, 설명은 `line-clamp-1`이라 한 줄로 잘립니다.
/// 추가 버튼은 [HoronIconButton]의 glass 변형입니다.
class HoronDirectoryCard extends StatelessWidget {
  /// 디렉터리 카드를 만듭니다.
  const HoronDirectoryCard({
    super.key,
    required this.icon,
    required this.name,
    this.description,
    this.onAdd,
    this.addLabel = 'Add',
  });

  /// 40px 타일에 그릴 아이콘입니다. 20px로 그려집니다.
  final Widget icon;

  /// 이름입니다.
  final String name;

  /// 한 줄 설명입니다. 길면 잘립니다.
  final String? description;

  /// 추가 버튼을 눌렀을 때입니다.
  final VoidCallback? onAdd;

  /// 추가 버튼의 접근성 이름입니다.
  final String addLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.xl2);

    return ClipRRect(
      borderRadius: radius,
      child: Stack(
        children: <Widget>[
          Positioned.fill(
            child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: const SizedBox.expand()),
          ),
          Padding(
            padding: const EdgeInsets.only(
              top: _cardPaddingY,
              bottom: _cardPaddingY,
              left: _cardPaddingLeft,
              right: _cardPaddingRight,
            ),
            child: Row(
              children: <Widget>[
                Container(
                  width: _tileSide,
                  height: _tileSide,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: HoronPalette.sky500,
                    borderRadius: BorderRadius.circular(_tileRadius),
                  ),
                  child: IconTheme.merge(
                    data: IconThemeData(size: 20, color: theme.colors.textInverse),
                    child: icon,
                  ),
                ),
                const SizedBox(width: _cardGap),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                      ),
                      if (description != null) ...<Widget>[
                        const SizedBox(height: 2),
                        Text(
                          description!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.caption.copyWith(
                            fontSize: 12,
                            height: 16 / 12,
                            color: theme.colors.textPlaceholder,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: _cardGap),
                HoronIconButton(
                  variant: HoronIconButtonVariant.glass,
                  size: HoronIconButtonSize.sm,
                  label: addLabel,
                  icon: const Icon(Icons.add, size: 14),
                  onPressed: onAdd,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
