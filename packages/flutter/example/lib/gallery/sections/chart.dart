import 'package:flutter/material.dart';
import 'package:horon_ui/chart.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// 다섯 계열짜리 설정입니다.
const HoronChartConfig _fiveSeriesConfig = HoronChartConfig(
  <String, HoronChartConfigEntry>{
    'desktop': HoronChartConfigEntry(label: '데스크톱'),
    'mobile': HoronChartConfigEntry(label: '모바일'),
    'tablet': HoronChartConfigEntry(label: '태블릿'),
    'watch': HoronChartConfigEntry(label: '워치'),
    'other': HoronChartConfigEntry(label: '기타'),
  },
);

/// 다섯 계열짜리 값입니다.
const List<HoronChartSeries> _fiveSeries = <HoronChartSeries>[
  HoronChartSeries(
    key: 'desktop',
    values: <double?>[186, 305, 237, 273, 209, 214],
  ),
  HoronChartSeries(
    key: 'mobile',
    values: <double?>[80, 200, 120, 190, 130, 140],
  ),
  HoronChartSeries(
    key: 'tablet',
    values: <double?>[120, 90, 150, 120, 180, 130],
  ),
  HoronChartSeries(key: 'watch', values: <double?>[40, 60, 50, 80, 60, 90]),
  HoronChartSeries(key: 'other', values: <double?>[20, 30, 25, 40, 35, 45]),
];

const List<String> _months = <String>['1월', '2월', '3월', '4월', '5월', '6월'];

/// 두 계열짜리 값입니다.
const List<HoronChartSeries> _twoSeries = <HoronChartSeries>[
  HoronChartSeries(
    key: 'desktop',
    values: <double?>[186, 305, 237],
    area: true,
  ),
  HoronChartSeries(key: 'mobile', values: <double?>[80, 200, 120], area: true),
];

/// `chart` 갤러리 섹션입니다.
///
/// React `chart.tsx`에는 cva 변형이 없습니다. 그래서 변형 칸에는 계열 수와 범례 자리를,
/// 상태 칸에는 툴팁 표시 기호 세 가지와 범례 숨김을 놓습니다. 이 섹션은 차트를
/// `package:horon_ui/chart.dart` 하위 경로로 읽습니다. 배럴에는 차트가 없습니다.
class HoronChartGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronChartGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Chart',
      variants: <Widget>[
        _ChartCell(
          label: 'five series, legend below',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _fiveSeries,
            xLabels: _months,
          ),
        ),
        _ChartCell(
          label: 'two series with area fill',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
          ),
        ),
        _ChartCell(
          label: 'legend on top',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
            legend: HoronChartLegend(verticalAlign: HoronChartLegendAlign.top),
          ),
        ),
        _ChartCell(
          label: 'no legend',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
            legend: null,
          ),
        ),
      ],
      states: <Widget>[
        _ChartCell(
          label: 'tooltip indicator: dot',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
          ),
        ),
        _ChartCell(
          label: 'tooltip indicator: line',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
            tooltip: HoronChartTooltip(indicator: HoronChartIndicator.line),
          ),
        ),
        _ChartCell(
          label: 'tooltip indicator: dashed',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
            tooltip: HoronChartTooltip(indicator: HoronChartIndicator.dashed),
          ),
        ),
        _ChartCell(
          label: 'label hidden, indicator hidden',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
            tooltip: HoronChartTooltip(hideLabel: true, hideIndicator: true),
          ),
        ),
        _ChartCell(
          label: 'pinned y range',
          child: const HoronChartContainer(
            config: _fiveSeriesConfig,
            series: _twoSeries,
            xLabels: <String>['1월', '2월', '3월'],
            minY: 0,
            maxY: 400,
          ),
        ),
      ],
      notes:
          'React `chart.tsx`는 recharts의 `ChartContainer`·`ChartTooltip`·`ChartLegend`입니다. '
          'Flutter 판은 그림·축·격자·툴팁을 `fl_chart`의 `LineChart`가 그리고, 범례만 이 패키지가 '
          '색 견본과 이름으로 그립니다(`fl_chart` 1.3.0에는 범례가 없습니다). 색은 설정 순서대로 '
          '테마의 `chart1`..`chart5`가 붙고, 밝기를 바꾸면 그 밝기의 다섯 색으로 다시 칠합니다. '
          '이 컴포넌트는 `package:horon_ui/chart.dart` 하위 경로로만 열립니다.',
    );
  }
}

/// 차트 하나를 이름과 함께 보여 주는 칸입니다.
class _ChartCell extends StatelessWidget {
  const _ChartCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 460,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          child,
        ],
      ),
    );
  }
}
