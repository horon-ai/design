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
  GallerySection(slug: 'checkbox', title: 'Checkbox', group: 'inputs'),
  GallerySection(slug: 'radio_group', title: 'Radio Group', group: 'inputs'),
  GallerySection(slug: 'switch', title: 'Switch', group: 'inputs'),
  GallerySection(slug: 'slider', title: 'Slider', group: 'inputs'),
  GallerySection(slug: 'chip', title: 'Chip', group: 'inputs'),
  GallerySection(slug: 'composer', title: 'Composer', group: 'inputs'),
  GallerySection(slug: 'split_button', title: 'Split Button', group: 'inputs'),
  GallerySection(
    slug: 'tool_permissions',
    title: 'Tool Permissions',
    group: 'inputs',
  ),
  GallerySection(slug: 'file_drop', title: 'File Drop', group: 'inputs'),
  GallerySection(slug: 'choice_card', title: 'Choice Card', group: 'inputs'),
  GallerySection(slug: 'avatar', title: 'Avatar', group: 'display'),
  GallerySection(slug: 'banner', title: 'Banner', group: 'display'),
  GallerySection(slug: 'kbd', title: 'Kbd', group: 'display'),
  GallerySection(slug: 'progress', title: 'Progress', group: 'display'),
  GallerySection(slug: 'usage_meter', title: 'Usage Meter', group: 'display'),
  GallerySection(slug: 'spinner', title: 'Spinner', group: 'display'),
  GallerySection(slug: 'skeleton', title: 'Skeleton', group: 'display'),
  GallerySection(slug: 'empty_state', title: 'Empty State', group: 'display'),
  GallerySection(slug: 'liquid_glass', title: 'Liquid Glass', group: 'display'),
  GallerySection(
    slug: 'directory_card',
    title: 'Directory Card',
    group: 'display',
  ),
  GallerySection(slug: 'code_panel', title: 'Code Panel', group: 'display'),
];
