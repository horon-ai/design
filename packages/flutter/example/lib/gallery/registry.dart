/// One gallery entry: the component slug it shows, its display title and the
/// group it belongs to (inputs, display, navigation, overlays, layout).
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
  GallerySection(slug: 'button_group', title: 'Button Group', group: 'inputs'),
  GallerySection(slug: 'input', title: 'Input', group: 'inputs'),
  GallerySection(slug: 'input_group', title: 'Input Group', group: 'inputs'),
  GallerySection(slug: 'textarea', title: 'Textarea', group: 'inputs'),
  GallerySection(slug: 'checkbox', title: 'Checkbox', group: 'inputs'),
  GallerySection(slug: 'radio_group', title: 'Radio Group', group: 'inputs'),
  GallerySection(slug: 'switch', title: 'Switch', group: 'inputs'),
  GallerySection(slug: 'slider', title: 'Slider', group: 'inputs'),
  GallerySection(slug: 'select', title: 'Select', group: 'inputs'),
  GallerySection(
    slug: 'native_select',
    title: 'Native Select',
    group: 'inputs',
  ),
  GallerySection(slug: 'combobox', title: 'Combobox', group: 'inputs'),
  GallerySection(slug: 'autocomplete', title: 'Autocomplete', group: 'inputs'),
  GallerySection(slug: 'date_picker', title: 'Date Picker', group: 'inputs'),
  GallerySection(slug: 'calendar', title: 'Calendar', group: 'inputs'),
  GallerySection(slug: 'input_otp', title: 'Input OTP', group: 'inputs'),
  GallerySection(slug: 'form', title: 'Form', group: 'inputs'),
  GallerySection(slug: 'field', title: 'Field', group: 'inputs'),
  GallerySection(slug: 'label', title: 'Label', group: 'inputs'),
  GallerySection(slug: 'file_upload', title: 'File Upload', group: 'inputs'),
  GallerySection(slug: 'attachment', title: 'Attachment', group: 'inputs'),
  GallerySection(
    slug: 'questionnaire',
    title: 'Questionnaire',
    group: 'inputs',
  ),
  GallerySection(slug: 'toggle', title: 'Toggle', group: 'inputs'),
  GallerySection(slug: 'toggle_group', title: 'Toggle Group', group: 'inputs'),
  GallerySection(slug: 'alert', title: 'Alert', group: 'display'),
  GallerySection(slug: 'badge', title: 'Badge', group: 'display'),
  GallerySection(slug: 'chip', title: 'Chip', group: 'display'),
  GallerySection(slug: 'avatar', title: 'Avatar', group: 'display'),
  GallerySection(slug: 'card', title: 'Card', group: 'display'),
  GallerySection(slug: 'table', title: 'Table', group: 'display'),
  GallerySection(slug: 'data_table', title: 'Data Table', group: 'display'),
  GallerySection(slug: 'list', title: 'List', group: 'display'),
  GallerySection(slug: 'item', title: 'Item', group: 'display'),
  GallerySection(slug: 'typography', title: 'Typography', group: 'display'),
  GallerySection(slug: 'kbd', title: 'Kbd', group: 'display'),
  GallerySection(slug: 'code_block', title: 'Code Block', group: 'display'),
  GallerySection(slug: 'progress', title: 'Progress', group: 'display'),
  GallerySection(slug: 'spinner', title: 'Spinner', group: 'display'),
  GallerySection(slug: 'skeleton', title: 'Skeleton', group: 'display'),
  GallerySection(slug: 'empty', title: 'Empty', group: 'display'),
  GallerySection(slug: 'aspect_ratio', title: 'Aspect Ratio', group: 'display'),
  GallerySection(slug: 'separator', title: 'Separator', group: 'display'),
  GallerySection(slug: 'marker', title: 'Marker', group: 'display'),
  GallerySection(slug: 'bubble', title: 'Bubble', group: 'display'),
  GallerySection(slug: 'message', title: 'Message', group: 'display'),
  GallerySection(
    slug: 'message_scroller',
    title: 'Message Scroller',
    group: 'display',
  ),
  GallerySection(slug: 'tabs', title: 'Tabs', group: 'navigation'),
  GallerySection(slug: 'breadcrumb', title: 'Breadcrumb', group: 'navigation'),
  GallerySection(slug: 'pagination', title: 'Pagination', group: 'navigation'),
  GallerySection(
    slug: 'navigation_menu',
    title: 'Navigation Menu',
    group: 'navigation',
  ),
  GallerySection(slug: 'menubar', title: 'Menubar', group: 'navigation'),
  GallerySection(slug: 'sidebar', title: 'Sidebar', group: 'navigation'),
  GallerySection(slug: 'stepper', title: 'Stepper', group: 'navigation'),
  GallerySection(slug: 'command', title: 'Command', group: 'navigation'),
  GallerySection(slug: 'dialog', title: 'Dialog', group: 'overlays'),
  GallerySection(
    slug: 'alert_dialog',
    title: 'Alert Dialog',
    group: 'overlays',
  ),
  GallerySection(slug: 'sheet', title: 'Sheet', group: 'overlays'),
  GallerySection(slug: 'drawer', title: 'Drawer', group: 'overlays'),
  GallerySection(slug: 'popover', title: 'Popover', group: 'overlays'),
  GallerySection(slug: 'hover_card', title: 'Hover Card', group: 'overlays'),
  GallerySection(slug: 'tooltip', title: 'Tooltip', group: 'overlays'),
  GallerySection(
    slug: 'dropdown_menu',
    title: 'Dropdown Menu',
    group: 'overlays',
  ),
  GallerySection(
    slug: 'context_menu',
    title: 'Context Menu',
    group: 'overlays',
  ),
  GallerySection(slug: 'menu', title: 'Menu', group: 'overlays'),
  GallerySection(slug: 'toast', title: 'Toast', group: 'overlays'),
  GallerySection(slug: 'sonner', title: 'Sonner', group: 'overlays'),
  GallerySection(slug: 'accordion', title: 'Accordion', group: 'layout'),
  GallerySection(slug: 'collapsible', title: 'Collapsible', group: 'layout'),
  GallerySection(slug: 'resizable', title: 'Resizable', group: 'layout'),
  GallerySection(slug: 'scroll_area', title: 'Scroll Area', group: 'layout'),
  GallerySection(slug: 'carousel', title: 'Carousel', group: 'layout'),
  GallerySection(slug: 'direction', title: 'Direction', group: 'layout'),
  GallerySection(
    slug: 'glass_surface',
    title: 'Glass Surface',
    group: 'layout',
  ),
  GallerySection(slug: 'liquid_glass', title: 'Liquid Glass', group: 'layout'),
  GallerySection(slug: 'chart', title: 'Chart', group: 'layout'),
];
