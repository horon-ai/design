import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/stepper.dart';

import '../section_scaffold.dart';

/// `stepper` 갤러리 섹션입니다.
///
/// React `stepper.tsx`에는 cva 변형이 없습니다. 변형 칸에 수평·수직 방향을,
/// 상태 칸에 지나온·지금·아직 오지 않은 단계가 한 화면에 보이는 조합을 놓습니다.
class HoronStepperGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronStepperGallerySection({super.key});

  /// 한 단계의 트리거와 구분선입니다.
  Widget _step(String value, String title) {
    return HoronStepperItem(
      step: value,
      children: <Widget>[
        HoronStepperTrigger(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              const HoronStepperIndicator(),
              const SizedBox(width: HoronSpace.s2_5),
              HoronStepperTitle(text: title),
            ],
          ),
        ),
        const HoronStepperSeparator(),
      ],
    );
  }

  /// 세 단계 묶음 하나입니다.
  Widget _cell(
    BuildContext context, {
    required String label,
    String? initialValue,
    bool vertical = false,
  }) {
    return SizedBox(
      width: vertical ? 220 : 420,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s3),
          HoronStepper(
            initialValue: initialValue,
            vertical: vertical,
            children: <Widget>[
              _step('account', '계정'),
              _step('address', '주소'),
              _step('payment', '결제'),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Stepper',
      variants: <Widget>[
        _cell(
          context,
          label: 'horizontal · active first',
          initialValue: 'account',
        ),
        _cell(
          context,
          label: 'horizontal · active middle',
          initialValue: 'address',
        ),
        _cell(
          context,
          label: 'horizontal · active last',
          initialValue: 'payment',
        ),
        _cell(
          context,
          label: 'vertical · active middle',
          initialValue: 'address',
          vertical: true,
        ),
      ],
      states: <Widget>[
        _cell(context, label: 'no value (all inactive)'),
        _cell(
          context,
          label: 'vertical · complete all but last',
          initialValue: 'payment',
          vertical: true,
        ),
      ],
      notes:
          'React `stepper.tsx`의 세 상태입니다. `active`는 인디케이터가 '
          '`border-primary bg-primary text-primary-foreground`, `complete`는 '
          '`border-primary text-primary`에 체크 표시, `inactive`는 '
          '`border-border bg-card text-muted-foreground`입니다. 구분선은 `complete`에서 '
          '`bg-primary`로 채워집니다.',
    );
  }
}
