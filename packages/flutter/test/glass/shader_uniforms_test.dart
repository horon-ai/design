import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/painting.dart' show Size;
import 'package:flutter/services.dart' show ByteData, rootBundle;
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/glass/glass_shader.dart';

/// 셰이더 자산과 유니폼 계약을 검사합니다.
///
/// `FragmentShader.setFloat`는 슬롯 색인을 받으므로, `.frag` 파일의 유니폼 순서가 곧
/// 계약입니다. 여기서는 파일을 직접 읽어 `glass_shader.dart`의 목록과 대조합니다.
/// 셰이더에 유니폼을 하나 끼워 넣으면 이 테스트가 먼저 깨집니다.
void main() {
  // 셰이더 자산은 테스트 자산 번들에도 컴파일되어 들어갑니다. 번들을 읽으려면 바인딩이
  // 필요합니다.
  TestWidgetsFlutterBinding.ensureInitialized();

  /// `.frag` 파일의 `uniform <type> <name>;` 선언을 순서대로 읽습니다.
  List<HoronShaderUniform> declaredUniforms(String source) {
    final RegExp pattern = RegExp(r'^uniform\s+(\w+)\s+(\w+)\s*;', multiLine: true);
    return <HoronShaderUniform>[
      for (final RegExpMatch match in pattern.allMatches(source))
        HoronShaderUniform(match.group(2)!, _typeOf(match.group(1)!)),
    ];
  }

  String sourceOf(String path) => File(path).readAsStringSync();

  group('shader assets', () {
    test('pubspec declares both shader assets', () {
      final String pubspec = sourceOf('pubspec.yaml');
      expect(pubspec, contains('shaders:'));
      expect(pubspec, contains(horonGlassRefractAsset));
      expect(pubspec, contains(horonFlueAsset));
      expect(File(horonGlassRefractAsset).existsSync(), isTrue);
      expect(File(horonFlueAsset).existsSync(), isTrue);
    });

    test('glass_refract.frag keeps the ImageFilter.shader contract', () {
      final List<HoronShaderUniform> declared = declaredUniforms(sourceOf(horonGlassRefractAsset));
      expect(declared, isNotEmpty);
      // 첫 유니폼은 vec2여야 하고, 샘플러가 최소 하나 있어야 합니다.
      expect(declared.first.name, 'uSize');
      expect(declared.first.type, HoronShaderUniformType.vec2);
      expect(declared.where((HoronShaderUniform u) => u.type == HoronShaderUniformType.sampler), isNotEmpty);
      // 백드롭을 실제로 읽습니다.
      expect(sourceOf(horonGlassRefractAsset), contains('texture(uBackdrop'));
    });

    test('flue.frag keeps the original constants and no sampler', () {
      final String source = sourceOf(horonFlueAsset);
      expect(source, contains('#define OCTAVES 3'));
      expect(source, contains('#define TRAIL_TAPS 6'));
      expect(source, contains('FlutterFragCoord'));
      final List<HoronShaderUniform> declared = declaredUniforms(source);
      expect(declared.where((HoronShaderUniform u) => u.type == HoronShaderUniformType.sampler), isEmpty);
    });
  });

  group('uniform order', () {
    test('glass_refract.frag matches horonGlassRefractUniforms', () {
      final List<HoronShaderUniform> declared = declaredUniforms(sourceOf(horonGlassRefractAsset));
      expect(
        <String>[for (final HoronShaderUniform u in declared) u.name],
        <String>[for (final HoronShaderUniform u in horonGlassRefractUniforms) u.name],
      );
      expect(
        <HoronShaderUniformType>[for (final HoronShaderUniform u in declared) u.type],
        <HoronShaderUniformType>[for (final HoronShaderUniform u in horonGlassRefractUniforms) u.type],
      );
    });

    test('flue.frag matches horonFlueUniforms', () {
      final List<HoronShaderUniform> declared = declaredUniforms(sourceOf(horonFlueAsset));
      expect(
        <String>[for (final HoronShaderUniform u in declared) u.name],
        <String>[for (final HoronShaderUniform u in horonFlueUniforms) u.name],
      );
      expect(
        <HoronShaderUniformType>[for (final HoronShaderUniform u in declared) u.type],
        <HoronShaderUniformType>[for (final HoronShaderUniform u in horonFlueUniforms) u.type],
      );
    });

    test('the computed slots are the ones the painters use', () {
      // 굴절: uSize 0-1, 샘플러 uBackdrop은 float 슬롯을 차지하지 않습니다(엔진이
      // 별도 색인으로 묶습니다). 그래서 uRadius가 2입니다.
      expect(horonGlassRefractSlots['uSize'], 0);
      expect(horonGlassRefractSlots.containsKey('uBackdrop'), isFalse);
      expect(horonGlassRefractSlots['uRadius'], 2);
      expect(horonGlassRefractSlots['uBezel'], 3);
      expect(horonGlassRefractSlots['uScale'], 4);
      expect(horonGlassRefractSlots['uSaturation'], 5);

      // Flue: iResolution 0-1, iTime 2, iMouse 3-4, 색 다섯이 9부터 3칸씩.
      expect(horonFlueSlots['iResolution'], 0);
      expect(horonFlueSlots['iTime'], 2);
      expect(horonFlueSlots['iMouse'], 3);
      expect(horonFlueSlots['iMouseVel'], 5);
      expect(horonFlueSlots['iMouseWake'], 7);
      expect(horonFlueSlots['uBgColor'], 9);
      expect(horonFlueSlots['uColorA'], 12);
      expect(horonFlueSlots['uColorD'], 21);
      expect(horonFlueSlots['uScale'], 24);
      expect(horonFlueSlots['uGrainAnim'], 49);
    });

    test('the slot maths counts components, not names, and skips samplers', () {
      const List<HoronShaderUniform> uniforms = <HoronShaderUniform>[
        HoronShaderUniform('a', HoronShaderUniformType.vec3),
        HoronShaderUniform('b', HoronShaderUniformType.sampler),
        HoronShaderUniform('c', HoronShaderUniformType.scalar),
        HoronShaderUniform('d', HoronShaderUniformType.vec2),
      ];
      expect(horonShaderSlots(uniforms), <String, int>{'a': 0, 'c': 3, 'd': 4});
    });
  });

  group('loading', () {
    test('both shader assets are compiled into the test bundle', () async {
      // `pubspec.yaml`의 `flutter: shaders:`에 있고, 툴체인이 실제로 컴파일해 넣었는지를
      // 바이트로 봅니다. 파일만 있는 것으로는 앱이 이 자산을 십지 못합니다.
      for (final String asset in <String>[horonFlueAsset, horonGlassRefractAsset]) {
        final ByteData data = await rootBundle.load(asset);
        expect(data.lengthInBytes, greaterThan(0), reason: asset);
      }
      // Flue는 셰이더 본문이 가장 큰 자산이라, 빈 파일이 아니라는 것도 같이 봅니다.
      final ByteData flue = await rootBundle.load(horonFlueAsset);
      expect(flue.lengthInBytes, greaterThan(1000));
    });

    test('a missing asset degrades to null instead of throwing', () async {
      expect(await horonLoadShaderProgram('shaders/does_not_exist.frag'), isNull);
    });

    test('a packaged asset never throws while loading', () async {
      // `flutter test`는 SkSL 백엔드로 돌아 이 자산의 런타임 스테이지를 못 읽습니다. 그때도
      // 던지지 않고 null이어야 위젯이 서리 채움으로 내려갑니다.
      await expectLater(horonLoadShaderProgram(horonFlueAsset), completes);
      await expectLater(horonLoadShaderProgram(horonGlassRefractAsset), completes);
    });

    test('the tables match the float count the engine reports', () async {
      // Impeller가 있는 실행에서만 프로그램이 만들어집니다. 테스트 환경은 SkSL이라
      // 대개 null이므로 그때는 이 검사를 건너뜁니다. 유니폼 순서 자체는 위의 파일 대조가
      // 보고, 슬롯 수는 `horonShaderSlots`가 목록에서 계산합니다.
      for (final MapEntry<String, List<HoronShaderUniform>> entry in <String, List<HoronShaderUniform>>{
        horonFlueAsset: horonFlueUniforms,
        horonGlassRefractAsset: horonGlassRefractUniforms,
      }.entries) {
        final ui.FragmentProgram? program = await horonLoadShaderProgram(entry.key);
        if (program == null) continue;

        final List<HoronShaderUniform> uniforms = entry.value;
        final int total = horonShaderSlots(uniforms)[uniforms.last.name]! + uniforms.last.slots;
        final ui.FragmentShader shader = program.fragmentShader();
        for (int index = 0; index < total; index++) {
          shader.setFloat(index, 0);
        }
        // 색인이 하나 더 많으면 엔진이 던집니다(= 목록에 없는 유니폼이 있거나 하나를 뻐줬습니다).
        expect(() => shader.setFloat(total, 0), throwsRangeError, reason: entry.key);
        shader.dispose();
      }
    });
  });

  group('refraction values', () {
    test('radius, bezel and scale are ratios of the host height', () {
      final HoronGlassRefractValues values = HoronGlassRefractValues.of(size: const Size(200, 48), cornerRadius: 24);
      expect(values.radius, closeTo(0.5, 1e-12));
      expect(values.bezel, closeTo(12 / 48, 1e-12));
      expect(values.scale, closeTo(18 / 48, 1e-12));
      expect(values.saturation, 1.2);
    });

    test('a radius larger than half the height is cut to the pill radius', () {
      final HoronGlassRefractValues values = HoronGlassRefractValues.of(size: const Size(120, 40), cornerRadius: 999);
      expect(values.radius, closeTo(0.5, 1e-12));
    });
  });
}

HoronShaderUniformType _typeOf(String glsl) => switch (glsl) {
  'float' => HoronShaderUniformType.scalar,
  'vec2' => HoronShaderUniformType.vec2,
  'vec3' => HoronShaderUniformType.vec3,
  'sampler2D' => HoronShaderUniformType.sampler,
  _ => throw StateError('Unexpected uniform type "$glsl" in a shader file.'),
};
