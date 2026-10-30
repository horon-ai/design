import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `field` 갤러리 섹션입니다.
///
/// 라벨·컨트롤·도움말 묶음과 오류·비활성 상태를 나란히 보여 줍니다.
class HoronFieldGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFieldGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Field',
      variants: <Widget>[
        _FieldCell(
          label: '라벨 + 도움말',
          child: HoronField(
            children: <Widget>[
              const HoronFieldLabel('워크스페이스 이름'),
              const SizedBox(
                width: 240,
                child: HoronInput(hintText: '예: horon'),
              ),
              const HoronFieldDescription('팀이 함께 보는 이름입니다.'),
            ],
          ),
        ),
        _FieldCell(
          label: '오류',
          child: HoronField(
            children: <Widget>[
              const HoronFieldLabel('워크스페이스 이름'),
              const SizedBox(
                width: 240,
                child: HoronInput(invalid: true, hintText: '예: horon'),
              ),
              const HoronFieldError('이미 쓰는 이름입니다.'),
            ],
          ),
        ),
      ],
      states: <Widget>[
        _FieldCell(
          label: '비활성',
          child: HoronField(
            disabled: true,
            children: <Widget>[
              const HoronFieldLabel('워크스페이스 이름'),
              const SizedBox(
                width: 240,
                child: HoronInput(enabled: false, hintText: '예: horon'),
              ),
              const HoronFieldDescription('관리자만 바꿀 수 있습니다.'),
            ],
          ),
        ),
      ],
      notes:
          'Figma `Field examples`(58:163)입니다. 라벨·컨트롤·도움말을 세로로 쌓고 사이를 '
          '8px 띄웁니다. 라벨은 `label-md`/`text-primary`(비활성이면 `text-disabled`), '
          '도움말은 `caption`/`text-secondary`, 오류는 `caption`/`text-danger`이고 160ms로 '
          '4px 아래에서 들어옵니다.',
    );
  }
}

/// 필드 하나를 캡션과 함께 보여 주는 칸입니다.
class _FieldCell extends StatelessWidget {
  const _FieldCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            label,
            style: horon.text.caption.copyWith(
              color: horon.colors.textSecondary,
            ),
          ),
          SizedBox(height: horon.space.s1_5),
          child,
        ],
      ),
    );
  }
}
