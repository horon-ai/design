// `horon-wordmark`의 Flutter 대응입니다.
//
// React 원본: `packages/react/src/components/horon-wordmark.tsx`. Figma 사이드바(88:808)의
// UI 크기 워드마크(48.7038 × 11.5 벡터)를 `currentColor`로 그립니다.

import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// React `HoronWordmark`의 `height = 11.5`입니다. UI 크기 워드마크의 세로 길이입니다.
const double _defaultHeight = 11.5;

/// `viewBox="0 0 48.7038 11.5"`의 세로입니다.
const double _viewBoxHeight = 11.5;

/// 같은 viewBox의 가로입니다.
const double _viewBoxWidth = 48.7038;

/// 가로는 세로에 이 비율로 따라붙습니다. React는 `height`만 받고 폭은 SVG가 정합니다.
const double _aspect = _viewBoxWidth / _viewBoxHeight;

/// `Horon` 6글자의 경로입니다. React `PATHS` 배열의 순서와 문자열을 그대로 옮겼습니다.
const List<String> _wordmarkPathData = <String>[
  'M0.0230414 11.2212H1.91244L1.92626 8.60366L1.93548 5.99076H8.47923L8.48845 8.60366L8.50228 '
      '11.2212H10.3917L10.4193 8.06449C10.447 5.32717 10.5207 2.68663 10.6267 0.585252L10.6543 '
      '0H8.47923V4.2857H1.93548V0H0L0.0230414 11.2212Z',
  'M15.6082 2.09677C13.5483 2.48847 11.9539 4.02764 11.5852 5.98155C11.2719 7.64514 12.0184 9.49306 '
      '13.4147 10.5069C14.3778 11.2073 15.2764 11.493 16.5437 11.493C17.576 11.4977 18.2764 11.3456 19.0552 '
      '10.9585C19.5621 10.7004 19.7741 10.5484 20.2442 10.0967C20.8893 9.47923 21.3179 8.75112 21.5483 '
      '7.9032C21.6958 7.36864 21.6727 6.05528 21.5068 5.52533C20.9861 3.82487 19.7327 2.63594 17.9861 '
      '2.18432C17.4055 2.03225 16.1843 1.99078 15.6082 2.09677ZM17.4884 3.894C18.811 4.24883 19.7465 '
      '5.36404 19.8064 6.65896C19.8433 7.5161 19.5806 8.17509 18.9446 8.80181C18.5022 9.2396 18.1843 '
      '9.44697 17.6958 9.61287C15.4562 10.3686 13.1106 8.63131 13.4101 6.43777C13.5898 5.13823 14.5714 '
      '4.12902 15.94 3.84331C16.3179 3.76496 17.1013 3.79261 17.4884 3.894Z',
  'M16.2672 5.52533C15.8571 5.65436 15.5069 5.96311 15.3686 6.32717C15.2442 6.65436 15.2903 7.16587 '
      '15.4654 7.45159C15.9078 8.16587 16.8755 8.29029 17.5115 7.71426C17.811 7.44237 17.9032 7.23039 '
      '17.9032 6.79721C17.9032 6.47002 17.8893 6.4009 17.7603 6.17509C17.4654 5.65436 16.7972 5.36404 '
      '16.2672 5.52533Z',
  'M32.0598 2.09677C29.6819 2.54838 28.0183 4.47003 28.0091 6.77417C27.9953 9.02762 29.5852 10.9216 '
      '31.8893 11.4147C32.4745 11.5391 33.6404 11.5253 34.2856 11.3871C36.198 10.9769 37.6128 9.59905 '
      '38.0229 7.73269C38.1612 7.11518 38.1289 6.10136 37.9492 5.50689C37.4561 3.84331 36.1796 2.63594 '
      '34.4285 2.17972C33.8616 2.03225 32.6312 1.99078 32.0598 2.09677ZM34.0321 3.91704C35.3962 4.341 '
      '36.2672 5.4516 36.2672 6.76496C36.2672 7.28569 36.1888 7.64514 35.9768 8.05527C35.0598 9.86172 '
      '32.6036 10.3502 30.9584 9.05527C29.8156 8.16126 29.5299 6.57602 30.281 5.31335C30.7004 4.6175 '
      '31.5114 4.05529 32.4054 3.84791C32.8156 3.75575 33.6128 3.78801 34.0321 3.91704Z',
  'M43.516 2.09677C42.6865 2.24884 41.9676 2.59446 41.3501 3.15667L41.1059 '
      '3.37326V2.30414H39.2764L39.2441 6.29952C39.2303 8.50228 39.2026 10.5115 39.1888 10.7742L39.1612 '
      '11.2442L40.1197 11.235L41.0828 11.2212L41.1059 8.54836C41.1335 5.66358 41.1289 5.74652 41.3962 '
      '5.2304C41.9399 4.20275 43.3823 3.58524 44.6496 3.8433C45.8201 4.08294 46.6035 4.84791 46.8063 '
      '5.9539C46.88 6.37325 46.8662 8.45158 46.774 10.023C46.751 10.4516 46.7233 10.8986 46.7187 '
      '11.0138L46.7049 11.2212L48.6865 11.2119L48.7003 8.61287C48.7141 5.75574 48.6957 5.39169 48.4745 '
      '4.72349C48.0828 3.53916 47.2717 2.74193 46.0137 2.29031C45.3224 2.04608 44.2579 1.96313 43.516 '
      '2.09677Z',
  'M22.8663 6.76035L22.8801 11.2212L23.7925 11.235L24.7004 11.2442L24.705 9.576C24.7188 6.46081 24.728 '
      '6.08293 24.811 5.788C24.9262 5.36865 25.1059 5.07832 25.4607 4.71888C25.8432 4.33178 26.2119 4.13363 '
      '26.7511 4.02764L27.1197 3.9493L27.7833 3.32257C28.1474 2.97695 28.5391 2.60829 28.6589 '
      '2.5023L28.8709 2.30875H26.2442L25.5068 2.99538L24.7695 3.68662L24.7419 2.30414H22.8571L22.8663 '
      '6.76035Z',
];

/// 위 경로를 한 번만 [Path]로 옮겨 둡니다.
final List<Path> _wordmarkPaths = <Path>[for (final String data in _wordmarkPathData) _parseSvgPath(data)];

/// Horon 워드마크입니다.
///
/// React `HoronWordmark`(`horon-wordmark.tsx`)가 48.7038 × 11.5 viewBox에 글자 하나당
/// 경로 하나(여섯 개)를 `currentColor`로 칠합니다. Flutter에는 SVG 패키지가 없으므로
/// 같은 `d` 문자열을 [Path]로 옮겨 칠합니다. 높이를 주면 폭은 비율을 따라 정해집니다.
///
/// React는 `role="img"`와 `aria-label={title}`을 답니다. 같은 자리를 [title]이 받아
/// 화면 낭독기에 읽힙니다.
class HoronWordmark extends StatelessWidget {
  /// 워드마크를 그립니다.
  const HoronWordmark({super.key, this.title = 'Horon', this.height = _defaultHeight, this.color});

  /// 낭독기가 읽을 이름입니다. React의 `aria-label`입니다.
  final String title;

  /// 워드마크의 세로 길이입니다. 폭은 48.7038/11.5 비율을 따라갑니다.
  final double height;

  /// 칠할 색입니다. null이면 주변 글자 색을 이어받습니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: title,
      image: true,
      child: SizedBox(
        width: height * _aspect,
        height: height,
        child: CustomPaint(painter: _WordmarkPainter(color: _resolveMarkColor(context, color))),
      ),
    );
  }
}

/// `currentColor`의 자리입니다.
///
/// React 워드마크는 부모의 글자 색을 씁니다. Flutter에서 그 자리는 테마의 본문 글자 색
/// (`textPrimary`)이고, [color]를 주면 그 색이 이깁니다. Material의 `IconTheme`을 기본값으로
/// 쓰지 않는 이유는 이 Flutter 버전의 `IconThemeData`가 색을 주지 않으면 불투명 검정으로
/// 채우기 때문입니다. 그러면 다크 화면에서 표식만 검게 그려집니다.
Color _resolveMarkColor(BuildContext context, Color? color) => color ?? HoronTheme.of(context).colors.textPrimary;

/// 여섯 경로를 viewBox 비율로 확대해 칠합니다.
class _WordmarkPainter extends CustomPainter {
  const _WordmarkPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final double scale = size.height / _viewBoxHeight;
    canvas
      ..save()
      ..scale(scale);
    // React `fill="currentColor"` — 선이 아니라 면으로 채웁니다.
    final Paint paint = Paint()..color = color;
    for (final Path path in _wordmarkPaths) {
      canvas.drawPath(path, paint);
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_WordmarkPainter oldDelegate) => oldDelegate.color != color;
}

/// SVG `d` 문자열의 조각(명령 글자 하나 또는 숫자 하나)을 읽습니다.
final RegExp _svgToken = RegExp(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|[A-Za-z]');

/// 명령 글자 하나인지 봅니다.
final RegExp _svgCommand = RegExp(r'^[A-Za-z]$');

/// SVG `d` 문자열을 [Path]로 옮깁니다.
///
/// 워드마크 경로가 쓰는 `M`·`H`·`L`·`C`·`V`·`Z`를 다루고, 대소문자로 절대·상대 좌표를
/// 가릅니다. `M` 뒤에 숫자 쌍이 더 오면 `L`로 잇는 SVG 규칙도 따릅니다. 지원하지 않는
/// 명령이 오면 조용히 건너뛰지 않고 [ArgumentError]를 던집니다.
///
/// 표식(`horon_icon.dart`)이 같은 파서를 사설로 하나 더 들고 있습니다. 두 파일이 서로의
/// 사설 멤버를 볼 수 없고, 레인은 자기 슬러그의 세 파일 밖을 만들 수 없기 때문입니다.
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
