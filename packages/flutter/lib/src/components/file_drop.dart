import 'dart:math' as math;
import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 파일을 끌어다 놓거나 눌러서 고르는 영역입니다.
///
/// React `FileDrop`: 1.5px 점선 테두리의 둥근 상자에 16px 아이콘과 13/18 500 라벨을
/// 가운데로 놓습니다. 끌어오는 동안 점선이 1px 브랜드 테두리와 투명 유리 배경으로 바뀌고,
/// 거부된 파일은 위험 테두리로 바뀝니다. 흔들림이나 튀는 움직임은 없습니다.
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

  /// 눌렀을 때 호출됩니다. 호스트가 자기 파일 선택 창을 엽니다. React의 숨은 파일 입력.
  final VoidCallback? onTap;

  /// 끌어다 놓은 자료를 받습니다. 자료의 타입은 끌어온 쪽이 정합니다. React `onFiles`.
  final ValueChanged<Object>? onDrop;

  /// `max-w-[550px]` — 영역이 더 넓어지지 않는 폭입니다.
  static const double _maxWidth = 550;

  /// `rounded-[10px]`.
  static const double _radius = 10;

  /// `border-[1.5px]`.
  static const double _strokeWidth = 1.5;

  /// 점선 한 칸의 길이입니다. CSS `dashed`의 기본 비율을 1.5px 선에 맞춘 값입니다.
  static const double _dashLength = 5;

  /// 점선 사이의 빈 길이입니다.
  static const double _dashGap = 4;

  /// `size-4` — 아이콘과 진행 표시의 크기입니다.
  static const double _iconSize = 16;

  /// `opacity-40` — 비활성이거나 업로드 중일 때의 불투명도입니다.
  static const double _disabledOpacity = 0.4;

  /// `text-[13px]/[18px]` — 토큰에 13px 단계가 없어 `text.code`(13/20)에서 줄 높이만 바꿉니다.
  static const double _labelFontSize = 13;

  /// 위 글자 크기에 대응하는 줄 높이 18입니다.
  static const double _labelLineHeight = 18;

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
    final bool inactive = widget.disabled || widget.uploading;

    // `data-dragging:border-solid border-border-brand bg-glass-clear`와
    // `data-rejected:border-solid border-border-danger`. 둘 다 켜지면 React의 규칙 순서대로
    // 거부가 이깁니다.
    final (Color borderColor, bool solid, Color? fill) = widget.rejected
        ? (colors.borderDanger, true, null)
        : _dragging
        ? (colors.borderBrand, true, colors.glassClear)
        : (colors.borderDashed, false, null);
    final String borderState = widget.rejected
        ? 'rejected'
        : _dragging
        ? 'dragging'
        : 'idle';

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth.isFinite
            ? math.min(constraints.maxWidth, HoronFileDrop._maxWidth)
            : HoronFileDrop._maxWidth;
        return SizedBox(
          width: width,
          child: Opacity(
            opacity: inactive ? HoronFileDrop._disabledOpacity : 1,
            child: MouseRegion(
              cursor: inactive ? SystemMouseCursors.basic : SystemMouseCursors.click,
              child: Semantics(
                button: true,
                enabled: !inactive,
                label: widget.label,
                child: DragTarget<Object>(
                  onWillAcceptWithDetails: (DragTargetDetails<Object> details) => !inactive,
                  onMove: (DragTargetDetails<Object> details) => _setDragging(true),
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
                        painter: _DropBorderPainter(color: borderColor, dashed: !solid),
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3),
                          decoration: BoxDecoration(
                            color: fill,
                            borderRadius: BorderRadius.circular(HoronFileDrop._radius),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              if (widget.uploading)
                                _UploadSpinner(label: theme.strings.uploading)
                              else
                                Icon(
                                  Icons.file_upload_outlined,
                                  size: HoronFileDrop._iconSize,
                                  color: colors.textSecondary,
                                ),
                              SizedBox(width: space.s2),
                              Flexible(
                                child: Text(
                                  widget.label,
                                  textAlign: TextAlign.center,
                                  style: theme.text.labelSm.copyWith(
                                    fontSize: HoronFileDrop._labelFontSize,
                                    height: HoronFileDrop._labelLineHeight / HoronFileDrop._labelFontSize,
                                    fontWeight: HoronFontWeight.medium,
                                    color: colors.textSecondary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
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

/// 테두리 한 겹을 그립니다. React의 `border-dashed`는 Flutter에 없어 직접 그립니다.
class _DropBorderPainter extends CustomPainter {
  const _DropBorderPainter({required this.color, required this.dashed});

  final Color color;
  final bool dashed;

  @override
  void paint(Canvas canvas, Size size) {
    final double inset = HoronFileDrop._strokeWidth / 2;
    final RRect rrect = RRect.fromRectAndRadius(
      (Offset.zero & size).deflate(inset),
      const Radius.circular(HoronFileDrop._radius),
    );
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = HoronFileDrop._strokeWidth
      ..color = color;

    if (!dashed) {
      canvas.drawRRect(rrect, paint);
      return;
    }

    final Path path = Path()..addRRect(rrect);
    for (final PathMetric metric in path.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double end = math.min(distance + HoronFileDrop._dashLength, metric.length);
        canvas.drawPath(metric.extractPath(distance, end), paint);
        distance = end + HoronFileDrop._dashGap;
      }
    }
  }

  @override
  bool shouldRepaint(_DropBorderPainter oldDelegate) => oldDelegate.color != color || oldDelegate.dashed != dashed;
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
