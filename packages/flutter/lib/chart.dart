/// Horon UI의 차트입니다. 이 하위 경로로만 엽니다.
///
/// `fl_chart`는 앱 번들에 늘 실려야 하는 패키지가 아닙니다. `lib/horon_ui.dart`가 이
/// 파일을 export하면 디자인 시스템을 쓰는 모든 앱이 `fl_chart`까지 싣게 되므로,
/// 차트가 필요한 앱만 `package:horon_ui/chart.dart`를 import합니다. React 패키지가
/// `chart`를 진입점에서 빼 둔 것과 같은 이유입니다.
///
/// ```dart
/// import 'package:horon_ui/horon_ui.dart';
/// import 'package:horon_ui/chart.dart';
/// ```
library;

export 'src/components/chart.dart';
