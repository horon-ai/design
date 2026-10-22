import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/calendar.dart';

import '../section_scaffold.dart';

/// `calendar` 갤러리 섹션입니다.
///
/// React `calendar.tsx`에는 cva 변형이 없으므로 나열할 변형은 선택 방식(단일·범위)과
/// 달 수이고, 상태는 오늘 강조·이웃 달 표시·선택 셋입니다.
///
/// 실행 날짜에 흔들리지 않도록 오늘은 2026-10-15로 고정합니다.
class HoronCalendarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCalendarGallerySection({super.key});

  /// 갤러리가 오늘로 강조할 날짜입니다.
  static final DateTime today = DateTime(2026, 10, 15);

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Calendar',
      variants: <Widget>[
        _CalendarCell(
          label: 'Single',
          child: HoronCalendar(
            initialMonth: today,
            today: today,
            selected: DateTime(2026, 10, 8),
          ),
        ),
        _CalendarCell(
          label: 'Range',
          child: HoronCalendar.range(
            initialMonth: today,
            today: today,
            range: HoronDateRange(
              from: DateTime(2026, 10, 5),
              to: DateTime(2026, 10, 12),
            ),
          ),
        ),
        _CalendarCell(
          label: 'Two months',
          child: HoronCalendar.range(
            initialMonth: today,
            today: today,
            months: 2,
            range: HoronDateRange(
              from: DateTime(2026, 10, 20),
              to: DateTime(2026, 11, 4),
            ),
          ),
        ),
      ],
      states: <Widget>[
        _CalendarCell(
          label: 'Today',
          child: HoronCalendar(initialMonth: today, today: today),
        ),
        _CalendarCell(
          label: 'Sunday start',
          child: HoronCalendar(
            initialMonth: today,
            today: today,
            firstDayOfWeek: DateTime.sunday,
          ),
        ),
        _CalendarCell(
          label: 'Outside days hidden',
          child: HoronCalendar(
            initialMonth: today,
            today: today,
            showOutsideDays: false,
          ),
        ),
        _CalendarCell(
          label: 'Selected',
          child: HoronCalendar(
            initialMonth: today,
            today: today,
            selected: DateTime(2026, 10, 22),
          ),
        ),
      ],
      notes:
          '한 칸은 `--cell-size` 32, 달력 표면은 카드 색과 반경 12(`rounded-md`), 안쪽 여백은 12(`p-3`)입니다. '
          '선택한 날은 primary, 오늘은 accent 배경입니다. 범위는 시작·끝이 primary이고 사이가 accent이며 '
          '시작 칸은 왼쪽, 끝 칸은 오른쪽 모서리만 둥급니다.',
    );
  }
}

/// 한 변형을 이름과 함께 보여 주는 칸입니다.
class _CalendarCell extends StatelessWidget {
  const _CalendarCell({required this.label, required this.child});

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
