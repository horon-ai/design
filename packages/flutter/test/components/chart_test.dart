import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/chart.dart';
import 'package:horon_ui/horon_ui.dart';

/// [HoronChartContainer]를 horon 테마 아래에 띄웁니다.
Future<void> pumpChart(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 640,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  );
  // fl_chart는 `ImplicitlyAnimatedWidget`이라 첫 프레임에서 데이터를 보간합니다.
  await tester.pumpAndSettle();
}

/// 다섯 계열짜리 설정입니다.
HoronChartConfig fiveSeriesConfig() => HoronChartConfig.labelled(<String, String>{
  'one': 'One',
  'two': 'Two',
  'three': 'Three',
  'four': 'Four',
  'five': 'Five',
});

/// 다섯 계열짜리 데이터입니다.
const List<HoronChartSeries> fiveSeries = <HoronChartSeries>[
  HoronChartSeries(key: 'one', values: <double?>[10, 20, 30]),
  HoronChartSeries(key: 'two', values: <double?>[20, 30, 40]),
  HoronChartSeries(key: 'three', values: <double?>[30, 40, 50]),
  HoronChartSeries(key: 'four', values: <double?>[40, 50, 60]),
  HoronChartSeries(key: 'five', values: <double?>[50, 60, 70]),
];

/// 그려진 `LineChart`의 데이터입니다.
LineChartData chartData(WidgetTester tester) => tester.widget<LineChart>(find.byType(LineChart)).data;

/// 범례 색 견본의 색을 위에서 아래, 왼쪽에서 오른쪽 순서로 돌려줍니다.
List<Color> legendColors(WidgetTester tester) {
  final Iterable<Element> elements = find
      .descendant(of: find.byType(HoronChartLegend), matching: find.byType(DecoratedBox))
      .evaluate();
  return <Color>[
    for (final Element element in elements) ((element.widget as DecoratedBox).decoration as BoxDecoration).color!,
  ];
}

void main() {
  testWidgets('chart: five series draw five distinct theme colours', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(config: fiveSeriesConfig(), series: fiveSeries, xLabels: const <String>['A', 'B', 'C']),
    );

    final LineChartData data = chartData(tester);
    expect(data.lineBarsData.length, 5);
    final List<Color> lineColors = <Color>[for (final LineChartBarData bar in data.lineBarsData) bar.color!];
    expect(lineColors.toSet().length, 5, reason: 'five series must not share a colour: $lineColors');
    expect(lineColors, <Color>[
      HoronLightColors.chart1,
      HoronLightColors.chart2,
      HoronLightColors.chart3,
      HoronLightColors.chart4,
      HoronLightColors.chart5,
    ]);
  });

  testWidgets('chart: dark brightness draws the dark chart slots', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(config: fiveSeriesConfig(), series: fiveSeries),
      brightness: Brightness.dark,
    );

    final List<Color> lineColors = <Color>[
      for (final LineChartBarData bar in chartData(tester).lineBarsData) bar.color!,
    ];
    expect(lineColors, <Color>[
      HoronDarkColors.chart1,
      HoronDarkColors.chart2,
      HoronDarkColors.chart3,
      HoronDarkColors.chart4,
      HoronDarkColors.chart5,
    ]);
    expect(lineColors.toSet().length, 5);
  });

  testWidgets('chart: the legend lists one entry per series with its colour', (WidgetTester tester) async {
    await pumpChart(tester, HoronChartContainer(config: fiveSeriesConfig(), series: fiveSeries));

    for (final String label in <String>['One', 'Two', 'Three', 'Four', 'Five']) {
      expect(find.text(label), findsOneWidget);
    }
    expect(legendColors(tester), <Color>[
      HoronLightColors.chart1,
      HoronLightColors.chart2,
      HoronLightColors.chart3,
      HoronLightColors.chart4,
      HoronLightColors.chart5,
    ]);
  });

  testWidgets('chart: a config entry colour overrides the theme slot', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(
        config: const HoronChartConfig(<String, HoronChartConfigEntry>{
          'one': HoronChartConfigEntry(label: 'One', light: HoronLightColors.info, dark: HoronDarkColors.info),
          'two': HoronChartConfigEntry(label: 'Two'),
        }),
        series: const <HoronChartSeries>[
          HoronChartSeries(key: 'one', values: <double?>[1, 2]),
          HoronChartSeries(key: 'two', values: <double?>[2, 3]),
        ],
      ),
    );

    final List<Color> lineColors = <Color>[
      for (final LineChartBarData bar in chartData(tester).lineBarsData) bar.color!,
    ];
    expect(lineColors, <Color>[HoronLightColors.info, HoronLightColors.chart2]);
  });

  testWidgets('chart: the container is 16:9 and the legend sits below the plot', (WidgetTester tester) async {
    await pumpChart(tester, HoronChartContainer(config: fiveSeriesConfig(), series: fiveSeries), width: 320);

    final Size plot = tester.getSize(find.byType(LineChart));
    expect(plot.width, 320);
    expect(plot.height, closeTo(320 * 9 / 16, 0.5));

    final double plotBottom = tester.getRect(find.byType(LineChart)).bottom;
    final double legendTop = tester.getRect(find.byType(HoronChartLegend)).top;
    expect(legendTop, greaterThanOrEqualTo(plotBottom));
  });

  testWidgets('chart: the top legend sits above the plot', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(
        config: fiveSeriesConfig(),
        series: fiveSeries,
        legend: const HoronChartLegend(verticalAlign: HoronChartLegendAlign.top),
      ),
    );

    final double legendBottom = tester.getRect(find.byType(HoronChartLegend)).bottom;
    final double plotTop = tester.getRect(find.byType(LineChart)).top;
    expect(legendBottom, lessThanOrEqualTo(plotTop));
  });

  testWidgets('chart: a null legend draws no legend', (WidgetTester tester) async {
    await pumpChart(tester, HoronChartContainer(config: fiveSeriesConfig(), series: fiveSeries, legend: null));

    expect(find.byType(HoronChartLegend), findsNothing);
    expect(find.text('One'), findsNothing);
  });

  testWidgets('chart: the tooltip names the axis label and each series value', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(
        config: HoronChartConfig.labelled(<String, String>{'desktop': '데스크톱', 'mobile': '모바일'}),
        series: const <HoronChartSeries>[
          HoronChartSeries(key: 'desktop', values: <double?>[186, 305, 237]),
          HoronChartSeries(key: 'mobile', values: <double?>[80, 200, 120]),
        ],
        xLabels: const <String>['1월', '2월', '3월'],
      ),
    );

    final LineTouchTooltipData tooltip = chartData(tester).lineTouchData.touchTooltipData;
    final LineChartBarData desktop = chartData(tester).lineBarsData.first;
    final List<LineBarSpot> spots = <LineBarSpot>[
      LineBarSpot(desktop, 0, desktop.spots[1]),
      LineBarSpot(chartData(tester).lineBarsData[1], 1, chartData(tester).lineBarsData[1].spots[1]),
    ];
    final List<LineTooltipItem> items = tooltip.getTooltipItems(spots).whereType<LineTooltipItem>().toList();

    // fl_chart는 항목 수와 점 수가 같기를 요구합니다. 첫 항목이 x축 이름을 앞줄로 들고,
    // 나머지 항목이 계열마다 이름과 값을 그립니다.
    expect(items.length, 2);
    expect(items.first.text, '2월\n');

    final StringBuffer rendered = StringBuffer();
    for (final LineTooltipItem item in items) {
      rendered.write(item.text);
      for (final TextSpan span in item.children ?? const <TextSpan>[]) {
        rendered.write(span.text ?? '');
      }
      rendered.write('|');
    }
    final String text = rendered.toString();
    expect(text, contains('데스크톱'));
    expect(text, contains('모바일'));
    expect(text, contains('305'));
    expect(text, contains('200'));
  });

  testWidgets('chart: hideLabel and hideIndicator remove their parts', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(
        config: HoronChartConfig.labelled(<String, String>{'one': 'One'}),
        series: const <HoronChartSeries>[
          HoronChartSeries(key: 'one', values: <double?>[1, 2]),
        ],
        xLabels: const <String>['A', 'B'],
        tooltip: const HoronChartTooltip(hideLabel: true, hideIndicator: true),
      ),
    );

    final LineChartBarData bar = chartData(tester).lineBarsData.first;
    final List<LineTooltipItem> items = chartData(tester).lineTouchData.touchTooltipData
        .getTooltipItems(<LineBarSpot>[LineBarSpot(bar, 0, bar.spots.first)])
        .whereType<LineTooltipItem>()
        .toList();

    expect(items.length, 1, reason: 'one item per touched spot');
    expect(items.single.text, isEmpty, reason: 'the label line is hidden');
    final List<TextSpan> spans = items.single.children!;
    expect(spans.first.text, 'One  ', reason: 'the indicator glyph is hidden');
  });

  testWidgets('chart: a legend outside a container throws', (WidgetTester tester) async {
    await pumpChart(tester, const HoronChartLegend());
    expect(tester.takeException(), isStateError);
  });

  testWidgets('chart: light and dark use their own axis and grid colours', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpChart(
        tester,
        HoronChartContainer(key: ValueKey<Brightness>(brightness), config: fiveSeriesConfig(), series: fiveSeries),
        brightness: brightness,
      );

      final LineChartData data = chartData(tester);
      final bool isDark = brightness == Brightness.dark;
      final Color expectedGrid = isDark ? HoronDarkColors.border : HoronLightColors.border;
      expect(data.gridData.getDrawingHorizontalLine(10).color, expectedGrid);

      final Widget leftTitle = data.titlesData.leftTitles.sideTitles.getTitlesWidget(10, _meta(data));
      expect(leftTitle, isA<SideTitleWidget>());
      final Text label = (leftTitle as SideTitleWidget).child as Text;
      expect(label.style?.color, isDark ? HoronDarkColors.mutedForeground : HoronLightColors.mutedForeground);
    }
  });

  testWidgets('chart: axis labels come from xLabels and skip past the end', (WidgetTester tester) async {
    await pumpChart(
      tester,
      HoronChartContainer(
        config: HoronChartConfig.labelled(<String, String>{'one': 'One'}),
        series: const <HoronChartSeries>[
          HoronChartSeries(key: 'one', values: <double?>[1, 2]),
        ],
        xLabels: const <String>['A', 'B'],
      ),
    );

    final SideTitles bottom = chartData(tester).titlesData.bottomTitles.sideTitles;
    final Text first = (bottom.getTitlesWidget(0, _meta(chartData(tester))) as SideTitleWidget).child as Text;
    expect(first.data, 'A');
    // 이름 목록 밖의 자리는 숫자로 떨어집니다.
    final Text beyond = (bottom.getTitlesWidget(9, _meta(chartData(tester))) as SideTitleWidget).child as Text;
    expect(beyond.data, '9');
  });

  test('chart: values are grouped with commas and trimmed', () {
    expect(HoronChartTooltip.formatValue(0), '0');
    expect(HoronChartTooltip.formatValue(1234), '1,234');
    expect(HoronChartTooltip.formatValue(1234567), '1,234,567');
    expect(HoronChartTooltip.formatValue(12.5), '12.5');
    expect(HoronChartTooltip.formatValue(12.50), '12.5');
    expect(HoronChartTooltip.formatValue(-1234.25), '-1,234.25');
  });
}

/// 축 이름을 만들 때 `fl_chart`가 넘기는 값을 흉내 냅니다.
TitleMeta _meta(LineChartData data) => TitleMeta(
  min: data.minY,
  max: data.maxY,
  parentAxisSize: 300,
  axisPosition: 0,
  appliedInterval: 1,
  sideTitles: const SideTitles(showTitles: true),
  formattedValue: '',
  axisSide: AxisSide.left,
  rotationQuarterTurns: 0,
);
