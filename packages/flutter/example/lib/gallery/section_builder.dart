// 슬러그를 갤러리 섹션 위젯으로 바꾸는 표입니다.
//
// 셸은 `sectionBuilder`가 없으면 `notImplemented` 자리표시자를 그립니다. 그래서
// 섹션 파일이 43개 있어도 앱 진입점이 이 값을 넘기지 않으면 화면에는 하나도
// 나오지 않습니다. 이 파일이 그 연결을 소유합니다.
//
// 이름 규칙은 `sections/<slug>.dart`의 `Horon<Pascal>GallerySection` 하나뿐이고,
// 2026-10-22에 43개 파일 전부가 그 규칙을 지키는 것을 확인했습니다. 섹션을
// 추가할 때 같은 규칙을 지키면 이 표에 한 줄만 더하면 됩니다. 표에 없는
// 슬러그는 `null`을 돌려주고 셸이 자리표시자를 그립니다.

import 'package:flutter/widgets.dart';

import 'registry.dart';
import 'sections/accordion.dart';
import 'sections/alert.dart';
import 'sections/aspect_ratio.dart';
import 'sections/avatar.dart';
import 'sections/badge.dart';
import 'sections/breadcrumb.dart';
import 'sections/button.dart';
import 'sections/button_group.dart';
import 'sections/card.dart';
import 'sections/checkbox.dart';
import 'sections/chip.dart';
import 'sections/code_block.dart';
import 'sections/collapsible.dart';
import 'sections/empty.dart';
import 'sections/field.dart';
import 'sections/form.dart';
import 'sections/glass_surface.dart';
import 'sections/input.dart';
import 'sections/input_group.dart';
import 'sections/item.dart';
import 'sections/kbd.dart';
import 'sections/label.dart';
import 'sections/liquid_glass.dart';
import 'sections/list.dart';
import 'sections/marker.dart';
import 'sections/pagination.dart';
import 'sections/progress.dart';
import 'sections/radio_group.dart';
import 'sections/resizable.dart';
import 'sections/scroll_area.dart';
import 'sections/separator.dart';
import 'sections/sidebar.dart';
import 'sections/skeleton.dart';
import 'sections/slider.dart';
import 'sections/spinner.dart';
import 'sections/stepper.dart';
import 'sections/switch.dart';
import 'sections/table.dart';
import 'sections/tabs.dart';
import 'sections/textarea.dart';
import 'sections/toggle.dart';
import 'sections/toggle_group.dart';
import 'sections/typography.dart';

/// 섹션 위젯을 슬러그로 찾습니다.
///
/// 등록되지 않은 슬러그면 `null`을 돌려주고, 셸이 자리표시자를 그립니다.
Widget? gallerySectionFor(BuildContext context, GallerySection section) =>
    _builders[section.slug]?.call();

/// 슬러그별 섹션 생성자입니다.
const Map<String, Widget Function()> _builders = <String, Widget Function()>{
  'accordion': HoronAccordionGallerySection.new,
  'alert': HoronAlertGallerySection.new,
  'aspect_ratio': HoronAspectRatioGallerySection.new,
  'avatar': HoronAvatarGallerySection.new,
  'badge': HoronBadgeGallerySection.new,
  'breadcrumb': HoronBreadcrumbGallerySection.new,
  'button': HoronButtonGallerySection.new,
  'button_group': HoronButtonGroupGallerySection.new,
  'card': HoronCardGallerySection.new,
  'checkbox': HoronCheckboxGallerySection.new,
  'chip': HoronChipGallerySection.new,
  'code_block': HoronCodeBlockGallerySection.new,
  'collapsible': HoronCollapsibleGallerySection.new,
  'empty': HoronEmptyGallerySection.new,
  'field': HoronFieldGallerySection.new,
  'form': HoronFormGallerySection.new,
  'glass_surface': HoronGlassSurfaceGallerySection.new,
  'input': HoronInputGallerySection.new,
  'input_group': HoronInputGroupGallerySection.new,
  'item': HoronItemGallerySection.new,
  'kbd': HoronKbdGallerySection.new,
  'label': HoronLabelGallerySection.new,
  'liquid_glass': HoronLiquidGlassGallerySection.new,
  'list': HoronListGallerySection.new,
  'marker': HoronMarkerGallerySection.new,
  'pagination': HoronPaginationGallerySection.new,
  'progress': HoronProgressGallerySection.new,
  'radio_group': HoronRadioGroupGallerySection.new,
  'resizable': HoronResizableGallerySection.new,
  'scroll_area': HoronScrollAreaGallerySection.new,
  'separator': HoronSeparatorGallerySection.new,
  'sidebar': HoronSidebarGallerySection.new,
  'skeleton': HoronSkeletonGallerySection.new,
  'slider': HoronSliderGallerySection.new,
  'spinner': HoronSpinnerGallerySection.new,
  'stepper': HoronStepperGallerySection.new,
  'switch': HoronSwitchGallerySection.new,
  'table': HoronTableGallerySection.new,
  'tabs': HoronTabsGallerySection.new,
  'textarea': HoronTextareaGallerySection.new,
  'toggle': HoronToggleGallerySection.new,
  'toggle_group': HoronToggleGroupGallerySection.new,
  'typography': HoronTypographyGallerySection.new,
};
