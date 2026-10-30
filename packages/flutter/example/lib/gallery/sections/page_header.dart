import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports

/// Page Header 갤러리 섹션입니다.
///
/// 뒤로 버튼이 있는 기본형, 뒤로 버튼 없이 제목이 들여 쓰인 형, 동작 버튼과 아래 줄
/// 내용이 있는 형을 놓습니다.
class HoronPageHeaderGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronPageHeaderGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          _Sample(
            label: '뒤로 버튼',
            child: HoronPageHeader(title: '에이전트 설정', onBack: () {}),
          ),
          _Sample(
            label: '동작 버튼과 아래 줄',
            child: HoronPageHeader(
              title: '지식 베이스',
              actions: HoronIconButton(
                icon: const Icon(Icons.search),
                label: '검색',
                onPressed: () {},
              ),
              child: Row(
                spacing: theme.space.s2,
                children: <Widget>[
                  Text(
                    '전체 24개',
                    style: theme.text.labelSm.copyWith(
                      color: theme.colors.textSecondary,
                    ),
                  ),
                  Text(
                    '동기화됨',
                    style: theme.text.labelSm.copyWith(
                      color: theme.colors.textBrand,
                    ),
                  ),
                ],
              ),
            ),
          ),
          _Sample(
            label: '긴 제목 (한 줄 말줄임)',
            child: HoronPageHeader(
              title: '아주 긴 에이전트 설정 페이지의 제목입니다',
              onBack: () {},
            ),
          ),
        ],
      ),
    );
  }
}

/// 변형 하나와 그 이름입니다.
class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s2,
      children: <Widget>[
        Text(
          label,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        child,
      ],
    );
  }
}
