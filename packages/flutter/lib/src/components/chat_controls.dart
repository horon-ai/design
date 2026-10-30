import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_theme.dart';

/// `chat-controls.tsx`의 `size-11`입니다. 최신으로 가는 원형 버튼입니다.
const double _jumpSide = 44;

/// `chat-controls.tsx`의 `[&_svg]:size-5`입니다.
const double _jumpIcon = 20;

/// `chat-controls.tsx`의 `h-10`입니다. 새 메시지 알약 높이입니다.
const double _pillHeight = 40;

/// `chat-controls.tsx`의 `h-13`입니다. 음성 입력 높이입니다.
const double _voiceHeight = 52;

/// `chat-controls.tsx`의 `w-60`입니다.
const double _voiceWidth = 240;

/// `chat-controls.tsx`의 `rounded-[3px]`입니다. 정지 사각형의 반경입니다.
const double _stopSquareRadius = 3;

/// `chat-controls.tsx`의 `rounded-[2px]`입니다. 파형 막대의 반경입니다.
const double _waveBarRadius = 2;

/// Figma 파형의 막대 높이(px)입니다.
const List<double> _waveform = <double>[8, 14, 22, 12, 26, 18, 10, 20, 28, 16, 9, 18, 24, 12, 7, 15, 21, 11];

/// Figma `Jump to latest`(Chat controls 88:659): 44px 옅은 유리 원에 20px 캐럿입니다.
class HoronJumpToLatest extends StatelessWidget {
  /// 버튼을 만듭니다.
  const HoronJumpToLatest({super.key, this.onPressed, this.label = 'Jump to latest'});

  /// 누르는 동작입니다.
  final VoidCallback? onPressed;

  /// 접근성 이름입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.full);

    return Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        onTap: onPressed,
        child: SizedBox(
          width: _jumpSide,
          height: _jumpSide,
          child: ClipRRect(
            borderRadius: radius,
            child: Stack(
              children: <Widget>[
                Positioned.fill(
                  child: HoronLiquidGlass(
                    tier: HoronGlassTier.clear,
                    borderRadius: radius,
                    child: const SizedBox.expand(),
                  ),
                ),
                Center(
                  child: Icon(Icons.keyboard_arrow_down, size: _jumpIcon, color: theme.colors.textPrimary),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Figma `New messages`(88:659): 40px 옅은 유리 알약에 16px 캐럿과 라벨입니다.
class HoronNewMessagesPill extends StatelessWidget {
  /// 알약을 만듭니다.
  const HoronNewMessagesPill({super.key, required this.label, this.onPressed});

  /// 알약 글자입니다.
  final String label;

  /// 누르는 동작입니다.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.full);

    return Semantics(
      button: true,
      child: GestureDetector(
        onTap: onPressed,
        child: SizedBox(
          height: _pillHeight,
          child: ClipRRect(
            borderRadius: radius,
            child: Stack(
              children: <Widget>[
                Positioned.fill(
                  child: HoronLiquidGlass(
                    tier: HoronGlassTier.clear,
                    borderRadius: radius,
                    child: const SizedBox.expand(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 14, right: 16),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Icon(Icons.keyboard_arrow_down, size: 16, color: theme.colors.textPrimary),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          label,
                          maxLines: 1,
                          softWrap: false,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Figma `Voice input`(88:659): 52px regular 유리 알약에 정지 버튼, 파형, 타이머가 놓입니다.
class HoronVoiceInput extends StatefulWidget {
  /// 음성 입력을 만듭니다.
  const HoronVoiceInput({
    super.key,
    required this.elapsed,
    this.levels,
    this.recording = true,
    this.onStop,
    this.stopLabel = 'Stop recording',
  });

  /// 경과 시간입니다. 예: `0:07`.
  final String elapsed;

  /// 0~1 레벨 18개입니다. 넘기지 않으면 Figma 파형을 씁니다.
  final List<double>? levels;

  /// 참이면 파형이 움직입니다.
  final bool recording;

  /// 정지를 눌렀을 때입니다.
  final VoidCallback? onStop;

  /// 정지 버튼의 접근성 이름입니다.
  final String stopLabel;

  @override
  State<HoronVoiceInput> createState() => _HoronVoiceInputState();
}

class _HoronVoiceInputState extends State<HoronVoiceInput> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final bool animate = widget.recording && !MediaQuery.disableAnimationsOf(context);
    if (animate && !_controller.isAnimating) {
      _controller.repeat();
    } else if (!animate) {
      _controller.stop();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.full);
    final List<double> heights = widget.levels == null
        ? _waveform
        : widget.levels!.map((double level) => math.max(4, (level * 28).roundToDouble()).toDouble()).toList();

    return SizedBox(
      width: _voiceWidth,
      height: _voiceHeight,
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronLiquidGlass(
                tier: HoronGlassTier.regular,
                borderRadius: radius,
                child: const SizedBox.expand(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Row(
                children: <Widget>[
                  Semantics(
                    button: true,
                    label: widget.stopLabel,
                    child: GestureDetector(
                      onTap: widget.onStop,
                      child: Container(
                        width: 36,
                        height: 36,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(color: theme.colors.textDanger, shape: BoxShape.circle),
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: theme.colors.bgSurface,
                            borderRadius: BorderRadius.circular(_stopSquareRadius),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: SizedBox(
                      height: 28,
                      child: AnimatedBuilder(
                        animation: _controller,
                        builder: (BuildContext context, Widget? child) {
                          return Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: <Widget>[
                              for (int index = 0; index < heights.length; index++)
                                Padding(
                                  padding: const EdgeInsets.only(right: 3),
                                  child: Container(
                                    width: 3,
                                    height: widget.recording
                                        ? heights[index] *
                                              (0.6 + 0.4 * math.sin((_controller.value * 2 * math.pi) + index * 0.55))
                                        : heights[index],
                                    decoration: BoxDecoration(
                                      color: theme.colors.interactivePrimary75,
                                      borderRadius: BorderRadius.circular(_waveBarRadius),
                                    ),
                                  ),
                                ),
                            ],
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    widget.elapsed,
                    maxLines: 1,
                    softWrap: false,
                    style: theme.text.labelMd.copyWith(color: theme.colors.textSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
