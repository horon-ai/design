import 'dart:io';

import 'package:flutter/animation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/theme/horon_motion.dart';

/// 모션 상수가 `globals.css`의 `@theme` 값과 같은지 확인합니다.
///
/// 웹의 CSS가 원본입니다. 이 파일의 숫자가 CSS와 어긋나면 같은 팝업이 웹과 Flutter에서
/// 다른 속도로 움직이고, 그 차이는 눈으로만 드러납니다.
void main() {
  test('원본이 CSS 파일임을 문서가 밝힌다', () {
    final source = File('lib/src/theme/horon_motion.dart').readAsStringSync();
    expect(source.contains('globals.css'), isTrue);
    expect(source.contains('--ease-out-quint'), isTrue);
  });

  test('이징 세 개가 CSS 베지어 곡선의 모양을 낸다', () {
    // ease-out-quint는 빨리 나가고 천천히 멈추므로 중간 지점에서 이미 1에 가깝습니다.
    expect(HoronMotion.easeOutQuint.transform(0.5), greaterThan(0.9));
    expect(HoronMotion.easeOutQuint.transform(0.5), lessThan(1));
    // ease-emphasized는 앞구간을 늦게 지나므로 같은 지점에서 quint보다 작습니다.
    expect(HoronMotion.easeEmphasized.transform(0.5), lessThan(HoronMotion.easeOutQuint.transform(0.5)));
    expect(HoronMotion.easeEmphasized.transform(0.5), inExclusiveRange(0, 1));
    // ease-spring은 1을 넘는 구간이 있는 튀는 곡선입니다.
    final peak = List<double>.generate(
      51,
      (index) => HoronMotion.easeSpring.transform(index / 50),
    ).reduce((left, right) => left > right ? left : right);
    expect(peak, greaterThan(1));
    for (final curve in <Cubic>[HoronMotion.easeOutQuint, HoronMotion.easeEmphasized, HoronMotion.easeSpring]) {
      expect(curve.transform(0), closeTo(0, 1e-9));
      expect(curve.transform(1), closeTo(1, 1e-9));
    }
  });

  test('애니메이션 길이와 배율이 CSS 값과 같다', () {
    expect(HoronMotion.shimmerDuration, const Duration(milliseconds: 1600));
    expect(HoronMotion.livePulseDuration, const Duration(milliseconds: 2000));
    expect(HoronMotion.popInDuration, const Duration(milliseconds: 220));
    expect(HoronMotion.popOutDuration, const Duration(milliseconds: 130));
    expect(HoronMotion.thinkingDuration, const Duration(milliseconds: 1200));
    expect(HoronMotion.popInScale, 0.6);
    expect(HoronMotion.popOutScale, 0.97);
    expect(HoronMotion.thinkingRise, 2);
  });

  test('유틸리티 시간이 CSS 유틸리티와 같다', () {
    expect(HoronMotion.popupEnterDuration, const Duration(milliseconds: 200));
    expect(HoronMotion.popupExitDuration, const Duration(milliseconds: 130));
    expect(HoronMotion.riseDuration, const Duration(milliseconds: 220));
    expect(HoronMotion.collapseDuration, const Duration(milliseconds: 240));
    expect(HoronMotion.indicatorDuration, const Duration(milliseconds: 280));
    expect(HoronMotion.colorsDuration, const Duration(milliseconds: 150));
    expect(HoronMotion.pressDuration, const Duration(milliseconds: 150));
    expect(HoronMotion.pressScale, 0.97);
    expect(HoronMotion.popupEnterScale, 0.95);
    expect(HoronMotion.popupExitScale, 0.97);
    expect(HoronMotion.riseOffset, 4);
  });

  test('애니메이션 곡선이 같은 이징 상수를 가리킨다', () {
    expect(identical(HoronMotion.shimmerCurve, Curves.linear), isTrue);
    expect(identical(HoronMotion.livePulseCurve, HoronMotion.easeOutQuint), isTrue);
    expect(identical(HoronMotion.popInCurve, HoronMotion.easeSpring), isTrue);
    expect(identical(HoronMotion.popOutCurve, Curves.easeIn), isTrue);
    expect(identical(HoronMotion.thinkingCurve, Curves.easeInOut), isTrue);
    expect(identical(HoronMotion.riseCurve, HoronMotion.easeOutQuint), isTrue);
    expect(identical(HoronMotion.collapseCurve, HoronMotion.easeOutQuint), isTrue);
    expect(identical(HoronMotion.indicatorCurve, HoronMotion.easeEmphasized), isTrue);
  });
}
