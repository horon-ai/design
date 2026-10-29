// 슬러그를 갤러리 섹션 위젯으로 바꾸는 표입니다.
//
// 셸은 `sectionBuilder`가 없으면 `notImplemented` 자리표시자를 그립니다. 그래서
// 섹션 파일이 있어도 앱 진입점이 이 값을 넘기지 않으면 화면에는 하나도 나오지
// 않습니다. 이 파일이 그 연결을 소유합니다.
//
// 이 파일은 `scripts/integrate.mjs`가 만듭니다. 손으로 고치지 않습니다.
// 표에 없는 슬러그는 `null`을 돌려주고 셸이 자리표시자를 그립니다.

import 'package:flutter/widgets.dart';

import 'registry.dart';
import 'sections/avatar.dart';
import 'sections/banner.dart';
import 'sections/button.dart';
import 'sections/checkbox.dart';
import 'sections/chip.dart';
import 'sections/choice_card.dart';
import 'sections/code_panel.dart';
import 'sections/composer.dart';
import 'sections/empty_state.dart';
import 'sections/file_drop.dart';
import 'sections/icon_button.dart';
import 'sections/kbd.dart';
import 'sections/liquid_glass.dart';
import 'sections/progress.dart';
import 'sections/radio_group.dart';
import 'sections/skeleton.dart';
import 'sections/slider.dart';
import 'sections/spinner.dart';
import 'sections/split_button.dart';
import 'sections/switch.dart';
import 'sections/tool_permissions.dart';

/// 섹션 위젯을 슬러그로 찾습니다.
///
/// 등록되지 않은 슬러그면 `null`을 돌려주고, 셸이 자리표시자를 그립니다.
Widget? gallerySectionFor(BuildContext context, GallerySection section) =>
    _builders[section.slug]?.call();

/// 슬러그별 섹션 생성자입니다.
const Map<String, Widget Function()> _builders = <String, Widget Function()>{
  'avatar': HoronAvatarGallerySection.new,
  'banner': HoronBannerGallerySection.new,
  'button': HoronButtonGallerySection.new,
  'checkbox': HoronCheckboxGallerySection.new,
  'chip': HoronChipGallerySection.new,
  'choice_card': HoronChoiceCardGallerySection.new,
  'code_panel': HoronCodePanelGallerySection.new,
  'composer': HoronComposerGallerySection.new,
  'empty_state': HoronEmptyStateGallerySection.new,
  'file_drop': HoronFileDropGallerySection.new,
  'icon_button': HoronIconButtonGallerySection.new,
  'kbd': HoronKbdGallerySection.new,
  'liquid_glass': HoronLiquidGlassGallerySection.new,
  'progress': HoronProgressGallerySection.new,
  'radio_group': HoronRadioGroupGallerySection.new,
  'skeleton': HoronSkeletonGallerySection.new,
  'slider': HoronSliderGallerySection.new,
  'spinner': HoronSpinnerGallerySection.new,
  'split_button': HoronSplitButtonGallerySection.new,
  'switch': HoronSwitchGallerySection.new,
  'tool_permissions': HoronToolPermissionsGallerySection.new,
};

/// 이 표가 알고 있는 슬러그입니다.
///
/// 갤러리 렌더 확인 테스트가 이 목록을 순회합니다. 등록부가 아직 비어 있어도
/// 섹션 위젯 자체는 전부 그려 볼 수 있습니다.
Set<String> get gallerySectionBuilderSlugs => _builders.keys.toSet();
