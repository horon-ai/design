import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `field` 갤러리 섹션입니다.
///
/// React `field.tsx`에는 cva 변형이 없으므로 나열할 변형은 조합이고, 상태는
/// default·invalid·disabled 셋입니다.
class HoronFieldGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFieldGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Field',
      variants: <Widget>[
        const _FieldCell(
          child: HoronField(
            children: <Widget>[
              HoronFieldLabel(label: 'Label only'),
              HoronInput(hintText: 'name@horon.ai'),
            ],
          ),
        ),
        const _FieldCell(
          child: HoronField(
            children: <Widget>[
              HoronFieldLabel(label: 'With description'),
              HoronInput(hintText: 'name@horon.ai'),
              HoronFieldDescription(
                description: 'We only use this to sign you in.',
              ),
            ],
          ),
        ),
        const _FieldCell(
          child: HoronFieldGroup(
            children: <Widget>[
              HoronField(
                children: <Widget>[
                  HoronFieldLabel(label: 'First name'),
                  HoronInput(hintText: 'Min-yeol'),
                ],
              ),
              HoronField(
                children: <Widget>[
                  HoronFieldLabel(label: 'Last name'),
                  HoronInput(hintText: 'Kim'),
                ],
              ),
            ],
          ),
        ),
      ],
      states: <Widget>[
        const _FieldCell(
          child: HoronField(
            children: <Widget>[
              HoronFieldLabel(label: 'Default'),
              HoronInput(hintText: 'name@horon.ai'),
            ],
          ),
        ),
        const _FieldCell(
          child: HoronField(
            invalid: true,
            children: <Widget>[
              HoronFieldLabel(label: 'Invalid'),
              HoronInput(hintText: 'name@horon.ai'),
              HoronFieldError(message: 'Enter an email address.'),
            ],
          ),
        ),
        const _FieldCell(
          child: HoronField(
            disabled: true,
            children: <Widget>[
              HoronFieldLabel(label: 'Disabled'),
              HoronInput(hintText: 'name@horon.ai'),
            ],
          ),
        ),
      ],
      notes:
          'React `field.tsx`에는 cva 변형이 없습니다. `HoronField`가 상태를 스코프로 '
          '내려보내 라벨·컨트롤이 함께 따라갑니다.',
    );
  }
}

/// 한 변형을 보여 주는 칸입니다.
class _FieldCell extends StatelessWidget {
  const _FieldCell({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(width: 280, child: child);
  }
}
