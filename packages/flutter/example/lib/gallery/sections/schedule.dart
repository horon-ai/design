import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `schedule` 갤러리 섹션입니다.
///
/// 시간 고르기 필드와 루틴 스케줄 카드를 solid와 veil(glass) 두 표면에 같은 목록으로
/// 놓고, 4% 잉크 inset 필드와 요일 토글을 따로 보여 줍니다. 각 표본은 실제로 눌러 볼
/// 수 있습니다.
class HoronScheduleGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronScheduleGallerySection({super.key});

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
            child: _samples(
              theme,
              HoronPickerSurface.solid,
              HoronSurface.solid,
            ),
          ),
          SurfaceGroup(
            label: 'Glass · veil-field',
            glass: true,
            child: _samples(
              theme,
              HoronPickerSurface.glass,
              HoronSurface.glass,
            ),
          ),
          _Sample(label: '요일', child: const _DaysPicker()),
          Text(
            '시간 필드를 누르면 목록이 8px 아래에 열리고, 지금 값(없으면 첫 줄)에 포커스와 '
            '강조가 놓입니다. 그래서 Enter가 그 값을 바로 고르고, Tab은 다음 줄로 옮깁니다. '
            '고른 줄의 체크는 0.6배에서 커지며 나타납니다(React `animate-pop-in`).',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _samples(
    HoronThemeData theme,
    HoronPickerSurface picker,
    HoronSurface card,
  ) {
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s6,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Sample(
          label: '시간 필드',
          child: _TimePicker(surface: picker),
        ),
        _Sample(
          label: 'Inset 필드 (4% 잉크)',
          child: _TimePicker(surface: HoronPickerSurface.inset),
        ),
        _Sample(
          label: '루틴 카드',
          child: _RoutineCard(surface: card),
        ),
      ],
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
  const _TimePicker({required this.surface});

  final HoronPickerSurface surface;

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
        surface: widget.surface,
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
  const _RoutineCard({this.surface = HoronSurface.solid});

  final HoronSurface surface;

  @override
  Widget build(BuildContext context) {
    return HoronScheduleCard(
      surface: surface,
      title: const Text('Morning digest'),
      nextRun: const Text('Tomorrow, 09:00'),
      children: <Widget>[
        HoronScheduleSection(
          label: const Text('Repeat'),
          children: <Widget>[
            _TimePicker(
              surface: surface == HoronSurface.glass
                  ? HoronPickerSurface.glass
                  : HoronPickerSurface.solid,
            ),
          ],
        ),
        const HoronScheduleSection(
          label: Text('Days'),
          children: <Widget>[_DaysPicker()],
        ),
      ],
    );
  }
}
