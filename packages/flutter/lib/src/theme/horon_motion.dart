/// horon의 움직임 상수입니다.
///
/// Figma에는 모션 변수가 없습니다. 그래서 라이브러리의 모션은
/// `packages/react/src/styles/globals.css`의 `@theme` 블록과 그 아래 유틸리티에 삽니다.
/// 이 파일은 그 값의 사본이며, 웹의 CSS가 바뀌면 이 파일도 함께 바꿉니다. 원본 주석의
/// 기준도 그대로 옮겼습니다: 색과 누름 피드백 120–150ms, 팝업과 패널 180–240ms,
/// 항목 사이를 옮겨 다니는 표시자 약 280ms.
///
/// 웹의 `prefers-reduced-motion` 규칙은 Flutter에서 `MediaQuery.disableAnimationsOf(context)`가
/// 대신합니다. 그 값이 참이면 애니메이션 길이를 0에 가깝게 줄여 같은 뜻을 냅니다.
///
/// 여러 컴포넌트가 함께 쓰는 두 유틸리티는 상수 옆에 위젯으로 한 번만 둡니다.
/// [HoronReveal]이 `motion-reveal`·`motion-reveal-x`, [HoronSwap]이 `motion-swap`입니다.
/// 나머지 유틸리티(`motion-rise`, `motion-popup`, `motion-details` 등)는 컴포넌트마다
/// 쓰는 위젯이 달라 상수만 두고 부르는 쪽이 자기 위젯으로 조립합니다.
library;

import 'package:flutter/widgets.dart';

/// CSS `@theme`의 이징과 애니메이션 값을 옮긴 상수 묶음입니다.
abstract final class HoronMotion {
  /// `--ease-out-quint` — `cubic-bezier(0.22, 1, 0.36, 1)`.
  ///
  /// 빨리 나가고 천천히 멈추는 기본 이징입니다. 팝업, 패널, 표시자가 씁니다.
  static const Cubic easeOutQuint = Cubic(0.22, 1, 0.36, 1);

  /// `--ease-emphasized` — `cubic-bezier(0.2, 0, 0, 1)`.
  ///
  /// 상태를 강조하는 이동(탭 표시자)에 씁니다.
  static const Cubic easeEmphasized = Cubic(0.2, 0, 0, 1);

  /// `--ease-spring` — `cubic-bezier(0.34, 1.3, 0.64, 1)`.
  ///
  /// 1을 넘는 구간이 있는 튀는 곡선입니다. 팝인에 씁니다.
  static const Cubic easeSpring = Cubic(0.34, 1.3, 0.64, 1);

  /// `--animate-shimmer` — `shimmer 1.6s linear infinite`.
  ///
  /// 스켈레톤의 반짝임이 지나가는 시간입니다. 곡선은 등속입니다.
  static const Duration shimmerDuration = Duration(milliseconds: 1600);

  /// `--animate-shimmer`의 곡선입니다.
  static const Curve shimmerCurve = Curves.linear;

  /// `--animate-live-pulse` — `live-pulse 2s var(--ease-out-quint) infinite`.
  static const Duration livePulseDuration = Duration(milliseconds: 2000);

  /// `--animate-live-pulse`의 곡선입니다.
  static const Curve livePulseCurve = easeOutQuint;

  /// `--animate-pop-in` — `pop-in 220ms var(--ease-spring) both`.
  static const Duration popInDuration = Duration(milliseconds: 220);

  /// `--animate-pop-in`의 곡선입니다.
  static const Curve popInCurve = easeSpring;

  /// 팝인의 시작 배율입니다(`@keyframes pop-in`의 `scale: 0.6`).
  static const double popInScale = 0.6;

  /// `--animate-pop-out` — `pop-out 130ms ease-in both`.
  static const Duration popOutDuration = Duration(milliseconds: 130);

  /// `--animate-pop-out`의 곡선입니다. CSS `ease-in`과 같은 값입니다.
  static const Curve popOutCurve = Curves.easeIn;

  /// 팝아웃의 끝 배율입니다(`@keyframes pop-out`의 `scale: 0.97`).
  static const double popOutScale = 0.97;

  /// `--animate-thinking` — `thinking-dot 1.2s ease-in-out infinite`.
  static const Duration thinkingDuration = Duration(milliseconds: 1200);

  /// `--animate-thinking`의 곡선입니다. CSS `ease-in-out`과 같은 값입니다.
  static const Curve thinkingCurve = Curves.easeInOut;

  /// 사고 중인 점이 위로 떠오르는 거리입니다(`@keyframes thinking-dot`의 `translate: 0 -2px`).
  static const double thinkingRise = 2;

  /// `motion-popup`의 진입 시간입니다.
  static const Duration popupEnterDuration = Duration(milliseconds: 200);

  /// `motion-popup` 진입의 시작 배율입니다(`scale: 0.95`).
  static const double popupEnterScale = 0.95;

  /// `motion-popup`의 퇴장 시간입니다. 진입보다 짧습니다.
  static const Duration popupExitDuration = Duration(milliseconds: 130);

  /// `motion-popup` 퇴장의 끝 배율입니다(`scale: 0.97`).
  static const double popupExitScale = 0.97;

  /// `motion-rise`의 패널·행 진입 시간입니다.
  static const Duration riseDuration = Duration(milliseconds: 220);

  /// `motion-rise`의 곡선입니다.
  static const Curve riseCurve = easeOutQuint;

  /// `motion-rise`의 시작 이동 거리입니다(`translate: 0 4px`).
  static const double riseOffset = 4;

  /// `motion-collapse`의 높이 전환 시간입니다.
  static const Duration collapseDuration = Duration(milliseconds: 240);

  /// `motion-collapse`의 곡선입니다.
  static const Curve collapseCurve = easeOutQuint;

  /// `motion-indicator`의 이동 시간입니다.
  static const Duration indicatorDuration = Duration(milliseconds: 280);

  /// `motion-indicator`의 곡선입니다.
  static const Curve indicatorCurve = easeEmphasized;

  /// `motion-colors`의 색 전환 시간입니다.
  static const Duration colorsDuration = Duration(milliseconds: 150);

  /// `motion-colors`의 곡선입니다.
  static const Curve colorsCurve = Curves.easeOut;

  /// `motion-press`의 누름 시간입니다. 색 전환과 배율이 함께 움직입니다.
  static const Duration pressDuration = Duration(milliseconds: 150);

  /// `motion-press`의 곡선입니다.
  static const Curve pressCurve = easeOutQuint;

  /// `motion-press`가 눌린 동안 줄이는 배율입니다(`scale: 0.97`).
  static const double pressScale = 0.97;

  /// `--animate-fade-in` — `fade-in 160ms var(--ease-out-quint) both`.
  ///
  /// 제자리에서 바뀌는 글자·캐럿·숫자의 등장입니다. 움직이지 않고 불투명도만 오릅니다.
  static const Duration fadeInDuration = Duration(milliseconds: 160);

  /// `--animate-fade-in`의 곡선입니다.
  static const Curve fadeInCurve = easeOutQuint;

  /// `--animate-scale-out` — `scale-out 120ms ease-in both`.
  ///
  /// 고정된 자리에서 빠져나가는 작은 글리프(체크 표시, 라디오 점)의 퇴장입니다.
  static const Duration scaleOutDuration = Duration(milliseconds: 120);

  /// `--animate-scale-out`의 곡선입니다. CSS `ease-in`과 같은 값입니다.
  static const Curve scaleOutCurve = Curves.easeIn;

  /// `scale-out`이 시작하는 배율입니다(`scale: 1`).
  static const double scaleOutStart = 1;

  /// `scale-out`이 끝나는 배율입니다(`scale: 0.6`).
  static const double scaleOutEnd = 0.6;

  /// `--animate-swap-move` — `swap-move 200ms var(--ease-out-quint) both`.
  ///
  /// 밀려나는 대신 갈아 끼우는 내용의 짧은 상승입니다. 불투명도는 함께 움직이지 않습니다.
  static const Duration swapMoveDuration = Duration(milliseconds: 200);

  /// `--animate-swap-move`의 곡선입니다.
  static const Curve swapMoveCurve = easeOutQuint;

  /// `swap-move`가 올라오는 거리입니다(`translate: 0 4px`).
  static const double swapMoveOffset = 4;

  /// `--animate-slide-shift-next`·`prev` — `200ms var(--ease-out-quint) both`.
  ///
  /// 앞뒤로 밀려 들어오는 내용의 가로 이동입니다. 불투명도는 바뀌지 않습니다.
  static const Duration slideShiftDuration = Duration(milliseconds: 200);

  /// `--animate-slide-shift-next`·`prev`의 곡선입니다.
  static const Curve slideShiftCurve = easeOutQuint;

  /// `slide-shift`가 이동하는 거리입니다(`translate: ±12px 0`). 다음은 +, 이전은 −입니다.
  static const double slideShiftOffset = 12;

  /// `--animate-sweep` — `sweep 1.4s var(--ease-out-quint) infinite`.
  ///
  /// 값이 없는 진행 표시의 막대가 트랙을 가로질러 다시 들어오는 주기입니다.
  static const Duration sweepDuration = Duration(milliseconds: 1400);

  /// `--animate-sweep`의 곡선입니다.
  static const Curve sweepCurve = easeOutQuint;

  /// `sweep`이 시작하는 위치입니다(`translate: -100% 0`). 막대 폭의 배수입니다.
  static const double sweepFrom = -1;

  /// `sweep`이 끝나는 위치입니다(`translate: 400% 0`). 막대 폭의 배수입니다.
  static const double sweepTo = 4;

  /// `motion-reveal`의 높이(또는 폭) 전환 시간입니다.
  ///
  /// React는 `grid-template-rows`(세로)와 `grid-template-columns`(가로)를 200ms
  /// `ease-out-quint`로 바꿉니다. Flutter에는 `0fr`이 없으므로 [HoronReveal]이
  /// `Align`의 `heightFactor`·`widthFactor`로 같은 길이를 냅니다.
  static const Duration revealDuration = Duration(milliseconds: 200);

  /// `motion-reveal`의 크기 전환 곡선입니다.
  static const Curve revealCurve = easeOutQuint;

  /// `motion-reveal`의 불투명도 전환 시간입니다. 크기보다 50ms 짧습니다.
  static const Duration revealOpacityDuration = Duration(milliseconds: 150);

  /// `motion-reveal`의 불투명도 곡선입니다. CSS `ease-out`과 같은 값입니다.
  static const Curve revealOpacityCurve = Curves.easeOut;

  /// `motion-swap`의 교차 전환 시간입니다. 불투명도와 배율이 함께 움직입니다.
  static const Duration swapDuration = Duration(milliseconds: 150);

  /// `motion-swap`의 곡선입니다.
  static const Curve swapCurve = easeOutQuint;

  /// `motion-swap`에서 숨은 자식의 배율입니다(`scale: 0.95`).
  static const double swapHiddenScale = 0.95;
}

/// `motion-reveal`·`motion-reveal-x` — 한 칸을 접고 펴는 래퍼입니다.
///
/// React는 `display: grid`의 `1fr`↔`0fr`과 불투명도로 자리를 열고 닫습니다. 자식은
/// 언제나 제 크기를 차지한 채 잘리고, 래퍼가 차지하는 자리만 애니메이션합니다. 그래서
/// [collapsed]가 바뀌어도 자식의 레이아웃은 흔들리지 않습니다(React의 `min-height: 0;
/// overflow: hidden`과 같은 뜻).
///
/// Flutter에는 `0fr`이 없으므로 [Align]의 `heightFactor`·`widthFactor`를 0과 1 사이에서
/// animate 하고 [ClipRect]로 잘라 냅니다. 세로가 `motion-reveal`, 가로가
/// `motion-reveal-x`입니다.
///
/// ```dart
/// HoronReveal(
///   collapsed: error == null,
///   child: Text(error ?? ''),
/// )
/// ```
///
/// 접었을 때 포커스 가능한 자식이 포커스를 받지 않도록 부르는 쪽에서 `ExcludeFocus`나
/// `IgnorePointer`를 함께 겁니다(React는 `inert`를 씁니다). 모션 축소면 길이를 0으로 줄여
/// 즉시 바뀝니다.
class HoronReveal extends StatelessWidget {
  /// 래퍼를 만듭니다.
  const HoronReveal({super.key, required this.collapsed, this.axis = Axis.vertical, required this.child});

  /// 자리를 닫을지 여부입니다. React의 `data-collapsed`입니다.
  final bool collapsed;

  /// 접히는 방향입니다. [Axis.vertical]이 `motion-reveal`, [Axis.horizontal]이
  /// `motion-reveal-x`입니다.
  final Axis axis;

  /// 접히고 펴지는 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final bool vertical = axis == Axis.vertical;
    final Alignment alignment = vertical ? Alignment.topCenter : Alignment.centerLeft;
    final Duration sizeDuration = reduceMotion ? Duration.zero : HoronMotion.revealDuration;
    return AnimatedSize(
      duration: sizeDuration,
      curve: HoronMotion.revealCurve,
      alignment: alignment,
      child: ClipRect(
        child: Align(
          alignment: alignment,
          widthFactor: vertical ? null : (collapsed ? 0 : 1),
          heightFactor: vertical ? (collapsed ? 0 : 1) : null,
          child: AnimatedOpacity(
            opacity: collapsed ? 0 : 1,
            duration: reduceMotion ? Duration.zero : HoronMotion.revealOpacityDuration,
            curve: HoronMotion.revealOpacityCurve,
            child: child,
          ),
        ),
      ),
    );
  }
}

/// `motion-swap` — 한 칸에 두 상태를 겹쳐 두고 교차 전환하는 래퍼입니다.
///
/// React는 두 자식을 같은 grid 칸에 쌓고 비활성 자식에 `data-hidden`을 줍니다. 칸은 큰
/// 자식의 크기를 따르고, 숨는 쪽은 불투명도 0과 배율 0.95로 물러납니다. 그래서 아이콘이
/// 재생↔정지처럼 갈아 끼워질 때 레이아웃이 흔들리지 않습니다.
///
/// ```dart
/// HoronSwap(
///   hidden: running,
///   child: const Icon(Icons.play_arrow),
///   hiddenChild: const Icon(Icons.stop),
/// )
/// ```
///
/// 숨은 자식은 투명해질 뿐 트리에 남으므로 [IgnorePointer]로 누름을, [ExcludeFocus]로
/// 포커스 이동을, [ExcludeSemantics]로 낭독을 막습니다(React는 `pointer-events: none`과
/// `aria-hidden`, `tabIndex={-1}`을 씁니다). 모션 축소면 길이를 0으로 줄여 즉시 바뀝니다.
class HoronSwap extends StatelessWidget {
  /// 래퍼를 만듭니다.
  const HoronSwap({super.key, required this.hidden, required this.hiddenChild, required this.child});

  /// [hiddenChild]를 보여 줄지 여부입니다.
  final bool hidden;

  /// [hidden]이 거짓일 때 보이는 자식입니다.
  final Widget child;

  /// [hidden]이 참일 때 보이는 자식입니다.
  final Widget hiddenChild;

  @override
  Widget build(BuildContext context) {
    final Duration duration = MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.swapDuration;
    // Stack은 자리 없는 자식 중 가장 큰 크기로 자리를 정합니다. 두 자식을 모두 남겨야
    // React의 "칸은 큰 자식의 크기" 계약이 유지됩니다.
    return Stack(
      alignment: Alignment.center,
      children: <Widget>[_slot(hiddenChild, !hidden, duration), _slot(child, hidden, duration)],
    );
  }

  Widget _slot(Widget child, bool isHidden, Duration duration) {
    return IgnorePointer(
      ignoring: isHidden,
      child: ExcludeFocus(
        excluding: isHidden,
        child: ExcludeSemantics(
          excluding: isHidden,
          child: AnimatedScale(
            scale: isHidden ? HoronMotion.swapHiddenScale : 1,
            duration: duration,
            curve: HoronMotion.swapCurve,
            child: AnimatedOpacity(
              opacity: isHidden ? 0 : 1,
              duration: duration,
              curve: HoronMotion.swapCurve,
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}
