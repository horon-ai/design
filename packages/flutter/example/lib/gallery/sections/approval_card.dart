import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `approval_card`의 갤러리 섹션입니다.
///
/// 대기·승인·거절 세 상태와 첨부를 보여 줍니다.
class HoronApprovalCardGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronApprovalCardGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s4,
        runSpacing: theme.space.s4,
        children: <Widget>[
          HoronApprovalCard(
            title: 'Q3 보드 덱을 팀에 보낼까요?',
            attachment: 'Q3-board-deck.pdf',
            onApprove: () {},
            onLater: () {},
          ),
          const HoronApprovalCard(
            title: '배포 노트를 게시했습니다.',
            state: HoronApprovalState.approved,
          ),
          const HoronApprovalCard(
            title: '외부 링크 공유를 취소했습니다.',
            state: HoronApprovalState.declined,
          ),
        ],
      ),
    );
  }
}
