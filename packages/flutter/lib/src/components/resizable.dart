import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `resizable.tsx`의 구분선 두께입니다. React는 `aria-[orientation=horizontal]:h-px`,
/// `aria-[orientation=vertical]:w-px`로 1px 선을 그립니다.
const double _handleLineThickness = 1.0;

/// 구분선의 손가락 접촉 영역입니다.
///
/// React는 `after:-inset-x-1`/`after:-inset-y-1` 의사 요소로 보이지 않는 4px 여백을
/// 양쪽에 더해 9px을 잡습니다. 터치에서는 그 값이 너무 좁아 같은 계산을 그대로
/// 씁니다: 1 + 4 + 4 = 9.
const double _handleHitThickness = _handleLineThickness + HoronSpace.s1 * 2;

/// 구분선 손잡이의 모서리 반경입니다. React의 `rounded-sm`입니다.
const double _gripRadius = HoronRadius.sm;

/// 구분선 손잡이의 세로 치수입니다(`aria-[orientation=vertical]:[&>span]:h-4`).
const double _gripHeightVertical = HoronSpace.s4;

/// 구분선 손잡이의 가로 치수입니다(`[&>span]:w-3`).
const double _gripWidthVertical = HoronSpace.s3;

/// 가로 구분선에서 손잡이가 눕는 치수입니다(`aria-[orientation=horizontal]:[&>span]:h-3`).
const double _gripHeightHorizontal = HoronSpace.s3;

/// 가로 구분선에서 손잡이의 가로 치수입니다(`[&>span]:w-4`).
const double _gripWidthHorizontal = HoronSpace.s4;

/// 구분선 손잡이 안의 그립 아이콘 크기입니다(`size-2.5`).
const double _gripGlyphSize = HoronSpace.s2_5;

/// 패널이 늘어선 방향입니다.
///
/// React `resizable.tsx`의 `Group direction`은 cva 변형 그룹이 아니므로 공개 enum을
/// 두지 않습니다. 호출자는 [HoronResizablePanelGroup]과
/// [HoronResizablePanelGroup.vertical]로 고릅니다.
enum _HoronResizeAxis { horizontal, vertical }

/// 분할 영역의 패널 하나입니다.
///
/// React `react-resizable-panels`의 `Panel`을 옮긴 것입니다. 크기는 픽셀이 아니라
/// 비율(0~1)로 다루고, 형제 패널과의 합이 1이 되도록 그룹이 맞춥니다.
/// [minSize]는 드래그로도 넘을 수 없는 하한입니다.
class HoronResizablePanel extends StatelessWidget {
  /// 패널 하나를 만듭니다.
  const HoronResizablePanel({
    super.key,
    required this.child,
    this.defaultSize,
    this.minSize = _defaultMinSize,
    this.maxSize = _defaultMaxSize,
  }) : assert(minSize >= 0 && minSize <= 1, 'minSize is a fraction between 0 and 1.'),
       assert(maxSize > 0 && maxSize <= 1, 'maxSize is a fraction between 0 and 1.'),
       assert(minSize <= maxSize, 'minSize cannot exceed maxSize.'),
       assert(
         defaultSize == null || (defaultSize >= minSize && defaultSize <= maxSize),
         'defaultSize must be within [minSize, maxSize].',
       );

  /// 기본 하한입니다. 1000px 폭에서 100px에 해당합니다.
  static const double _defaultMinSize = 0.1;

  /// 기본 상한입니다.
  static const double _defaultMaxSize = 1.0;

  /// 패널 안에 그릴 내용입니다.
  final Widget child;

  /// 처음 배분에서 이 패널이 가져갈 비율입니다. 없으면 남은 비율을 균등하게 나눕니다.
  final double? defaultSize;

  /// 드래그로도 줄일 수 없는 하한 비율입니다.
  final double minSize;

  /// 드래그로도 늘릴 수 없는 상한 비율입니다.
  final double maxSize;

  @override
  Widget build(BuildContext context) => child;
}

/// 패널 사이를 나누는 구분선입니다.
///
/// React `resizable.tsx`의 `Separator`입니다. 보이는 선은 1px이고, 손가락이 잡는
/// 영역은 그보다 넓습니다. [withHandle]을 켜면 선 가운데에 그립 손잡이가 붙습니다.
/// 드래그 중이거나 포커스가 오면 선이 포커스 링 색으로 바뀝니다(React의
/// `data-[separator=active]:bg-ring`).
class HoronResizableHandle extends StatefulWidget {
  /// 구분선 하나를 만듭니다.
  const HoronResizableHandle({super.key, this.withHandle = false, this.semanticLabel});

  /// 선 가운데에 그립 손잡이를 그릴지 여부입니다.
  final bool withHandle;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronResizableHandle> createState() => _HoronResizableHandleState();
}

class _HoronResizableHandleState extends State<HoronResizableHandle> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool vertical = _HoronResizeAxisScope.maybeOf(context) != _HoronResizeAxis.horizontal;

    // "bg-border"이고, `data-[separator=hover]:bg-ring/60`과 active·focus는 `bg-ring`입니다.
    final Color lineColor = (_hovered || _focused) ? horon.ring : scheme.outline;

    final Widget line = SizedBox(
      width: vertical ? _handleLineThickness : double.infinity,
      height: vertical ? double.infinity : _handleLineThickness,
      child: ColoredBox(color: lineColor),
    );

    final Widget grip = widget.withHandle
        ? DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(_gripRadius),
              border: Border.all(color: scheme.outline),
            ),
            child: SizedBox(
              width: vertical ? _gripWidthVertical : _gripWidthHorizontal,
              height: vertical ? _gripHeightVertical : _gripHeightHorizontal,
              child: Center(
                child: SizedBox.square(
                  dimension: _gripGlyphSize,
                  child: CustomPaint(
                    painter: _HoronGripPainter(color: scheme.onSurfaceVariant, vertical: vertical),
                  ),
                ),
              ),
            ),
          )
        : const SizedBox.shrink();

    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        child: SizedBox(
          width: vertical ? _handleHitThickness : double.infinity,
          height: vertical ? double.infinity : _handleHitThickness,
          child: Stack(alignment: Alignment.center, children: <Widget>[line, grip]),
        ),
      ),
    );
  }
}

/// `GripVerticalIcon`(lucide `grip-vertical`)을 점 여섯 개로 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않고 호스트 앱이 공급합니다. 그래서 그립을
/// `Icons.drag_handle` 같은 글리프에 맡기면, 폰트를 싣지 않은 호스트에서 빈 네모가
/// 됩니다. 점 여섯 개는 어떤 환경에서도 같은 모양으로 그려집니다.
class _HoronGripPainter extends CustomPainter {
  const _HoronGripPainter({required this.color, required this.vertical});

  final Color color;
  final bool vertical;

  @override
  void paint(Canvas canvas, Size size) {
    // lucide `grip-vertical`의 24 그리드: x = 9, 15 / y = 5, 12, 19, 반지름 1.
    const List<double> columns = <double>[9, 15];
    const List<double> rows = <double>[5, 12, 19];
    final Paint dot = Paint()..color = color;
    final double scale = size.width / 24;
    final double radius = math.max(scale, _handleLineThickness / 2);

    for (final double x in columns) {
      for (final double y in rows) {
        // 가로 구분선에서는 lucide 클래스가 `rotate-90`을 걸어 그립이 눕습니다.
        final Offset point = vertical ? Offset(x * scale, y * scale) : Offset(y * scale, x * scale);
        canvas.drawCircle(point, radius, dot);
      }
    }
  }

  @override
  bool shouldRepaint(_HoronGripPainter oldDelegate) => color != oldDelegate.color || vertical != oldDelegate.vertical;
}

/// 구분선이 자기 방향을 자식에게 알리는 스코프입니다.
///
/// 소비자는 직접 쓰지 않습니다. [HoronResizablePanelGroup]이 설치하고
/// [HoronResizableHandle]이 읽어 선의 두께·방향을 정합니다.
class _HoronResizeAxisScope extends InheritedWidget {
  const _HoronResizeAxisScope({required this.axis, required super.child});

  final _HoronResizeAxis axis;

  static _HoronResizeAxis? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronResizeAxisScope>()?.axis;

  @override
  bool updateShouldNotify(_HoronResizeAxisScope oldWidget) => axis != oldWidget.axis;
}

/// 패널과 구분선을 담는 분할 영역입니다.
///
/// React `resizable.tsx`의 `Group`을 옮긴 것입니다. 자식에 [HoronResizablePanel]과
/// [HoronResizableHandle]을 순서대로 넣으면, 그룹이 그 순서대로 배치하고 구분선
/// 드래그로 이웃한 두 패널의 비율을 바꿉니다. 웹의 마우스 드래그를 터치 드래그로
/// 옮긴 것이라 손가락으로도 같은 조작이 됩니다.
///
/// 비율은 픽셀이 아니라 0~1의 몫이고, 각 패널의 [HoronResizablePanel.minSize]가
/// 하한입니다. 드래그가 하한을 넘어가면 그 자리에서 멈추고, 이웃 패널의 몫을 그만큼
/// 늘립니다. 두 패널의 합은 드래그 전후로 같습니다.
///
/// ```dart
/// HoronResizablePanelGroup(
///   children: <Widget>[
///     HoronResizablePanel(minSize: 0.2, child: side()),
///     HoronResizableHandle(withHandle: true),
///     HoronResizablePanel(child: main()),
///   ],
/// );
/// ```
class HoronResizablePanelGroup extends StatefulWidget {
  /// 가로 분할 영역을 만듭니다.
  const HoronResizablePanelGroup({super.key, required this.children, this.borderRadius, this.semanticLabel})
    : _axis = _HoronResizeAxis.horizontal;

  /// 세로 분할 영역을 만듭니다.
  const HoronResizablePanelGroup.vertical({super.key, required this.children, this.borderRadius, this.semanticLabel})
    : _axis = _HoronResizeAxis.vertical;

  /// 패널과 구분선입니다. 순서가 배치 순서입니다.
  final List<Widget> children;

  /// 전체 표면의 반경입니다. React의 `rounded-md`입니다.
  final BorderRadius? borderRadius;

  /// 보조 기술이 읽을 영역 이름입니다.
  final String? semanticLabel;

  final _HoronResizeAxis _axis;

  @override
  State<HoronResizablePanelGroup> createState() => _HoronResizablePanelGroupState();
}

class _HoronResizablePanelGroupState extends State<HoronResizablePanelGroup> {
  late List<double> _sizes = _initialSizes();

  List<HoronResizablePanel> get _panels => widget.children.whereType<HoronResizablePanel>().toList();

  int get _handleCount => widget.children.whereType<HoronResizableHandle>().length;

  /// [HoronResizablePanel.defaultSize]가 있으면 그것을, 없으면 남은 몫을 균등하게 씁니다.
  List<double> _initialSizes() {
    final List<HoronResizablePanel> panels = _panels;
    if (panels.isEmpty) return <double>[];
    final double assigned = panels.fold<double>(0, (double sum, HoronResizablePanel p) => sum + (p.defaultSize ?? 0));
    final int unassignedCount = panels.where((HoronResizablePanel p) => p.defaultSize == null).length;
    final double each = unassignedCount == 0 ? 0 : math.max(0, 1 - assigned) / unassignedCount;
    final List<double> raw = <double>[
      for (final HoronResizablePanel panel in panels) (panel.defaultSize ?? each).clamp(panel.minSize, panel.maxSize),
    ];
    final double total = raw.fold<double>(0, (double sum, double value) => sum + value);
    if (total <= 0) return List<double>.filled(panels.length, 1 / panels.length);
    return <double>[for (final double value in raw) value / total];
  }

  @override
  void didUpdateWidget(covariant HoronResizablePanelGroup oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.children.whereType<HoronResizablePanel>().length != _panels.length) {
      _sizes = _initialSizes();
    }
  }

  /// 이웃한 두 패널의 몫을 [delta]만큼 옮깁니다. 하한·상한에서 멈춥니다.
  void _resize(int index, double delta) {
    if (index < 0 || index + 1 >= _sizes.length) return;
    final List<HoronResizablePanel> panels = _panels;
    final double pairSum = _sizes[index] + _sizes[index + 1];
    final double lower = math.max(panels[index].minSize, pairSum - panels[index + 1].maxSize);
    final double upper = math.min(panels[index].maxSize, pairSum - panels[index + 1].minSize);
    if (lower > upper) return;
    final double next = (_sizes[index] + delta).clamp(lower, upper);
    if (next == _sizes[index]) return;
    setState(() {
      _sizes[index] = next;
      _sizes[index + 1] = pairSum - next;
    });
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool horizontal = widget._axis == _HoronResizeAxis.horizontal;

    final Widget content = LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double totalExtent = horizontal ? constraints.maxWidth : constraints.maxHeight;
        // 교차축 크기입니다. 가로 분할이면 높이, 세로 분할이면 폭입니다.
        final double crossExtent = horizontal ? constraints.maxHeight : constraints.maxWidth;
        final double handleExtent = _handleCount * _handleHitThickness;
        final double contentExtent = math.max(0, totalExtent - handleExtent);

        final List<Widget> laid = <Widget>[];
        int panelIndex = 0;
        double cursor = 0;
        for (final Widget child in widget.children) {
          if (child is HoronResizablePanel) {
            final double fraction = panelIndex < _sizes.length ? _sizes[panelIndex] : 0;
            final double extent = contentExtent * fraction;
            laid.add(
              Positioned(
                left: horizontal ? cursor : 0,
                top: horizontal ? 0 : cursor,
                width: horizontal ? extent : crossExtent,
                height: horizontal ? crossExtent : extent,
                child: ClipRect(
                  child: _HoronResizeAxisScope(axis: widget._axis, child: child.child),
                ),
              ),
            );
            cursor += extent;
            panelIndex++;
          } else if (child is HoronResizableHandle) {
            final int handleIndex = panelIndex - 1;
            laid.add(
              Positioned(
                left: horizontal ? cursor : 0,
                top: horizontal ? 0 : cursor,
                width: horizontal ? _handleHitThickness : crossExtent,
                height: horizontal ? crossExtent : _handleHitThickness,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onHorizontalDragUpdate: horizontal
                      ? (DragUpdateDetails details) =>
                            _resize(handleIndex, details.delta.dx / math.max(contentExtent, 1))
                      : null,
                  onVerticalDragUpdate: horizontal
                      ? null
                      : (DragUpdateDetails details) =>
                            _resize(handleIndex, details.delta.dy / math.max(contentExtent, 1)),
                  child: _HoronResizeAxisScope(axis: widget._axis, child: child),
                ),
              ),
            );
            cursor += _handleHitThickness;
          } else {
            // 패널·구분선이 아닌 자식은 자기 자리를 차지하지 않고 겹쳐 놓습니다.
            laid.add(Positioned.fill(child: child));
          }
        }

        return Stack(children: laid);
      },
    );

    final BorderRadius radius = widget.borderRadius ?? BorderRadius.circular(HoronRadiusRole.card);

    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: ClipRRect(
        borderRadius: radius,
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: radius,
            border: Border.all(color: scheme.outline),
          ),
          child: content,
        ),
      ),
    );
  }
}
