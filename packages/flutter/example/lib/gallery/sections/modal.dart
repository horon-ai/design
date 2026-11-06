import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 미리보기 상자의 최대 폭입니다. 좁은 화면에서는 남는 폭에 맞춰 줄입니다.
const double _previewMaxWidth = 560;

/// Modal 갤러리 섹션입니다.
///
/// 폼과 긴 글을 담는 모달을 solid와 veil(glass) 두 표면, sm·md·lg 세 폭으로
/// 보여 주고, 크기 세 단계를 실제 스크림 위에 띄워 봅니다.
class HoronModalGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronModalGallerySection({super.key});

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
                label: 'solid · md · 스크롤 본문',
                child: SizedBox(
                  width: width,
                  child: HoronModal(
                    title: const Text('워크스페이스 만들기'),
                    description: const Text('이름과 멤버를 정합니다.'),
                    onClose: () {},
                    footer: HoronModalFooter(
                      children: <Widget>[
                        HoronButton(label: '취소', onPressed: () {}),
                        HoronButton(label: '만들기', onPressed: () {}),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: theme.space.s3,
                      children: <Widget>[
                        for (int index = 0; index < 6; index += 1)
                          Text(
                            '본문 ${index + 1} — 화면 높이에 닿으면 이 영역만 스크롤합니다.',
                            style: theme.text.bodyMd.copyWith(
                              color: theme.colors.textPrimary,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
              _Sample(
                label: 'glass · veil-overlay · sm',
                child: SizedBox(
                  width: width,
                  child: HoronModal(
                    title: const Text('초대 링크'),
                    description: const Text('링크를 아는 사람은 참여할 수 있습니다.'),
                    size: HoronModalSize.sm,
                    surface: HoronModalSurfaceKind.glass,
                    onClose: () {},
                    footer: HoronModalFooter(
                      children: <Widget>[
                        HoronButton(label: '복사', onPressed: () {}),
                      ],
                    ),
                    child: HoronButton(
                      label: 'horon.app/invite/8f2c',
                      onPressed: () {},
                    ),
                  ),
                ),
              ),
              _Sample(
                label: 'solid · lg · leading',
                child: SizedBox(
                  width: width,
                  child: HoronModal(
                    title: const Text('에이전트 설정'),
                    description: const Text('이 에이전트의 모델과 도구를 고릅니다.'),
                    size: HoronModalSize.lg,
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
                    onClose: () {},
                    footer: HoronModalFooter(
                      children: <Widget>[
                        HoronButton(label: '취소', onPressed: () {}),
                        HoronButton(label: '저장', onPressed: () {}),
                      ],
                    ),
                    child: const SizedBox.shrink(),
                  ),
                ),
              ),
              _Sample(
                label: 'live · 크기 세 단계',
                child: Wrap(
                  spacing: theme.space.s2,
                  runSpacing: theme.space.s2,
                  children: <Widget>[
                    for (final HoronModalSize size in HoronModalSize.values)
                      HoronButton(
                        label: '${size.name} 열기',
                        onPressed: () => _open(context, size),
                      ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _open(BuildContext context, HoronModalSize size) {
    showHoronModalContent<void>(
      context,
      size: size,
      title: const Text('워크스페이스 삭제'),
      description: const Text('이 작업은 되돌릴 수 없습니다.'),
      footer: HoronModalFooter(
        children: <Widget>[
          HoronButton(
            label: '취소',
            onPressed: () => Navigator.of(context).maybePop(),
          ),
          HoronButton(
            label: '삭제',
            variant: HoronButtonVariant.danger,
            onPressed: () => Navigator.of(context).maybePop(),
          ),
        ],
      ),
      child: const Text('삭제하면 이 워크스페이스의 봇과 실행 기록이 함께 사라집니다.'),
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
