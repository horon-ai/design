import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/services.dart' show ByteData, rootBundle;
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 셰이더 자산과 유니폼 계약을 검사합니다.
///
/// `FragmentShader.setFloat`는 슬롯 색인을 받으므로, `.frag` 파일의 유니폼 순서가 곧
/// 계약입니다. 여기서는 파일을 직접 읽어 `glass_shader.dart`의 목록과 대조합니다.
/// 셰이더에 유니폼을 하나 끼워 넣으면 이 테스트가 먼저 깨집니다.
///
/// 글래스 표면은 셰이더를 쓰지 않으므로 남은 자산은 Flue 배경 하나입니다.
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
    test('pubspec declares the flue shader asset', () {
      final String pubspec = sourceOf('pubspec.yaml');
      expect(pubspec, contains('shaders:'));
      expect(pubspec, contains(horonFlueAsset));
      expect(File(horonFlueAsset).existsSync(), isTrue);
      // 글래스는 셰이더 자산을 갖지 않습니다. shaders/에는 Flue 하나만 남습니다.
      final List<String> assets = Directory('shaders')
          .listSync()
          .map((FileSystemEntity entity) => entity.uri.pathSegments.last)
          .toList();
      expect(assets, <String>['flue.frag']);
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

    test('the computed slots are the ones the painter uses', () {
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
    test('the shader asset is compiled into the test bundle', () async {
      // `pubspec.yaml`의 `flutter: shaders:`에 있고, 툴체인이 실제로 컴파일해 넣었는지를
      // 바이트로 봅니다. 파일만 있는 것으로는 앱이 이 자산을 읽지 못합니다.
      final ByteData data = await rootBundle.load(horonFlueAsset);
      expect(data.lengthInBytes, greaterThan(1000));
    });

    test('a missing asset degrades to null instead of throwing', () async {
      expect(await horonLoadShaderProgram('shaders/does_not_exist.frag'), isNull);
    });

    test('a packaged asset never throws while loading', () async {
      // `flutter test`는 SkSL 백엔드로 돌아 이 자산의 런타임 스테이지를 못 읽습니다. 그때도
      // 던지지 않고 null이어야 호출자가 단색으로 내려갑니다.
      await expectLater(horonLoadShaderProgram(horonFlueAsset), completes);
    });

    test('the table matches the float count the engine reports', () async {
      // Impeller가 있는 실행에서만 프로그램이 만들어집니다. 테스트 환경은 SkSL이라
      // 대개 null이므로 그때는 이 검사를 건너뜁니다. 유니폼 순서 자체는 위의 파일 대조가
      // 보고, 슬롯 수는 `horonShaderSlots`가 목록에서 계산합니다.
      final ui.FragmentProgram? program = await horonLoadShaderProgram(horonFlueAsset);
      if (program == null) return;

      final int total =
          horonShaderSlots(horonFlueUniforms)[horonFlueUniforms.last.name]! + horonFlueUniforms.last.slots;
      final ui.FragmentShader shader = program.fragmentShader();
      for (int index = 0; index < total; index++) {
        shader.setFloat(index, 0);
      }
      // 색인이 하나 더 많으면 엔진이 던집니다(= 목록에 없는 유니폼이 있거나 하나를 뺐습니다).
      expect(() => shader.setFloat(total, 0), throwsRangeError);
      shader.dispose();
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
