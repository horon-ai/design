import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `calendar` 갤러리 섹션입니다.
///
/// 날짜 하나를 고르는 달력, 팝오버 변형, 범위 달력, 일부 날짜를 막은 달력을
/// solid와 glass 두 표면에 같은 목록으로 놓습니다. 각 표본은 실제로 눌러 볼 수 있습니다.
class HoronCalendarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCalendarGallerySection({super.key});

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
            child: _calendars(theme, HoronCalendarSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _calendars(theme, HoronCalendarSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 달력 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _calendars(HoronThemeData theme, HoronCalendarSurface surface) {
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s6,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Sample(
          label: '기본',
          child: _SingleCalendar(surface: surface),
        ),
        _Sample(
          label: '팝오버',
          child: _SingleCalendar(popover: true, surface: surface),
        ),
        _Sample(
          label: '범위',
          child: _RangeCalendar(surface: surface),
        ),
        _Sample(
          label: '일부 날짜 막음',
          child: _DisabledCalendar(surface: surface),
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

/// 날짜 하나를 고르는 표본입니다.
class _SingleCalendar extends StatefulWidget {
  const _SingleCalendar({
    this.popover = false,
    this.surface = HoronCalendarSurface.solid,
  });

  final bool popover;
  final HoronCalendarSurface surface;

  @override
  State<_SingleCalendar> createState() => _SingleCalendarState();
}

class _SingleCalendarState extends State<_SingleCalendar> {
  DateTime? _value;

  @override
  Widget build(BuildContext context) {
    return HoronCalendar(
      value: _value,
      onValueChange: (DateTime next) => setState(() => _value = next),
      popover: widget.popover,
      surface: widget.surface,
    );
  }
}

/// 범위를 고르는 표본입니다.
class _RangeCalendar extends StatefulWidget {
  const _RangeCalendar({this.surface = HoronCalendarSurface.solid});

  final HoronCalendarSurface surface;

  @override
  State<_RangeCalendar> createState() => _RangeCalendarState();
}

class _RangeCalendarState extends State<_RangeCalendar> {
  HoronDateRange _range = HoronDateRange(
    start: DateTime(DateTime.now().year, DateTime.now().month, 12),
    end: DateTime(DateTime.now().year, DateTime.now().month, 16),
  );

  @override
  Widget build(BuildContext context) {
    return HoronCalendar(
      range: _range,
      popover: true,
      surface: widget.surface,
      onRangeChange: (HoronDateRange next) => setState(() => _range = next),
    );
  }
}

/// 주말을 막은 표본입니다.
class _DisabledCalendar extends StatelessWidget {
  const _DisabledCalendar({this.surface = HoronCalendarSurface.solid});

  final HoronCalendarSurface surface;

  @override
  Widget build(BuildContext context) {
    return HoronCalendar(
      surface: surface,
      isDateDisabled: (DateTime date) =>
          date.weekday == DateTime.saturday || date.weekday == DateTime.sunday,
    );
  }
}
