import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `date_field`의 갤러리 섹션입니다.
///
/// 빈 필드, 값이 있는 필드, 잘못된 값, 비활성 필드를 세로로 보여 줍니다.
class HoronDateFieldGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronDateFieldGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text('빈 필드', style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          SizedBox(height: theme.space.s2),
          const HoronDateField(placeholder: '날짜 선택'),
          SizedBox(height: theme.space.s4),
          Text('값이 있는 필드', style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          SizedBox(height: theme.space.s2),
          HoronDateField(
            value: DateTime(2026, 10, 29),
            formatDate: (DateTime date) =>
                '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}',
            onValueChange: (_) {},
          ),
          SizedBox(height: theme.space.s4),
          Text('잘못된 값', style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          SizedBox(height: theme.space.s2),
          const HoronDateField(placeholder: '날짜 선택', invalid: true),
          SizedBox(height: theme.space.s4),
          Text('비활성', style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          SizedBox(height: theme.space.s2),
          const HoronDateField(placeholder: '날짜 선택', disabled: true),
        ],
      ),
    );
  }
}
