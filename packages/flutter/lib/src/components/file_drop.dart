import 'dart:math' as math;
import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';

import '../glass/horon_veil.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 파일 드롭 영역의 표면입니다.
enum HoronFileDropSurface {
  /// `surface="solid"` — 불투명 `bg-surface` 채움에 점선 테두리. 기본값입니다.
  solid,

  /// `surface="glass"` — `.veil-drop` 표면 위에 놓습니다. 점선 테두리가 유일한 윤곽입니다.
  glass,
}

/// 파일을 끌어다 놓거나 눌러서 고르는 영역입니다.
///
/// React `FileDrop`: 1.5px 점선 테두리의 둥근 상자에 16px 아이콘과 `label-md` 라벨을
/// 가운데로 놓습니다. 테두리 모양은 `border-style` 전환이 안 되므로 점선 그대로 두고,
/// 끌어오는 동안 브랜드 1px 안쪽 링을 더합니다. 거부된 파일은 위험 테두리와 위험
/// 글자, 위험 안쪽 링을 씁니다. 업로드 중에는 라벨만 60%로 낮추고 상자는 흐리지
/// 않습니다(비활성만 40%).
///
/// React는 `<input type="file">`을 품은 `<label>`이라 클릭이 곧 파일 선택입니다. Flutter에는
/// 브라우저의 파일 선택 창이 없으므로 선택은 [onTap]으로 호스트에 넘기고, 끌어다 놓기는
/// [onDrop]으로 넘깁니다. 이 위젯은 파일을 읽지도 저장하지도 않습니다.
class HoronFileDrop extends StatefulWidget {
  /// 라벨과 상태를 받습니다.
  const HoronFileDrop({
    super.key,
    this.label = 'Drop files here or click to upload',
    this.uploading = false,
    this.rejected = false,
    this.disabled = false,
    this.surface = HoronFileDropSurface.solid,
    this.onTap,
    this.onDrop,
  });

  /// 아이콘 옆 문구입니다. React `label`.
  final String label;

  /// 업로드 중이면 아이콘 자리에 진행 표시를 그리고 전체를 흐리게 합니다.
  /// React `uploading`.
  final bool uploading;

  /// 거부된 파일이면 위험 테두리를 그립니다. React `rejected`.
  final bool rejected;

  /// 누르기와 끌어다 놓기를 모두 막습니다. React `disabled`.
  final bool disabled;

  /// 표면입니다. 기본값은 [HoronFileDropSurface.solid]입니다.
  final HoronFileDropSurface surface;

  /// 눌렀을 때 호출됩니다. 호스트가 자기 파일 선택 창을 엽니다. React의 숨은 파일 입력.
  final VoidCallback? onTap;

  /// 끌어다 놓은 자료를 받습니다. 자료의 타입은 끌어온 쪽이 정합니다. React `onFiles`.
  final ValueChanged<Object>? onDrop;

  /// `max-w-[550px]` — 영역이 더 넓어지지 않는 폭입니다.
  static const double _maxWidth = 550;

  /// `rounded-md`.
  static const double _radius = 10;

  /// `border-[1.5px]`.
  static const double _strokeWidth = 1.5;

  /// 점선 한 칸의 길이입니다. CSS `dashed`의 기본 비율을 1.5px 선에 맞춘 값입니다.
  static const double _dashLength = 5;

  /// 점선 사이의 빈 길이입니다.
  static const double _dashGap = 4;

  /// `size-4` — 아이콘과 진행 표시의 크기입니다.
  static const double _iconSize = 16;

  /// `opacity-40` — 비활성 상태의 불투명도입니다.
  static const double _disabledOpacity = 0.4;

  /// 업로드 중 라벨의 `opacity-60`입니다.
  static const double _uploadingLabelOpacity = 0.6;

  /// `shadow-[inset_0_0_0_1px_...]` — 끌어오기·거부 상태의 안쪽 링 두께입니다.
  static const double _insetRingWidth = 1;

  /// Spinner의 `stroke-width="11"`(viewBox 100 기준)을 옮긴 선 두께 비율입니다.
  static const double _spinnerStrokeFraction = 0.11;

  @override
  State<HoronFileDrop> createState() => _HoronFileDropState();
}

class _HoronFileDropState extends State<HoronFileDrop> {
  bool _dragging = false;

  void _setDragging(bool value) {
    if (_dragging == value) return;
    setState(() => _dragging = value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    // uploading은 라벨 불투명도만 낮추고 상자는 그대로 둡니다. 누르기와 끌어오기는
    // 업로드 중에도 막습니다(React는 `uploading`에서 포인터를 받지 않습니다).
    final bool inactive = widget.disabled || widget.uploading;

    // 테두리 모양은 `border-style` 전환이 되지 않으므로 점선을 유지하고, 끌어오기·거부는
    // `shadow-[inset_0_0_0_1px_...]` 안쪽 링과 색으로 알립니다. 둘 다 켜지면 React의
    // 규칙 순서대로 거부가 이깁니다. 채움은 표면이 정합니다: solid는 `bg-surface`,
    // 끌어오는 동안 `bg-subtle`, glass는 `.veil-drop`입니다.
    final bool isGlass = widget.surface == HoronFileDropSurface.glass;
    final Color fill = _dragging ? colors.bgSubtle : colors.bgSurface;
    final Color borderColor = widget.rejected
        ? colors.borderDanger
        : _dragging
        ? colors.borderBrand
        : colors.borderDashed;
    // 거부는 글자도 `text-danger`가 됩니다.
    final Color labelColor = widget.rejected ? colors.textDanger : colors.textSecondary;
    final String borderState = widget.rejected
        ? 'rejected'
        : _dragging
        ? 'dragging'
        : 'idle';
    // 점선은 그대로 두고, 끌어오기·거부에는 안쪽 1px 링을 더합니다(CSS inset shadow).
    final Color? borderInset = widget.rejected
        ? colors.borderDanger
        : _dragging
        ? colors.textBrand
        : null;

    final BorderRadius radius = BorderRadius.circular(HoronFileDrop._radius);
    final Widget content = Padding(
      padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          if (widget.uploading)
            _UploadSpinner(label: theme.strings.uploading)
          else
            Icon(Icons.file_upload_outlined, size: HoronFileDrop._iconSize, color: colors.textSecondary),
          SizedBox(width: space.s2),
          Flexible(
            child: Opacity(
              opacity: widget.uploading ? HoronFileDrop._uploadingLabelOpacity : 1,
              child: Text(
                widget.label,
                textAlign: TextAlign.center,
                style: theme.text.labelMd.copyWith(color: labelColor),
              ),
            ),
          ),
        ],
      ),
    );

    // glass는 `.veil-drop` 한 겹입니다. 링이 없어 점선 테두리가 유일한 윤곽이고,
    // 끌어오기·거부 때만 테두리가 바뀝니다. HoronLiquidGlass는 겹치지 않습니다.
    final Widget body = isGlass
        ? HoronVeil(kind: HoronVeilKind.drop, borderRadius: radius, child: content)
        : DecoratedBox(
            key: const Key('horon-file-drop-fill'),
            decoration: BoxDecoration(color: fill, borderRadius: radius),
            child: content,
          );

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite
            ? math.min(constraints.maxWidth, HoronFileDrop._maxWidth)
            : HoronFileDrop._maxWidth;
        return SizedBox(
          width: width,
          // React는 비활성일 때만 상자를 `opacity-40`으로 흐립니다. 업로드 중에는
          // 라벨만 60%이고 상자·테두리는 그대로입니다.
          child: Opacity(
            opacity: widget.disabled ? HoronFileDrop._disabledOpacity : 1,
            child: MouseRegion(
              cursor: widget.disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
              child: Semantics(
                button: true,
                enabled: !inactive,
                label: widget.label,
                child: DragTarget<Object>(
                  // React는 비활성일 때만 끌어오기 강조를 막습니다(업로드 중에도 강조는 뜹니다).
                  onWillAcceptWithDetails: (DragTargetDetails<Object> details) => !widget.disabled,
                  onMove: (DragTargetDetails<Object> details) {
                    if (!widget.disabled) _setDragging(true);
                  },
                  onLeave: (Object? data) => _setDragging(false),
                  onAcceptWithDetails: (DragTargetDetails<Object> details) {
                    _setDragging(false);
                    if (!inactive) widget.onDrop?.call(details.data);
                  },
                  builder: (BuildContext context, List<Object?> candidate, List<Object?> rejected) {
                    return GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: inactive ? null : widget.onTap,
                      child: CustomPaint(
                        key: ValueKey<String>('horon-file-drop-border-$borderState'),
                        painter: _DropBorderPainter(color: borderColor, inset: borderInset),
                        child: body,
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// 점선 테두리 한 겹을 그립니다. React의 `border-dashed`는 Flutter에 없어 직접 그립니다.
///
/// [inset]이 있으면 그 색으로 안쪽 1px 링을 한 겹 더 그립니다. CSS의
/// `shadow-[inset_0_0_0_1px_...]`처럼 테두리 안쪽에만 칠합니다.
class _DropBorderPainter extends CustomPainter {
  const _DropBorderPainter({required this.color, this.inset});

  final Color color;
  final Color? inset;

  @override
  void paint(Canvas canvas, Size size) {
    final double edge = HoronFileDrop._strokeWidth / 2;
    final RRect rrect = RRect.fromRectAndRadius(
      (Offset.zero & size).deflate(edge),
      const Radius.circular(HoronFileDrop._radius),
    );
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = HoronFileDrop._strokeWidth
      ..color = color;

    final Path path = Path()..addRRect(rrect);
    for (final PathMetric metric in path.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double end = math.min(distance + HoronFileDrop._dashLength, metric.length);
        canvas.drawPath(metric.extractPath(distance, end), paint);
        distance = end + HoronFileDrop._dashGap;
      }
    }

    final Color? ring = inset;
    if (ring == null) return;
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        (Offset.zero & size).deflate(HoronFileDrop._strokeWidth + HoronFileDrop._insetRingWidth / 2),
        Radius.circular(HoronFileDrop._radius - HoronFileDrop._strokeWidth),
      ),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = HoronFileDrop._insetRingWidth
        ..color = ring,
    );
  }

  @override
  bool shouldRepaint(_DropBorderPainter oldDelegate) => oldDelegate.color != color || oldDelegate.inset != inset;
}

/// 업로드 중 표시입니다. React `Spinner`의 10% 잉크 고리와 11% 두께를 옮겼습니다.
class _UploadSpinner extends StatelessWidget {
  const _UploadSpinner({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronColors colors = HoronTheme.of(context).colors;
    return Semantics(
      label: label,
      child: SizedBox(
        width: HoronFileDrop._iconSize,
        height: HoronFileDrop._iconSize,
        child: CircularProgressIndicator(
          strokeWidth: HoronFileDrop._iconSize * HoronFileDrop._spinnerStrokeFraction,
          color: colors.interactivePrimary,
          backgroundColor: colors.overlayInk10,
        ),
      ),
    );
  }
}
