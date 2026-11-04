import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `textarea_field` 갤러리 섹션입니다.
///
/// 라벨 붙은 여러 줄 필드를 도움말·글자 수·오류·비활성 상태로 solid와 glass 두
/// 표면에 같은 목록으로 보여 줍니다.
class HoronTextareaFieldGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTextareaFieldGallerySection({super.key});

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
          Text('Textarea field', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _fields(theme, HoronInputSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _fields(theme, HoronInputSurface.glass),
          ),
          Text(
            'Figma `Textarea field`(60:466)입니다. 라벨 줄(오른쪽에 힌트), 120px 상자, '
            '아래 푸터로 이루어집니다. React는 폭을 `w-90`(360)으로 고정하지만, 여기서는 '
            '360까지 늘고 좁은 화면에서는 부모 폭을 따릅니다. 오류가 있으면 테두리와 '
            '푸터가 `text-danger`로 바뀌고, 카운터는 `현재 / 최대`로 갱신됩니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 필드 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _fields(HoronThemeData theme, HoronInputSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Cell(
          label: '도움말',
          child: HoronTextareaField(
            label: '메모',
            hint: 'Optional',
            surface: surface,
            description: '팀에게 공유할 내용을 적어 주세요.',
          ),
        ),
        _Cell(
          label: '글자 수',
          child: HoronTextareaField(
            label: '메모',
            maxLength: 120,
            surface: surface,
            description: '팀에게 공유할 내용을 적어 주세요.',
          ),
        ),
        _Cell(
          label: '오류 (도움말 자리를 대신합니다)',
          child: HoronTextareaField(
            label: '메모',
            description: '도움말',
            error: '필수 항목입니다.',
            maxLength: 120,
            surface: surface,
          ),
        ),
        _Cell(
          label: 'Disabled (60%)',
          child: HoronTextareaField(
            label: '메모',
            description: '도움말',
            disabled: true,
            surface: surface,
          ),
        ),
      ],
    );
  }
}

/// 필드 하나를 캡션과 함께 보여 주는 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 320,
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
