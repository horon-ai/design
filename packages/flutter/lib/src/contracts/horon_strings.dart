/// Horon 컴포넌트가 화면에 쓰는 문자열 표면입니다.
///
/// `flutter_localizations`도 ARB도 쓰지 않습니다. 호스트 앱이 구현 하나를 골라 컴포넌트에
/// 넘기고, 이 패키지는 번역 데이터를 들고 있지 않습니다. 언어를 늘리는 일은 호스트 앱이
/// [HoronStrings]를 구현하는 일입니다.
abstract interface class HoronStrings {
  /// 1월부터 12월까지의 이름입니다.
  List<String> get monthNames;

  /// 월요일부터 일요일까지의 이름입니다.
  List<String> get weekdayNames;

  /// 달력의 이전 달 버튼 이름입니다.
  String get previousPage;

  /// 달력의 다음 달 버튼 이름입니다.
  String get nextPage;

  /// 검색·필터 결과가 비었을 때의 문구입니다.
  String get noResults;

  /// 파일을 끌어다 놓는 영역의 문구입니다.
  String get dropFilesHere;

  /// 파일 선택 버튼의 이름입니다.
  String get browse;

  /// 업로드가 진행 중임을 알리는 문구입니다.
  String get uploading;

  /// 업로드가 실패했음을 알리는 문구입니다.
  String get uploadFailed;

  /// 실패한 작업을 다시 시도하는 버튼의 이름입니다.
  String get retry;

  /// 닫기 버튼의 이름입니다.
  String get close;

  /// 항목을 제거하는 버튼의 이름입니다.
  String get remove;
}

/// 영어 문자열입니다.
final class HoronStringsEn implements HoronStrings {
  /// 기본 생성자입니다.
  const HoronStringsEn();

  @override
  List<String> get monthNames => const <String>[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  @override
  List<String> get weekdayNames => const <String>[
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  @override
  String get previousPage => 'Previous';

  @override
  String get nextPage => 'Next';

  @override
  String get noResults => 'No results';

  @override
  String get dropFilesHere => 'Drop files here';

  @override
  String get browse => 'Browse';

  @override
  String get uploading => 'Uploading';

  @override
  String get uploadFailed => 'Upload failed';

  @override
  String get retry => 'Retry';

  @override
  String get close => 'Close';

  @override
  String get remove => 'Remove';
}

/// 한국어 문자열입니다.
final class HoronStringsKo implements HoronStrings {
  /// 기본 생성자입니다.
  const HoronStringsKo();

  @override
  List<String> get monthNames => const <String>[
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  @override
  List<String> get weekdayNames => const <String>['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  @override
  String get previousPage => '이전';

  @override
  String get nextPage => '다음';

  @override
  String get noResults => '결과가 없습니다';

  @override
  String get dropFilesHere => '여기로 파일을 끌어다 놓습니다';

  @override
  String get browse => '찾아보기';

  @override
  String get uploading => '업로드 중';

  @override
  String get uploadFailed => '업로드에 실패했습니다';

  @override
  String get retry => '다시 시도';

  @override
  String get close => '닫기';

  @override
  String get remove => '제거';
}
