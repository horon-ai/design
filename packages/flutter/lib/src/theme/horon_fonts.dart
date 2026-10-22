/// 호스트 앱이 등록하는 폰트 패밀리 이름입니다.
///
/// 이 패키지는 폰트 파일을 번들하지 않습니다. 앱 자산은 패키지에서 읽을 수 없고,
/// `flutter_test`는 폰트를 싣지 않기 때문입니다. 호스트 앱이 `pubspec.yaml`의
/// `fonts:` 절에 네 패밀리를 등록하면(예: `mobile/pubspec.yaml`) 컴포넌트는 그 이름을
/// 그대로 씁니다. 이름을 여기 상수로 두는 이유는 오타 한 글자로 화면 전체가
/// 대체 글꼴로 떨어지는 일을 막기 위해서입니다.
library;

/// horon이 쓰는 네 폰트 패밀리입니다.
abstract final class HoronFont {
  /// 한글 글리프를 담은 본문 패밀리입니다.
  static const String body = 'Pretendard';

  /// 라틴 문자를 담은 대체 패밀리입니다.
  static const String latin = 'Geist';

  /// 코드용 고정폭 패밀리입니다.
  static const String mono = 'GeistMono';

  /// 아이콘 글리프를 담은 패밀리입니다. 코드포인트는 호스트가 공급합니다.
  static const String icon = 'BuzzTabler';

  /// 본문 패밀리 뒤에 두는 대체 패밀리 목록입니다.
  ///
  /// `TextStyle(fontFamily: HoronFont.body, fontFamilyFallback: HoronFont.fontFamilyFallback)`
  /// 처럼 씁니다. Pretendard에 없는 라틴 글리프를 Geist가 받아 그립니다.
  static const List<String> fontFamilyFallback = <String>[latin];
}
