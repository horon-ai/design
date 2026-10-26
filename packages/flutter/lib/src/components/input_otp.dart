import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// React `input-otp.tsx` 슬롯의 `size-9`입니다.
const double _slotSize = HoronSpace.s9;

/// React `containerClassName`의 `gap-2`입니다. 그룹과 구분자 사이 간격입니다.
const double _containerGap = HoronSpace.s2;

/// React `input-otp.tsx`의 `text-sm`입니다.
const double _slotFontSize = HoronText.body;

/// React `border-input`의 테두리 두께입니다. CSS `border`는 1px입니다.
const double _slotBorderWidth = 1;

/// React `first:rounded-l-sm last:rounded-r-sm`의 반경입니다. 생성 스케일의 `sm`이
/// 8이지만 이 자리는 6(`rounded-sm`의 Tailwind 기본값)이 아니라 디자인 토큰 `sm`을
/// 씁니다. `HoronRadius.sm`이 그 값입니다.
const double _slotRadius = HoronRadius.sm;

/// React `ring-3`입니다. 활성 슬롯의 링 두께입니다.
const double _ringWidth = 3;

/// React `ring-ring/50`입니다.
const double _ringAlpha = 0.5;

/// React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// React `input-otp-caret-line`의 `h-4`입니다.
const double _caretHeight = HoronSpace.s4;

/// React `input-otp-caret-line`의 `w-px`입니다.
const double _caretWidth = 1;

/// React `animate-pulse`의 한 주기입니다. Tailwind의 기본값은 2초이고, 깜박임은
/// 그 절반(1초)마다 상태를 뒤집습니다.
const Duration _caretPeriod = Duration(milliseconds: 1000);

/// 코드 입력의 한 글자를 담는 칸입니다.
///
/// `input-otp.tsx`의 `InputOTPSlot`을 옮긴 것입니다. [index]가 이 칸이 읽을 글자의
/// 자리입니다. React는 `OTPInputContext.slots[index]`에서 글자와 활성 여부를 읽지만,
/// Flutter에서는 [HoronInputOtp]가 [HoronInputOtpScope]로 그 값을 내려 줍니다.
///
/// 칸은 사각형이고 첫 칸만 왼쪽 모서리가, 마지막 칸만 오른쪽 모서리가 둥급습니다.
/// 그룹 안에서 그룹의 첫·마지막 칸을 판정합니다.
class HoronInputOtpSlot extends StatelessWidget {
  /// 칸 하나를 만듭니다.
  const HoronInputOtpSlot({super.key, required this.index});

  /// 이 칸이 읽을 글자의 자리입니다. 0부터 셉니다.
  final int index;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronInputOtpScope? scope = _HoronInputOtpScope.maybeOf(context);
    final _HoronInputOtpGroupScope? group = _HoronInputOtpGroupScope.maybeOf(context);
    final String char = scope?.charAt(index) ?? '';
    final bool active = scope?.activeIndex == index && !(scope?.disabled ?? false);
    final bool disabled = scope?.disabled ?? false;
    // 그룹 안에서는 그룹의 첫·마지막 칸이 둥근 모서리를 갖고, 그룹 밖에서는 코드
    // 전체의 첫·마지막 칸이 갖습니다. React의 `first:`/`last:`는 그룹 기준입니다.
    final bool first = group != null ? group.firstIndex == index : index == 0;
    final bool last = group != null ? group.lastIndex == index : index == (scope?.length ?? 0) - 1;

    // "border-y border-r border-input first:rounded-l-sm first:border-l last:rounded-r-sm"
    // 활성 칸은 `border-ring ring-3 ring-ring/50`로 테두리도 금색이 됩니다.
    final Color borderColor = active ? horon.ring : scheme.outline;
    final Border border = Border(
      top: BorderSide(color: borderColor, width: _slotBorderWidth),
      bottom: BorderSide(color: borderColor, width: _slotBorderWidth),
      right: BorderSide(color: borderColor, width: _slotBorderWidth),
      left: first ? BorderSide(color: borderColor, width: _slotBorderWidth) : BorderSide.none,
    );

    final Widget slot = Stack(
      children: <Widget>[
        DecoratedBox(
          decoration: BoxDecoration(
            border: border,
            borderRadius: BorderRadius.horizontal(
              left: first ? const Radius.circular(_slotRadius) : Radius.zero,
              right: last ? const Radius.circular(_slotRadius) : Radius.zero,
            ),
            // React의 칸은 `border-y border-r border-input`만 있고 배경이 없습니다.
            // 채움을 넣으면 다크에서 카드(#141414) 위의 칸이 배경(#0A0A0A)으로
            // 검게 도드라집니다(2026-10-22 렌더 확인).
            color: Colors.transparent,
          ),
          child: SizedBox.square(
            dimension: _slotSize,
            child: Stack(
              alignment: Alignment.center,
              children: <Widget>[
                Text(
                  char,
                  maxLines: 1,
                  softWrap: false,
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: _slotFontSize,
                    height: HoronLineHeight.none,
                    color: scheme.onSurface,
                    decoration: TextDecoration.none,
                  ),
                ),
                if (active && char.isEmpty) const _HoronInputOtpCaret(),
              ],
            ),
          ),
        ),
        // React는 활성 칸에 `ring-3 ring-ring/50`과 `z-10`을 줍니다. Flutter의 `Row`는
        // 자식을 순서대로 칠하므로 바깥으로 번지는 링은 옆 칸의 불투명 채움에 덮입니다.
        // 그래서 링을 칸 안쪽에 3px로 그립니다. 같은 금색 강조이고, 잘리지 않으며
        // 칸 크기(36)도 그대로입니다.
        if (active)
          Positioned.fill(
            child: IgnorePointer(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: horon.ring.withValues(alpha: _ringAlpha),
                    width: _ringWidth,
                  ),
                  borderRadius: BorderRadius.horizontal(
                    left: first ? const Radius.circular(_slotRadius) : Radius.zero,
                    right: last ? const Radius.circular(_slotRadius) : Radius.zero,
                  ),
                ),
              ),
            ),
          ),
      ],
    );

    return Semantics(
      label: char.isEmpty ? null : char,
      child: Opacity(opacity: disabled ? _disabledOpacity : 1, child: slot),
    );
  }
}

/// 코드 입력의 한 묶음입니다.
///
/// `input-otp.tsx`의 `InputOTPGroup`을 옮긴 것입니다. 칸을 가로로 나란히 놓고
/// 테두리를 이어 붙입니다.
class HoronInputOtpGroup extends StatelessWidget {
  /// 묶음 하나를 만듭니다.
  const HoronInputOtpGroup({super.key, required this.children});

  /// 묶음 안에 넣을 칸입니다. 보통 [HoronInputOtpSlot]입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return _HoronInputOtpGroupScope(
      firstIndex: _firstSlotIndex(children),
      lastIndex: _lastSlotIndex(children),
      child: Row(mainAxisSize: MainAxisSize.min, children: children),
    );
  }
}

/// 코드 입력의 묶음 사이에 놓는 구분자입니다.
///
/// `input-otp.tsx`의 `InputOTPSeparator`를 옮긴 것입니다. lucide `Minus`를 그립니다.
/// 이 패키지는 아이콘 폰트를 들고 있지 않으므로 `CustomPainter`로 선 하나를 긋습니다.
class HoronInputOtpSeparator extends StatelessWidget {
  /// 구분자를 만듭니다.
  const HoronInputOtpSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Semantics(
      label: '-',
      child: SizedBox(
        width: HoronSpace.s4,
        height: _slotSize,
        child: Center(
          child: SizedBox(
            width: HoronSpace.s4,
            height: HoronSpace.s4,
            child: CustomPaint(painter: _HoronInputOtpDashPainter(color: scheme.onSurfaceVariant)),
          ),
        ),
      ),
    );
  }
}

/// 코드(OTP)를 자리별 칸으로 입력받는 필드입니다.
///
/// `input-otp.tsx`를 옮긴 것입니다. React는 `input-otp` 패키지의 `OTPInput`이 실제
/// 입력·붙여넣기·포커스 이동을 맡고, 이 파일은 그 상태를 칸으로 그립니다. 여기서는
/// `TextField` 하나를 칸 뒤에 두고 그 값을 칸으로 나눠 그립니다. 그래야 붙여넣기와
/// 키보드 이동을 직접 만들지 않아도 되고, 화면에는 칸만 보입니다.
///
/// - 붙여넣은 글자에서 숫자만 남깁니다. React `input-otp`의 기본 `pattern`이
///   숫자이므로 같은 규칙입니다.
/// - 자리를 다 채우면 [onCompleted]를 부릅니다. 그 뒤로는 더 받지 않습니다.
/// - [length]보다 긴 입력은 잘라 냅니다.
///
/// ```dart
/// HoronInputOtp(
///   length: 6,
///   onCompleted: (String code) => verify(code),
///   children: <Widget>[
///     HoronInputOtpGroup(children: <Widget>[
///       HoronInputOtpSlot(index: 0),
///       HoronInputOtpSlot(index: 1),
///       HoronInputOtpSlot(index: 2),
///     ]),
///     const HoronInputOtpSeparator(),
///     HoronInputOtpGroup(children: <Widget>[
///       HoronInputOtpSlot(index: 3),
///       HoronInputOtpSlot(index: 4),
///       HoronInputOtpSlot(index: 5),
///     ]),
///   ],
/// );
/// ```
class HoronInputOtp extends StatefulWidget {
  /// 활성 칸에서 깜박이는 커서를 찾는 키입니다. React의 `input-otp-caret` 자리입니다.
  static const Key caretKey = ValueKey<String>('horon-input-otp-caret');

  /// 코드 입력을 만듭니다.
  const HoronInputOtp({
    super.key,
    required this.length,
    required this.children,
    this.controller,
    this.focusNode,
    this.onChanged,
    this.onCompleted,
    this.disabled = false,
    this.autofocus = false,
    this.semanticLabel,
  }) : assert(length > 0, 'HoronInputOtp needs at least one slot.');

  /// 코드의 자릿수입니다. [children]이 그리는 칸의 수와 같아야 합니다.
  final int length;

  /// 칸과 구분자입니다. 보통 [HoronInputOtpGroup]과 [HoronInputOtpSlot]입니다.
  final List<Widget> children;

  /// 코드 글자를 읽고 쓰는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final TextEditingController? controller;

  /// 포커스 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 코드가 바뀔 때 부릅니다.
  final ValueChanged<String>? onChanged;

  /// 자리를 다 채웠을 때 부릅니다.
  final ValueChanged<String>? onCompleted;

  /// 입력을 받지 않는 상태입니다.
  final bool disabled;

  /// 화면이 열릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 보조 기술이 읽을 필드의 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronInputOtp> createState() => _HoronInputOtpState();
}

class _HoronInputOtpState extends State<HoronInputOtp> {
  TextEditingController? _ownedController;
  FocusNode? _ownedFocusNode;

  TextEditingController get _controller => widget.controller ?? (_ownedController ??= TextEditingController());

  FocusNode get _focusNode => widget.focusNode ?? (_ownedFocusNode ??= FocusNode(debugLabel: 'HoronInputOtp'));

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
    _controller.addListener(_handleTextChange);
  }

  @override
  void didUpdateWidget(covariant HoronInputOtp oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.focusNode != widget.focusNode) {
      (oldWidget.focusNode ?? _ownedFocusNode)?.removeListener(_handleFocusChange);
      _focusNode.addListener(_handleFocusChange);
    }
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _ownedController)?.removeListener(_handleTextChange);
      _controller.addListener(_handleTextChange);
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _controller.removeListener(_handleTextChange);
    _ownedFocusNode?.dispose();
    _ownedController?.dispose();
    super.dispose();
  }

  void _handleFocusChange() => setState(() {});

  void _handleTextChange() {
    final String digits = _digitsOnly(_controller.text);
    if (digits != _controller.text) {
      // 문자를 걸러 낸 결과를 필드에도 되돌립니다. 그러지 않으면 커서가 지운
      // 글자 뒤에 남아 다음 숫자가 엉뚱한 자리에 들어갑니다.
      _controller.value = TextEditingValue(
        text: digits,
        selection: TextSelection.collapsed(offset: digits.length),
      );
      return;
    }
    setState(() {});
    widget.onChanged?.call(digits);
    if (digits.length == widget.length) widget.onCompleted?.call(digits);
  }

  /// 숫자만 남깁니다.
  ///
  /// React `input-otp`의 기본 `pattern`이 숫자입니다. 붙여넣은 문자열에서도 같은
  /// 규칙으로 숫자만 취합니다.
  static String _digitsOnly(String raw) {
    final StringBuffer buffer = StringBuffer();
    for (final int unit in raw.codeUnits) {
      if (unit >= 0x30 && unit <= 0x39) buffer.writeCharCode(unit);
    }
    return buffer.toString();
  }

  /// 지금 커서가 놓인 자리입니다. React의 `isActive`에 대응합니다.
  int get _activeIndex {
    if (!_focusNode.hasFocus) return -1;
    final int offset = _controller.selection.isValid ? _controller.selection.end : _controller.text.length;
    return offset.clamp(0, widget.length - 1);
  }

  /// React `containerClassName`의 `gap-2`를 자식 사이 간격으로 옮깁니다.
  ///
  /// `Row`에는 CSS의 `gap`이 없으므로 자식 사이에 [SizedBox]를 끼워 넣습니다.
  List<Widget> _withGaps(List<Widget> children) => <Widget>[
    for (int index = 0; index < children.length; index++) ...<Widget>[
      if (index > 0) const SizedBox(width: _containerGap),
      children[index],
    ],
  ];

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final String code = _digitsOnly(_controller.text);

    final Widget field = Semantics(
      textField: true,
      enabled: !widget.disabled,
      label: widget.semanticLabel,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: widget.disabled ? null : _focusNode.requestFocus,
        child: _HoronInputOtpScope(
          code: code,
          length: widget.length,
          activeIndex: _activeIndex,
          disabled: widget.disabled,
          child: Row(mainAxisSize: MainAxisSize.min, children: _withGaps(widget.children)),
        ),
      ),
    );

    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Opacity(opacity: widget.disabled ? _disabledOpacity : 1, child: field),
        // 실제 입력을 받는 필드입니다. 칸 뒤에 두고 투명하게 그립니다. 크기를 1x1로
        // 줄이면 일부 플랫폼의 입력 연결이 붙지 않으므로 칸 전체를 덮게 둡니다.
        Positioned.fill(
          child: Opacity(
            opacity: 0,
            child: TextField(
              controller: _controller,
              focusNode: _focusNode,
              enabled: !widget.disabled,
              autofocus: widget.autofocus,
              keyboardType: TextInputType.number,
              inputFormatters: <TextInputFormatter>[
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(widget.length),
              ],
              cursorColor: horon.ring,
              showCursor: false,
              enableInteractiveSelection: false,
              style: TextStyle(color: scheme.surface, fontSize: _slotFontSize),
              decoration: const InputDecoration(
                filled: false,
                isCollapsed: true,
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// 코드와 활성 자리를 칸에 알리는 스코프입니다.
class _HoronInputOtpScope extends InheritedWidget {
  const _HoronInputOtpScope({
    required this.code,
    required this.length,
    required this.activeIndex,
    required this.disabled,
    required super.child,
  });

  final String code;
  final int length;
  final int activeIndex;
  final bool disabled;

  String charAt(int index) => index >= 0 && index < code.length ? code[index] : '';

  static _HoronInputOtpScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronInputOtpScope>();

  @override
  bool updateShouldNotify(_HoronInputOtpScope oldWidget) =>
      oldWidget.code != code ||
      oldWidget.length != length ||
      oldWidget.activeIndex != activeIndex ||
      oldWidget.disabled != disabled;
}

/// 그룹의 첫·마지막 칸 자리를 알리는 스코프입니다.
class _HoronInputOtpGroupScope extends InheritedWidget {
  const _HoronInputOtpGroupScope({required this.firstIndex, required this.lastIndex, required super.child});

  final int? firstIndex;
  final int? lastIndex;

  static _HoronInputOtpGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronInputOtpGroupScope>();

  @override
  bool updateShouldNotify(_HoronInputOtpGroupScope oldWidget) =>
      oldWidget.firstIndex != firstIndex || oldWidget.lastIndex != lastIndex;
}

/// [children]에서 첫 칸의 자리 번호를 찾습니다.
int? _firstSlotIndex(List<Widget> children) {
  for (final Widget child in children) {
    if (child is HoronInputOtpSlot) return child.index;
  }
  return null;
}

/// [children]에서 마지막 칸의 자리 번호를 찾습니다.
int? _lastSlotIndex(List<Widget> children) {
  int? last;
  for (final Widget child in children) {
    if (child is HoronInputOtpSlot) last = child.index;
  }
  return last;
}

/// 활성 칸에서 깜박이는 커서입니다. React `animate-pulse`의 `bg-foreground` 선입니다.
///
/// 깜박임을 [AnimationController]가 아니라 [Timer.periodic]로 돌립니다. 반복 애니메이션은
/// 끝나지 않으므로 `pumpAndSettle`이 영원히 기다립니다. Flutter의 `EditableText`도 같은
/// 이유로 커서를 타이머로 깜박입니다. 그래서 이 위젯은 테스트에서 멈추지 않습니다.
class _HoronInputOtpCaret extends StatefulWidget {
  const _HoronInputOtpCaret();

  @override
  State<_HoronInputOtpCaret> createState() => _HoronInputOtpCaretState();
}

class _HoronInputOtpCaretState extends State<_HoronInputOtpCaret> {
  Timer? _timer;
  bool _visible = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _timer?.cancel();
      _timer = null;
      _visible = true;
    } else {
      _timer ??= Timer.periodic(_caretPeriod, (_) => setState(() => _visible = !_visible));
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Color color = Theme.of(context).colorScheme.onSurface;
    return SizedBox(
      key: HoronInputOtp.caretKey,
      width: _caretWidth,
      height: _caretHeight,
      child: Opacity(
        opacity: _visible ? 1 : 0,
        child: ColoredBox(color: color),
      ),
    );
  }
}

/// lucide `Minus`(`M5 12h14`)를 24 단위 상자의 비율로 그립니다.
class _HoronInputOtpDashPainter extends CustomPainter {
  const _HoronInputOtpDashPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * _dashStrokeRatio
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(
      Offset(size.width * _dashStartX, size.height * _dashY),
      Offset(size.width * _dashEndX, size.height * _dashY),
      paint,
    );
  }

  @override
  bool shouldRepaint(_HoronInputOtpDashPainter oldDelegate) => color != oldDelegate.color;
}

/// lucide `Minus`의 시작 x입니다. 24 단위 중 5입니다.
const double _dashStartX = 5 / 24;

/// lucide `Minus`의 끝 x입니다. 24 단위 중 19입니다.
const double _dashEndX = 19 / 24;

/// lucide `Minus`의 y입니다. 24 단위 중 12입니다.
const double _dashY = 12 / 24;

/// lucide `Minus`의 `stroke-width` 2를 24 단위로 나눈 값입니다.
const double _dashStrokeRatio = 2 / 24;
