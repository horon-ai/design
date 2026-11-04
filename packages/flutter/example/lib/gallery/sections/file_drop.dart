import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `file_drop` 갤러리 섹션입니다.
///
/// 기본, 거부된 파일, 업로드 중, 비활성 네 상태를 solid와 glass 두 표면에 같은
/// 목록으로 보여 줍니다.
class HoronFileDropGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFileDropGallerySection({super.key});

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
            child: _drops(theme, HoronFileDropSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass · veil drop',
            glass: true,
            child: _drops(theme, HoronFileDropSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 드롭 영역 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _drops(HoronThemeData theme, HoronFileDropSurface surface) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s6,
      children: <Widget>[
        _Sample(
          label: '기본',
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: HoronFileDrop(surface: surface),
          ),
        ),
        _Sample(
          label: '거부된 파일',
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: HoronFileDrop(
              label: 'report.csv is not allowed',
              surface: surface,
              rejected: true,
            ),
          ),
        ),
        _Sample(
          label: '업로드 중',
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: HoronFileDrop(
              label: 'Uploading design-notes.pdf',
              surface: surface,
              uploading: true,
            ),
          ),
        ),
        _Sample(
          label: '비활성',
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: _maxWidth),
            child: HoronFileDrop(surface: surface, disabled: true),
          ),
        ),
      ],
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
