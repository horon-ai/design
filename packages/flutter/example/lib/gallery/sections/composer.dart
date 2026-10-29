import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/composer.dart';

/// `composer` 갤러리 섹션입니다.
///
/// 빈 입력(음성 버튼), 글이 있는 입력(전송 버튼), 다른 안내 문구, 비활성 네 상태를 보여 줍니다.
class HoronComposerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronComposerGallerySection({super.key});

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
            label: '빈 입력',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: HoronComposer(onAttach: () {}, onVoice: () {}),
            ),
          ),
          _Sample(
            label: '글이 있는 입력',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: HoronComposer(
                initialValue: 'Design tokens are ready to review',
                onAttach: () {},
                onSubmit: (_) {},
              ),
            ),
          ),
          _Sample(
            label: '다른 안내 문구',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: HoronComposer(
                placeholder: 'Ask the bot anything',
                onAttach: () {},
                onVoice: () {},
              ),
            ),
          ),
          _Sample(
            label: '비활성',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: HoronComposer(
                disabled: true,
                onAttach: () {},
                onVoice: () {},
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 샘플 하나의 최대 폭입니다. 폰 폭에서는 부모를 따라 줄어듭니다.
  static const double _maxWidth = 520;
}

class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          label,
          style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
        ),
        SizedBox(height: theme.space.s2),
        child,
      ],
    );
  }
}
