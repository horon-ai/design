import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `calendar` 갤러리 섹션입니다.
///
/// 날짜 하나를 고르는 달력, 팝오버 변형, 범위 달력, 일부 날짜를 막은 달력을
/// 나란히 놓습니다. 각 표본은 실제로 눌러 볼 수 있습니다.
class HoronCalendarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCalendarGallerySection({super.key});

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
          const _Sample(label: '기본', child: _SingleCalendar()),
          const _Sample(label: '팝오버', child: _SingleCalendar(popover: true)),
          const _Sample(label: '범위', child: _RangeCalendar()),
          const _Sample(label: '일부 날짜 막음', child: _DisabledCalendar()),
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

/// 날짜 하나를 고르는 표본입니다.
class _SingleCalendar extends StatefulWidget {
  const _SingleCalendar({this.popover = false});

  final bool popover;

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
    );
  }
}

/// 범위를 고르는 표본입니다.
class _RangeCalendar extends StatefulWidget {
  const _RangeCalendar();

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
      onRangeChange: (HoronDateRange next) => setState(() => _range = next),
    );
  }
}

/// 주말을 막은 표본입니다.
class _DisabledCalendar extends StatelessWidget {
  const _DisabledCalendar();

  @override
  Widget build(BuildContext context) {
    return HoronCalendar(
      isDateDisabled: (DateTime date) =>
          date.weekday == DateTime.saturday || date.weekday == DateTime.sunday,
    );
  }
}
