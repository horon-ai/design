import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';
import 'pending_components.dart';

/// The gallery registry is what the example app renders from, so a component
/// that exists in the library but is not registered is invisible, and a
/// registry entry with no component does not compile. Both directions are
/// checked here.
///
/// `example/` is a separate package, so the registry is parsed as source rather
/// than imported.
void main() {
  test('gallery: every component is registered as a gallery section', () {
    final registered = gallerySectionSlugs();
    final implemented = implementedComponentSlugs();

    final unregistered = (implemented.difference(registered).toList()..sort());
    final orphaned = (registered.difference(implemented).toList()..sort());

    expect(
      unregistered,
      isEmpty,
      reason:
          'Components with no gallery section: $unregistered. '
          'Add example/lib/gallery/sections/<slug>.dart and a GallerySection entry.',
    );
    expect(
      orphaned,
      isEmpty,
      reason:
          'Gallery sections with no component file: $orphaned. '
          'Each entry must name a lib/src/components/<slug>.dart file.',
    );
  });

  test('gallery: the registry source is readable', () {
    expect(galleryRegistrySource(), contains('gallerySections'));
  });

  test('gallery: registered slugs are React components', () {
    final react = reactComponentSlugs();
    final unknown = (gallerySectionSlugs().difference(react).toList()..sort());
    expect(unknown, isEmpty, reason: 'Gallery sections that are not React components: $unknown');
  });

  test('gallery: every pending slug is still pending', () {
    // Guards against a registry entry written ahead of its component file.
    final registeredPending = (gallerySectionSlugs().intersection(pendingComponents.toSet()).toList()..sort());
    expect(
      registeredPending,
      isEmpty,
      reason:
          'These slugs are still in pendingComponents but already have a gallery entry: '
          '$registeredPending',
    );
  });
}
