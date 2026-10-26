import 'package:flutter/material.dart';

import '../tokens/horon_tokens.g.dart';

/// `scroll-area.tsx`의 스크롤바 두께입니다.
///
/// 수직은 `w-2.5`, 수평은 `h-2.5`이고 Tailwind의 2.5는 10px입니다.
const double _scrollbarThickness = HoronSpace.s2_5;

/// `scroll-area.tsx`의 스크롤바 손잡이 `bg-foreground/20` 불투명도입니다.
const double _thumbOpacity = 0.2;

/// 스크롤 영역이 늘어선 방향입니다.
///
/// React `scroll-area.tsx`의 `orientation`은 Base UI 프리미티브의 prop이고 cva 변형
/// 그룹이 아니므로 공개 enum을 두지 않습니다. 호출자는 [HoronScrollArea]와
/// [HoronScrollArea.horizontal]로 고릅니다.
enum _HoronScrollAxis { vertical, horizontal }

/// 스타일된 스크롤바를 가진 스크롤 영역입니다.
///
/// `scroll-area.tsx`를 옮긴 것입니다. React는 루트를 `relative overflow-hidden`으로
/// 자르고, 뷰포트를 `size-full`로 채운 뒤, 스크롤바를 10px 두께의
/// `rounded-full bg-foreground/20` 손잡이로 그립니다.
///
/// Flutter의 [RawScrollbar]가 그 손잡이를 그립니다. 색은 테마의 전경 색을 20%
/// 불투명도로 쓰고, 반경은 [HoronRadius.full]이라 양 끝이 둥급니다. 손잡이는
/// 스크롤이 실제로 필요할 때만 나타나고, 스크롤이 끝나면 사라집니다.
///
/// ```dart
/// SizedBox(
///   height: 240,
///   child: HoronScrollArea(child: Column(children: rows)),
/// );
/// ```
class HoronScrollArea extends StatefulWidget {
  /// 세로 스크롤 영역을 만듭니다.
  const HoronScrollArea({
    super.key,
    required this.child,
    this.controller,
    this.padding = EdgeInsets.zero,
    this.semanticLabel,
  }) : _axis = _HoronScrollAxis.vertical;

  /// 가로 스크롤 영역을 만듭니다.
  const HoronScrollArea.horizontal({
    super.key,
    required this.child,
    this.controller,
    this.padding = EdgeInsets.zero,
    this.semanticLabel,
  }) : _axis = _HoronScrollAxis.horizontal;

  /// 스크롤할 내용입니다.
  final Widget child;

  /// 스크롤 위치를 읽고 옮기는 컨트롤러입니다. 없으면 이 위젯이 소유합니다.
  final ScrollController? controller;

  /// 내용 주위에 두는 여백입니다. React는 여백을 정하지 않으므로 기본값은 0입니다.
  final EdgeInsetsGeometry padding;

  /// 보조 기술이 읽을 영역 이름입니다.
  final String? semanticLabel;

  final _HoronScrollAxis _axis;

  @override
  State<HoronScrollArea> createState() => _HoronScrollAreaState();
}

class _HoronScrollAreaState extends State<HoronScrollArea> {
  ScrollController? _ownedController;

  ScrollController get _controller => widget.controller ?? (_ownedController ??= ScrollController());

  @override
  void dispose() {
    _ownedController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool vertical = widget._axis == _HoronScrollAxis.vertical;
    final Axis axis = vertical ? Axis.vertical : Axis.horizontal;

    final Widget view = SingleChildScrollView(
      controller: _controller,
      scrollDirection: axis,
      padding: widget.padding,
      child: widget.child,
    );

    final Widget scrolled = RawScrollbar(
      controller: _controller,
      // React의 손잡이는 스크롤 중에만 나타나고 `transition-opacity`로 사라집니다.
      thumbVisibility: false,
      thickness: _scrollbarThickness,
      radius: const Radius.circular(HoronRadius.full),
      thumbColor: scheme.onSurface.withValues(alpha: _thumbOpacity),
      scrollbarOrientation: vertical ? ScrollbarOrientation.right : ScrollbarOrientation.bottom,
      child: view,
    );

    // 루트의 `overflow-hidden`입니다. 스크롤바가 영역 밖으로 새지 않습니다.
    final Widget clipped = ClipRect(child: scrolled);

    if (widget.semanticLabel == null) return clipped;
    return Semantics(container: true, label: widget.semanticLabel, child: clipped);
  }
}
