import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// React `SegmentedControlSize`와 같은 값 집합입니다.
enum HoronSegmentedControlSize {
  /// `sm` — 세그먼트 30px, 좌우 여백 12, 트랙 안쪽 여백 3.
  sm,

  /// `md` — 트랙 36px, 세그먼트 30px, 좌우 여백 16.
  md,

  /// `lg` — 트랙 44px, 세그먼트 36px, 트랙 좌우 여백 4.
  lg,

  /// `tab` — 세그먼트 32px, 트랙 안쪽 여백 4, 간격 4.
  tab,
}

/// React `SegmentedControlSurface`와 같은 값 집합입니다.
enum HoronSegmentedControlSurface {
  /// `glass` — 보통 유리 트랙입니다.
  glass,

  /// `inset` — 루틴 카드 안쪽의 5% 잉크 트랙입니다.
  inset,

  /// `insetFaint` — 헤더 필터 안쪽의 4% 잉크 트랙입니다.
  insetFaint,

  /// `subtle` — `bg-subtle` 페이지 탭 트레이입니다. 선택 표시는 흰 알약입니다.
  subtle,
}

/// React `SegmentedControl`의 항목입니다.
class HoronSegmentedItem {
  /// 항목을 만듭니다.
  const HoronSegmentedItem({required this.value, required this.label, this.disabled = false});

  /// 항목의 값입니다.
  final String value;

  /// 세그먼트에 보이는 문구입니다.
  final String label;

  /// 고를 수 없는 항목인지 여부입니다.
  final bool disabled;
}

/// React `SegmentedControl`(Figma 62:379 등)을 옮긴 단일 선택 세그먼트입니다.
///
/// 선택 표시는 하나의 알약입니다. [fill]이 참이면 세그먼트가 폭을 똑같이 나누므로
/// `AnimatedAlign`으로 알약이 옆 세그먼트까지 미끄러지고, 거짓이면 세그먼트가 글자
/// 폭에 맞춰 달라지므로 알약을 세그먼트 안에서 교차 페이드합니다. 폭이 제각각인
/// 칸 사이를 미끄러뜨리려면 레이아웃 패스에서 칸 폭을 재야 해서, 그 대신 이
/// 두 경로로 나눴습니다.
class HoronSegmentedControl extends StatefulWidget {
  /// 세그먼트 컨트롤을 만듭니다.
  const HoronSegmentedControl({
    super.key,
    required this.items,
    this.value,
    this.defaultValue,
    this.onValueChange,
    this.size = HoronSegmentedControlSize.md,
    this.surface = HoronSegmentedControlSurface.glass,
    this.fill,
    this.semanticLabel,
  });

  /// 세그먼트 목록입니다.
  final List<HoronSegmentedItem> items;

  /// 선택된 값입니다. 지정하면 부모가 값을 소유합니다.
  final String? value;

  /// 처음 선택값입니다. [value]가 없을 때만 쓰입니다.
  final String? defaultValue;

  /// 선택이 바뀔 때 호출됩니다.
  final ValueChanged<String>? onValueChange;

  /// 크기입니다. 트랙과 세그먼트의 높이·여백을 함께 고릅니다.
  final HoronSegmentedControlSize size;

  /// 트랙 표면입니다.
  final HoronSegmentedControlSurface surface;

  /// 세그먼트가 폭을 똑같이 나눌지 여부입니다. 생략하면 [size]가 `md`일 때 참입니다.
  final bool? fill;

  /// 접근성 이름입니다. React `aria-label`에 대응합니다.
  final String? semanticLabel;

  @override
  State<HoronSegmentedControl> createState() => _HoronSegmentedControlState();
}

class _HoronSegmentedControlState extends State<HoronSegmentedControl> {
  String? _internalValue;

  bool get _fill => widget.fill ?? widget.size == HoronSegmentedControlSize.md;

  String? get _value => widget.value ?? _internalValue;

  @override
  void initState() {
    super.initState();
    _internalValue = widget.defaultValue;
  }

  void _select(HoronSegmentedItem item) {
    if (item.disabled) return;
    if (widget.value == null) setState(() => _internalValue = item.value);
    widget.onValueChange?.call(item.value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final _TrackMetrics metrics = _TrackMetrics.of(horon, widget.size);
    final BorderRadius pill = BorderRadius.all(Radius.circular(horon.radius.full));
    final int index = widget.items.indexWhere((HoronSegmentedItem item) => item.value == _value);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Duration indicatorDuration = reduceMotion ? Duration.zero : HoronMotion.indicatorDuration;

    final List<Widget> segments = <Widget>[
      for (final HoronSegmentedItem item in widget.items) _segment(horon, item, metrics, index, reduceMotion),
    ];

    final Widget indicator = _indicator(horon, pill);

    final Widget row = Row(
      mainAxisSize: _fill ? MainAxisSize.max : MainAxisSize.min,
      spacing: metrics.gap,
      children: <Widget>[
        for (int i = 0; i < segments.length; i++)
          if (_fill) Expanded(child: segments[i]) else Flexible(fit: FlexFit.loose, child: segments[i]),
      ],
    );

    final Widget stacked = _fill
        ? Stack(
            fit: StackFit.passthrough,
            children: <Widget>[
              if (index >= 0)
                Positioned.fill(
                  child: AnimatedAlign(
                    alignment: _alignmentFor(index, widget.items.length),
                    duration: indicatorDuration,
                    curve: HoronMotion.indicatorCurve,
                    child: FractionallySizedBox(
                      widthFactor: 1 / widget.items.length,
                      heightFactor: 1,
                      child: indicator,
                    ),
                  ),
                ),
              row,
            ],
          )
        : row;

    final Widget track = Padding(padding: metrics.padding, child: stacked);

    return Semantics(label: widget.semanticLabel, container: true, child: _track(context, horon, metrics, pill, track));
  }

  /// 선택 인덱스를 `Align`의 x 정렬값으로 옮깁니다. 칸 폭이 같을 때만 씁니다.
  Alignment _alignmentFor(int index, int count) {
    if (count <= 1) return Alignment.center;
    final double x = (2 * index - (count - 1)) / (count - 1);
    return Alignment(x, 0);
  }

  Widget _track(BuildContext context, HoronThemeData horon, _TrackMetrics metrics, BorderRadius pill, Widget child) {
    final Color fill = switch (widget.surface) {
      HoronSegmentedControlSurface.glass => Colors.transparent,
      HoronSegmentedControlSurface.inset => horon.colors.overlayInk5,
      HoronSegmentedControlSurface.insetFaint => horon.colors.overlayInk4,
      HoronSegmentedControlSurface.subtle => horon.colors.bgSubtle,
    };

    final Widget sized = SizedBox(height: metrics.height, child: child);

    if (widget.surface == HoronSegmentedControlSurface.glass) {
      return HoronLiquidGlass(tier: HoronGlassTier.regular, borderRadius: pill, child: sized);
    }
    return AnimatedContainer(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      decoration: BoxDecoration(color: fill, borderRadius: pill),
      child: sized,
    );
  }

  Widget _segment(HoronThemeData horon, HoronSegmentedItem item, _TrackMetrics metrics, int index, bool reduceMotion) {
    final bool selected = item.value == _value;
    final Color color = selected ? horon.colors.textPrimary : horon.colors.textSecondary;
    final BorderRadius pill = BorderRadius.all(Radius.circular(horon.radius.full));

    final Widget label = Text(
      item.label,
      style: horon.text.labelMd.copyWith(color: color),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      softWrap: false,
    );

    final Widget body = _fill
        ? Padding(
            padding: EdgeInsets.symmetric(horizontal: metrics.segmentPadding),
            child: Center(child: label),
          )
        : Stack(
            fit: StackFit.passthrough,
            children: <Widget>[
              if (selected)
                Positioned.fill(
                  child: AnimatedOpacity(
                    opacity: 1,
                    duration: reduceMotion ? Duration.zero : HoronMotion.indicatorDuration,
                    curve: HoronMotion.indicatorCurve,
                    child: _indicator(horon, pill),
                  ),
                ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: metrics.segmentPadding),
                child: label,
              ),
            ],
          );

    return Opacity(
      opacity: item.disabled ? 0.4 : 1,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: item.disabled ? null : () => _select(item),
        child: MouseRegion(
          cursor: item.disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
          child: SizedBox(height: metrics.segmentHeight, child: body),
        ),
      ),
    );
  }

  /// 선택 알약입니다. 표면에 따라 채움과 테두리가 달라집니다.
  Widget _indicator(HoronThemeData horon, BorderRadius pill) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    if (widget.surface == HoronSegmentedControlSurface.glass) {
      return DecoratedBox(
        position: DecorationPosition.foreground,
        decoration: BoxDecoration(
          borderRadius: pill,
          border: Border.all(color: horon.colors.glassRimStrong),
          boxShadow: <BoxShadow>[
            // React `shadow-[0_1px_3px_rgba(0,0,0,0.08)]`입니다. 어두운 밝기에서는
            // `dark:bg-overlay-ink-10`으로 채움이 바뀝니다.
            BoxShadow(
              color: horon.colors.bgScrim.withValues(alpha: 0.08),
              offset: const Offset(0, _shadowOffsetY),
              blurRadius: _shadowBlur,
            ),
          ],
        ),
        child: HoronLiquidGlass(
          tier: HoronGlassTier.clear,
          borderRadius: pill,
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            decoration: BoxDecoration(
              color: horon.brightness == Brightness.dark ? horon.colors.overlayInk10 : Colors.transparent,
              borderRadius: pill,
            ),
          ),
        ),
      );
    }

    final Color fill = widget.surface == HoronSegmentedControlSurface.subtle
        ? horon.colors.bgDefault
        : horon.colors.overlayInk10;
    return AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      decoration: BoxDecoration(color: fill, borderRadius: pill),
    );
  }
}

/// 크기별 트랙·세그먼트 수치입니다.
///
/// React `trackClass`와 `segmentClass`의 조합을 그대로 옮겼습니다.
class _TrackMetrics {
  const _TrackMetrics({
    required this.height,
    required this.padding,
    required this.gap,
    required this.segmentHeight,
    required this.segmentPadding,
  });

  factory _TrackMetrics.of(HoronThemeData horon, HoronSegmentedControlSize size) {
    return switch (size) {
      // `p-[3px]` — 높이는 세그먼트 30 + 위아래 3입니다.
      HoronSegmentedControlSize.sm => _TrackMetrics(
        height: 36,
        padding: EdgeInsets.all(_trackInsetSmall),
        gap: horon.space.s0_5,
        segmentHeight: 30,
        segmentPadding: horon.space.s3,
      ),
      // `h-9 p-[3px]`, 세그먼트 `h-7.5 px-4`.
      HoronSegmentedControlSize.md => _TrackMetrics(
        height: 36,
        padding: EdgeInsets.all(_trackInsetSmall),
        gap: horon.space.s0_5,
        segmentHeight: 30,
        segmentPadding: horon.space.s4,
      ),
      // `h-11 px-1`, 세그먼트 `h-9 px-4`.
      HoronSegmentedControlSize.lg => _TrackMetrics(
        height: 44,
        padding: EdgeInsets.symmetric(horizontal: horon.space.s1),
        gap: horon.space.s0_5,
        segmentHeight: 36,
        segmentPadding: horon.space.s4,
      ),
      // `gap-1 p-1`, 세그먼트 `h-8 px-3.5`.
      HoronSegmentedControlSize.tab => _TrackMetrics(
        height: 40,
        padding: EdgeInsets.all(horon.space.s1),
        gap: horon.space.s1,
        segmentHeight: 32,
        segmentPadding: horon.space.s3_5,
      ),
    };
  }

  final double height;
  final EdgeInsetsGeometry padding;
  final double gap;
  final double segmentHeight;
  final double segmentPadding;
}

/// `p-[3px]` — sm·md 트랙 안쪽 여백입니다.
const double _trackInsetSmall = 3;

/// `0 1px 3px`의 y 오프셋입니다.
const double _shadowOffsetY = 1;

/// `0 1px 3px`의 블러입니다.
const double _shadowBlur = 3;
