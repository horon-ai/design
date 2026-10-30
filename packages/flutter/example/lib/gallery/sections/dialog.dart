import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 미리보기 상자의 최대 폭입니다. 좁은 화면에서는 남는 폭에 맞춰 줄입니다.
const double _previewMaxWidth = 380;

/// Dialog 갤러리 섹션입니다.
///
/// 유리 다이얼로그와 Paper의 불투명 모달을 나란히 놓고, 실제로 열리는 다이얼로그
/// 하나를 둡니다.
class HoronDialogGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDialogGallerySection({super.key});

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
              _Sample(
                label: 'glass',
                child: SizedBox(
                  width: width,
                  child: HoronDialog(
                    title: const Text('워크스페이스 삭제'),
                    description: const Text(
                      '이 작업은 되돌릴 수 없습니다. 멤버와 봇이 모두 접근을 잃습니다.',
                    ),
                    onClose: () {},
                    child: HoronDialogFooter(
                      children: <Widget>[
                        HoronButton(label: '취소', onPressed: () {}),
                        HoronButton(
                          label: '삭제',
                          variant: HoronButtonVariant.danger,
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              _Sample(
                label: 'solid · leading',
                child: SizedBox(
                  width: width,
                  child: HoronDialog(
                    title: const Text('봇 설정'),
                    description: const Text('이 봇의 이름과 설명을 바꿉니다.'),
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: theme.colors.bgSubtle,
                        borderRadius: BorderRadius.circular(theme.radius.md),
                      ),
                      child: Icon(
                        Icons.smart_toy_outlined,
                        color: theme.colors.textSecondary,
                      ),
                    ),
                    solid: true,
                    onClose: () {},
                    child: HoronDialogFooter(
                      children: <Widget>[
                        HoronButton(label: '취소', onPressed: () {}),
                        HoronButton(label: '저장', onPressed: () {}),
                      ],
                    ),
                  ),
                ),
              ),
              _Sample(
                label: 'live · 스크림 위에 가운데로 뜹니다',
                child: HoronButton(
                  label: '다이얼로그 열기',
                  onPressed: () => showHoronDialog(
                    context,
                    title: const Text('워크스페이스 삭제'),
                    description: const Text('이 작업은 되돌릴 수 없습니다.'),
                    child: HoronDialogFooter(
                      children: <Widget>[
                        HoronButton(label: '취소', onPressed: () {}),
                        HoronButton(
                          label: '삭제',
                          variant: HoronButtonVariant.danger,
                          onPressed: () {},
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
