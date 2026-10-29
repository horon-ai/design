import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `directory_card`의 갤러리 섹션입니다.
///
/// 설명이 있는 카드와 없는 카드를 보여 주고, 추가 버튼이 실제로 눌리는지 확인할 수 있게 둡니다.
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
        children: <Widget>[
          HoronDirectoryCard(
            icon: const Icon(Icons.folder_outlined),
            name: 'Knowledge',
            description: '팀 문서와 노트를 한곳에 모읍니다',
            onAdd: () {},
          ),
          SizedBox(height: theme.space.s3),
          HoronDirectoryCard(
            icon: const Icon(Icons.dns_outlined),
            name: 'MCP servers',
            onAdd: () {},
          ),
          SizedBox(height: theme.space.s3),
          const HoronDirectoryCard(
            icon: Icon(Icons.extension_outlined),
            name: 'Plugins',
            description: '추가 버튼이 비활성인 상태입니다',
          ),
        ],
      ),
    );
  }
}
