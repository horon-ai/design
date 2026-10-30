/// One gallery entry: the component slug it shows, its display title and the
/// group it belongs to (inputs, display, navigation, overlays, conversation, agents).
class GallerySection {
  const GallerySection({
    required this.slug,
    required this.title,
    required this.group,
  });

  final String slug;
  final String title;
  final String group;
}

/// Every gallery section, in rail order.
///
/// todo 4's registry gate compares these slugs, in both directions, with the
/// component files under `lib/src/components/`. Each component todo adds its
/// own line here and its own `sections/<slug>.dart`.
const List<GallerySection> gallerySections = <GallerySection>[
  GallerySection(slug: 'button', title: 'Button', group: 'inputs'),
  GallerySection(slug: 'icon_button', title: 'Icon Button', group: 'inputs'),
  GallerySection(slug: 'input', title: 'Input', group: 'inputs'),
  GallerySection(slug: 'textarea', title: 'Textarea', group: 'inputs'),
  GallerySection(slug: 'field', title: 'Field', group: 'inputs'),
  GallerySection(
    slug: 'textarea_field',
    title: 'Textarea Field',
    group: 'inputs',
  ),
  GallerySection(slug: 'input_group', title: 'Input Group', group: 'inputs'),
  GallerySection(slug: 'select', title: 'Select', group: 'inputs'),
  GallerySection(slug: 'checkbox', title: 'Checkbox', group: 'inputs'),
  GallerySection(slug: 'radio_group', title: 'Radio Group', group: 'inputs'),
  GallerySection(slug: 'switch', title: 'Switch', group: 'inputs'),
  GallerySection(slug: 'slider', title: 'Slider', group: 'inputs'),
  GallerySection(slug: 'chip', title: 'Chip', group: 'inputs'),
  GallerySection(
    slug: 'segmented_control',
    title: 'Segmented Control',
    group: 'inputs',
  ),
  GallerySection(slug: 'date_field', title: 'Date Field', group: 'inputs'),
  GallerySection(slug: 'calendar', title: 'Calendar', group: 'inputs'),
  GallerySection(slug: 'schedule', title: 'Schedule', group: 'inputs'),
  GallerySection(slug: 'composer', title: 'Composer', group: 'inputs'),
  GallerySection(slug: 'split_button', title: 'Split Button', group: 'inputs'),
  GallerySection(
    slug: 'tool_permissions',
    title: 'Tool Permissions',
    group: 'inputs',
  ),
  GallerySection(slug: 'file_drop', title: 'File Drop', group: 'inputs'),
  GallerySection(slug: 'choice_card', title: 'Choice Card', group: 'inputs'),
  GallerySection(slug: 'badge', title: 'Badge', group: 'display'),
  GallerySection(slug: 'avatar', title: 'Avatar', group: 'display'),
  GallerySection(slug: 'card', title: 'Card', group: 'display'),
  GallerySection(slug: 'banner', title: 'Banner', group: 'display'),
  GallerySection(slug: 'kbd', title: 'Kbd', group: 'display'),
  GallerySection(slug: 'progress', title: 'Progress', group: 'display'),
  GallerySection(slug: 'usage_meter', title: 'Usage Meter', group: 'display'),
  GallerySection(slug: 'spinner', title: 'Spinner', group: 'display'),
  GallerySection(slug: 'skeleton', title: 'Skeleton', group: 'display'),
  GallerySection(slug: 'empty_state', title: 'Empty State', group: 'display'),
  GallerySection(
    slug: 'integration_row',
    title: 'Integration Row',
    group: 'display',
  ),
  GallerySection(slug: 'liquid_glass', title: 'Liquid Glass', group: 'display'),
  GallerySection(slug: 'horon_icon', title: 'Horon Icon', group: 'display'),
  GallerySection(
    slug: 'horon_wordmark',
    title: 'Horon Wordmark',
    group: 'display',
  ),
  GallerySection(
    slug: 'settings_list',
    title: 'Settings List',
    group: 'display',
  ),
  GallerySection(
    slug: 'mcp_server_row',
    title: 'MCP Server Row',
    group: 'display',
  ),
  GallerySection(
    slug: 'directory_card',
    title: 'Directory Card',
    group: 'display',
  ),
  GallerySection(slug: 'plugin_row', title: 'Plugin Row', group: 'display'),
  GallerySection(
    slug: 'marketplace_card',
    title: 'Marketplace Card',
    group: 'display',
  ),
  GallerySection(slug: 'list_detail', title: 'List Detail', group: 'display'),
  GallerySection(slug: 'code_panel', title: 'Code Panel', group: 'display'),
  GallerySection(slug: 'tabs', title: 'Tabs', group: 'navigation'),
  GallerySection(slug: 'tab_bar', title: 'Tab Bar', group: 'navigation'),
  GallerySection(slug: 'breadcrumb', title: 'Breadcrumb', group: 'navigation'),
  GallerySection(slug: 'sidebar', title: 'Sidebar', group: 'navigation'),
  GallerySection(
    slug: 'page_header',
    title: 'Page Header',
    group: 'navigation',
  ),
  GallerySection(slug: 'top_bar', title: 'Top Bar', group: 'navigation'),
  GallerySection(
    slug: 'breadcrumb_header',
    title: 'Breadcrumb Header',
    group: 'navigation',
  ),
  GallerySection(slug: 'filter_bar', title: 'Filter Bar', group: 'navigation'),
  GallerySection(slug: 'dialog', title: 'Dialog', group: 'overlays'),
  GallerySection(
    slug: 'bottom_sheet',
    title: 'Bottom Sheet',
    group: 'overlays',
  ),
  GallerySection(slug: 'menu', title: 'Menu', group: 'overlays'),
  GallerySection(slug: 'tooltip', title: 'Tooltip', group: 'overlays'),
  GallerySection(slug: 'toast', title: 'Toast', group: 'overlays'),
  GallerySection(
    slug: 'command_palette',
    title: 'Command Palette',
    group: 'overlays',
  ),
  GallerySection(
    slug: 'workspace_menu',
    title: 'Workspace Menu',
    group: 'overlays',
  ),
  GallerySection(
    slug: 'chat_bubble',
    title: 'Chat Bubble',
    group: 'conversation',
  ),
  GallerySection(
    slug: 'approval_card',
    title: 'Approval Card',
    group: 'conversation',
  ),
  GallerySection(
    slug: 'bot_list_row',
    title: 'Bot List Row',
    group: 'conversation',
  ),
  GallerySection(
    slug: 'chat_controls',
    title: 'Chat Controls',
    group: 'conversation',
  ),
  GallerySection(
    slug: 'message_extras',
    title: 'Message Extras',
    group: 'conversation',
  ),
  GallerySection(
    slug: 'agent_activity',
    title: 'Agent Activity',
    group: 'agents',
  ),
  GallerySection(slug: 'agent_lane', title: 'Agent Lane', group: 'agents'),
  GallerySection(slug: 'plan_step', title: 'Plan Step', group: 'agents'),
  GallerySection(slug: 'source_row', title: 'Source Row', group: 'agents'),
  GallerySection(slug: 'plan_card', title: 'Plan Card', group: 'agents'),
  GallerySection(
    slug: 'tool_calls_header',
    title: 'Tool Calls Header',
    group: 'agents',
  ),
];
