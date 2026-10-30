import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `plugin_row` 갤러리 섹션입니다.
///
/// 변형 어휘가 없으므로 상태를 늘어놓습니다. 최신 상태, 업데이트 알약과 켜진 스위치,
/// 인증 배지와 오버플로, 그리고 폭이 좁을 때 액션이 아래로 내려가는 모습입니다.
class HoronPluginRowGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronPluginRowGallerySection({super.key});

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
                label: '기본 — 이름 · 버전 · 작성자 · 칩',
                width: wide,
                child: HoronPluginRow(
                  initials: 'FS',
                  name: 'filesystem',
                  version: 'v1.4.0',
                  author: 'alpox',
                  verified: true,
                  chips: _chips,
                  enabled: true,
                  onEnabledChange: (bool value) {},
                ),
              ),
              _Cell(
                label: '업데이트 알약 · Update 버튼 · 오버플로',
                width: wide,
                child: HoronPluginRow(
                  initials: 'WB',
                  name: 'web-search',
                  version: 'v0.9.2',
                  updateBadge: '업데이트',
                  author: 'horon',
                  chips: _chips,
                  enabled: true,
                  onEnabledChange: (bool value) {},
                  onUpdate: () {},
                  onMenuPressed: () {},
                ),
              ),
              _Cell(
                label: '최신 · 꺼진 스위치 · 액션 없음',
                width: wide,
                child: HoronPluginRow(
                  initials: 'MS',
                  name: 'mail-sync',
                  version: 'v2.0.0',
                  author: 'horon',
                  chips: const <HoronPluginRowChip>[
                    HoronPluginRowChip(id: 'read', label: 'mail.read'),
                  ],
                  onEnabledChange: (bool value) {},
                ),
              ),
              _Cell(
                label: '좁은 폭 — 액션이 글자 아래로',
                width: narrow,
                child: HoronPluginRow(
                  initials: 'WB',
                  name: 'web-search',
                  version: 'v0.9.2',
                  updateBadge: '업데이트',
                  author: 'horon',
                  verified: true,
                  chips: _chips,
                  enabled: true,
                  onEnabledChange: (bool value) {},
                  onUpdate: () {},
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

const List<HoronPluginRowChip> _chips = <HoronPluginRowChip>[
  HoronPluginRowChip(
    id: 'read',
    label: 'files.read',
    icon: Icon(Icons.description_outlined),
  ),
  HoronPluginRowChip(
    id: 'write',
    label: 'files.write',
    icon: Icon(Icons.edit_outlined),
  ),
];

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
