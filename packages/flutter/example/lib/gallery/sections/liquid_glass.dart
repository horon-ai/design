import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `liquid_glass` 갤러리 섹션입니다.
///
/// 세 티어를 Flue 연기 배경 위에 얹어, 유리가 뒤 색을 어느 정도 통과시키고 가장자리에서
/// 휘게 하는지 눈으로 확인합니다. 배경은 정지 프레임입니다(`TickerMode`를 끕니다).
/// 그래야 갤러리를 스크롤하는 동안 티커가 돌지 않고도 색이 고르게 남습니다.
///
/// 굴절은 실제 기기에서만 보입니다. `ui.ImageFilter.shader`는 Impeller가 필요해서,
/// 시뮬레이터·테스트처럼 Impeller가 없으면 세 티어 모두 서리 채움으로 그려집니다.
class HoronLiquidGlassGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronLiquidGlassGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Liquid Glass',
      variants: <Widget>[
        const _LiquidCell(
          label: 'Clear — 버튼·칩',
          child: HoronLiquidGlass(
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full)),
            child: _GlassLabel('Clear'),
          ),
        ),
        const _LiquidCell(
          label: 'Regular — 배너·토스트',
          child: HoronLiquidGlass(
            tier: HoronGlassTier.regular,
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full)),
            child: _GlassLabel('Regular'),
          ),
        ),
        const _LiquidCell(
          label: 'Thick — 카드·사이드바',
          child: HoronLiquidGlass(
            tier: HoronGlassTier.thick,
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.xl)),
            child: _GlassLabel('Thick'),
          ),
        ),
      ],
      states: <Widget>[
        const _LiquidCell(
          label: 'Texture (칩의 질감 레이어)',
          child: HoronLiquidGlass(
            tier: HoronGlassTier.regular,
            texture: true,
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full)),
            child: _GlassLabel('Texture'),
          ),
        ),
        const _LiquidCell(
          label: 'Refraction off — 서리 채움',
          child: HoronLiquidGlass(
            tier: HoronGlassTier.regular,
            refract: HoronGlassRefraction.off,
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full)),
            child: _GlassLabel('Frost'),
          ),
        ),
        const _LiquidCell(
          label: 'Opaque host — 굴절 없이 레이어만',
          child: HoronLiquidGlass(
            tier: HoronGlassTier.thick,
            opaque: true,
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.xl)),
            child: _GlassLabel('Opaque'),
          ),
        ),
      ],
      notes:
          'Figma의 `Liquid layers` 그룹을 그대로 옮겼습니다. 아래에서 위로 채움, 굴절(선택), '
          '질감(선택), 색조(45px 블러), 안쪽 그늘(4px 블러, overlay), 부드러운 가장자리'
          '(1px 테두리, plus-lighter), 광택(135°/315° 그라디언트 링, screen)입니다. '
          '색조·안쪽 그늘·가장자리는 layerOpacity 0.5로, 질감·광택·굴절은 1로 그립니다. '
          '안쪽 그늘 여백과 가장자리 블러는 호스트 높이에 비례합니다(높이 32/40/48/52/74/76/112/120에서 '
          'CSS와 같은 값). 굴절이 켜지면 웹과 같이 광택이 사라지고, 셰이더를 못 쓰면 서리 채움만 남습니다.',
    );
  }
}

/// 글래스 하나를 정지 Flue 배경 위에 얹어 보여 주는 칸입니다.
class _LiquidCell extends StatelessWidget {
  const _LiquidCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1_5),
          ClipRRect(
            borderRadius: BorderRadius.all(Radius.circular(horon.radius.xl)),
            child: SizedBox(
              height: 168,
              child: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  // 정지 프레임: 티커를 멈추고 12초 시점의 한 프레임을 그립니다.
                  TickerMode(
                    enabled: false,
                    child: const HoronFlueBackground(),
                  ),
                  // 유리가 통과시키는 색을 보이게 하는 덩어리입니다. Flue만으로는
                  // 파랑 한 계열이라 티어 차이가 잘 읽히지 않습니다.
                  Positioned(
                    left: -20,
                    bottom: -24,
                    child: _Blob(color: horon.colors.statusLive, size: 120),
                  ),
                  Positioned(
                    right: -16,
                    top: -28,
                    child: _Blob(
                      color: horon.colors.interactivePrimary,
                      size: 104,
                    ),
                  ),
                  Center(child: child),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// 배경 위에 얹는 색 덩어리입니다.
class _Blob extends StatelessWidget {
  const _Blob({required this.color, required this.size});

  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.55),
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}

/// 유리 위에 얹는 짧은 글자입니다. 표면이 내용 크기를 정하므로 여백을 여기서 줍니다.
class _GlassLabel extends StatelessWidget {
  const _GlassLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: HoronSpace.s5,
        vertical: HoronSpace.s3,
      ),
      // 유리 뒤 색과 무관하게 읽히도록 밝기별 전경색을 씁니다.
      child: Text(text, style: HoronTheme.of(context).text.labelLg),
    );
  }
}
