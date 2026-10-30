// `horon-icon`의 Flutter 대응입니다.
//
// React 원본: `packages/react/src/components/horon-icon.tsx`. 파일이 세 가지를 내보내고
// Flutter도 같은 셋을 냅니다: [HoronIcon](팔콘 눈 표식), [HoronIconName](Paper 아이콘
// 이름 79개), [HoronGlyph](이름을 실제 글리프로 푸는 위젯).
//
// 이 패키지는 SVG 패키지를, 아이콘 폰트도 번들하지 않습니다. 그래서 표식은 SVG `d`
// 문자열을 [Path]로 옮겨 칠하고, 나머지 이름은 Material 아이콘으로 옮깁니다.

import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// `1em` — React가 `size`를 주지 않을 때의 값입니다. 본문 글자 크기와 같은 16px로 옮깁니다.
const double _defaultIconSize = 16;

/// React `HoronGlyph`의 `size = 20`입니다.
const double _defaultGlyphSize = 20;

/// Figma `icon/horon`(256:9116)의 팔콘 눈 한 줄 경로입니다. `viewBox="0 0 22 22"`.
const String _falconPathData =
    'M20.1444 5.12948C19.6411 5.2126 19.307 5.26623 17.0453 5.62287C16.2541 5.74889 15.3486 5.89369 '
    '15.0343 5.94464C14.72 5.99559 14.1221 6.09212 13.7045 6.15915C9.0054 6.918 6.10856 7.48379 '
    '3.04688 8.23996C1.89737 8.52419 1.98968 8.44911 1.05997 9.83005C0.251141 11.026 0.255537 11.0233 '
    '0.240152 11.0984C0.198391 11.2914 0.279714 11.5194 0.415984 11.5998C0.55665 11.6802 0.653358 '
    '11.6588 1.1347 11.4255C2.09079 10.9643 2.63807 10.7096 2.65345 10.7203C2.66005 10.7257 2.73038 '
    '10.8436 2.80511 10.9804C4.99202 14.9302 7.76138 16.9386 11.0231 16.9359C13.3616 16.9359 '
    '15.2892 16.0054 17.397 13.8603C18.1245 13.1229 19.6411 11.337 19.7246 11.1225C19.8191 10.8865 '
    '19.8015 10.6157 19.6828 10.4146C19.6059 10.2832 17.7179 8.63145 16.7376 7.84042C16.5992 '
    '7.7278 16.5003 7.63127 16.5178 7.62859C16.5354 7.62322 16.8981 7.56155 17.3201 7.48647C17.7443 '
    '7.41407 18.4674 7.28804 18.9311 7.20492C19.3949 7.12447 20.1686 6.99845 20.6521 6.92337C21.1356 '
    '6.85097 21.5466 6.77857 21.5686 6.76516C21.6851 6.6874 21.7708 6.50774 21.7708 6.34417C21.7708 '
    '6.2101 21.7159 6.10016 21.4258 5.64968C21.0191 5.02222 20.951 4.99541 20.1444 5.12948ZM14.9485 '
    '8.37403C16.0079 9.18919 18.0564 10.8865 18.0564 10.9482C18.0564 10.9616 17.9047 11.1627 17.7223 '
    '11.3933C15.4409 14.2464 13.4034 15.4879 11.0121 15.4825C8.2735 15.4745 5.93053 13.7932 4.1722 '
    '10.5701C3.97219 10.2001 3.84911 9.95608 3.8601 9.94267C3.91285 9.881 6.76134 9.25086 8.00096 '
    '9.02562C8.20756 8.98808 8.50428 8.93445 8.66033 8.90495C8.81858 8.87814 8.95924 8.85401 8.97683 '
    '8.85401C8.99221 8.85401 8.93506 8.94518 8.84935 9.0578C7.69984 10.5326 8.03173 12.911 9.51971 '
    '13.8469C11.0846 14.8336 12.966 13.5841 13.1572 11.4282C13.2583 10.2913 12.7396 9.08461 11.9066 '
    '8.51883C11.8209 8.45983 11.7484 8.4062 11.7484 8.39816C11.7484 8.38475 14.2606 7.97986 14.3771 '
    '7.97181C14.4013 7.96913 14.6584 8.15147 14.9485 8.37403Z';

/// 위 경로의 viewBox 한 변입니다.
const double _falconViewBox = 22;

/// 경로 문자열을 자주 다시 읽지 않도록 한 번만 만듭니다.
final Path _falconPath = _parseSvgPath(_falconPathData);

/// Horon 팔콘 눈 표식입니다.
///
/// React `HoronIcon`(`horon-icon.tsx`)이 22×22 viewBox의 `<svg fill="currentColor">`에
/// 경로 하나를 그립니다. Flutter에는 SVG 패키지가 없으므로 같은 `d` 문자열을 [Path]로
/// 옮겨 칠합니다. 기본 크기는 React의 `1em`이라 본문 글자 크기(16)와 같습니다.
///
/// 색은 [color] → 주변 [IconTheme] → 기본 글자 색 순서로 정해집니다. React가
/// `fill="currentColor"`로 부모의 글자 색을 쓰던 자리이고, `aria-hidden`이므로 의미
/// 정보를 만들지 않습니다.
class HoronIcon extends StatelessWidget {
  /// 팔콘 눈을 그립니다.
  const HoronIcon({super.key, this.size = _defaultIconSize, this.color});

  /// 한 변의 논리 픽셀입니다.
  final double size;

  /// 칠할 색입니다. null이면 주변 색을 이어받습니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final Color resolved = _resolveIconColor(context, color);
    return SizedBox.square(
      dimension: size,
      child: CustomPaint(
        painter: _FalconPainter(path: _falconPath, color: resolved),
      ),
    );
  }
}

/// Paper의 `icon/<name>` 79개 이름입니다.
///
/// React `iconNames`의 순서를 그대로 따릅니다(케밥 표기를 카멜 표기로 옮겼습니다).
/// 순서는 Paper가 그리는 자리(작은 컨트롤 16, 버튼·행 20, 바·빈 상태 24)와 무관하게
/// 고정된 어휘입니다. 이 어휘는 배리언트 게이트가 React와 양방향으로 비교합니다.
enum HoronIconName {
  /// `plus` — 더하기.
  plus,

  /// `x` — 닫기.
  x,

  /// `check` — 확인.
  check,

  /// `minus` — 빼기.
  minus,

  /// `chevron-down` — 아래로 접힘.
  chevronDown,

  /// `chevron-right` — 오른쪽 이동.
  chevronRight,

  /// `chevron-left` — 왼쪽 이동.
  chevronLeft,

  /// `search` — 검색.
  search,

  /// `send` — 보내기.
  send,

  /// `arrow-up` — 위로.
  arrowUp,

  /// `arrow-right` — 오른쪽으로.
  arrowRight,

  /// `bot` — 봇.
  bot,

  /// `user` — 사용자.
  user,

  /// `settings` — 설정.
  settings,

  /// `bell` — 알림.
  bell,

  /// `info` — 정보.
  info,

  /// `circle-alert` — 경고(원).
  circleAlert,

  /// `circle-check` — 완료(원).
  circleCheck,

  /// `triangle-alert` — 경고(삼각).
  triangleAlert,

  /// `inbox` — 받은 편지함.
  inbox,

  /// `mail` — 메일.
  mail,

  /// `calendar` — 달력.
  calendar,

  /// `paperclip` — 첨부.
  paperclip,

  /// `mic` — 마이크.
  mic,

  /// `ellipsis` — 더 보기.
  ellipsis,

  /// `copy` — 복사.
  copy,

  /// `log-out` — 로그아웃.
  logOut,

  /// `sparkles` — 반짝임.
  sparkles,

  /// `eye` — 보기.
  eye,

  /// `trash` — 삭제.
  trash,

  /// `globe` — 공개 범위.
  globe,

  /// `question` — 도움말.
  question,

  /// `drop` — 물방울.
  drop,

  /// `list-checks` — 체크 목록.
  listChecks,

  /// `grid` — 격자 보기.
  grid,

  /// `key` — 키.
  key,

  /// `external-link` — 새 창.
  externalLink,

  /// `caret-up-down` — 위아래 정렬.
  caretUpDown,

  /// `user-plus` — 사용자 추가.
  userPlus,

  /// `folder` — 폴더.
  folder,

  /// `thumbs-up` — 좋아요.
  thumbsUp,

  /// `arrow-clockwise` — 새로 고침.
  arrowClockwise,

  /// `image` — 이미지.
  image,

  /// `plug` — 연결.
  plug,

  /// `thumbs-down` — 싫어요.
  thumbsDown,

  /// `chat-circle` — 대화.
  chatCircle,

  /// `command` — 명령 키.
  command,

  /// `enter` — 엔터.
  enter,

  /// `wrench` — 도구.
  wrench,

  /// `clock` — 시각.
  clock,

  /// `repeat` — 반복.
  repeat,

  /// `house` — 홈.
  house,

  /// `file-text` — 문서.
  fileText,

  /// `git-pull-request` — 풀 리퀘스트.
  gitPullRequest,

  /// `upload` — 업로드.
  upload,

  /// `archive` — 보관.
  archive,

  /// `stop` — 정지.
  stop,

  /// `sliders` — 조정.
  sliders,

  /// `lightning` — 번개.
  lightning,

  /// `pause` — 일시 정지.
  pause,

  /// `play` — 재생.
  play,

  /// `arrow-down` — 아래로.
  arrowDown,

  /// `scan` — 스캔.
  scan,

  /// `file-pdf` — PDF.
  filePdf,

  /// `brain` — 추론.
  brain,

  /// `bookmark-simple` — 북마크.
  bookmarkSimple,

  /// `files` — 파일 묶음.
  files,

  /// `list` — 목록.
  list,

  /// `horon` — Horon 팔콘 눈(다른 이름과 달리 [HoronIcon]이 그립니다).
  horon,

  /// `cube` — 3차원 상자.
  cube,

  /// `code` — 코드.
  code,

  /// `clipboard-text` — 클립보드.
  clipboardText,

  /// `megaphone` — 공지.
  megaphone,

  /// `pen-nib` — 펜촉.
  penNib,

  /// `chart-line-up` — 상승 그래프.
  chartLineUp,

  /// `flask` — 실험.
  flask,

  /// `users-three` — 사용자 여럿.
  usersThree,

  /// `pencil-simple` — 편집.
  pencilSimple,

  /// `plus-circle` — 추가(원).
  plusCircle,
}

/// 이름을 Material 아이콘으로 옮긴 표입니다.
///
/// Phosphor의 outline 계열을 Material Symbols의 가까운 자리로 바꿨습니다. `horon`은
/// 표에 없습니다. 그 이름만 [HoronIcon]이 그리고, 나머지 78개가 여기서 풀립니다.
/// 나중에 한 자리를 바꿀 때는 이 표의 한 줄만 고칩니다.
const Map<HoronIconName, IconData> _glyphs = <HoronIconName, IconData>{
  HoronIconName.plus: Icons.add,
  HoronIconName.x: Icons.close,
  HoronIconName.check: Icons.check,
  HoronIconName.minus: Icons.remove,
  HoronIconName.chevronDown: Icons.expand_more,
  HoronIconName.chevronRight: Icons.chevron_right,
  HoronIconName.chevronLeft: Icons.chevron_left,
  HoronIconName.search: Icons.search,
  HoronIconName.send: Icons.send,
  HoronIconName.arrowUp: Icons.arrow_upward,
  HoronIconName.arrowRight: Icons.arrow_forward,
  HoronIconName.bot: Icons.smart_toy_outlined,
  HoronIconName.user: Icons.person_outline,
  HoronIconName.settings: Icons.settings_outlined,
  HoronIconName.bell: Icons.notifications_none,
  HoronIconName.info: Icons.info_outline,
  HoronIconName.circleAlert: Icons.error_outline,
  HoronIconName.circleCheck: Icons.check_circle_outline,
  HoronIconName.triangleAlert: Icons.warning_amber,
  HoronIconName.inbox: Icons.inbox_outlined,
  HoronIconName.mail: Icons.mail_outline,
  HoronIconName.calendar: Icons.calendar_today_outlined,
  HoronIconName.paperclip: Icons.attach_file,
  HoronIconName.mic: Icons.mic_none,
  HoronIconName.ellipsis: Icons.more_horiz,
  HoronIconName.copy: Icons.copy_outlined,
  HoronIconName.logOut: Icons.logout,
  HoronIconName.sparkles: Icons.auto_awesome,
  HoronIconName.eye: Icons.visibility_outlined,
  HoronIconName.trash: Icons.delete_outline,
  HoronIconName.globe: Icons.public,
  HoronIconName.question: Icons.help_outline,
  HoronIconName.drop: Icons.water_drop_outlined,
  HoronIconName.listChecks: Icons.checklist,
  HoronIconName.grid: Icons.grid_view,
  HoronIconName.key: Icons.key,
  HoronIconName.externalLink: Icons.open_in_new,
  HoronIconName.caretUpDown: Icons.unfold_more,
  HoronIconName.userPlus: Icons.person_add_alt_1_outlined,
  HoronIconName.folder: Icons.folder_outlined,
  HoronIconName.thumbsUp: Icons.thumb_up_outlined,
  HoronIconName.arrowClockwise: Icons.refresh,
  HoronIconName.image: Icons.image_outlined,
  HoronIconName.plug: Icons.power,
  HoronIconName.thumbsDown: Icons.thumb_down_outlined,
  HoronIconName.chatCircle: Icons.chat_bubble_outline,
  HoronIconName.command: Icons.keyboard_command_key,
  HoronIconName.enter: Icons.subdirectory_arrow_left,
  HoronIconName.wrench: Icons.build_outlined,
  HoronIconName.clock: Icons.schedule,
  HoronIconName.repeat: Icons.repeat,
  HoronIconName.house: Icons.home_outlined,
  HoronIconName.fileText: Icons.description_outlined,
  HoronIconName.gitPullRequest: Icons.call_split,
  HoronIconName.upload: Icons.upload_file,
  HoronIconName.archive: Icons.archive_outlined,
  HoronIconName.stop: Icons.stop_circle_outlined,
  HoronIconName.sliders: Icons.tune,
  HoronIconName.lightning: Icons.bolt,
  HoronIconName.pause: Icons.pause_circle_outline,
  HoronIconName.play: Icons.play_arrow,
  HoronIconName.arrowDown: Icons.arrow_downward,
  HoronIconName.scan: Icons.center_focus_strong,
  HoronIconName.filePdf: Icons.picture_as_pdf_outlined,
  HoronIconName.brain: Icons.psychology_outlined,
  HoronIconName.bookmarkSimple: Icons.bookmark_border,
  HoronIconName.files: Icons.folder_copy_outlined,
  HoronIconName.list: Icons.format_list_bulleted,
  HoronIconName.cube: Icons.view_in_ar_outlined,
  HoronIconName.code: Icons.code,
  HoronIconName.clipboardText: Icons.assignment_outlined,
  HoronIconName.megaphone: Icons.campaign_outlined,
  HoronIconName.penNib: Icons.brush_outlined,
  HoronIconName.chartLineUp: Icons.show_chart,
  HoronIconName.flask: Icons.science_outlined,
  HoronIconName.usersThree: Icons.groups_outlined,
  HoronIconName.pencilSimple: Icons.edit_outlined,
  HoronIconName.plusCircle: Icons.add_circle_outline,
};

/// 이름 하나를 실제 글리프로 푸는 위젯입니다.
///
/// React `HoronGlyph`(`horon-icon.tsx`)가 Paper의 `icon/<name>` 이름을 Phosphor
/// 컴포넌트로 바꿉니다. 여기서는 Material 아이콘으로 바꾸고, `horon`만 [HoronIcon]으로
/// 그립니다. 기본 크기 20은 React와 같습니다.
class HoronGlyph extends StatelessWidget {
  /// 이름에 맞는 글리프를 그립니다.
  const HoronGlyph({super.key, required this.name, this.size = _defaultGlyphSize, this.color});

  /// 그릴 이름입니다.
  final HoronIconName name;

  /// 글리프 한 변의 논리 픽셀입니다.
  final double size;

  /// 칠할 색입니다. null이면 주변 색을 이어받습니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final Color resolved = _resolveIconColor(context, color);
    if (name == HoronIconName.horon) return HoronIcon(size: size, color: resolved);
    return Icon(_glyphs[name], size: size, color: resolved);
  }
}

/// `currentColor`의 자리입니다.
///
/// React 아이콘은 부모의 글자 색을 씁니다. Flutter에서 그 자리는 테마의 본문 글자 색
/// (`textPrimary`)이고, [color]를 주면 그 색이 이깁니다. Material의 `IconTheme`을 기본값으로
/// 쓰지 않는 이유는 이 Flutter 버전의 `IconThemeData`가 색을 주지 않으면 불투명 검정으로
/// 채우기 때문입니다. 그러면 다크 화면에서 표식만 검게 그려집니다.
Color _resolveIconColor(BuildContext context, Color? color) => color ?? HoronTheme.of(context).colors.textPrimary;

/// 팔콘 눈을 22×22 viewBox에서 위젯 크기로 확대해 칠합니다.
class _FalconPainter extends CustomPainter {
  const _FalconPainter({required this.path, required this.color});

  final Path path;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final double scale = size.shortestSide / _falconViewBox;
    canvas
      ..save()
      ..scale(scale);
    // React `fill="currentColor"` — 선이 아니라 면으로 채웁니다.
    canvas.drawPath(path, Paint()..color = color);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_FalconPainter oldDelegate) => oldDelegate.color != color || oldDelegate.path != path;
}

/// SVG `d` 문자열의 조각(명령 글자 하나 또는 숫자 하나)을 읽습니다.
final RegExp _svgToken = RegExp(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|[A-Za-z]');

/// 명령 글자 하나인지 봅니다.
final RegExp _svgCommand = RegExp(r'^[A-Za-z]$');

/// SVG `d` 문자열을 [Path]로 옮깁니다.
///
/// React 소스가 쓰는 `M`·`C`·`Z`(표식)와 `M`·`H`·`L`·`C`·`V`·`Z`(워드마크)를 모두
/// 다루고, 대소문자로 절대·상대 좌표를 가릅니다. `M` 뒤에 숫자 쌍이 더 오면 `L`로
/// 잇는 SVG 규칙도 따릅니다. 지원하지 않는 명령이 오면 조용히 건너뛰지 않고
/// [ArgumentError]를 던집니다. 잘못된 경로는 아무것도 그리지 않는 것보다 실패하는 편이
/// 낫기 때문입니다.
Path _parseSvgPath(String data) {
  final List<String> tokens = <String>[for (final RegExpMatch match in _svgToken.allMatches(data)) match.group(0)!];
  final Path path = Path();
  var index = 0;
  double x = 0;
  double y = 0;
  double startX = 0;
  double startY = 0;
  String? command;

  double number() {
    if (index >= tokens.length) throw ArgumentError('경로 데이터가 값 없이 끝납니다: $data');
    return double.parse(tokens[index++]);
  }

  while (index < tokens.length) {
    if (_svgCommand.hasMatch(tokens[index])) {
      command = tokens[index];
      index++;
    }
    if (command == null) throw ArgumentError('경로가 명령 없이 시작합니다: $data');
    final String verb = command.toUpperCase();
    final bool relative = command != verb;
    switch (verb) {
      case 'M':
      case 'L':
        final double dx = number();
        final double dy = number();
        final double nextX = relative ? x + dx : dx;
        final double nextY = relative ? y + dy : dy;
        if (verb == 'M') {
          path.moveTo(nextX, nextY);
          startX = nextX;
          startY = nextY;
          // `M` 뒤의 추가 숫자 쌍은 선으로 이어집니다.
          command = relative ? 'l' : 'L';
        } else {
          path.lineTo(nextX, nextY);
        }
        x = nextX;
        y = nextY;
      case 'H':
        final double dx = number();
        x = relative ? x + dx : dx;
        path.lineTo(x, y);
      case 'V':
        final double dy = number();
        y = relative ? y + dy : dy;
        path.lineTo(x, y);
      case 'C':
        final double c1x = number();
        final double c1y = number();
        final double c2x = number();
        final double c2y = number();
        final double dx = number();
        final double dy = number();
        final double nextX = relative ? x + dx : dx;
        final double nextY = relative ? y + dy : dy;
        path.cubicTo(
          relative ? x + c1x : c1x,
          relative ? y + c1y : c1y,
          relative ? x + c2x : c2x,
          relative ? y + c2y : c2y,
          nextX,
          nextY,
        );
        x = nextX;
        y = nextY;
      case 'Z':
        path.close();
        x = startX;
        y = startY;
      default:
        throw ArgumentError('지원하지 않는 SVG 명령 "$command"입니다: $data');
    }
  }
  return path;
}
