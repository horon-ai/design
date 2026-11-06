import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `banner`의 갤러리 섹션입니다.
///
/// 정보·위험 두 톤과, 동작이 붙은 경우를 solid와 glass 두 표면에 같은 목록으로
/// 보여 줍니다. 본문은 기본 글자색이고 톤 색은 아이콘과 밑줄 동작에만 남습니다.
/// 세로 여백은 `py-2.5`/`py-3`이라 한 줄 띠가 48px입니다. Paper `TY7-1`의 인스턴스
/// 폭 640에 맞춰 넓은 화면에서도 640을 넘지 않게 둡니다.
class HoronBannerGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBannerGallerySection({super.key});

  /// Paper `TY7-1`의 폭입니다.
  static const double _boardWidth = 640;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: _boardWidth),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: theme.space.s6,
          children: <Widget>[
            SurfaceGroup(
              label: 'Solid',
              child: _banners(theme, HoronBannerSurface.solid),
            ),
            SurfaceGroup(
              label: 'Glass',
              glass: true,
              child: _banners(theme, HoronBannerSurface.glass),
            ),
          ],
        ),
      ),
    );
  }

  /// 한 표면의 배너 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _banners(HoronThemeData theme, HoronBannerSurface surface) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        HoronBanner(message: '새 버전이 있습니다. 지금 업데이트할 수 있습니다.', surface: surface),
        SizedBox(height: theme.space.s3),
        HoronBanner(
          message: '워크스페이스 연결이 끊겼습니다.',
          tone: HoronBannerTone.danger,
          surface: surface,
        ),
        SizedBox(height: theme.space.s3),
        HoronBanner(
          message: '모델 제공자 키가 만료되었습니다.',
          tone: HoronBannerTone.danger,
          surface: surface,
          action: TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              foregroundColor: theme.colors.textDanger,
            ),
            child: const Text('키 갱신'),
          ),
        ),
      ],
    );
  }
}
