import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `input` 갤러리 섹션입니다.
///
/// 두 크기와 선행 아이콘·오류·비활성 상태를 solid와 glass 두 표면에 같은 목록으로
/// 놓고, 페이지 배경에 직접 놓는 `solidOnPage` 표면을 따로 보여 줍니다.
class HoronInputGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s6,
        children: <Widget>[
          Text('Input', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _inputs(theme, HoronInputSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _inputs(theme, HoronInputSurface.glass),
          ),
          SurfaceGroup(
            label: 'SolidOnPage',
            child: _InputCell(
              label: 'MD · solidOnPage',
              child: const HoronInput(
                surface: HoronInputSurface.solidOnPage,
                hintText: '이메일',
              ),
            ),
          ),
          Text(
            'Figma `Input`(58:126)입니다. 상자는 40(MD)·48(LG)이고 반경은 '
            '`radius.md`(12), 좌우 여백은 12/14/20입니다. 기본값은 Solid이고, Glass 표면은 '
            'React `.veil-field`와 같은 veil 한 겹이라 LiquidGlass를 겹치지 않으며, '
            '상태 테두리(초점·오류)를 veil 링이 맡습니다. '
            'SolidOnPage는 페이지 배경에 직접 놓는 불투명 표면입니다. 선행 아이콘은 '
            '`text-secondary`로 MD 16px·LG 20px입니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 입력 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _inputs(HoronThemeData theme, HoronInputSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _InputCell(
          label: 'MD',
          child: HoronInput(surface: surface, hintText: '이메일'),
        ),
        _InputCell(
          label: 'LG',
          child: HoronInput(
            surface: surface,
            size: HoronInputSize.lg,
            hintText: '이메일',
          ),
        ),
        _InputCell(
          label: '선행 아이콘 (16px)',
          child: HoronInput(
            surface: surface,
            icon: const Icon(Icons.search),
            hintText: '검색',
          ),
        ),
        _InputCell(
          label: 'Invalid',
          child: HoronInput(surface: surface, invalid: true, hintText: '이메일'),
        ),
        _InputCell(
          label: 'Disabled',
          child: HoronInput(surface: surface, enabled: false, hintText: '이메일'),
        ),
      ],
    );
  }
}

/// 입력 하나를 캡션과 함께 보여 주는 칸입니다.
class _InputCell extends StatelessWidget {
  const _InputCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 240,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            label,
            style: horon.text.caption.copyWith(
              color: horon.colors.textSecondary,
            ),
          ),
          SizedBox(height: horon.space.s1_5),
          child,
        ],
      ),
    );
  }
}
