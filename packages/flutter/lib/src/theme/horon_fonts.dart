/// 호스트 앱이 등록하는 폰트 패밀리 이름입니다.
///
/// 이 패키지는 폰트 파일을 번들하지 않습니다. 앱 자산은 패키지에서 읽을 수 없고,
/// `flutter_test`는 폰트를 싣지 않기 때문입니다. 호스트 앱이 `pubspec.yaml`의 `fonts:`
/// 절에 패밀리를 등록하면 컴포넌트는 그 이름을 그대로 씁니다. 이름을 여기 상수로 두는
/// 이유는 오타 한 글자로 화면 전체가 대체 글꼴로 떨어지는 일을 막기 위해서입니다.
///
/// 이름과 대체 목록은 `packages/tokens/src/typography.ts`의 `fontFamily` 스택과 같습니다.
/// 굵기는 네 개(400/500/600/700)뿐이고, 토큰을 따라 생성된 [HoronFontWeight]가
/// `regular`·`medium`·`semibold`·`bold`로 노출합니다. Thin과 Light는 제품에 없습니다.
library;

/// horon이 쓰는 폰트 패밀리입니다.
abstract final class HoronFont {
  /// 본문 패밀리입니다. `fontFamily.sans` 스택의 첫 이름입니다.
  static const String sans = 'Pretendard Variable';

  /// [sans] 뒤에 두는 대체 패밀리입니다.
  ///
  /// 여기 없는 글리프를 Pretendard가 받아 그리지 못하면 `system-ui`, `sans-serif`로
  /// 넘어갑니다. 순서를 바꾸면 웹과 글리프가 달라집니다.
  static const List<String> sansFallback = <String>['Pretendard', 'system-ui', 'sans-serif'];

  /// 코드용 고정폭 패밀리입니다. `fontFamily.mono` 스택의 첫 이름입니다.
  static const String mono = 'Geist Mono Variable';

  /// [mono] 뒤에 두는 대체 패밀리입니다.
  static const List<String> monoFallback = <String>['Geist Mono', 'ui-monospace', 'monospace'];

  /// 아이콘 글리프를 담은 패밀리입니다. 코드포인트는 호스트가 공급합니다.
  static const String icon = 'BuzzTabler';

  /// 본문 패밀리의 v1 이름입니다. [sans]와 같은 값입니다.
  static const String body = sans;

  /// v1 이름의 대체 목록입니다. [sansFallback]과 같은 값입니다.
  ///
  /// `TextStyle(fontFamily: HoronFont.sans, fontFamilyFallback: HoronFont.sansFallback)`
  /// 처럼 씁니다. 생성된 타이포 스타일은 이미 이 목록을 달고 있습니다.
  static const List<String> fontFamilyFallback = sansFallback;
}
