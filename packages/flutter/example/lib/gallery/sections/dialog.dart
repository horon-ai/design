import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴은 통합 스크립트가 채웁니다. 그 전에는 하위 경로로 가져옵니다.

import '../section_scaffold.dart';

/// `dialog` 갤러리 섹션입니다.
class HoronDialogGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDialogGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Dialog',
      variants: <Widget>[
        HoronDialog(
          trigger: const _Trigger(label: '열기'),
          title: '변경 사항을 저장할까요?',
          description: '저장하지 않고 닫으면 편집한 내용이 사라집니다.',
          footer: HoronDialogFooter(
            children: <Widget>[
              HoronDialogClose(label: '나중에'),
              HoronButton(label: '저장', onPressed: () {}),
            ],
          ),
        ),
        HoronAlertDialog(
          trigger: const _Trigger(label: '삭제'),
          title: '정말 삭제할까요?',
          description: '이 작업은 되돌릴 수 없습니다.',
          cancelLabel: '취소',
          confirmLabel: '삭제',
          destructive: true,
          onConfirm: () {},
        ),
      ],
      states: <Widget>[
        HoronDialog(
          trigger: const _Trigger(label: '닫기 버튼 없음'),
          title: '닫기 버튼이 없는 대화상자',
          showCloseButton: false,
        ),
        HoronAlertDialog(
          trigger: const _Trigger(label: '일반 확인'),
          title: '계속할까요?',
          cancelLabel: '취소',
          confirmLabel: '계속',
        ),
      ],
      notes:
          'React `dialog.tsx`와 `alert-dialog.tsx`를 옮긴 것입니다. 배경은 토큰 '
          '스크림이고, Material의 showDialog나 showModalBottomSheet은 쓰지 않습니다.',
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
