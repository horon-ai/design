import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `banner`의 갤러리 섹션입니다.
///
/// 정보·위험 두 톤과, 동작이 붙은 경우를 보여 줍니다.
class HoronBannerGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBannerGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          const HoronBanner(message: '새 버전이 있습니다. 지금 업데이트할 수 있습니다.'),
          SizedBox(height: theme.space.s3),
          const HoronBanner(
            message: '워크스페이스 연결이 끊겼습니다.',
            tone: HoronBannerTone.danger,
          ),
          SizedBox(height: theme.space.s3),
          HoronBanner(
            message: '모델 제공자 키가 만료되었습니다.',
            tone: HoronBannerTone.danger,
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
      ),
    );
  }
}
