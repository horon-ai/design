import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/mcp_server_row.dart';

/// `mcp_server_row` 갤러리 섹션입니다.
///
/// 변형 어휘가 없으므로 상태를 늘어놓습니다. 태그와 메타가 있는 기본형, 브랜드 태그와
/// 두 액션이 있는 행, 설명이 없는 최소형, 그리고 폭이 좁을 때 액션이 아래로 내려가는
/// 모습입니다.
class HoronMcpServerRowGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMcpServerRowGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double available = constraints.maxWidth.isFinite
              ? constraints.maxWidth
              : 640;
          final double wide = math.min(available, 640);
          final double narrow = math.min(available, 360);
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              _Cell(
                label: '기본 — 타일 · 태그 · 설명 · 메타 · 상태',
                width: wide,
                child: HoronMcpServerRow(
                  name: 'notion',
                  tags: const <String>['Official', 'Local'],
                  description: '페이지와 데이터베이스를 읽습니다',
                  meta: const <String>['v1.2.0', 'stdio', '2 tools'],
                  onConfigure: () {},
                ),
              ),
              _Cell(
                label: '브랜드 태그 · Configure · 오버플로',
                width: wide,
                child: HoronMcpServerRow(
                  name: 'github',
                  initials: 'GH',
                  tags: const <String>['Official'],
                  brandTags: const <String>['All devices', 'Read only'],
                  description: '이슈와 풀 리퀘스트를 조회합니다',
                  meta: const <String>['v2.1.0', 'http'],
                  onConfigure: () {},
                  onMenuPressed: () {},
                ),
              ),
              _Cell(
                label: '설명 없음 · 최소',
                width: wide,
                child: const HoronMcpServerRow(
                  name: 'linear',
                  statusLabel: '연결됨',
                ),
              ),
              _Cell(
                label: '좁은 폭 — 액션이 글자 아래로',
                width: narrow,
                child: HoronMcpServerRow(
                  name: 'github',
                  tags: const <String>['Official'],
                  brandTags: const <String>['All devices'],
                  description: '이슈와 풀 리퀘스트를 조회합니다',
                  meta: const <String>['v2.1.0', 'http'],
                  onConfigure: () {},
                  onMenuPressed: () {},
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// 캡션이 붙은 갤러리 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.width, required this.child});

  final String label;
  final double width;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      width: width,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s2,
        children: <Widget>[
          Text(
            label,
            style: theme.text.labelSm.copyWith(
              color: theme.colors.textPlaceholder,
            ),
          ),
          child,
        ],
      ),
    );
  }
}
