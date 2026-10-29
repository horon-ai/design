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
  GallerySection(slug: 'liquid_glass', title: 'Liquid Glass', group: 'display'),
];
