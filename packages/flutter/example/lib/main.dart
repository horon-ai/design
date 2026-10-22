import 'package:flutter/material.dart';

void main() {
  runApp(const HoronUiGalleryApp());
}

/// 갤러리 앱의 루트입니다. 섹션은 `gallery/registry.dart`가 정합니다.
class HoronUiGalleryApp extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronUiGalleryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'horon_ui gallery',
      home: Scaffold(body: Center(child: Text('horon_ui gallery'))),
    );
  }
}
