import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';
import 'pending_components.dart';

/// The gallery registry is what the example app renders from, so a registry
/// entry with no component does not compile, and a component that is not
/// registered is invisible.
///
/// `example/lib/gallery/registry.dart` is integrator-owned: only
/// `scripts/integrate.mjs` writes it, so a lane cannot register its own
/// section. The two directions therefore differ:
///
///  * a registry slug with no `lib/src/components/<slug>.dart` always fails;
///  * a component file that is not registered fails only when its slug is NOT
///    in `pendingComponents`.
///
/// The ledger is the migration window and the empty ledger is the contract: a
/// slug still listed as pending may have a file and no registry entry, and once
/// the integrator removes it from the ledger the registry must list it. With
/// zero components and an empty registry every check here is green; the parity
/// gate reports what is still owed.
///
/// `example/` is a separate package, so the registry is parsed as source rather
/// than imported.
void main() {
  test('gallery: the registry and the component files agree', () {
    final registered = gallerySectionSlugs();
    final implemented = implementedComponentSlugs();
    final pending = pendingComponents.toSet();

    final unregistered = (implemented.difference(registered).difference(pending).toList()..sort());
    final orphaned = (registered.difference(implemented).toList()..sort());

    expect(
      orphaned,
      isEmpty,
      reason:
          'Gallery sections with no component file: $orphaned. '
          'Each entry must name a lib/src/components/<slug>.dart file.',
    );
    expect(
      unregistered,
      isEmpty,
      reason:
          'Components that are not pending and have no gallery section: $unregistered. '
          'Run scripts/integrate.mjs to register them.',
    );
  });

  test('gallery: the registry source is readable', () {
    // The parser saw the file. An empty registry is legitimate, so the content
    // is not required to be non-empty.
    expect(galleryRegistrySource(), contains('gallerySections'));
    // The parser must read entries, not just survive an empty list.
    expect(gallerySectionSlugsIn("const x = [GallerySection(slug: 'a', title: 'A', group: 'inputs')];"), <String>{'a'});
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
