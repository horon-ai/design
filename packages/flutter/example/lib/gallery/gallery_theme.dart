import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 갤러리가 쓰는 [ThemeData]입니다.
///
/// 패키지의 [horonTheme]를 그대로 돌려줍니다. 갤러리 섹션은 실제 앱과 같은
/// 테마에서 그려져야 하고, `HoronTheme.of(context)`를 부르는 컴포넌트는
/// 등록된 [HoronThemeData]가 없으면 예외를 던지기 때문입니다.
///
/// todo 5에서 이 파일은 테마 브리지(todo 3)보다 먼저 쓰인 임시 스텁이었고,
/// `extensions`가 비어 있어 테마를 읽는 컴포넌트 16개가 갤러리에서 열리지
/// 않았습니다. 지금은 스텁을 걷어내고 브리지에 위임합니다.
ThemeData galleryTheme(Brightness brightness) => horonTheme(brightness);
