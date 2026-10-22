import 'package:flutter/material.dart';

import 'gallery_strings.dart';
import 'gallery_theme.dart';
import 'registry.dart';
import 'shell.dart';

/// 갤러리 앱의 루트입니다.
///
/// 테마와 언어를 소유합니다. 셸은 이 값을 받아 그리고, 바꾸려는 값만 콜백으로 올립니다.
class GalleryApp extends StatefulWidget {
  /// 기본 생성자입니다.
  const GalleryApp({
    super.key,
    this.sections = gallerySections,
    this.sectionBuilder,
  });

  /// 레일에 나열할 섹션입니다.
  final List<GallerySection> sections;

  /// 섹션 본문을 만드는 함수입니다.
  final Widget Function(BuildContext context, GallerySection section)?
  sectionBuilder;

  @override
  State<GalleryApp> createState() => _GalleryAppState();
}

class _GalleryAppState extends State<GalleryApp> {
  Brightness _brightness = Brightness.light;
  GalleryLanguage _language = GalleryLanguage.ko;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'horon_ui gallery',
      debugShowCheckedModeBanner: false,
      theme: galleryTheme(Brightness.light),
      darkTheme: galleryTheme(Brightness.dark),
      themeMode: _brightness == Brightness.dark
          ? ThemeMode.dark
          : ThemeMode.light,
      home: GalleryShell(
        sections: widget.sections,
        sectionBuilder: widget.sectionBuilder,
        brightness: _brightness,
        language: _language,
        onBrightnessChanged: (Brightness value) =>
            setState(() => _brightness = value),
        onLanguageChanged: (GalleryLanguage value) =>
            setState(() => _language = value),
      ),
    );
  }
}
