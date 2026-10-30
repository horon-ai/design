// 셰이더 자산과 유니폼 계약입니다.
//
// Flutter의 `FragmentShader.setFloat`는 이름이 아니라 슬롯 색인을 받으므로, 유니폼
// 선언 순서가 곧 계약입니다. 여기 목록이 그 계약이고, 색인은 목록에서 계산합니다
// (`horonShaderSlots`). `test/glass/shader_uniforms_test.dart`가 이 목록을 실제
// `.frag` 파일의 선언과 대조하므로, 셰이더에 유니폼을 하나 끼워 넣으면 테스트가
// 먼저 깨집니다.

import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';

import 'glass_geometry.dart';

/// 유니폼 하나의 GLSL 타입입니다.
enum HoronShaderUniformType {
  /// `float` — 슬롯 1개.
  scalar,

  /// `vec2` — 슬롯 2개.
  vec2,

  /// `vec3` — 슬롯 3개.
  vec3,

  /// `sampler2D` — float 슬롯을 차지하지 않습니다(엔진이 별도 색인으로 묶습니다).
  sampler,
}

/// 셰이더 유니폼 선언 하나입니다.
@immutable
class HoronShaderUniform {
  /// 이름과 타입을 받습니다. 슬롯 수는 타입에서 나옵니다.
  const HoronShaderUniform(this.name, this.type);

  /// GLSL 식별자입니다.
  final String name;

  /// GLSL 타입입니다.
  final HoronShaderUniformType type;

  /// 이 유니폼이 차지하는 float 슬롯 수입니다.
  ///
  /// `setFloat`의 색인은 샘플러를 건너뛰고 매겨집니다(엔진 문서: "ignoring any
  /// samplers"). 샘플러는 `setImageSampler`로 따로 묶이므로 0입니다.
  int get slots => switch (type) {
    HoronShaderUniformType.scalar => 1,
    HoronShaderUniformType.vec2 => 2,
    HoronShaderUniformType.vec3 => 3,
    HoronShaderUniformType.sampler => 0,
  };
}

/// 유니폼 목록에서 이름별 첫 float 슬롯을 계산합니다.
///
/// 샘플러 이름은 빠집니다. 굴절 셰이더의 `uBackdrop`이 그 자리입니다.
Map<String, int> horonShaderSlots(List<HoronShaderUniform> uniforms) {
  final Map<String, int> slots = <String, int>{};
  int next = 0;
  for (final HoronShaderUniform uniform in uniforms) {
    if (uniform.type == HoronShaderUniformType.sampler) continue;
    slots[uniform.name] = next;
    next += uniform.slots;
  }
  return slots;
}

/// 굴절 셰이더의 자산 경로입니다. `pubspec.yaml`의 `flutter: shaders:`에 있습니다.
const String horonGlassRefractAsset = 'shaders/glass_refract.frag';

/// Flue 셰이더의 자산 경로입니다.
const String horonFlueAsset = 'shaders/flue.frag';

/// `shaders/glass_refract.frag`의 유니폼 순서입니다.
///
/// 앞의 둘은 `ui.ImageFilter.shader`의 계약입니다: 첫 유니폼은 `vec2`(엔진이 입력
/// 텍스처 크기로 채웁니다), 첫 `sampler2D`는 필터 입력입니다. 나머지 넷은 아래
/// [HoronGlassRefractValues]가 채웁니다.
const List<HoronShaderUniform> horonGlassRefractUniforms = <HoronShaderUniform>[
  HoronShaderUniform('uSize', HoronShaderUniformType.vec2),
  HoronShaderUniform('uBackdrop', HoronShaderUniformType.sampler),
  HoronShaderUniform('uRadius', HoronShaderUniformType.scalar),
  HoronShaderUniform('uBezel', HoronShaderUniformType.scalar),
  HoronShaderUniform('uScale', HoronShaderUniformType.scalar),
  HoronShaderUniform('uSaturation', HoronShaderUniformType.scalar),
];

/// `shaders/flue.frag`의 유니폼 순서입니다. `FlueConfig` 필드 순서와 같습니다.
const List<HoronShaderUniform> horonFlueUniforms = <HoronShaderUniform>[
  HoronShaderUniform('iResolution', HoronShaderUniformType.vec2),
  HoronShaderUniform('iTime', HoronShaderUniformType.scalar),
  HoronShaderUniform('iMouse', HoronShaderUniformType.vec2),
  HoronShaderUniform('iMouseVel', HoronShaderUniformType.vec2),
  HoronShaderUniform('iMouseWake', HoronShaderUniformType.vec2),
  HoronShaderUniform('uBgColor', HoronShaderUniformType.vec3),
  HoronShaderUniform('uColorA', HoronShaderUniformType.vec3),
  HoronShaderUniform('uColorB', HoronShaderUniformType.vec3),
  HoronShaderUniform('uColorC', HoronShaderUniformType.vec3),
  HoronShaderUniform('uColorD', HoronShaderUniformType.vec3),
  HoronShaderUniform('uScale', HoronShaderUniformType.scalar),
  HoronShaderUniform('uSpeed', HoronShaderUniformType.scalar),
  HoronShaderUniform('uFlow', HoronShaderUniformType.scalar),
  HoronShaderUniform('uRoughness', HoronShaderUniformType.scalar),
  HoronShaderUniform('uLacunarity', HoronShaderUniformType.scalar),
  HoronShaderUniform('uSmokeScale', HoronShaderUniformType.scalar),
  HoronShaderUniform('uCurl', HoronShaderUniformType.scalar),
  HoronShaderUniform('uCurlScale', HoronShaderUniformType.scalar),
  HoronShaderUniform('uRise', HoronShaderUniformType.scalar),
  HoronShaderUniform('uSlender', HoronShaderUniformType.scalar),
  HoronShaderUniform('uWidth', HoronShaderUniformType.scalar),
  HoronShaderUniform('uSpread', HoronShaderUniformType.scalar),
  HoronShaderUniform('uLean', HoronShaderUniformType.scalar),
  HoronShaderUniform('uDensity', HoronShaderUniformType.scalar),
  HoronShaderUniform('uContrast', HoronShaderUniformType.scalar),
  HoronShaderUniform('uMidpoint', HoronShaderUniformType.scalar),
  HoronShaderUniform('uGlow', HoronShaderUniformType.scalar),
  HoronShaderUniform('uSink', HoronShaderUniformType.scalar),
  HoronShaderUniform('uGrain', HoronShaderUniformType.scalar),
  HoronShaderUniform('uDither', HoronShaderUniformType.scalar),
  HoronShaderUniform('uVignette', HoronShaderUniformType.scalar),
  HoronShaderUniform('uPointerRadius', HoronShaderUniformType.scalar),
  HoronShaderUniform('uDraft', HoronShaderUniformType.scalar),
  HoronShaderUniform('uPointerStrength', HoronShaderUniformType.scalar),
  HoronShaderUniform('uParallax', HoronShaderUniformType.scalar),
  HoronShaderUniform('uGrainAnim', HoronShaderUniformType.scalar),
];

/// 굴절 셰이더의 이름별 슬롯입니다.
final Map<String, int> horonGlassRefractSlots = horonShaderSlots(horonGlassRefractUniforms);

/// Flue 셰이더의 이름별 슬롯입니다.
final Map<String, int> horonFlueSlots = horonShaderSlots(horonFlueUniforms);

/// 굴절 셰이더가 받는 기하 값입니다.
///
/// 셋 다 호스트 높이로 나눈 값입니다. 그래야 엔진이 어떤 배율의 텍스처를 넘기든 같은
/// 모양이 나옵니다(`uSize`는 엔진이 채우고, 그 비율만 씁니다).
@immutable
class HoronGlassRefractValues {
  /// 값을 그대로 받는 생성자입니다.
  const HoronGlassRefractValues({
    required this.radius,
    required this.bezel,
    required this.scale,
    required this.saturation,
  });

  /// 호스트 크기와 모서리 반경에서 값을 계산합니다.
  factory HoronGlassRefractValues.of({required Size size, required double cornerRadius}) {
    final double height = math.max(1, size.height);
    final HoronGlassShape shape = HoronGlassShape(width: size.width, height: size.height, radius: cornerRadius);
    return HoronGlassRefractValues(
      radius: math.min(cornerRadius, height / 2) / height,
      bezel: horonGlassBezel(shape) / height,
      scale: horonGlassScale(shape) / height,
      saturation: horonGlassSaturation,
    );
  }

  /// 모서리 반경 / 높이입니다.
  final double radius;

  /// 가장자리 띠 폭 / 높이입니다.
  final double bezel;

  /// 최대 변위 / 높이입니다.
  final double scale;

  /// 채도 배율입니다.
  final double saturation;

  /// 굴절 셰이더의 네 유니폼을 채웁니다.
  void applyTo(ui.FragmentShader shader) {
    shader
      ..setFloat(horonGlassRefractSlots['uRadius']!, radius)
      ..setFloat(horonGlassRefractSlots['uBezel']!, bezel)
      ..setFloat(horonGlassRefractSlots['uScale']!, scale)
      ..setFloat(horonGlassRefractSlots['uSaturation']!, saturation);
  }
}

/// 자산을 읽어 프로그램으로 만듭니다. 실패하면 `null`입니다.
///
/// 라이브러리 패키지의 자산 키는 `packages/horon_ui/…`로 시작하고, 자기 패키지가
/// 루트인 실행(예: 이 패키지의 `flutter test`)에서는 접두사가 없습니다. 둘 다 시도하고,
/// 어느 쪽도 안 되면 던지지 않고 `null`을 돌려줍니다. 호출자는 서리 채움으로 내려갑니다.
Future<ui.FragmentProgram?> horonLoadShaderProgram(String asset) async {
  for (final String key in <String>['packages/horon_ui/$asset', asset]) {
    try {
      return await ui.FragmentProgram.fromAsset(key);
    } catch (_) {
      // 자산이 없거나(테스트·미선언) 엔진이 셰이더를 지원하지 않는 경우입니다.
      continue;
    }
  }
  return null;
}

final Map<String, Future<ui.FragmentProgram?>> _programs = <String, Future<ui.FragmentProgram?>>{};

/// 자산별 프로그램을 한 번만 읽습니다. 여러 글래스 호스트가 같은 프로그램을 나눕니다.
///
/// 실패도 캐시합니다. 매 프레임 자산을 다시 읽어 실패하는 것보다, 한 번 실패하고
/// 서리 채움으로 남는 편이 낫습니다.
Future<ui.FragmentProgram?> horonShaderProgram(String asset) =>
    _programs.putIfAbsent(asset, () => horonLoadShaderProgram(asset));

/// 프로그램 캐시를 비웁니다. 테스트가 지원 여부를 바꿔 가며 검사할 때 씁니다.
@visibleForTesting
void horonShaderProgramCacheClear() => _programs.clear();

/// 엔진 환경과 자산 로딩을 읽는 지점입니다. 테스트가 값을 바꿔 강등 경로를 확인합니다.
///
/// `ui.ImageFilter.isShaderFilterSupported`는 Impeller가 켜진 실행에서만 참입니다.
/// 위젯 테스트는 Impeller 없이 돌고, 자산 읽기는 실제 입출력이라 가짜 시간 위에서는
/// 끝나지 않습니다. 이 두 지점을 바꿀 수 있어야 강등을 결정적으로 테스트할 수 있습니다.
abstract final class HoronGlassProbe {
  /// 셰이더 필터를 쓸 수 있는지 답하는 함수입니다.
  static bool Function() shaderFilterSupported = () => ui.ImageFilter.isShaderFilterSupported;

  /// 셰이더 프로그램을 읽는 함수입니다. 기본은 자산에서 읽습니다.
  static Future<ui.FragmentProgram?> Function(String asset) loadProgram = horonShaderProgram;

  /// 지금까지 굴절 셰이더를 로드하려 한 횟수입니다.
  ///
  /// 지원하지 않는 엔진에서는 0이어야 합니다. 강등이 실제로 걸렸는지를 보는 값입니다.
  static int refractionAttempts = 0;

  /// 기본값으로 되돌립니다. 테스트의 `setUp`에서 부릅니다.
  @visibleForTesting
  static void reset() {
    shaderFilterSupported = () => ui.ImageFilter.isShaderFilterSupported;
    loadProgram = horonShaderProgram;
    refractionAttempts = 0;
  }
}
