import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `modal` 갤러리 섹션입니다.
///
/// 불투명 표면과 베일 표면을 나란히 두고, 크기 세 단계를 실제로 여는 버튼을 둡니다.
/// 미리보기 폭은 화면보다 넓어지지 않게 컴포넌트가 스스로 줄입니다.
class HoronModalGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronModalGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          _Sample(
            label: 'solid · md · footer',
            child: HoronModal(
              title: const Text('워크스페이스 삭제'),
              description: const Text('이 작업은 되돌릴 수 없습니다. 멤버와 봇이 모두 접근을 잃습니다.'),
              onClose: () {},
              footer: HoronModalFooter(
                children: <Widget>[
                  HoronButton(label: '취소', onPressed: () {}),
                  HoronButton(
                    label: '삭제',
                    variant: HoronButtonVariant.danger,
                    onPressed: () {},
                  ),
                ],
              ),
              child: const Text('삭제하면 이 워크스페이스의 봇, 지식 베이스, 실행 기록이 함께 사라집니다.'),
            ),
          ),
          _Sample(
            label: 'glass · sm · leading',
            child: HoronModal(
              size: HoronModalSize.sm,
              surface: HoronModalSurfaceKind.glass,
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
              title: const Text('봇 설정'),
              description: const Text('이 봇의 이름과 설명을 바꿉니다.'),
              onClose: () {},
              footer: HoronModalFooter(
                children: <Widget>[
                  HoronButton(label: '취소', onPressed: () {}),
                  HoronButton(label: '저장', onPressed: () {}),
                ],
              ),
              child: const Text('변경 사항은 저장한 뒤부터 새 대화에 적용됩니다.'),
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
