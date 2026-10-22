import 'package:flutter_test/flutter_test.dart';

import '../gates/pending_components.dart';

/// The final gate: the pending ledger must be empty once every component has
/// landed.
///
/// It lives outside `test/gates/` on purpose. The ledger is legitimately
/// non-empty while the port is being built, and `test/gates/` is the suite every
/// component todo runs as its acceptance criterion — a permanently red test
/// there would block each of them. This file is the one todo 24 runs explicitly:
///
///     flutter test test/gates_final
///
/// Note that a bare `flutter test` includes this file and therefore fails until
/// todo 24. Component todos run `flutter test test/gates` and are unaffected.
void main() {
  test('parity: the pending ledger is empty', () {
    expect(
      pendingComponents,
      isEmpty,
      reason:
          'Components still unported: ${pendingComponents.toList()..sort()}. '
          'Each of them needs lib/src/components/<slug>.dart, a barrel export, '
          'a gallery section, and its slug removed from the ledger.',
    );
  });
}
