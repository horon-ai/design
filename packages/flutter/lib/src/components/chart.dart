import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `chart.tsx`의 `text-xs`입니다. 축 이름·툴팁·범례가 모두 이 크기를 씁니다.
const double _chartFontSize = HoronText.caption;

/// `chart.tsx`의 `gap-1.5`입니다. 범례 항목 안, 툴팁 항목 안의 간격입니다.
const double _chartItemGap = HoronSpace.s1_5;

/// `chart.tsx`의 `gap-4`입니다. 범례 항목 사이 간격입니다.
const double _chartLegendGap = HoronSpace.s4;

/// `chart.tsx`의 `pt-3`/`pb-3`입니다. 범례와 그림 사이 간격입니다.
const double _chartLegendInset = HoronSpace.s3;

/// `chart.tsx`의 `size-2`입니다. 범례 표시의 한 변입니다.
const double _chartLegendIndicatorSize = HoronSpace.s2;

/// `chart.tsx`의 `[&>svg]:size-3`입니다. 범례 아이콘의 한 변입니다.
const double _chartLegendIconSize = HoronSpace.s3;

/// `chart.tsx`의 `px-2.5`입니다. 툴팁 좌우 여백입니다.
const double _chartTooltipPaddingHorizontal = HoronSpace.s2_5;

/// `chart.tsx`의 `py-1.5`입니다. 툴팁 위아래 여백입니다.
const double _chartTooltipPaddingVertical = HoronSpace.s1_5;

/// `chart.tsx`의 `size-2.5`입니다. 툴팁 점 표시의 한 변입니다.
const double _chartTooltipDotSize = HoronSpace.s2_5;

/// 축 이름이 쓰는 자리입니다(`reservedSize`).
const double _chartAxisReservedSize = HoronSpace.s9;

/// 축 이름과 그림 사이 간격입니다.
const double _chartAxisGap = HoronSpace.s1;

/// `[&_.recharts-cartesian-grid-line]:stroke-border`가 그리는 선 두께입니다.
const double _chartGridWidth = 1.0;

/// recharts 선의 기본 `strokeWidth`입니다.
const double _chartLineWidth = 2.0;

/// `chart.tsx`의 기본 종횡비입니다(`aspect-video`, 16 대 9).
const double _chartAspectRatio = 16 / 9;

/// recharts `Area`가 선 아래를 칠하는 불투명도입니다.
///
/// React 소비자가 `fillOpacity`를 적지 않으면 recharts 기본값 0.6을 씁니다. 이 패키지는
/// 계열 색 하나로 칠하므로, 0.6으로 칠하면 라이트에서 거의 검은 띠가 되어 격자와 다른
/// 계열을 가립니다(측정: 0.16에서도 회색 띠가 두 계열을 한 덩어리로 보이게 했습니다).
const double _chartAreaOpacity = 0.1;

/// 테마의 차트 색 다섯 자리를 순서대로 돌려주는 표입니다.
///
/// `chart.tsx`는 `--color-<key>`를 소비자가 직접 적습니다. Flutter에는 그 자리가 없어
/// 설정에 색이 없을 때 이 다섯 색을 계열 순서대로 붙입니다. 그래서 다섯 계열이 서로 다른
/// 색을 쓰고, 밝기를 바꾸면 같은 계열이 그 밝기의 색으로 다시 칠해집니다.
List<Color> _chartPalette(HoronThemeData horon) => <Color>[
  horon.chart1,
  horon.chart2,
  horon.chart3,
  horon.chart4,
  horon.chart5,
];

/// 툴팁의 표시 기호 종류입니다. React의 `indicator: "line" | "dot" | "dashed"`입니다.
///
/// React에는 이 이름들이 cva 변형이 아니라 타입 별칭으로만 있으므로, 여기서도 공개
/// enum을 두지 않고 이름 붙은 상수로 엽니다.
class HoronChartIndicator {
  const HoronChartIndicator._(this.name);

  /// 채운 점입니다(`size-2.5`).
  static const HoronChartIndicator dot = HoronChartIndicator._('dot');

  /// 세로 막대입니다(`w-1`).
  static const HoronChartIndicator line = HoronChartIndicator._('line');

  /// 점선입니다(`border-[1.5px] border-dashed`).
  static const HoronChartIndicator dashed = HoronChartIndicator._('dashed');

  /// React의 이름입니다.
  final String name;
}

/// 범례가 그림에 대해 놓이는 자리입니다. React `ChartLegendContent`의
/// `verticalAlign`입니다.
class HoronChartLegendAlign {
  const HoronChartLegendAlign._(this.name);

  /// 그림 위입니다(`pb-3`).
  static const HoronChartLegendAlign top = HoronChartLegendAlign._('top');

  /// 그림 아래입니다(`pt-3`). React의 기본값입니다.
  static const HoronChartLegendAlign bottom = HoronChartLegendAlign._('bottom');

  /// 그림과 같은 줄 가운데입니다.
  static const HoronChartLegendAlign middle = HoronChartLegendAlign._('middle');

  /// React의 이름입니다.
  final String name;
}

/// `chart.tsx`의 `ChartConfig` 한 항목입니다.
///
/// React는 항목마다 `label`·`icon`과 색을 받고, 색은 `color` 하나이거나
/// `theme: { light, dark }` 두 값입니다. Flutter에는 CSS 변수가 없으므로 밝기별 색을
/// 그대로 들고 있다가 [resolve]에서 고릅니다.
///
/// 색을 주지 않으면 [HoronChartConfig.colorOf]가 테마의 `chart1`..`chart5`를 표의 순서대로
/// 붙입니다.
class HoronChartConfigEntry {
  /// 항목 하나를 만듭니다.
  const HoronChartConfigEntry({required this.label, this.icon, this.color, this.light, this.dark})
    : assert(color == null || (light == null && dark == null), 'Give either color or the light/dark pair, not both.');

  /// 범례와 툴팁이 보여 줄 이름입니다.
  final String label;

  /// 이름 앞에 놓는 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 밝기와 무관한 색입니다.
  final Color? color;

  /// 라이트 밝기의 색입니다.
  final Color? light;

  /// 다크 밝기의 색입니다.
  final Color? dark;

  /// [brightness]에서 이 항목이 그리는 색입니다.
  ///
  /// React의 `ChartStyle`과 같은 우선순위입니다. 밝기별 색이 있으면 그것을, 없으면
  /// [color]를 씁니다. 둘 다 없으면 [fallback]입니다.
  Color resolve(Brightness brightness, Color fallback) {
    final Color? themed = brightness == Brightness.dark ? dark : light;
    return themed ?? color ?? fallback;
  }
}

/// `chart.tsx`의 `ChartConfig`입니다. 계열 키에서 항목으로 가는 표입니다.
class HoronChartConfig {
  /// 항목 표를 받아 만듭니다. 삽입 순서가 차트 색 순서입니다.
  const HoronChartConfig(this.entries);

  /// 계열 키와 이름만으로 만드는 설정입니다. 색은 테마의 차트 색이 순서대로 붙습니다.
  factory HoronChartConfig.labelled(Map<String, String> labels) => HoronChartConfig(<String, HoronChartConfigEntry>{
    for (final MapEntry<String, String> entry in labels.entries) entry.key: HoronChartConfigEntry(label: entry.value),
  });

  /// 키가 항목인 표입니다.
  final Map<String, HoronChartConfigEntry> entries;

  /// [key]의 항목입니다. 없으면 null입니다.
  HoronChartConfigEntry? operator [](String key) => entries[key];

  /// [key]가 그리는 색입니다.
  ///
  /// 항목이 색을 들고 있으면 그 색이 이기고, 없으면 테마의 차트 색 다섯 개를 항목 순서대로
  /// 돌려 씁니다. 여섯 번째부터는 다섯 색을 다시 씁니다.
  Color colorOf(String key, HoronThemeData horon, Brightness brightness) {
    final List<Color> palette = _chartPalette(horon);
    final int index = entries.keys.toList().indexOf(key);
    final Color fallback = palette[(index < 0 ? 0 : index) % palette.length];
    return entries[key]?.resolve(brightness, fallback) ?? fallback;
  }
}

/// 그림 하나의 계열입니다. recharts의 `dataKey` 하나에 해당합니다.
class HoronChartSeries {
  /// 계열 하나를 만듭니다.
  const HoronChartSeries({required this.key, required this.values, this.area = false});

  /// 설정에서 색과 이름을 찾는 키입니다. React의 `dataKey` 자리입니다.
  final String key;

  /// x축 눈금마다의 값입니다. null인 자리는 선이 끊기지 않고 건너뜁니다.
  final List<double?> values;

  /// 선 아래를 옅게 칠할지 여부입니다. recharts의 `Area`에 해당합니다.
  final bool area;
}

/// `chart.tsx`의 `ChartContainer`입니다.
///
/// recharts의 `ResponsiveContainer`와 `ChartStyle`이 하던 일을 이 위젯이 합니다. 그림은
/// `fl_chart`의 `LineChart`가 그리고, 축 이름·격자·툴팁도 `fl_chart`가 그립니다. React가
/// CSS 선택자로 칠하던 색(`fill-muted-foreground`, `stroke-border`)은 [HoronTheme]의
/// 슬롯으로 옮겼습니다.
///
/// 설정([config])은 [HoronChartScope]로 자식에게 내려갑니다. [HoronChartLegend]는 그 값을
/// 읽으므로 반드시 이 안에 있어야 하고, 밖에서 쓰면 React의 `useChart`처럼 [StateError]를
/// 던집니다.
///
/// `fl_chart` 1.3.0에는 범례 위젯이 없습니다. 그래서 범례만 [HoronChartLegend]가 일반
/// 위젯으로 그립니다(색 견본 + 이름). 그림·축·툴팁은 전부 `fl_chart`가 그리므로 이 파일은
/// 차트를 `CustomPainter`로 다시 그리지 않습니다.
///
/// ```dart
/// HoronChartContainer(
///   config: HoronChartConfig.labelled(<String, String>{'desktop': '데스크톱', 'mobile': '모바일'}),
///   series: const <HoronChartSeries>[
///     HoronChartSeries(key: 'desktop', values: <double?>[186, 305, 237]),
///     HoronChartSeries(key: 'mobile', values: <double?>[80, 200, 120]),
///   ],
///   xLabels: const <String>['1월', '2월', '3월'],
/// );
/// ```
class HoronChartContainer extends StatelessWidget {
  /// 차트 상자 하나를 만듭니다.
  const HoronChartContainer({
    super.key,
    required this.config,
    required this.series,
    this.xLabels = const <String>[],
    this.tooltip = const HoronChartTooltip(),
    this.legend = const HoronChartLegend(),
    this.aspectRatio = _chartAspectRatio,
    this.minY,
    this.maxY,
    this.semanticLabel,
  });

  /// 설정입니다.
  final HoronChartConfig config;

  /// 그릴 계열입니다.
  final List<HoronChartSeries> series;

  /// x축 눈금 이름입니다. 비어 있으면 눈금 숫자를 그립니다.
  final List<String> xLabels;

  /// 툴팁 설정입니다.
  final HoronChartTooltip tooltip;

  /// 범례입니다. null이면 범례를 그리지 않습니다.
  final Widget? legend;

  /// 그림의 가로 세로 비율입니다. React의 `aspect-video`와 같은 16:9가 기본입니다.
  final double aspectRatio;

  /// y축 최솟값입니다. 없으면 `fl_chart`가 값에서 고릅니다.
  final double? minY;

  /// y축 최댓값입니다. 없으면 `fl_chart`가 값에서 고릅니다.
  final double? maxY;

  /// 그림의 접근성 이름입니다.
  final String? semanticLabel;

  /// [context]의 차트 스코프를 읽습니다.
  ///
  /// [HoronChartLegend]가 쓰는 통로입니다. [HoronChartContainer] 밖이면 [StateError]를
  /// 던집니다. React의 `useChart`가 `ChartContext` 밖에서 던지는 것과 같은 이유입니다.
  /// 조용히 기본값으로 떨어지면 범례가 엉뚱한 색을 칠하고도 화면이 그려집니다.
  static HoronChartScope of(BuildContext context) {
    final HoronChartScope? scope = context.dependOnInheritedWidgetOfExactType<HoronChartScope>();
    if (scope == null) {
      throw StateError(
        'No HoronChartScope in the widget tree. Put this widget inside a '
        'HoronChartContainer so it can read the chart config.',
      );
    }
    return scope;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final HoronThemeData horon = HoronTheme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    // React는 범례를 소비자가 children으로 넣고, recharts가 `verticalAlign`에 따라 위나
    // 아래에 붙입니다. Flutter 쪽은 그 자리를 [legend] 슬롯으로 받고, 같은 규칙을
    // 여기서 적용합니다.
    final Widget? legendWidget = legend;
    final bool legendOnTop = legendWidget is HoronChartLegend && legendWidget.verticalAlign.name == 'top';

    final List<Widget> children = <Widget>[];
    if (legendWidget != null && legendOnTop) children.add(legendWidget);
    final (double low, double high, double step) = _yDomain();
    children.add(
      AspectRatio(
        aspectRatio: aspectRatio,
        child: LineChart(
          LineChartData(
            minY: low,
            maxY: high,
            lineBarsData: <LineChartBarData>[
              for (final HoronChartSeries line in series) _barData(line, horon, theme.brightness),
            ],
            titlesData: _titlesData(context, scheme, step),
            gridData: FlGridData(
              drawVerticalLine: false,
              horizontalInterval: step,
              getDrawingHorizontalLine: (double value) => FlLine(color: scheme.outline, strokeWidth: _chartGridWidth),
            ),
            borderData: FlBorderData(show: false),
            lineTouchData: tooltip.touchData(context, config: config, series: series, xLabels: xLabels),
          ),
          duration: const Duration(milliseconds: HoronDuration.normal),
        ),
      ),
    );
    if (legendWidget != null && !legendOnTop) children.add(legendWidget);

    return HoronChartScope(
      config: config,
      series: series,
      brightness: theme.brightness,
      child: Semantics(
        container: true,
        label: semanticLabel,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: children,
        ),
      ),
    );
  }

  LineChartBarData _barData(HoronChartSeries line, HoronThemeData horon, Brightness brightness) {
    final Color color = config.colorOf(line.key, horon, brightness);
    return LineChartBarData(
      spots: <FlSpot>[
        for (int index = 0; index < line.values.length; index++)
          if (line.values[index] != null) FlSpot(index.toDouble(), line.values[index]!),
      ],
      color: color,
      barWidth: _chartLineWidth,
      isStrokeCapRound: true,
      dotData: const FlDotData(show: false),
      belowBarData: BarAreaData(
        show: line.area,
        color: color.withValues(alpha: _chartAreaOpacity),
      ),
    );
  }

  /// y축 범위와 눈금 간격입니다.
  ///
  /// recharts처럼 0을 바닥에 두고, 값이 음수면 음수 쪽도 담습니다. 눈금은 1·2·5 눈금의
  /// "둥근" 간격으로 골라 최대 여섯 칸이 되게 합니다. 범위를 간격의 배수로 맞춰 두므로
  /// 최솟값·최댓값 라벨이 따로 붙지 않고, 그래서 눈금 글자가 겹치지 않습니다(측정: 범위를
  /// 그대로 두었을 때 라이트 렌더의 y축 꼭대기에 `300`과 `305`가 겹쳐 찍혔습니다).
  ///
  /// [minY]·[maxY]를 주면 그 값이 범위를 정하고, 간격은 그 범위에서 다시 고릅니다.
  (double, double, double) _yDomain() {
    double low = 0;
    double high = 0;
    bool seen = false;
    for (final HoronChartSeries line in series) {
      for (final double? value in line.values) {
        if (value == null) continue;
        if (!seen) {
          low = value;
          high = value;
          seen = true;
          continue;
        }
        if (value < low) low = value;
        if (value > high) high = value;
      }
    }
    if (!seen) {
      low = 0;
      high = 1;
    }
    if (low > 0) low = 0;
    if (high < 0) high = 0;
    low = minY ?? low;
    high = maxY ?? high;
    if (high <= low) high = low + 1;

    // 1·2·5 눈금에서 범위가 여섯 칸 안에 들어가는 가장 작은 간격을 고릅니다.
    final double span = high - low;
    double step = 1;
    for (final double candidate in <double>[1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000]) {
      step = candidate;
      if (span / step <= 6) break;
    }
    if (span / step > 6) step = (span / 6).ceilToDouble();

    final double alignedLow = minY ?? (low / step).floorToDouble() * step;
    final double alignedHigh = maxY ?? (high / step).ceilToDouble() * step;
    return (alignedLow, alignedHigh <= alignedLow ? alignedLow + step : alignedHigh, step);
  }

  /// 축 이름을 horon 모양으로 칠합니다
  /// (`[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground`).
  ///
  /// 위·오른쪽 축은 React와 같이 그리지 않습니다. y축 눈금은 [step] 간격으로 찍습니다.
  FlTitlesData _titlesData(BuildContext context, ColorScheme scheme, double step) {
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _chartFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );

    Widget label(String text, TitleMeta meta) => SideTitleWidget(
      meta: meta,
      space: _chartAxisGap,
      child: Text(text, maxLines: 1, softWrap: false, style: style),
    );

    return FlTitlesData(
      topTitles: const AxisTitles(),
      rightTitles: const AxisTitles(),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: _chartAxisReservedSize,
          interval: step,
          // 최댓값 눈금은 끕니다. 범위가 간격의 배수라 마지막 눈금이 그림 꼭대기와 같은
          // 자리에 오고, 그 이름이 위로 삐져나와 셀 이름과 겹칩니다(측정: 라이트 렌더에서
          // `400`이 라벨 줄을 침범했습니다).
          maxIncluded: false,
          getTitlesWidget: (double value, TitleMeta meta) => label(HoronChartTooltip.formatValue(value), meta),
        ),
      ),
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: _chartAxisReservedSize,
          interval: 1,
          getTitlesWidget: (double value, TitleMeta meta) {
            final int index = value.round();
            final String text = index >= 0 && index < xLabels.length
                ? xLabels[index]
                : HoronChartTooltip.formatValue(value);
            return label(text, meta);
          },
        ),
      ),
    );
  }
}

/// 차트 부품이 설정과 계열을 읽는 통로입니다. React의 `ChartContext`에 해당합니다.
///
/// 직접 만들지 않고 [HoronChartContainer.of]로 읽습니다.
class HoronChartScope extends InheritedWidget {
  /// 스코프 하나를 만듭니다.
  const HoronChartScope({
    super.key,
    required this.config,
    required this.series,
    required this.brightness,
    required super.child,
  });

  /// 컨테이너가 들고 있는 설정입니다.
  final HoronChartConfig config;

  /// 컨테이너가 그리는 계열입니다.
  final List<HoronChartSeries> series;

  /// 지금 밝기입니다. 색을 고를 때 씁니다.
  final Brightness brightness;

  /// [key] 계열의 색입니다.
  Color colorOf(String key, HoronThemeData horon) => config.colorOf(key, horon, brightness);

  @override
  bool updateShouldNotify(HoronChartScope oldWidget) =>
      config != oldWidget.config || series != oldWidget.series || brightness != oldWidget.brightness;
}

/// `chart.tsx`의 `ChartTooltip`입니다.
///
/// recharts의 `Tooltip` 자리를 `fl_chart`의 `LineTouchData`가 대신합니다. 이 객체는 그
/// 설정을 만드는 값 묶음입니다. 상자는 React의 `glass-strong`과 같은
/// [HoronThemeData.glassFillStrong]을 칠하고, 테두리는 [HoronThemeData.glassBorder],
/// 반경은 `rounded-md`입니다.
///
/// 첫 줄에 x축 이름이, 그 아래 계열마다 이름과 값이 들어갑니다. React의
/// `ChartTooltipContent`가 그리는 순서와 같습니다.
class HoronChartTooltip {
  /// 툴팁 설정을 만듭니다.
  const HoronChartTooltip({
    this.indicator = HoronChartIndicator.dot,
    this.hideLabel = false,
    this.hideIndicator = false,
    this.nameKey,
    this.labelKey,
    this.color,
    this.enabled = true,
  });

  /// 표시 기호의 종류입니다.
  final HoronChartIndicator indicator;

  /// 첫 줄의 x축 이름을 감출지 여부입니다.
  final bool hideLabel;

  /// 표시 기호를 감출지 여부입니다.
  final bool hideIndicator;

  /// 계열 이름을 찾을 키입니다. 없으면 계열 키를 씁니다.
  final String? nameKey;

  /// 첫 줄 이름을 덮어쓸 값입니다.
  final String? labelKey;

  /// 표시 기호의 색을 덮어쓸 값입니다.
  final Color? color;

  /// 툴팁을 켤지 여부입니다.
  final bool enabled;

  /// 표시 기호를 글자로 옮긴 것입니다.
  ///
  /// `fl_chart`의 툴팁은 글자만 그리므로 점·막대·점선을 글리프 하나로 대신합니다.
  String get glyph => switch (indicator.name) {
    'line' => '▏',
    'dashed' => '┆',
    _ => '●',
  };

  /// [fl_chart]에 넘길 터치 설정을 만듭니다.
  LineTouchData touchData(
    BuildContext context, {
    required HoronChartConfig config,
    required List<HoronChartSeries> series,
    List<String> xLabels = const <String>[],
  }) {
    final ThemeData theme = Theme.of(context);
    final HoronThemeData horon = HoronTheme.of(context);
    final ColorScheme scheme = theme.colorScheme;

    final TextStyle labelStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _chartFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.snug,
      color: scheme.onSurface,
    );
    final TextStyle itemStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _chartFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.snug,
      color: scheme.onSurfaceVariant,
    );
    final TextStyle valueStyle = itemStyle.copyWith(
      fontWeight: HoronFontWeight.medium,
      color: scheme.onSurface,
      fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
    );

    return LineTouchData(
      enabled: enabled,
      touchTooltipData: LineTouchTooltipData(
        // `glass-strong`
        getTooltipColor: (LineBarSpot spot) => horon.glassFillStrong,
        tooltipBorder: BorderSide(color: horon.glassBorder),
        tooltipBorderRadius: BorderRadius.circular(HoronRadiusRole.card),
        tooltipPadding: const EdgeInsets.symmetric(
          horizontal: _chartTooltipPaddingHorizontal,
          vertical: _chartTooltipPaddingVertical,
        ),
        fitInsideHorizontally: true,
        fitInsideVertically: true,
        getTooltipItems: (List<LineBarSpot> spots) {
          // `fl_chart`는 툴팁 항목 수와 터치된 점 수가 같기를 요구합니다(다르면
          // `tooltipItems and touchedSpots size should be same`로 던집니다). 그래서
          // x축 이름은 별도 줄이 아니라 첫 항목 글자의 앞줄로 넣습니다. React의
          // `ChartTooltipContent`가 이름을 먼저 그리고 그 아래 계열을 나열하는 모양과
          // 같은 결과입니다.
          final String label = hideLabel
              ? ''
              : labelKey ??
                    (spots.isNotEmpty && spots.first.x.round() >= 0 && spots.first.x.round() < xLabels.length
                        ? xLabels[spots.first.x.round()]
                        : '');

          final List<LineTooltipItem> items = <LineTooltipItem>[];
          for (int index = 0; index < spots.length; index++) {
            final LineBarSpot spot = spots[index];
            if (spot.barIndex < 0 || spot.barIndex >= series.length) {
              items.add(LineTooltipItem('', itemStyle));
              continue;
            }
            final HoronChartSeries line = series[spot.barIndex];
            final String name = config[nameKey ?? line.key]?.label ?? config[line.key]?.label ?? line.key;
            final Color swatch = color ?? config.colorOf(line.key, horon, theme.brightness);
            items.add(
              LineTooltipItem(
                index == 0 && label.isNotEmpty ? '$label\n' : '',
                index == 0 && label.isNotEmpty ? labelStyle : itemStyle,
                textAlign: TextAlign.left,
                children: <TextSpan>[
                  // 표시 기호는 계열 색으로, 이름은 보조 색으로, 값은 전경색으로 나눠
                  // 그립니다. React의 `chart-tooltip-indicator`·`-name`·`-value` 자리입니다.
                  if (!hideIndicator)
                    TextSpan(
                      text: '$glyph ',
                      style: TextStyle(color: swatch),
                    ),
                  TextSpan(text: '$name  ', style: itemStyle),
                  TextSpan(text: formatValue(spot.y), style: valueStyle),
                ],
              ),
            );
          }
          return items;
        },
      ),
      getTouchedSpotIndicator: (LineChartBarData bar, List<int> indexes) => <TouchedSpotIndicatorData?>[
        for (final int _ in indexes)
          TouchedSpotIndicatorData(
            FlLine(color: scheme.outline, strokeWidth: _chartGridWidth),
            FlDotData(
              show: true,
              getDotPainter: (FlSpot spot, double percent, LineChartBarData barData, int spotIndex) =>
                  FlDotCirclePainter(
                    radius: _chartTooltipDotSize / 2,
                    color: barData.color ?? horon.chart1,
                    strokeWidth: 0,
                  ),
            ),
          ),
      ],
    );
  }

  /// 값을 화면에 쓰는 문자열로 만듭니다.
  ///
  /// React는 `value.toLocaleString()`을 씁니다. 이 패키지는 `intl`에 기대지 않으므로
  /// 세 자리 쉼표를 직접 넣고, 소수는 두 자리까지 남겨 뒤의 0을 지웁니다.
  static String formatValue(double value) {
    final bool negative = value < 0;
    final double magnitude = value.abs();
    final String text = magnitude == magnitude.roundToDouble()
        ? magnitude.round().toString()
        : magnitude.toStringAsFixed(2).replaceFirst(RegExp(r'0+$'), '').replaceFirst(RegExp(r'\.$'), '');
    final int dot = text.indexOf('.');
    final String integer = dot < 0 ? text : text.substring(0, dot);
    final String fraction = dot < 0 ? '' : text.substring(dot);
    final StringBuffer grouped = StringBuffer();
    for (int index = 0; index < integer.length; index++) {
      if (index > 0 && (integer.length - index) % 3 == 0) grouped.write(',');
      grouped.write(integer[index]);
    }
    return '${negative ? '-' : ''}$grouped$fraction';
  }
}

/// `chart.tsx`의 `ChartLegend`입니다.
///
/// `fl_chart` 1.3.0에는 범례가 없으므로 이 위젯이 색 견본과 이름을 나란히 그립니다.
/// 자리와 여백은 React와 같습니다. 그림 아래(`bottom`)에 `pt-3`, 위(`top`)에 `pb-3`을
/// 두고 항목을 가운데로 모읍니다.
class HoronChartLegend extends StatelessWidget {
  /// 범례 하나를 만듭니다.
  const HoronChartLegend({
    super.key,
    this.verticalAlign = HoronChartLegendAlign.bottom,
    this.hideIcon = false,
    this.semanticLabel,
  });

  /// 그림에 대한 자리입니다.
  final HoronChartLegendAlign verticalAlign;

  /// 설정의 아이콘을 감출지 여부입니다.
  final bool hideIcon;

  /// 범례의 접근성 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final HoronChartScope scope = HoronChartContainer.of(context);
    final HoronThemeData horon = HoronTheme.of(context);
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final EdgeInsets padding = switch (verticalAlign.name) {
      'top' => const EdgeInsets.only(bottom: _chartLegendInset),
      'bottom' => const EdgeInsets.only(top: _chartLegendInset),
      _ => EdgeInsets.zero,
    };

    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _chartFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Semantics(
      container: true,
      label: semanticLabel,
      child: Padding(
        padding: padding,
        child: Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: _chartLegendGap,
          runSpacing: HoronSpace.s2,
          children: <Widget>[
            for (final HoronChartSeries line in scope.series)
              _HoronChartLegendItem(
                label: scope.config[line.key]?.label ?? line.key,
                icon: scope.config[line.key]?.icon,
                color: scope.colorOf(line.key, horon),
                hideIcon: hideIcon,
                style: style,
                iconColor: scheme.onSurfaceVariant,
              ),
          ],
        ),
      ),
    );
  }
}

/// 범례의 항목 하나입니다(`chart.tsx`의 `chart-legend-item`).
class _HoronChartLegendItem extends StatelessWidget {
  const _HoronChartLegendItem({
    required this.label,
    required this.icon,
    required this.color,
    required this.hideIcon,
    required this.style,
    required this.iconColor,
  });

  final String label;
  final Widget? icon;
  final Color color;
  final bool hideIcon;
  final TextStyle style;
  final Color iconColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        if (icon != null && !hideIcon)
          IconTheme.merge(
            data: IconThemeData(size: _chartLegendIconSize, color: iconColor),
            child: icon!,
          )
        else
          SizedBox.square(
            dimension: _chartLegendIndicatorSize,
            child: DecoratedBox(
              decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(HoronRadius.xs)),
            ),
          ),
        SizedBox(width: _chartItemGap),
        Text(label, maxLines: 1, softWrap: false, style: style),
      ],
    );
  }
}
