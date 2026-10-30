import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `bot_instructions_panel`의 갤러리 섹션입니다.
///
/// 지시문·변수·시나리오·출력이 모두 있는 패널과, 버전 알약과 Example 탭만 있는
/// 패널을 나란히 보여 줍니다.
class HoronBotInstructionsPanelGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBotInstructionsPanelGallerySection({super.key});

  static const List<List<HoronInstructionPart>> _instructions =
      <List<HoronInstructionPart>>[
        <HoronInstructionPart>[
          HoronInstructionPart.text('You are the'),
          HoronInstructionPart.variable(
            'bot_name',
            tone: HoronInstructionVariableTone.brand,
          ),
          HoronInstructionPart.text('assistant for'),
          HoronInstructionPart.variable('workspace'),
        ],
        <HoronInstructionPart>[
          HoronInstructionPart.text('Answer in'),
          HoronInstructionPart.variable('language'),
          HoronInstructionPart.text('and keep replies under'),
          HoronInstructionPart.variable(
            'max_words',
            tone: HoronInstructionVariableTone.neutral,
          ),
          HoronInstructionPart.text('words.'),
        ],
        <HoronInstructionPart>[
          HoronInstructionPart.text('Escalate billing questions to a human.'),
        ],
      ];

  static const List<HoronInstructionVariable> _variables =
      <HoronInstructionVariable>[
        HoronInstructionVariable(name: 'bot_name', value: 'Horon Helper'),
        HoronInstructionVariable(
          name: 'workspace',
          value: 'Horon CS',
          tone: HoronInstructionVariableTone.brand,
        ),
        HoronInstructionVariable(
          name: 'language',
          value: 'Korean',
          tone: HoronInstructionVariableTone.neutral,
        ),
        HoronInstructionVariable(name: 'max_words', value: '120'),
      ];

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: theme.space.s2,
            children: <Widget>[
              Text(
                '지시문 · 변수 · 시나리오 · 실행 출력',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              HoronBotInstructionsPanel(
                bot: const HoronBotSummary(initial: 'H', name: 'Horon Helper'),
                instructions: _instructions,
                tokenCount: 184,
                variables: _variables,
                scenarios: const <String>['Onboarding', 'Pricing', 'Billing'],
                onRun: (String? scenario) {},
                output: Text('Sure — here is how to invite a teammate.'),
              ),
            ],
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: theme.space.s2,
            children: <Widget>[
              Text(
                '버전 알약 · Example 탭',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              HoronBotInstructionsPanel(
                version: 'v4',
                versionStatus: 'Live',
                bot: const HoronBotSummary(initial: 'Q', name: 'Q3 Support'),
                instructions: _instructions,
                tokenCount: 96,
                example: Text('Hi! Where can I update my invoice address?'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
