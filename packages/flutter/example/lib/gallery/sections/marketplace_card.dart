import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/marketplace_card.dart';

/// `marketplace_card` 갤러리 섹션입니다.
///
/// 변형 어휘가 없으므로 상태를 늘어놓습니다. 별점과 설치 수가 있는 기본형, 칩만 있는
/// 카드, 그리고 이름만 있는 최소형입니다. 폭이 좁으면 카드가 프레임 폭에 맞춰 줄어듭니다.
class HoronMarketplaceCardGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMarketplaceCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double available = constraints.maxWidth.isFinite
              ? constraints.maxWidth
              : 320;
          final double card = math.min(available, 320);
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              _Cell(
                label: '별점 · 설치 수 · Install',
                width: card,
                child: HoronMarketplaceCard(
                  initials: 'WB',
                  name: 'web-search',
                  author: 'horon',
                  description: '웹을 검색하고 인용할 수 있는 근거를 모읍니다',
                  chips: _chips,
                  score: '4.8',
                  installs: '12k',
                  onInstall: () {},
                ),
              ),
              _Cell(
                label: '칩만 있는 카드',
                width: card,
                child: HoronMarketplaceCard(
                  initials: 'FS',
                  name: 'filesystem',
                  author: 'alpox',
                  description: '로컬 파일을 읽고 고칩니다',
                  chips: _chips,
                  onInstall: () {},
                ),
              ),
              _Cell(
                label: '최소 — 이름만',
                width: card,
                child: const HoronMarketplaceCard(
                  initials: 'MS',
                  name: 'mail-sync',
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

const List<HoronMarketplaceCardChip> _chips = <HoronMarketplaceCardChip>[
  HoronMarketplaceCardChip(
    id: 'web',
    label: 'web.read',
    icon: Icon(Icons.public),
  ),
  HoronMarketplaceCardChip(
    id: 'cite',
    label: 'citations',
    icon: Icon(Icons.format_quote),
  ),
];

/// 캡션이 붙은 갤러리 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.width, required this.child});

  final String label;
  final double width;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      width: width,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s2,
        children: <Widget>[
          Text(
            label,
            style: theme.text.labelSm.copyWith(
              color: theme.colors.textPlaceholder,
            ),
          ),
          child,
        ],
      ),
    );
  }
}
