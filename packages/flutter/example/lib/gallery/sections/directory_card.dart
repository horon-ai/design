import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `directory_card`의 갤러리 섹션입니다.
///
/// 설명이 있는 카드, 설명이 없는 카드, 추가 버튼이 없는 카드를 solid와 glass
/// 두 표면에 같은 목록으로 보여 줍니다. 추가 버튼은 `onAdd`가 있을 때만 그려지고
/// 실제로 눌러 볼 수 있습니다.
class HoronDirectoryCardGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronDirectoryCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(
            label: 'Solid',
            child: _cards(theme, HoronSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _cards(theme, HoronSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 카드 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _cards(HoronThemeData theme, HoronSurface surface) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        HoronDirectoryCard(
          icon: const Icon(Icons.folder_outlined),
          name: 'Knowledge',
          description: '팀 문서와 노트를 한곳에 모읍니다',
          surface: surface,
          onAdd: () {},
        ),
        SizedBox(height: theme.space.s3),
        HoronDirectoryCard(
          icon: const Icon(Icons.dns_outlined),
          name: 'MCP servers',
          surface: surface,
          onAdd: () {},
        ),
        SizedBox(height: theme.space.s3),
        HoronDirectoryCard(
          icon: const Icon(Icons.extension_outlined),
          name: 'Plugins',
          description: 'onAdd가 없어 추가 버튼을 그리지 않습니다',
          surface: surface,
        ),
      ],
    );
  }
}
