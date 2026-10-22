import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/calendar.dart';
import 'package:horon_ui/src/components/date_picker.dart';

import '../section_scaffold.dart';

/// `date_picker` 갤러리 섹션입니다.
///
/// React `date-picker.tsx`에는 cva 변형이 없으므로 나열할 변형은 두 선택기(단일·범위)와
/// 아이콘 유무이고, 상태는 기본·값 있음·비활성 셋입니다.
///
/// 아이콘은 갤러리 앱의 자산을 씁니다. 패키지는 아이콘 폰트를 들고 있지 않으므로
/// 호스트가 넘깁니다(`icon_slot.dart`의 계약).
class HoronDatePickerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDatePickerGallerySection({super.key});

  /// 갤러리가 오늘로 강조할 날짜입니다.
  static final DateTime today = DateTime(2026, 10, 15);

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Date Picker',
      variants: <Widget>[
        _PickerCell(
          label: 'Single',
          child: HoronDatePicker(
            placeholder: 'Pick a date',
            icon: const Icon(Icons.calendar_today),
            today: today,
            initialMonth: today,
          ),
        ),
        _PickerCell(
          label: 'Single with value',
          child: HoronDatePicker(
            value: DateTime(2026, 10, 8),
            placeholder: 'Pick a date',
            icon: const Icon(Icons.calendar_today),
            today: today,
          ),
        ),
        _PickerCell(
          label: 'Range',
          child: HoronDateRangePicker(
            placeholder: 'Pick a date range',
            icon: const Icon(Icons.date_range),
            today: today,
            initialMonth: today,
          ),
        ),
        _PickerCell(
          label: 'Range with value',
          child: HoronDateRangePicker(
            value: HoronDateRange(
              from: DateTime(2026, 10, 5),
              to: DateTime(2026, 10, 12),
            ),
            placeholder: 'Pick a date range',
            icon: const Icon(Icons.date_range),
            today: today,
          ),
        ),
      ],
      states: <Widget>[
        _PickerCell(
          label: 'Default',
          child: HoronDatePicker(
            placeholder: 'Pick a date',
            today: today,
            initialMonth: today,
          ),
        ),
        _PickerCell(
          label: 'Placeholder muted',
          child: HoronDatePicker(
            placeholder: 'No date chosen',
            today: today,
            initialMonth: today,
          ),
        ),
        _PickerCell(
          label: 'Disabled',
          child: HoronDatePicker(
            value: DateTime(2026, 10, 8),
            placeholder: 'Pick a date',
            today: today,
            disabled: true,
          ),
        ),
      ],
      notes:
          '트리거는 `button.tsx`의 outline 변형과 같은 높이 37·반경 12·`px-5`이고, 내용은 왼쪽에 붙습니다(`justify-start`). '
          '값이 없으면 글자가 muted 색입니다. 팝업은 `popover.tsx`의 `glass-strong` 표면에 여백 12를 두고, '
          '아래 자리가 모자라면 트리거 위로 뒤집힙니다. 배치는 todo 18의 공유 위치 유틸이 생기면 그쪽으로 수렴합니다.',
    );
  }
}

/// 한 변형을 이름과 함께 보여 주는 칸입니다.
class _PickerCell extends StatelessWidget {
  const _PickerCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(label, style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: HoronSpace.s1),
        child,
      ],
    );
  }
}
