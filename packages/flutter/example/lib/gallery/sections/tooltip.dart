import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `tooltip`의 갤러리 섹션입니다.
///
/// 네 방향의 말풍선을 같은 줄에 두고, 마우스를 올리거나 길게 눌러 확인하게 합니다.
class HoronTooltipGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronTooltipGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    Widget target(String label, Widget tooltip) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          tooltip,
          SizedBox(height: theme.space.s2),
          Text(
            label,
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      );
    }

    return Padding(
      padding: EdgeInsets.all(theme.space.s8),
      child: Wrap(
        spacing: theme.space.s8,
        runSpacing: theme.space.s8,
        children: <Widget>[
          target(
            '위',
            HoronTooltip.top(
              label: '위쪽 말풍선',
              child: HoronIconButton(
                label: '위',
                icon: const Icon(Icons.arrow_upward),
                onPressed: () {},
              ),
            ),
          ),
          target(
            '아래',
            HoronTooltip.bottom(
              label: '아래쪽 말풍선',
              child: HoronIconButton(
                label: '아래',
                icon: const Icon(Icons.arrow_downward),
                onPressed: () {},
              ),
            ),
          ),
          target(
            '왼쪽',
            HoronTooltip.left(
              label: '왼쪽 말풍선',
              child: HoronIconButton(
                label: '왼쪽',
                icon: const Icon(Icons.arrow_back),
                onPressed: () {},
              ),
            ),
          ),
          target(
            '오른쪽',
            HoronTooltip.right(
              label: '오른쪽 말풍선',
              child: HoronIconButton(
                label: '오른쪽',
                icon: const Icon(Icons.arrow_forward),
                onPressed: () {},
              ),
            ),
          ),
        ],
      ),
    );
  }
}
