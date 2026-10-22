import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `code-block.tsx`의 복사 버튼 `size-7`입니다.
const double _codeBlockCopySize = 28.0;

/// `code-block.tsx`의 `[&_svg…]:size-3.5`입니다.
const double _codeBlockCopyIconSize = 14.0;

/// `code-block.tsx`의 본문 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값입니다.
const double _codeBlockFontSize = 13.0;

/// `code-block.tsx`의 `px-3`입니다.
const double _codeBlockHeaderPaddingX = HoronSpace.s3;

/// `code-block.tsx`의 `py-1.5`입니다.
const double _codeBlockHeaderPaddingY = HoronSpace.s1_5;

/// `code-block.tsx`의 `gap-3`입니다.
const double _codeBlockHeaderGap = HoronSpace.s3;

/// `code-block.tsx`의 `p-4`입니다.
const double _codeBlockBodyPadding = HoronSpace.s4;

/// `code-block.tsx`의 `focus-visible:ring-3`입니다.
const double _codeBlockFocusRing = 3.0;

/// 코드 한 덩어리를 감싸는 상자입니다.
///
/// `code-block.tsx`의 `CodeBlock`을 옮긴 것입니다. `rounded-md border border-border
/// bg-card text-card-foreground`에 `overflow-hidden`이 붙습니다.
///
/// React는 `CodeBlockContext`에 `<pre>`의 ref를 담고 복사 버튼이 그 `textContent`를
/// 읽습니다. Flutter에는 그에 해당하는 DOM이 없으므로 [code]를 상자가 들고 있다가
/// 아래 자식에게 전달합니다. 그래서 [HoronCodeBlockCopyButton]과
/// [HoronCodeBlockContent]는 값을 따로 받지 않아도 같은 코드를 씁니다.
///
/// 구문 강조는 하지 않습니다. 이 패키지는 강조 패키지를 의존하지 않고, 본문은
/// [SelectableText]라 사용자가 직접 골라 복사할 수도 있습니다.
///
/// ```dart
/// const HoronCodeBlock(
///   code: 'dart format lib',
///   children: <Widget>[
///     HoronCodeBlockHeader(title: 'bash', trailing: HoronCodeBlockCopyButton()),
///     HoronCodeBlockContent(),
///   ],
/// );
/// ```
class HoronCodeBlock extends StatelessWidget {
  /// 코드 상자를 만듭니다.
  const HoronCodeBlock({super.key, required this.code, required this.children});

  /// 복사할 코드 전문입니다.
  final String code;

  /// 헤더와 본문입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.card);
    return _HoronCodeBlockScope(
      code: code,
      child: DecoratedBox(
        decoration: BoxDecoration(
          // `bg-card`
          color: scheme.surfaceContainerLow,
          borderRadius: radius,
          border: Border.all(color: scheme.outline),
        ),
        child: ClipRRect(
          borderRadius: radius,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: children,
          ),
        ),
      ),
    );
  }
}

/// `code-block.tsx`의 `CodeBlockHeader`입니다.
///
/// `flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-3
/// py-1.5 text-xs font-medium text-muted-foreground`를 옮겼습니다. [title]은 언어 이름
/// 같은 왼쪽 표시이고, [trailing]은 복사 버튼 자리입니다.
class HoronCodeBlockHeader extends StatelessWidget {
  /// 헤더를 만듭니다.
  const HoronCodeBlockHeader({super.key, this.title, this.leading, this.trailing});

  /// 왼쪽에 보이는 이름입니다.
  final String? title;

  /// 왼쪽에 넣는 내용입니다. [title]보다 우선합니다.
  final Widget? leading;

  /// 오른쪽에 넣는 내용입니다.
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.caption,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );

    final Widget left = leading ?? Text(title ?? '', style: style);

    return DecoratedBox(
      decoration: BoxDecoration(
        // `bg-muted/50`
        color: scheme.surfaceContainerHighest.withValues(alpha: 0.5),
        border: Border(bottom: BorderSide(color: scheme.outline)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _codeBlockHeaderPaddingX, vertical: _codeBlockHeaderPaddingY),
        child: Row(
          children: <Widget>[
            Expanded(
              child: Align(alignment: Alignment.centerLeft, child: left),
            ),
            if (trailing != null) ...<Widget>[const SizedBox(width: _codeBlockHeaderGap), trailing!],
          ],
        ),
      ),
    );
  }
}

/// `code-block.tsx`의 `CodeBlockContent`입니다.
///
/// `overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground`를
/// 옮겼습니다. 본문은 [SelectableText]라 길게 눌러 선택·복사할 수 있고, 가로로 길면
/// [SingleChildScrollView]가 스크롤합니다.
class HoronCodeBlockContent extends StatelessWidget {
  /// 본문을 만듭니다.
  const HoronCodeBlockContent({super.key, this.code});

  /// 본문 글자입니다. 없으면 [HoronCodeBlock]이 들고 있는 값을 씁니다.
  final String? code;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final String text = code ?? _HoronCodeBlockScope.of(context)?.code ?? '';
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.all(_codeBlockBodyPadding),
      child: SelectableText(
        text,
        style: TextStyle(
          fontFamily: HoronFont.mono,
          fontSize: _codeBlockFontSize,
          fontWeight: HoronFontWeight.regular,
          height: HoronLineHeight.relaxed,
          color: scheme.onSurface,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }
}

/// `code-block.tsx`의 `CodeBlockCopyButton`입니다.
///
/// 누르면 [Clipboard.setData]로 코드를 복사하고 [copiedTimeout] 동안 체크 표시로
/// 바뀝니다(React의 `timeout = 2000`). 복사가 실패하면 체크 표시로 바꾸지 않습니다.
/// 접근성 이름은 [copyLabel]/[copiedLabel]이 없으면 React와 같은 문구를 씁니다.
///
/// 아이콘은 글리프 폰트에 기대지 않고 직접 그립니다. 이 패키지는 아이콘 폰트를 번들하지
/// 않으므로, 호스트가 폰트를 싣지 않으면 글리프가 빈 네모가 되기 때문입니다.
class HoronCodeBlockCopyButton extends StatefulWidget {
  /// 복사 버튼을 찾는 키입니다. React의 `data-slot="code-block-copy-button"`에 해당합니다.
  static const Key buttonKey = Key('horon-code-block-copy-button');

  /// 복사 버튼을 만듭니다.
  const HoronCodeBlockCopyButton({
    super.key,
    this.value,
    this.copiedTimeout = const Duration(milliseconds: 2000),
    this.copyLabel = 'Copy code',
    this.copiedLabel = 'Copied',
  });

  /// 복사할 글자입니다. 없으면 [HoronCodeBlock]이 들고 있는 값을 씁니다.
  final String? value;

  /// 체크 표시가 유지되는 시간입니다.
  final Duration copiedTimeout;

  /// 복사 전 접근성 이름입니다.
  final String copyLabel;

  /// 복사 후 접근성 이름입니다.
  final String copiedLabel;

  @override
  State<HoronCodeBlockCopyButton> createState() => _HoronCodeBlockCopyButtonState();
}

class _HoronCodeBlockCopyButtonState extends State<HoronCodeBlockCopyButton> {
  bool _copied = false;
  bool _hovered = false;
  bool _focused = false;
  Timer? _resetTimer;

  @override
  void dispose() {
    _resetTimer?.cancel();
    super.dispose();
  }

  Future<void> _copy() async {
    final String text = widget.value ?? _HoronCodeBlockScope.of(context)?.code ?? '';
    try {
      await Clipboard.setData(ClipboardData(text: text));
    } on PlatformException {
      // React도 복사에 실패하면 `setCopied(false)`로 되돌립니다.
      return;
    }
    if (!mounted) return;
    _resetTimer?.cancel();
    setState(() => _copied = true);
    _resetTimer = Timer(widget.copiedTimeout, () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final Color color = _hovered ? scheme.onSurface : scheme.onSurfaceVariant;
    final String label = _copied ? widget.copiedLabel : widget.copyLabel;

    return Semantics(
      button: true,
      label: label,
      child: Tooltip(
        message: label,
        child: FocusableActionDetector(
          onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                unawaited(_copy());
                return null;
              },
            ),
          },
          child: GestureDetector(
            key: HoronCodeBlockCopyButton.buttonKey,
            behavior: HitTestBehavior.opaque,
            onTap: _copy,
            child: DecoratedBox(
              decoration: BoxDecoration(
                // `hover:bg-muted`
                color: _hovered ? scheme.surfaceContainerHighest : Colors.transparent,
                borderRadius: BorderRadius.circular(HoronRadius.sm),
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(color: horon.ring.withValues(alpha: 0.5), spreadRadius: _codeBlockFocusRing),
                      ]
                    : null,
              ),
              child: SizedBox.square(
                dimension: _codeBlockCopySize,
                child: Center(
                  child: SizedBox.square(
                    dimension: _codeBlockCopyIconSize,
                    child: CustomPaint(
                      painter: _copied ? _HoronCodeBlockCheckPainter(color) : _HoronCodeBlockCopyPainter(color),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// [HoronCodeBlock]의 코드를 자식에게 전달합니다. React의 `CodeBlockContext`입니다.
class _HoronCodeBlockScope extends InheritedWidget {
  const _HoronCodeBlockScope({required this.code, required super.child});

  /// 복사할 코드 전문입니다.
  final String code;

  static _HoronCodeBlockScope? of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronCodeBlockScope>();

  @override
  bool updateShouldNotify(_HoronCodeBlockScope oldWidget) => code != oldWidget.code;
}

/// lucide `copy`의 사각형 두 개를 그립니다.
class _HoronCodeBlockCopyPainter extends CustomPainter {
  const _HoronCodeBlockCopyPainter(this.color);

  /// 선 색입니다.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    // lucide `copy`의 24 그리드입니다.
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 2 / 24
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final double unit = size.width / 24;
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(8 * unit, 8 * unit, 14 * unit, 14 * unit), Radius.circular(2 * unit)),
      stroke,
    );
    final Path back = Path()
      ..moveTo(4 * unit, 16 * unit)
      ..cubicTo(2.9 * unit, 16 * unit, 2 * unit, 15.1 * unit, 2 * unit, 14 * unit)
      ..lineTo(2 * unit, 4 * unit)
      ..cubicTo(2 * unit, 2.9 * unit, 2.9 * unit, 2 * unit, 4 * unit, 2 * unit)
      ..lineTo(14 * unit, 2 * unit)
      ..cubicTo(15.1 * unit, 2 * unit, 16 * unit, 2.9 * unit, 16 * unit, 4 * unit);
    canvas.drawPath(back, stroke);
  }

  @override
  bool shouldRepaint(_HoronCodeBlockCopyPainter oldDelegate) => color != oldDelegate.color;
}

/// lucide `check`의 꺾은선을 그립니다.
class _HoronCodeBlockCheckPainter extends CustomPainter {
  const _HoronCodeBlockCheckPainter(this.color);

  /// 선 색입니다.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    // lucide `check`의 24 그리드입니다.
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 2 / 24
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final double unit = size.width / 24;
    final Path path = Path()
      ..moveTo(20 * unit, 6 * unit)
      ..lineTo(9 * unit, 17 * unit)
      ..lineTo(4 * unit, 12 * unit);
    canvas.drawPath(path, stroke);
  }

  @override
  bool shouldRepaint(_HoronCodeBlockCheckPainter oldDelegate) => color != oldDelegate.color;
}
