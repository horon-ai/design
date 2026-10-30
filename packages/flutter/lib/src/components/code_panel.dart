import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `code-panel.tsx`의 `rounded-[10px]`입니다.
const double _panelRadius = 10;

/// `code-panel.tsx`의 `px-4`입니다.
const double _panelPaddingX = 16;

/// `code-panel.tsx`의 `py-3.5`입니다.
const double _panelPaddingY = 14;

/// `code-panel.tsx`의 `text-[12px]/[21px]`입니다.
const double _panelFontSize = 12;

/// 위 줄 간격입니다. Paper 행 19px + 2px 간격입니다.
const double _panelLineHeight = 21;

/// Paper `Code block`(1VV9-0)의 라이트 변형입니다.
///
/// 10px 라운드의 neutral-50 패널에 1px 헤어라인, Geist Mono 12px/21px입니다.
/// 헤더 바와 복사 버튼은 없습니다(그건 `message_extras`의 잉크 `CodeBlock`입니다).
/// 긴 줄은 잘라지 않고 가로로 스크롤됩니다 — 코드는 열을 맞춰야 하므로 이 한 곳만
/// 가로 스크롤을 허용합니다(반응형 게이트의 예외 목록에 있습니다).
class HoronCodePanel extends StatelessWidget {
  /// 코드 패널을 만듭니다.
  const HoronCodePanel({super.key, required this.code, this.maxHeight});

  /// 코드 본문입니다.
  final String code;

  /// 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final Color background = isDark ? HoronPalette.neutral800 : HoronPalette.neutral50;

    final Widget block = Container(
      constraints: BoxConstraints(maxHeight: maxHeight ?? double.infinity),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(_panelRadius),
        border: Border.all(color: theme.colors.borderDefault),
      ),
      padding: const EdgeInsets.symmetric(horizontal: _panelPaddingX, vertical: _panelPaddingY),
      child: Text(
        code,
        softWrap: false,
        style: TextStyle(
          fontFamily: theme.text.code.fontFamily,
          fontFamilyFallback: theme.text.code.fontFamilyFallback,
          fontSize: _panelFontSize,
          height: _panelLineHeight / _panelFontSize,
          color: theme.colors.syntaxString,
        ),
      ),
    );

    return SingleChildScrollView(scrollDirection: Axis.horizontal, child: block);
  }
}

/// `CodePanel` 안의 강조 토큰입니다. frontmatter 키처럼 색만 다른 조각에 씁니다.
class HoronCodeKey extends StatelessWidget {
  /// 강조 토큰을 만듭니다.
  const HoronCodeKey({super.key, required this.label});

  /// 토큰 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Text(
      label,
      style: TextStyle(
        fontFamily: theme.text.code.fontFamily,
        fontFamilyFallback: theme.text.code.fontFamilyFallback,
        fontSize: _panelFontSize,
        height: _panelLineHeight / _panelFontSize,
        color: theme.colors.syntaxKey,
      ),
    );
  }
}
