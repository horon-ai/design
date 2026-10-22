import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `alert_dialog` 갤러리 섹션입니다.
class HoronAlertDialogGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronAlertDialogGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Alert Dialog',
      variants: <Widget>[
        HoronAlertDialog(
          trigger: const _Trigger(label: '일반'),
          title: '계속할까요?',
          description: '이 작업을 진행합니다.',
          cancelLabel: '취소',
          confirmLabel: '계속',
          onConfirm: () {},
        ),
        HoronAlertDialog(
          trigger: const _Trigger(label: '파괴적'),
          title: '정말 삭제할까요?',
          description: '되돌릴 수 없습니다.',
          cancelLabel: '취소',
          confirmLabel: '삭제',
          destructive: true,
          onConfirm: () {},
        ),
      ],
      states: <Widget>[
        HoronAlertDialog(
          trigger: const _Trigger(label: '본문 있음'),
          title: '약관이 바뀌었습니다',
          description: '계속하려면 동의해 주세요.',
          cancelLabel: '나중에',
          confirmLabel: '동의',
          children: const <Widget>[
            HoronButton(label: '전문 보기', variant: HoronButtonVariant.link),
          ],
        ),
        HoronAlertDialog(
          trigger: const _Trigger(label: '닫기 금지'),
          title: '필수 확인',
          cancelLabel: '취소',
          confirmLabel: '확인',
          dismissible: false,
        ),
      ],
      notes:
          'React `alert-dialog.tsx`를 옮긴 것입니다. 바닥 버튼이 고정되어 항상 '
          '취소·확인이 있고, 파괴적 변형은 확인 버튼이 파괴적 색을 씁니다.',
    );
  }
}

class _Trigger extends StatelessWidget {
  const _Trigger({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: HoronSpace.s3,
        vertical: HoronSpace.s2,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(HoronRadiusRole.control),
        border: Border.all(color: scheme.outline),
      ),
      child: Text(
        label,
        style: text.bodyMedium?.copyWith(color: scheme.onSurface),
      ),
    );
  }
}
