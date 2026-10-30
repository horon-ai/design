import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 메시지 입력 알약입니다.
///
/// React `Composer`: regular 유리 알약 안에 첨부 버튼, 입력칸, 그리고 글이 없을 때는 음성
/// 버튼, 글이 있으면 잉크색 전송 버튼이 들어갑니다. 여백 8, 간격 8, `rounded-full`입니다.
///
/// React는 `value`/`defaultValue`로 값을 제어합니다. Flutter에서는 관례대로
/// [controller]를 받고, 시작 값은 [initialValue]입니다.
class HoronComposer extends StatefulWidget {
  /// 입력칸과 콜백을 받습니다.
  const HoronComposer({
    super.key,
    this.placeholder = 'Message',
    this.controller,
    this.initialValue = '',
    this.onValueChange,
    this.onSubmit,
    this.onAttach,
    this.onVoice,
    this.disabled = false,
  });

  /// 입력칸의 안내 문구입니다. React `placeholder`(기본 "Message").
  final String placeholder;

  /// 입력 값을 소유하는 컨트롤러입니다. 주지 않으면 이 위젯이 하나 만들어 폐기합니다.
  final TextEditingController? controller;

  /// 컨트롤러를 주지 않았을 때의 시작 값입니다. React `defaultValue`.
  final String initialValue;

  /// 글자가 바뀔 때마다 호출됩니다. React `onValueChange`.
  final ValueChanged<String>? onValueChange;

  /// 전송할 때 호출되고 입력칸을 비웁니다. 빈 값이면 아무 일도 하지 않습니다. React `onSubmit`.
  final ValueChanged<String>? onSubmit;

  /// 첨부 버튼을 눌렀을 때 호출됩니다. React `onAttach`.
  final VoidCallback? onAttach;

  /// 음성 버튼을 눌렀을 때 호출됩니다. React `onVoice`.
  final VoidCallback? onVoice;

  /// 입력칸과 세 버튼을 모두 막습니다. React `disabled`.
  final bool disabled;

  /// `size-10` — 아이콘 버튼 한 변입니다.
  static const double _buttonSize = 40;

  /// `size-5` — 아이콘 버튼 안 아이콘의 크기입니다.
  static const double _iconSize = 20;

  @override
  State<HoronComposer> createState() => _HoronComposerState();
}

class _HoronComposerState extends State<HoronComposer> {
  late final TextEditingController _controller;
  late final bool _ownsController;

  @override
  void initState() {
    super.initState();
    _ownsController = widget.controller == null;
    _controller = widget.controller ?? TextEditingController(text: widget.initialValue);
    _controller.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    _controller.removeListener(_onTextChanged);
    if (_ownsController) _controller.dispose();
    super.dispose();
  }

  void _onTextChanged() {
    if (mounted) setState(() {});
  }

  void _submit() {
    final String value = _controller.text;
    if (value.trim().isEmpty) return;
    widget.onSubmit?.call(value);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    final bool disabled = widget.disabled;
    final bool hasText = _controller.text.trim().isNotEmpty;

    return ClipRRect(
      key: const Key('horon-composer'),
      borderRadius: BorderRadius.circular(theme.radius.full),
      child: ColoredBox(
        // `bg-glass-regular` — 유리 레이어 엔진이 없어 토큰 색으로 채웁니다.
        color: colors.glassRegular,
        child: Padding(
          // `p-2`.
          padding: EdgeInsets.all(space.s2),
          child: Row(
            children: <Widget>[
              _ComposerIconButton(icon: Icons.add, label: 'Attach', onPressed: disabled ? null : widget.onAttach),
              SizedBox(width: space.s2),
              Expanded(
                child: TextField(
                  controller: _controller,
                  enabled: !disabled,
                  maxLines: 1,
                  style: theme.text.bodyMd.copyWith(color: colors.textPrimary),
                  cursorColor: colors.textPrimary,
                  textInputAction: TextInputAction.send,
                  onChanged: widget.onValueChange,
                  onSubmitted: (String value) => _submit(),
                  decoration: InputDecoration(
                    hintText: widget.placeholder,
                    hintStyle: theme.text.bodyMd.copyWith(color: colors.textPlaceholder),
                    // `bg-transparent outline-none` — 테마의 채운 배경과 테두리를 끕니다.
                    filled: false,
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    disabledBorder: InputBorder.none,
                  ),
                ),
              ),
              SizedBox(width: space.s2),
              AnimatedSwitcher(
                duration: animate ? HoronMotion.popInDuration : Duration.zero,
                switchInCurve: HoronMotion.popInCurve,
                switchOutCurve: HoronMotion.popOutCurve,
                transitionBuilder: (Widget child, Animation<double> animation) => ScaleTransition(
                  scale: animation.drive(
                    Tween<double>(
                      begin: HoronMotion.popInScale,
                      end: 1,
                    ).chain(CurveTween(curve: HoronMotion.popInCurve)),
                  ),
                  child: child,
                ),
                child: hasText
                    ? _ComposerIconButton(
                        key: const ValueKey<String>('horon-composer-send'),
                        icon: Icons.arrow_upward,
                        label: 'Send',
                        primary: true,
                        onPressed: disabled ? null : _submit,
                      )
                    : _ComposerIconButton(
                        key: const ValueKey<String>('horon-composer-voice'),
                        icon: Icons.mic_none,
                        label: 'Voice input',
                        iconColor: colors.textSecondary,
                        onPressed: disabled ? null : widget.onVoice,
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Composer 안의 40px 원형 아이콘 버튼입니다.
///
/// React `IconButton`의 `ghost`/`primary` 변형과 `md` 크기만 옮겼습니다. 44px 터치 영역은
/// 보이는 원 위에 겹쳐 넓힙니다(`after:min-h-11`).
class _ComposerIconButton extends StatelessWidget {
  const _ComposerIconButton({
    super.key,
    required this.icon,
    required this.label,
    this.onPressed,
    this.primary = false,
    this.iconColor,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final bool primary;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool enabled = onPressed != null;

    return Opacity(
      opacity: enabled ? 1 : _disabledOpacity,
      child: Semantics(
        button: true,
        enabled: enabled,
        label: label,
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: Material(
            color: primary ? colors.interactivePrimary : Colors.transparent,
            shape: const StadiumBorder(),
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: onPressed,
              splashFactory: NoSplash.splashFactory,
              hoverColor: primary ? colors.interactivePrimaryHover : colors.overlayInk6,
              focusColor: colors.textBrand.withValues(alpha: 0.12),
              child: SizedBox(
                width: HoronComposer._buttonSize,
                height: HoronComposer._buttonSize,
                child: Icon(
                  icon,
                  size: HoronComposer._iconSize,
                  color: primary ? colors.interactiveOnPrimary : (iconColor ?? colors.textPrimary),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `data-disabled:opacity-40`.
const double _disabledOpacity = 0.4;
