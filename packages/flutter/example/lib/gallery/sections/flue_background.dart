import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `flue_background` 갤러리 섹션입니다.
///
/// 기본 하늘 팔레트, 팔레트 덮어쓰기, 그리고 세 가지 변형(기본·사이드바·인증)을 나란히
/// 두고, 그 위에 내용을 얹어 배경이 내용 뒤에 남는지 보여 줍니다. 갤러리에서는 티커를
/// 끄고 12초 시점의 한 프레임만 그립니다. 그래야 스크롤하는 동안 매 프레임 다시 그리지
/// 않습니다.
///
/// 셰이더는 Impeller가 있는 기기에서만 돕니다. 시뮬레이터나 테스트처럼 셰이더를 읽지
/// 못하는 환경에서는 [HoronFlueConfig.bgColor] 단색과 색조만 남습니다.
class HoronFlueBackgroundGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronFlueBackgroundGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text('Flue Background', style: theme.text.titleLg),
          SizedBox(height: theme.space.s6),
          Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            children: <Widget>[
              const _FlueCell(label: 'Sky (기본 팔레트)'),
              const _FlueCell(
                label: '사이드바 · sidebar',
                variant: HoronFlueVariant.sidebar,
              ),
              const _FlueCell(
                label: '인증 화면 · auth',
                variant: HoronFlueVariant.auth,
              ),
              const _FlueCell(
                label: '팔레트 덮어쓰기',
                config: HoronFlueConfig(
                  bgColor: Color(0xFFF6EFEA),
                  colorA: Color(0xFFF6E7DA),
                  colorB: Color(0xFFE3C3A6),
                  colorC: Color(0xFFB07C56),
                  colorD: Color(0xFF3B2113),
                ),
              ),
              _FlueCell(label: '색조 없음 (연기만)', tint: Colors.transparent),
            ],
          ),
          SizedBox(height: theme.space.s4),
          Text(
            '셰이더를 못 쓰는 엔진과 테스트에서는 단색으로 내려갑니다. 포인터를 따라 '
            '연기가 휘는 움직임과 모션 축소 시의 정지 프레임은 앱에서 확인합니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

/// 배경 한 벌을 정해진 크기로 보여 주는 칸입니다. 위젯 테스트가 이 칸을 그대로
/// 그리므로, 카드처럼 얹은 내용도 함께 검사됩니다.
class _FlueCell extends StatelessWidget {
  const _FlueCell({
    required this.label,
    this.variant = HoronFlueVariant.defaultValue,
    this.config,
    this.tint,
  });

  final String label;
  final HoronFlueVariant variant;
  final HoronFlueConfig? config;
  final Color? tint;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: theme.text.labelSm),
          SizedBox(height: theme.space.s2),
          ClipRRect(
            borderRadius: BorderRadius.all(Radius.circular(theme.radius.lg)),
            child: SizedBox(
              height: 180,
              child: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  // 정지 프레임: 갤러리에서 티커를 돌리지 않습니다.
                  TickerMode(
                    enabled: false,
                    child: HoronFlueBackground(
                      variant: variant,
                      config: config,
                      tint: tint,
                    ),
                  ),
                  Center(
                    child: Padding(
                      padding: EdgeInsets.all(theme.space.s4),
                      child: Text('사이드바 뒤의 하늘', style: theme.text.bodyMd),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
