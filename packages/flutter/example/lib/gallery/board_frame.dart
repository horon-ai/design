import 'package:flutter/widgets.dart';

/// 데스크톱 보드 섹션을 폰 폭에서도 담아내는 틀입니다.
///
/// 에이전트 계열 패널(`agent_lanes_timeline`, `agent_steering_panel`,
/// `document_extract_panel`, `knowledge_base_panel`)은 여러 레인을 가로로 늘어놓는
/// 보드라 360px 폰에서 그대로 그리면 안쪽 행이 넘칩니다. 이 틀은 보드를 설계 폭
/// (`designWidth`)으로 먼저 그린 뒤, 자리가 모자라면 비율을 줄여 담습니다.
/// 갤러리에서 보드의 배치를 확인하는 창구이고, 실제 앱은 자기 레이아웃을 씁니다.
class BoardFrame extends StatelessWidget {
  /// 틀을 만듭니다.
  const BoardFrame({super.key, required this.child, this.designWidth = 720});

  /// 담을 보드입니다.
  final Widget child;

  /// 보드가 설계된 폭입니다.
  final double designWidth;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        if (!constraints.maxWidth.isFinite ||
            constraints.maxWidth >= designWidth) {
          return child;
        }
        return FittedBox(
          fit: BoxFit.scaleDown,
          alignment: Alignment.topLeft,
          child: SizedBox(width: designWidth, child: child),
        );
      },
    );
  }
}
