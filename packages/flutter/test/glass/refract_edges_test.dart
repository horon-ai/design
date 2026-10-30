import 'dart:math' as math;

import 'package:flutter_test/flutter_test.dart';

/// `shaders/glass_refract.frag`의 거리 계산을 Dart로 옮긴 사본입니다.
///
/// 셰이더는 `flutter test`의 SkSL 백엔드에서 프로그램을 만들지 못해(엔진이 null을
/// 돌려줍니다) 픽셀 결과를 직접 검사할 수 없습니다. 그래서 이 파일은 셰이더가 쓰는
/// 수식을 그대로 옮겨, 도형이 가로로 길 때 양쪽 가장자리가 같은 깊이로 판정되는지를
/// 봅니다. 이 성질이 깨지면 실제 기기에서 한쪽 가장자리만 굴절됩니다.
///
/// 좌표는 셰이더와 같습니다. `uv`는 축마다 0~1이고 x만 `aspect`로 늘려 정사각형
/// 좌표계로 옮깁니다. `radius`는 높이에 대한 비율이라 알약이면 0.5입니다.
double _depthAt({
  required double uvX,
  required double uvY,
  required double width,
  required double height,
  required double radius,
}) {
  final double aspect = width / height;
  final double px = uvX * aspect - 0.5 * aspect;
  final double py = uvY - 0.5;
  final double dx = px.abs() - (0.5 * aspect - radius);
  final double dy = py.abs() - (0.5 - radius);
  final double outside =
      math.sqrt(math.max(dx, 0) * math.max(dx, 0) + math.max(dy, 0) * math.max(dy, 0)) + math.min(math.max(dx, dy), 0);
  return radius - outside;
}

void main() {
  group('glass refraction edge band', () {
    test('a wide pill refracts both ends the same', () {
      const double width = 120;
      const double height = 40;
      const double radius = 0.5;

      double depthAtX(double x) => _depthAt(uvX: x / width, uvY: 0.5, width: width, height: height, radius: radius);

      expect(depthAtX(1), closeTo(depthAtX(width - 1), 1e-9));
      expect(depthAtX(1), greaterThan(0));
      expect(depthAtX(width - 1), greaterThan(0));
      expect(depthAtX(width / 2), greaterThan(0.25));
    });

    test('a square host keeps the band on all four edges', () {
      const double size = 60;
      const double radius = 0.5;
      double depthAtX(double x) => _depthAt(uvX: x / size, uvY: 0.5, width: size, height: size, radius: radius);
      double depthAtY(double y) => _depthAt(uvX: 0.5, uvY: y / size, width: size, height: size, radius: radius);

      expect(depthAtX(1), greaterThan(0));
      expect(depthAtX(size - 1), greaterThan(0));
      expect(depthAtY(1), greaterThan(0));
      expect(depthAtY(size - 1), greaterThan(0));
    });
  });
}
