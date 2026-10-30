import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `schedule` 갤러리 섹션입니다.
///
/// 시간 고르기 필드의 두 표면(유리·카드 안), 요일 토글, 그리고 그 둘을 담은
/// 루틴 스케줄 카드를 나란히 놓습니다. 각 표본은 실제로 눌러 볼 수 있습니다.
class HoronScheduleGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronScheduleGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: const <Widget>[
          _Sample(label: '유리 필드', child: _TimePicker(glass: true)),
          _Sample(label: '카드 안 필드', child: _TimePicker(glass: false)),
          _Sample(label: '요일', child: _DaysPicker()),
          _Sample(label: '루틴 카드', child: _RoutineCard()),
        ],
      ),
    );
  }
}

/// 변형 이름을 위에 붙인 표본입니다.
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

/// 하루 중 시각을 고르는 표본입니다.
class _TimePicker extends StatefulWidget {
  const _TimePicker({required this.glass});

  final bool glass;

  @override
  State<_TimePicker> createState() => _TimePickerState();
}

class _TimePickerState extends State<_TimePicker> {
  static const List<HoronPickerItem> _items = <HoronPickerItem>[
    HoronPickerItem(value: '06:00', label: Text('06:00')),
    HoronPickerItem(value: '09:00', label: Text('09:00')),
    HoronPickerItem(value: '12:30', label: Text('12:30')),
    HoronPickerItem(value: '18:00', label: Text('18:00')),
    HoronPickerItem(value: '21:30', label: Text('21:30')),
    HoronPickerItem(value: '23:00', label: Text('23:00')),
  ];

  String? _value = '09:00';

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: HoronPickerField(
        items: _items,
        value: _value,
        glass: widget.glass,
        label: 'Time',
        onChanged: (String? next) => setState(() => _value = next),
      ),
    );
  }
}

/// 요일 토글 표본입니다.
class _DaysPicker extends StatefulWidget {
  const _DaysPicker();

  @override
  State<_DaysPicker> createState() => _DaysPickerState();
}

class _DaysPickerState extends State<_DaysPicker> {
  static const List<HoronWeekday> _days = <HoronWeekday>[
    HoronWeekday(value: 'mon', label: 'M', name: 'Monday'),
    HoronWeekday(value: 'tue', label: 'T', name: 'Tuesday'),
    HoronWeekday(value: 'wed', label: 'W', name: 'Wednesday'),
    HoronWeekday(value: 'thu', label: 'T', name: 'Thursday'),
    HoronWeekday(value: 'fri', label: 'F', name: 'Friday'),
    HoronWeekday(value: 'sat', label: 'S', name: 'Saturday'),
    HoronWeekday(value: 'sun', label: 'S', name: 'Sunday'),
  ];

  List<String> _value = const <String>['mon', 'tue', 'wed', 'thu', 'fri'];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: HoronWeekdayPicker(
        days: _days,
        value: _value,
        label: 'Days',
        onChanged: (List<String> next) => setState(() => _value = next),
      ),
    );
  }
}

/// 루틴 스케줄 카드 표본입니다.
class _RoutineCard extends StatelessWidget {
  const _RoutineCard();

  @override
  Widget build(BuildContext context) {
    return const HoronScheduleCard(
      title: Text('Morning digest'),
      nextRun: Text('Tomorrow, 09:00'),
      children: <Widget>[
        HoronScheduleSection(
          label: Text('Repeat'),
          children: <Widget>[_TimePicker(glass: false)],
        ),
        HoronScheduleSection(
          label: Text('Days'),
          children: <Widget>[_DaysPicker()],
        ),
      ],
    );
  }
}
