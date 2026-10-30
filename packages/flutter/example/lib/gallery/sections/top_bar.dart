import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports
import 'package:horon_ui/src/components/top_bar.dart';

/// Top Bar 갤러리 섹션입니다.
///
/// 부제와 라이브 점이 있는 기본형, 제목만 있는 형, 긴 제목이 잘리는 형을 놓습니다.
class HoronTopBarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTopBarGallerySection({super.key});

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
            label: '부제 + 라이브',
            child: HoronTopBar(
              title: '연구 도우미',
              subtitle: '3개 도구 사용 중',
              live: true,
              onBack: () {},
              onMore: () {},
            ),
          ),
          _Sample(
            label: '제목만',
            child: HoronTopBar(title: '문서 추출', onBack: () {}, onMore: () {}),
          ),
          _Sample(
            label: '긴 제목 (한 줄 말줄임)',
            child: HoronTopBar(
              title: '아주 긴 워크스페이스 이름을 가진 에이전트의 연구 도우미',
              subtitle: '아주 긴 부제도 한 줄에서 잘립니다',
              onBack: () {},
              onMore: () {},
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
