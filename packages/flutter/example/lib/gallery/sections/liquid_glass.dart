import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `liquid_glass` 갤러리 섹션입니다.
///
/// 세 티어를 Flue 연기 배경 위에 얹어, 유리가 뒤 배경을 얼마나 흐리고 채도를 올리는지,
/// 티어별 채움과 가장자리 림이 어떻게 보이는지 눈으로 확인합니다. 이어서 입력·오버레이가
/// 쓰는 더 가벼운 veil 재료를 상태별로 보여 줍니다. 배경은 정지 프레임입니다
/// (`TickerMode`를 끕니다). 그래야 갤러리를 스크롤하는 동안 티커가 돌지 않고도 색이
/// 고르게 남습니다.
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
        const _VeilCell(label: 'Veil Field — 입력', kind: HoronVeilKind.field),
        const _VeilCell(
          label: 'Veil Field — 포커스',
          kind: HoronVeilKind.field,
          focused: true,
        ),
        const _VeilCell(
          label: 'Veil Field — 오류',
          kind: HoronVeilKind.field,
          invalid: true,
        ),
        const _VeilCell(
          label: 'Veil Overlay — 메뉴·시트',
          kind: HoronVeilKind.overlay,
        ),
        const _VeilCell(
          label: 'Veil Overlay — 동작 줄이기',
          kind: HoronVeilKind.overlay,
          reduceMotion: true,
        ),
        const _VeilCell(label: 'Veil Drop — 링 없음', kind: HoronVeilKind.drop),
        const _LiquidCell(
          label: 'Frost — 동작 줄이기 설정',
          child: _ReducedMotion(
            child: HoronLiquidGlass(
              tier: HoronGlassTier.regular,
              borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full)),
              child: _GlassLabel('Frost'),
            ),
          ),
        ),
      ],
      notes:
          '세 플랫폼이 같은 재료를 씁니다. 아래에서 위로 뒤 배경을 20px 흐리고 채도를 '
          '1.8배로 올린 다음, 티어 채움(glass-clear/regular/thick)을 덮고, 표면 안쪽 '
          '1px 림을 위에서 아래로 밝음 → 12% → 30% 그라디언트로 그립니다. 굴절·질감·'
          '안쪽 그늘·광택은 없고, 그림자는 재료가 아니라 컴포넌트가 자기 토큰으로 답니다. '
          '뒤 배경을 필터할 수 없을 때(동작 줄이기 설정)는 glass-fill-frost 한 겹으로 '
          '그리고 림은 그대로 남깁니다. veil은 8px 흐림·1.6배 채도에 1px 링과 soft '
          'shadow를 쓰고, 필드 포커스는 field-focus, 오류는 danger 링, 드롭은 링 없이 '
          '점선 테두리가 유일한 윤곽입니다.',
    );
  }
}

/// veil 하나를 정지 Flue 배경 위에 얹어 보여 주는 칸입니다.
class _VeilCell extends StatelessWidget {
  const _VeilCell({
    required this.label,
    required this.kind,
    this.focused = false,
    this.invalid = false,
    this.reduceMotion = false,
  });

  final String label;
  final HoronVeilKind kind;
  final bool focused;
  final bool invalid;
  final bool reduceMotion;

  @override
  Widget build(BuildContext context) {
    final Widget veil = HoronVeil(
      kind: kind,
      focused: focused,
      invalid: invalid,
      borderRadius: BorderRadius.all(Radius.circular(HoronRadius.md)),
      child: SizedBox(
        width: 200,
        height: 56,
        child: Center(
          child: Text(label, style: HoronTheme.of(context).text.labelLg),
        ),
      ),
    );
    return _LiquidCell(
      label: label,
      child: reduceMotion
          ? MediaQuery(
              data: MediaQuery.of(context).copyWith(disableAnimations: true),
              child: veil,
            )
          : veil,
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

/// 동작 줄이기 설정을 켠 채로 자식을 그립니다. 서리 채움 경로를 보여 줍니다.
class _ReducedMotion extends StatelessWidget {
  const _ReducedMotion({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(disableAnimations: true),
      child: child,
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
