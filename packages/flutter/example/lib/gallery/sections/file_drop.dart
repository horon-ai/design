import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/file_drop.dart';

/// `file_drop` 갤러리 섹션입니다.
///
/// 기본, 거부된 파일, 업로드 중, 비활성 네 상태를 나란히 보여 줍니다.
class HoronFileDropGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFileDropGallerySection({super.key});

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
            label: '기본',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: const HoronFileDrop(),
            ),
          ),
          _Sample(
            label: '거부된 파일',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: const HoronFileDrop(
                label: 'report.csv is not allowed',
                rejected: true,
              ),
            ),
          ),
          _Sample(
            label: '업로드 중',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: const HoronFileDrop(
                label: 'Uploading design-notes.pdf',
                uploading: true,
              ),
            ),
          ),
          _Sample(
            label: '비활성',
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _maxWidth),
              child: const HoronFileDrop(disabled: true),
            ),
          ),
        ],
      ),
    );
  }

  /// `max-w-[550px]` — 컴포넌트가 스스로 정하는 폭입니다.
  static const double _maxWidth = 550;
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
