import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 미리보기 상자의 최대 폭입니다. 좁은 화면에서는 남는 폭에 맞춰 줄입니다.
const double _previewMaxWidth = 360;

/// 섹션이 함께 쓰는 토스트 컨트롤러입니다.
///
/// 갤러리 섹션은 `StatelessWidget`이라 상태를 들 자리가 없으므로, 데모용
/// 컨트롤러 하나를 파일에 둡니다.
final HoronToastController _demoController = HoronToastController();

/// Toast 갤러리 섹션입니다.
///
/// 세 톤의 카드를 나란히 놓고, 실제로 뜨고 닫히는 토스터 하나를 함께 둡니다.
class HoronToastGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronToastGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double width = constraints.maxWidth < _previewMaxWidth
              ? constraints.maxWidth
              : _previewMaxWidth;
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              for (final HoronToastTone tone in HoronToastTone.values)
                _Sample(
                  label: tone.name,
                  child: SizedBox(
                    width: width,
                    child: HoronToast(
                      title: switch (tone) {
                        HoronToastTone.neutral => '동기화가 끝났습니다',
                        HoronToastTone.success => '저장했습니다',
                        HoronToastTone.danger => '업로드에 실패했습니다',
                      },
                      description: switch (tone) {
                        HoronToastTone.neutral => '봇 3개를 다시 읽었습니다.',
                        HoronToastTone.success => '변경 사항이 반영되었습니다.',
                        HoronToastTone.danger => '네트워크를 확인하고 다시 시도하세요.',
                      },
                      tone: tone,
                      onDismiss: () {},
                    ),
                  ),
                ),
              _Sample(
                label: 'live · 오른쪽 아래에 쌓입니다',
                child: SizedBox(
                  width: width,
                  height: 260,
                  child: HoronToaster(
                    controller: _demoController,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      spacing: theme.space.s2,
                      children: <Widget>[
                        HoronButton(
                          label: '성공 알림',
                          onPressed: () => _demoController.show(
                            title: '저장했습니다',
                            description: '변경 사항이 반영되었습니다.',
                            tone: HoronToastTone.success,
                          ),
                        ),
                        HoronButton(
                          label: '실패 알림',
                          variant: HoronButtonVariant.danger,
                          onPressed: () => _demoController.show(
                            title: '업로드에 실패했습니다',
                            description: '네트워크를 확인하고 다시 시도하세요.',
                            tone: HoronToastTone.danger,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// 캡션과 위젯 하나입니다.
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
      spacing: theme.space.s1,
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
