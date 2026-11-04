import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `approval_card`의 갤러리 섹션입니다.
///
/// 대기·승인·거절 세 상태와 상태 문구 카드를 solid와 glass 두 표면에 같은 목록으로
/// 보여 줍니다.
class HoronApprovalCardGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronApprovalCardGallerySection({super.key});

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
            child: _cards(theme, HoronApprovalCardSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _cards(theme, HoronApprovalCardSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 카드 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _cards(HoronThemeData theme, HoronApprovalCardSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      children: <Widget>[
        HoronApprovalCard(
          title: 'Q3 보드 덱을 팀에 보낼까요?',
          attachment: 'Q3-board-deck.pdf',
          surface: surface,
          onApprove: () {},
          onLater: () {},
        ),
        HoronApprovalCard(
          title: '배포 노트를 게시했습니다.',
          state: HoronApprovalState.approved,
          surface: surface,
        ),
        HoronApprovalCard(
          title: '외부 링크 공유를 취소했습니다.',
          state: HoronApprovalState.declined,
          surface: surface,
        ),
        HoronApprovalCard(
          title: '승인 대기 상태 문구',
          status: 'Needs your yes',
          surface: surface,
        ),
      ],
    );
  }
}
