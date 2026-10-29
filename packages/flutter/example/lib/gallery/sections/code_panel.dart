import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `code_panel`의 갤러리 섹션입니다.
///
/// 짧은 frontmatter 블록과 긴 줄이 있는 블록을 보여 주고, 강조 토큰도 함께 놓습니다.
class HoronCodePanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronCodePanelGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'frontmatter',
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
          SizedBox(height: theme.space.s2),
          const HoronCodePanel(
            code: 'name: horon-router\nversion: 0.4.1\nprovider: anthropic\nstream: true\n',
          ),
          SizedBox(height: theme.space.s4),
          Text(
            '강조 토큰',
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
          SizedBox(height: theme.space.s2),
          const Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              HoronCodeKey(label: 'model'),
              SizedBox(width: 8),
              Text(': gpt-5.5'),
            ],
          ),
          SizedBox(height: theme.space.s4),
          Text(
            '긴 줄',
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
          SizedBox(height: theme.space.s2),
          const HoronCodePanel(
            code: 'curl -sS -X POST https://api.horon.ai/v1/agents/run -H \'authorization: Bearer \$TOKEN\' -d @payload.json',
          ),
        ],
      ),
    );
  }
}
