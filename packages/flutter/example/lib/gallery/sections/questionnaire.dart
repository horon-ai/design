import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/questionnaire.dart';

import '../section_scaffold.dart';

/// `questionnaire` 갤러리 섹션입니다.
///
/// React `questionnaire.tsx`에는 cva 변형이 없습니다. 변형 칸에는 라디오 선택지와 체크박스
/// 선택지를, 상태 칸에는 진행 헤더의 유무·선택·비활성을 놓습니다.
class HoronQuestionnaireGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronQuestionnaireGallerySection({super.key});

  @override
  State<HoronQuestionnaireGallerySection> createState() =>
      _HoronQuestionnaireGallerySectionState();
}

class _HoronQuestionnaireGallerySectionState
    extends State<HoronQuestionnaireGallerySection> {
  int _satisfaction = 0;
  final Set<String> _channels = <String>{'email'};

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Questionnaire',
      variants: <Widget>[
        _QuestionnaireCell(
          label: 'radio options',
          child: HoronQuestionnaire(
            children: <Widget>[
              const HoronQuestionnaireProgress(
                label: '1 / 3',
                value: 1,
                max: 3,
              ),
              HoronQuestionnaireItem(
                semanticLabel: '만족도',
                children: <Widget>[
                  const Text('얼마나 만족하십니까?'),
                  HoronQuestionnaireOptions<int>(
                    value: _satisfaction,
                    onChanged: (int value) =>
                        setState(() => _satisfaction = value),
                    children: const <Widget>[
                      HoronQuestionnaireOption<int>.radio(
                        value: 0,
                        child: Text('아주 만족합니다'),
                      ),
                      HoronQuestionnaireOption<int>.radio(
                        value: 1,
                        child: Text('보통입니다'),
                      ),
                      HoronQuestionnaireOption<int>.radio(
                        value: 2,
                        child: Text('만족하지 않습니다'),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        _QuestionnaireCell(
          label: 'checkbox options',
          child: HoronQuestionnaire(
            children: <Widget>[
              HoronQuestionnaireItem(
                semanticLabel: '알림 채널',
                children: <Widget>[
                  const Text('어떤 경로로 알려 드릴까요?'),
                  HoronQuestionnaireOptions<String>(
                    semanticLabel: '복수 선택',
                    children: <Widget>[
                      for (final String channel in <String>[
                        'email',
                        'push',
                        'sms',
                      ])
                        HoronQuestionnaireOption<String>.checkbox(
                          selected: _channels.contains(channel),
                          onChanged: (bool value) => setState(() {
                            if (value) {
                              _channels.add(channel);
                            } else {
                              _channels.remove(channel);
                            }
                          }),
                          child: Text(channel),
                        ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
      states: <Widget>[
        _QuestionnaireCell(
          label: 'progress only',
          child: const HoronQuestionnaire(
            children: <Widget>[
              HoronQuestionnaireProgress(label: '2 / 3', value: 2, max: 3),
            ],
          ),
        ),
        _QuestionnaireCell(
          label: 'disabled options',
          child: HoronQuestionnaire(
            children: <Widget>[
              HoronQuestionnaireItem(
                children: <Widget>[
                  const Text('응답이 마감된 질문'),
                  HoronQuestionnaireOptions<int>(
                    value: 0,
                    enabled: false,
                    onChanged: (_) {},
                    children: const <Widget>[
                      HoronQuestionnaireOption<int>.radio(
                        value: 0,
                        child: Text('마감된 선택지'),
                      ),
                      HoronQuestionnaireOption<int>.radio(
                        value: 1,
                        child: Text('다른 선택지'),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        _QuestionnaireCell(
          label: 'checked box',
          child: HoronQuestionnaire(
            children: <Widget>[
              HoronQuestionnaireItem(
                children: <Widget>[
                  HoronQuestionnaireOptions<int>(
                    children: <Widget>[
                      HoronQuestionnaireOption<int>.checkbox(
                        selected: true,
                        onChanged: (_) {},
                        child: const Text('선택된 체크박스'),
                      ),
                      HoronQuestionnaireOption<int>.checkbox(
                        selected: false,
                        onChanged: (_) {},
                        child: const Text('선택되지 않은 체크박스'),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
      notes:
          'React `questionnaire.tsx`의 질문·선택지 그룹과 진행 헤더를 옮겼습니다. 선택지 '
          '카드는 `min-h-11 rounded-lg border-input bg-input/20`이고, 선택되면 '
          '`border-primary/40 bg-primary/10`이 됩니다. 라디오는 원과 8px 점, 체크박스는 둥근 '
          '사각형과 체크 표시로 구분합니다.',
    );
  }
}

/// 설문 하나를 이름과 함께 보여 주는 칸입니다.
class _QuestionnaireCell extends StatelessWidget {
  const _QuestionnaireCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 360,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.surface,
              borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              border: Border.all(color: scheme.outline),
            ),
            child: Padding(
              padding: const EdgeInsets.all(HoronSpace.s4),
              child: child,
            ),
          ),
        ],
      ),
    );
  }
}
