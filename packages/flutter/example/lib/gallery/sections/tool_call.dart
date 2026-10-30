import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `tool_call`의 갤러리 섹션입니다.
///
/// 세 상태를 나란히 놓고, 펼친 카드로 인자·결과·오류 상자를 함께 보여 줍니다.
/// [Wrap]이라 휴대폰 폭에서는 카드가 위아래로 섭니다.
class HoronToolCallGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronToolCallGallerySection({super.key});

  /// 카드가 넘지 않는 폭입니다.
  static const double _cardWidth = 360;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final List<(String, Widget)> variants = <(String, Widget)>[
      (
        'running',
        const HoronToolCall(
          status: HoronToolCallStatus.running,
          toolName: 'Web search',
          toolIcon: Icon(Icons.search),
          summary: 'Searching the web',
          elapsed: '0.8s',
          args: <String, Object?>{'query': 'horon design system'},
          initiallyOpen: true,
        ),
      ),
      (
        'done',
        HoronToolCall(
          status: HoronToolCallStatus.done,
          toolName: 'Web search',
          toolIcon: const Icon(Icons.search),
          summary: 'Read 8 pages',
          elapsed: '2.4s',
          args: <String, Object?>{'query': 'horon design system', 'limit': 8},
          result: <String, Object?>{
            'count': 8,
            'pages': <Object?>['tokens', 'theme', 'glass'],
          },
          truncated: true,
          onShowAll: () {},
          initiallyOpen: true,
        ),
      ),
      (
        'failed',
        HoronToolCall(
          status: HoronToolCallStatus.failed,
          toolName: 'Stripe',
          toolIcon: const Icon(Icons.credit_card),
          summary: 'Creating a charge',
          error: 'The card was declined by the issuer.',
          onRetry: () {},
          initiallyOpen: true,
        ),
      ),
    ];

    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double width = constraints.maxWidth < _cardWidth
              ? constraints.maxWidth
              : _cardWidth;
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            children: <Widget>[
              for (final (String caption, Widget card) in variants)
                SizedBox(
                  width: width,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      Padding(
                        padding: EdgeInsets.only(bottom: theme.space.s2),
                        child: Text(
                          caption,
                          style: theme.text.labelSm.copyWith(
                            color: theme.colors.textSecondary,
                          ),
                        ),
                      ),
                      card,
                    ],
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
