/// 갤러리 크롬이 쓰는 문구입니다.
///
/// 컴포넌트가 화면에 쓰는 `HoronStrings`와 별개입니다. 저쪽은 호스트 앱이 주입하는
/// 컴포넌트 계약이고, 이쪽은 갤러리 자체의 도구 UI 문구입니다.
final class GalleryStrings {
  /// 한국어 문구입니다.
  const GalleryStrings.ko()
    : title = 'horon_ui 갤러리',
      search = '섹션 검색',
      brightness = '밝기',
      light = '라이트',
      dark = '다크',
      width = '폭',
      language = '언어',
      noSections = '등록된 섹션이 없습니다.',
      noMatches = '검색 결과가 없습니다.',
      notImplemented = '아직 구현되지 않은 섹션입니다.',
      groupInputs = '입력과 선택',
      groupDisplay = '표시',
      groupNavigation = '내비게이션',
      groupOverlays = '오버레이',
      groupConversation = '대화',
      groupAgents = '에이전트';

  /// 영어 문구입니다.
  const GalleryStrings.en()
    : title = 'horon_ui gallery',
      search = 'Search sections',
      brightness = 'Theme',
      light = 'Light',
      dark = 'Dark',
      width = 'Width',
      language = 'Language',
      noSections = 'No sections registered yet.',
      noMatches = 'No matching sections.',
      notImplemented = 'This section is not implemented yet.',
      groupInputs = 'Inputs',
      groupDisplay = 'Display',
      groupNavigation = 'Navigation',
      groupOverlays = 'Overlays',
      groupConversation = 'Conversation',
      groupAgents = 'Agents';

  /// 갤러리 이름입니다.
  final String title;

  /// 레일 검색 필드의 안내 문구입니다.
  final String search;

  /// 밝기 토글 묶음의 이름입니다.
  final String brightness;

  /// 라이트 밝기 선택지의 이름입니다.
  final String light;

  /// 다크 밝기 선택지의 이름입니다.
  final String dark;

  /// 폭 토글 묶음의 이름입니다.
  final String width;

  /// 언어 토글 묶음의 이름입니다.
  final String language;

  /// 레지스트리가 비었을 때의 문구입니다.
  final String noSections;

  /// 검색이 모든 섹션을 걸러 냈을 때의 문구입니다.
  final String noMatches;

  /// 섹션 본문이 아직 없을 때의 문구입니다.
  final String notImplemented;

  /// `inputs` 그룹의 이름입니다.
  final String groupInputs;

  /// `display` 그룹의 이름입니다.
  final String groupDisplay;

  /// `navigation` 그룹의 이름입니다.
  final String groupNavigation;

  /// `overlays` 그룹의 이름입니다.
  final String groupOverlays;

  /// `conversation` 그룹의 이름입니다.
  final String groupConversation;

  /// `agents` 그룹의 이름입니다.
  final String groupAgents;

  /// 그룹 id를 사람이 읽는 이름으로 바꿉니다.
  ///
  /// React 카탈로그의 `componentGroups`가 정한 여섯 그룹이고, 등록부의 `group` 값이
  /// 그 id입니다. 모르는 값은 그대로 돌려줍니다.
  String groupLabel(String group) => switch (group) {
    'inputs' => groupInputs,
    'display' => groupDisplay,
    'navigation' => groupNavigation,
    'overlays' => groupOverlays,
    'conversation' => groupConversation,
    'agents' => groupAgents,
    _ => group,
  };
}

/// 셸의 언어 토글이 고르는 두 값입니다.
enum GalleryLanguage {
  /// 한국어입니다.
  ko('ko'),

  /// 영어입니다.
  en('en');

  const GalleryLanguage(this.label);

  /// 토글에 보이는 값입니다.
  final String label;

  /// 이 언어의 갤러리 문구입니다.
  GalleryStrings get strings => switch (this) {
    GalleryLanguage.ko => const GalleryStrings.ko(),
    GalleryLanguage.en => const GalleryStrings.en(),
  };
}
