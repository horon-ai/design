import 'package:flutter/material.dart';

import 'gallery/app.dart';
import 'gallery/section_builder.dart';

void main() {
  runApp(const GalleryApp(sectionBuilder: gallerySectionFor));
}
