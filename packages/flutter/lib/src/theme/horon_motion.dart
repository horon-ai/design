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
library;

import 'package:flutter/animation.dart' show Cubic, Curve, Curves;

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
}
