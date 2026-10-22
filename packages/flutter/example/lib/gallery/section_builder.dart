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
import 'sections/accordion.dart';
import 'sections/alert.dart';
import 'sections/alert_dialog.dart';
import 'sections/aspect_ratio.dart';
import 'sections/attachment.dart';
import 'sections/autocomplete.dart';
import 'sections/avatar.dart';
import 'sections/badge.dart';
import 'sections/breadcrumb.dart';
import 'sections/bubble.dart';
import 'sections/button.dart';
import 'sections/button_group.dart';
import 'sections/calendar.dart';
import 'sections/card.dart';
import 'sections/carousel.dart';
import 'sections/chart.dart';
import 'sections/checkbox.dart';
import 'sections/chip.dart';
import 'sections/code_block.dart';
import 'sections/collapsible.dart';
import 'sections/combobox.dart';
import 'sections/command.dart';
import 'sections/context_menu.dart';
import 'sections/data_table.dart';
import 'sections/date_picker.dart';
import 'sections/dialog.dart';
import 'sections/direction.dart';
import 'sections/drawer.dart';
import 'sections/dropdown_menu.dart';
import 'sections/empty.dart';
import 'sections/field.dart';
import 'sections/file_upload.dart';
import 'sections/form.dart';
import 'sections/glass_surface.dart';
import 'sections/hover_card.dart';
import 'sections/input.dart';
import 'sections/input_group.dart';
import 'sections/input_otp.dart';
import 'sections/item.dart';
import 'sections/kbd.dart';
import 'sections/label.dart';
import 'sections/liquid_glass.dart';
import 'sections/list.dart';
import 'sections/marker.dart';
import 'sections/menu.dart';
import 'sections/menubar.dart';
import 'sections/message.dart';
import 'sections/message_scroller.dart';
import 'sections/native_select.dart';
import 'sections/navigation_menu.dart';
import 'sections/pagination.dart';
import 'sections/popover.dart';
import 'sections/progress.dart';
import 'sections/questionnaire.dart';
import 'sections/radio_group.dart';
import 'sections/resizable.dart';
import 'sections/scroll_area.dart';
import 'sections/select.dart';
import 'sections/separator.dart';
import 'sections/sheet.dart';
import 'sections/sidebar.dart';
import 'sections/skeleton.dart';
import 'sections/slider.dart';
import 'sections/sonner.dart';
import 'sections/spinner.dart';
import 'sections/stepper.dart';
import 'sections/switch.dart';
import 'sections/table.dart';
import 'sections/tabs.dart';
import 'sections/textarea.dart';
import 'sections/toast.dart';
import 'sections/toggle.dart';
import 'sections/toggle_group.dart';
import 'sections/tooltip.dart';
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
  'alert_dialog': HoronAlertDialogGallerySection.new,
  'aspect_ratio': HoronAspectRatioGallerySection.new,
  'attachment': HoronAttachmentGallerySection.new,
  'autocomplete': HoronAutocompleteGallerySection.new,
  'avatar': HoronAvatarGallerySection.new,
  'badge': HoronBadgeGallerySection.new,
  'breadcrumb': HoronBreadcrumbGallerySection.new,
  'bubble': HoronBubbleGallerySection.new,
  'button': HoronButtonGallerySection.new,
  'button_group': HoronButtonGroupGallerySection.new,
  'calendar': HoronCalendarGallerySection.new,
  'card': HoronCardGallerySection.new,
  'carousel': HoronCarouselGallerySection.new,
  'chart': HoronChartGallerySection.new,
  'checkbox': HoronCheckboxGallerySection.new,
  'chip': HoronChipGallerySection.new,
  'code_block': HoronCodeBlockGallerySection.new,
  'collapsible': HoronCollapsibleGallerySection.new,
  'combobox': HoronComboboxGallerySection.new,
  'command': HoronCommandGallerySection.new,
  'context_menu': HoronContextMenuGallerySection.new,
  'data_table': HoronDataTableGallerySection.new,
  'date_picker': HoronDatePickerGallerySection.new,
  'dialog': HoronDialogGallerySection.new,
  'direction': HoronDirectionGallerySection.new,
  'drawer': HoronDrawerGallerySection.new,
  'dropdown_menu': HoronDropdownMenuGallerySection.new,
  'empty': HoronEmptyGallerySection.new,
  'field': HoronFieldGallerySection.new,
  'file_upload': HoronFileUploadGallerySection.new,
  'form': HoronFormGallerySection.new,
  'glass_surface': HoronGlassSurfaceGallerySection.new,
  'hover_card': HoronHoverCardGallerySection.new,
  'input': HoronInputGallerySection.new,
  'input_group': HoronInputGroupGallerySection.new,
  'input_otp': HoronInputOtpGallerySection.new,
  'item': HoronItemGallerySection.new,
  'kbd': HoronKbdGallerySection.new,
  'label': HoronLabelGallerySection.new,
  'liquid_glass': HoronLiquidGlassGallerySection.new,
  'list': HoronListGallerySection.new,
  'marker': HoronMarkerGallerySection.new,
  'menu': HoronMenuGallerySection.new,
  'menubar': HoronMenubarGallerySection.new,
  'message': HoronMessageGallerySection.new,
  'message_scroller': HoronMessageScrollerGallerySection.new,
  'native_select': HoronNativeSelectGallerySection.new,
  'navigation_menu': HoronNavigationMenuGallerySection.new,
  'pagination': HoronPaginationGallerySection.new,
  'popover': HoronPopoverGallerySection.new,
  'progress': HoronProgressGallerySection.new,
  'questionnaire': HoronQuestionnaireGallerySection.new,
  'radio_group': HoronRadioGroupGallerySection.new,
  'resizable': HoronResizableGallerySection.new,
  'scroll_area': HoronScrollAreaGallerySection.new,
  'select': HoronSelectGallerySection.new,
  'separator': HoronSeparatorGallerySection.new,
  'sheet': HoronSheetGallerySection.new,
  'sidebar': HoronSidebarGallerySection.new,
  'skeleton': HoronSkeletonGallerySection.new,
  'slider': HoronSliderGallerySection.new,
  'sonner': HoronSonnerGallerySection.new,
  'spinner': HoronSpinnerGallerySection.new,
  'stepper': HoronStepperGallerySection.new,
  'switch': HoronSwitchGallerySection.new,
  'table': HoronTableGallerySection.new,
  'tabs': HoronTabsGallerySection.new,
  'textarea': HoronTextareaGallerySection.new,
  'toast': HoronToastGallerySection.new,
  'toggle': HoronToggleGallerySection.new,
  'toggle_group': HoronToggleGroupGallerySection.new,
  'tooltip': HoronTooltipGallerySection.new,
  'typography': HoronTypographyGallerySection.new,
};

/// 이 표가 알고 있는 슬러그입니다.
///
/// 갤러리 렌더 확인 테스트가 이 목록을 순회합니다. 등록부가 아직 비어 있어도
/// 섹션 위젯 자체는 전부 그려 볼 수 있습니다.
Set<String> get gallerySectionBuilderSlugs => _builders.keys.toSet();
