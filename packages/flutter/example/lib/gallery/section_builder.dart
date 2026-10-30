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
import 'sections/agent_activity.dart';
import 'sections/agent_lane.dart';
import 'sections/approval_card.dart';
import 'sections/avatar.dart';
import 'sections/badge.dart';
import 'sections/banner.dart';
import 'sections/bot_list_row.dart';
import 'sections/bottom_sheet.dart';
import 'sections/breadcrumb.dart';
import 'sections/breadcrumb_header.dart';
import 'sections/button.dart';
import 'sections/calendar.dart';
import 'sections/card.dart';
import 'sections/chat_bubble.dart';
import 'sections/chat_controls.dart';
import 'sections/checkbox.dart';
import 'sections/chip.dart';
import 'sections/choice_card.dart';
import 'sections/code_panel.dart';
import 'sections/command_palette.dart';
import 'sections/composer.dart';
import 'sections/date_field.dart';
import 'sections/dialog.dart';
import 'sections/directory_card.dart';
import 'sections/empty_state.dart';
import 'sections/field.dart';
import 'sections/file_drop.dart';
import 'sections/filter_bar.dart';
import 'sections/horon_icon.dart';
import 'sections/horon_wordmark.dart';
import 'sections/icon_button.dart';
import 'sections/input.dart';
import 'sections/input_group.dart';
import 'sections/integration_row.dart';
import 'sections/kbd.dart';
import 'sections/liquid_glass.dart';
import 'sections/list_detail.dart';
import 'sections/marketplace_card.dart';
import 'sections/mcp_server_row.dart';
import 'sections/menu.dart';
import 'sections/message_extras.dart';
import 'sections/page_header.dart';
import 'sections/plan_card.dart';
import 'sections/plan_step.dart';
import 'sections/plugin_row.dart';
import 'sections/progress.dart';
import 'sections/radio_group.dart';
import 'sections/schedule.dart';
import 'sections/segmented_control.dart';
import 'sections/select.dart';
import 'sections/settings_list.dart';
import 'sections/sidebar.dart';
import 'sections/skeleton.dart';
import 'sections/slider.dart';
import 'sections/source_row.dart';
import 'sections/spinner.dart';
import 'sections/split_button.dart';
import 'sections/switch.dart';
import 'sections/tab_bar.dart';
import 'sections/tabs.dart';
import 'sections/textarea.dart';
import 'sections/textarea_field.dart';
import 'sections/toast.dart';
import 'sections/tool_calls_header.dart';
import 'sections/tool_permissions.dart';
import 'sections/tooltip.dart';
import 'sections/top_bar.dart';
import 'sections/usage_meter.dart';
import 'sections/workspace_menu.dart';

/// 섹션 위젯을 슬러그로 찾습니다.
///
/// 등록되지 않은 슬러그면 `null`을 돌려주고, 셸이 자리표시자를 그립니다.
Widget? gallerySectionFor(BuildContext context, GallerySection section) =>
    _builders[section.slug]?.call();

/// 슬러그별 섹션 생성자입니다.
const Map<String, Widget Function()> _builders = <String, Widget Function()>{
  'agent_activity': HoronAgentActivityGallerySection.new,
  'agent_lane': HoronAgentLaneGallerySection.new,
  'approval_card': HoronApprovalCardGallerySection.new,
  'avatar': HoronAvatarGallerySection.new,
  'badge': HoronBadgeGallerySection.new,
  'banner': HoronBannerGallerySection.new,
  'bot_list_row': HoronBotListRowGallerySection.new,
  'bottom_sheet': HoronBottomSheetGallerySection.new,
  'breadcrumb': HoronBreadcrumbGallerySection.new,
  'breadcrumb_header': HoronBreadcrumbHeaderGallerySection.new,
  'button': HoronButtonGallerySection.new,
  'calendar': HoronCalendarGallerySection.new,
  'card': HoronCardGallerySection.new,
  'chat_bubble': HoronChatBubbleGallerySection.new,
  'chat_controls': HoronChatControlsGallerySection.new,
  'checkbox': HoronCheckboxGallerySection.new,
  'chip': HoronChipGallerySection.new,
  'choice_card': HoronChoiceCardGallerySection.new,
  'code_panel': HoronCodePanelGallerySection.new,
  'command_palette': HoronCommandPaletteGallerySection.new,
  'composer': HoronComposerGallerySection.new,
  'date_field': HoronDateFieldGallerySection.new,
  'dialog': HoronDialogGallerySection.new,
  'directory_card': HoronDirectoryCardGallerySection.new,
  'empty_state': HoronEmptyStateGallerySection.new,
  'field': HoronFieldGallerySection.new,
  'file_drop': HoronFileDropGallerySection.new,
  'filter_bar': HoronFilterBarGallerySection.new,
  'horon_icon': HoronIconGallerySection.new,
  'horon_wordmark': HoronWordmarkGallerySection.new,
  'icon_button': HoronIconButtonGallerySection.new,
  'input': HoronInputGallerySection.new,
  'input_group': HoronInputGroupGallerySection.new,
  'integration_row': HoronIntegrationRowGallerySection.new,
  'kbd': HoronKbdGallerySection.new,
  'liquid_glass': HoronLiquidGlassGallerySection.new,
  'list_detail': HoronListDetailGallerySection.new,
  'marketplace_card': HoronMarketplaceCardGallerySection.new,
  'mcp_server_row': HoronMcpServerRowGallerySection.new,
  'menu': HoronMenuGallerySection.new,
  'message_extras': HoronMessageExtrasGallerySection.new,
  'page_header': HoronPageHeaderGallerySection.new,
  'plan_card': HoronPlanCardGallerySection.new,
  'plan_step': HoronPlanStepGallerySection.new,
  'plugin_row': HoronPluginRowGallerySection.new,
  'progress': HoronProgressGallerySection.new,
  'radio_group': HoronRadioGroupGallerySection.new,
  'schedule': HoronScheduleGallerySection.new,
  'segmented_control': HoronSegmentedControlGallerySection.new,
  'select': HoronSelectGallerySection.new,
  'settings_list': HoronSettingsListGallerySection.new,
  'sidebar': HoronSidebarGallerySection.new,
  'skeleton': HoronSkeletonGallerySection.new,
  'slider': HoronSliderGallerySection.new,
  'source_row': HoronSourceRowGallerySection.new,
  'spinner': HoronSpinnerGallerySection.new,
  'split_button': HoronSplitButtonGallerySection.new,
  'switch': HoronSwitchGallerySection.new,
  'tab_bar': HoronTabBarGallerySection.new,
  'tabs': HoronTabsGallerySection.new,
  'textarea': HoronTextareaGallerySection.new,
  'textarea_field': HoronTextareaFieldGallerySection.new,
  'toast': HoronToastGallerySection.new,
  'tool_calls_header': HoronToolCallsHeaderGallerySection.new,
  'tool_permissions': HoronToolPermissionsGallerySection.new,
  'tooltip': HoronTooltipGallerySection.new,
  'top_bar': HoronTopBarGallerySection.new,
  'usage_meter': HoronUsageMeterGallerySection.new,
  'workspace_menu': HoronWorkspaceMenuGallerySection.new,
};

/// 이 표가 알고 있는 슬러그입니다.
///
/// 갤러리 렌더 확인 테스트가 이 목록을 순회합니다. 등록부가 아직 비어 있어도
/// 섹션 위젯 자체는 전부 그려 볼 수 있습니다.
Set<String> get gallerySectionBuilderSlugs => _builders.keys.toSet();
