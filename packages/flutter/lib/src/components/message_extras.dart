import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../contracts/surface.dart';
import '../glass/glass_geometry.dart';
import '../glass/horon_surface.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'icon_button.dart';

/// `message-extras.tsx`의 `size-7.5`입니다. 동작 버튼 상자입니다.
const double _actionSide = 30;

/// `message-extras.tsx`의 `size-10`입니다. 첨부 썸네일입니다.
const double _attachmentThumb = 40;

/// `message-extras.tsx`의 `rounded-md`입니다.
const double _attachmentRadius = HoronRadius.md;

/// `message-extras.tsx`의 `p-[3px]`입니다. 동작 알약의 안쪽 여백입니다.
const double _actionsPadding = 3;

/// `message-extras.tsx`의 `w-70`입니다.
const double _attachmentWidth = 280;

/// `message-extras.tsx`의 `rounded-lg`입니다. 코드 블록의 14 반경입니다.
const double _codeRadius = HoronRadius.lg;

/// Figma `Date separator`(Message extras 109:667): 10% 잉크 선 사이의 캡션입니다.
class HoronDateSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronDateSeparator({super.key, required this.label});

  /// 가운데 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      container: true,
      child: Row(
        children: <Widget>[
          Expanded(
            child: SizedBox(height: 1, child: ColoredBox(color: theme.colors.overlayInk10)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(label, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          ),
          Expanded(
            child: SizedBox(height: 1, child: ColoredBox(color: theme.colors.overlayInk10)),
          ),
        ],
      ),
    );
  }
}

/// 메시지 아래 동작 하나입니다.
class HoronMessageAction {
  /// 동작을 만듭니다.
  const HoronMessageAction({required this.label, required this.icon, this.onPressed});

  /// 접근성 이름입니다.
  final String label;

  /// 16px로 그릴 아이콘입니다.
  final Widget icon;

  /// 누르는 동작입니다.
  final VoidCallback? onPressed;
}

/// Figma `Message actions`(109:667): 16px 아이콘의 30px 버튼을 담은 regular 유리 알약입니다.
class HoronMessageActions extends StatelessWidget {
  /// 알약을 만듭니다.
  const HoronMessageActions({super.key, required this.actions, this.surface = HoronSurface.solid});

  /// 동작 목록입니다.
  final List<HoronMessageAction> actions;

  /// 표면입니다. 기본값은 [HoronSurface.solid]입니다.
  final HoronSurface surface;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.full);

    return Align(
      alignment: Alignment.centerLeft,
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronSurfaceLayer(
                surface: surface,
                tier: HoronGlassTier.regular,
                borderRadius: radius,
                child: const SizedBox.expand(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(_actionsPadding),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                spacing: 2,
                children: <Widget>[
                  for (final HoronMessageAction action in actions) _MessageActionButton(action: action),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 메시지 동작 하나의 30px 버튼입니다.
///
/// React `message-extras.tsx`의 `size-7.5 … motion-press hover:bg-overlay-ink-6
/// focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand`입니다.
class _MessageActionButton extends StatefulWidget {
  const _MessageActionButton({required this.action});

  final HoronMessageAction action;

  @override
  State<_MessageActionButton> createState() => _MessageActionButtonState();
}

class _MessageActionButtonState extends State<_MessageActionButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    final bool interactive = widget.action.onPressed != null;

    return Semantics(
      button: true,
      label: widget.action.label,
      child: FocusableActionDetector(
        enabled: interactive,
        mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.action.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.action.onPressed,
          onTapDown: (TapDownDetails details) {
            if (interactive) setState(() => _pressed = true);
          },
          onTapUp: (TapUpDetails details) {
            if (_pressed) setState(() => _pressed = false);
          },
          onTapCancel: () {
            if (_pressed) setState(() => _pressed = false);
          },
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              AnimatedScale(
                scale: _pressed && interactive && !reduce ? HoronMotion.pressScale : 1, // motion-press
                duration: reduce ? Duration.zero : HoronMotion.pressDuration,
                curve: HoronMotion.pressCurve,
                child: AnimatedContainer(
                  duration: reduce ? Duration.zero : HoronMotion.colorsDuration, // motion-colors
                  curve: HoronMotion.colorsCurve,
                  width: _actionSide,
                  height: _actionSide,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    // hover:bg-overlay-ink-6
                    color: _hovered && interactive ? colors.overlayInk6 : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  child: IconTheme.merge(
                    data: IconThemeData(size: 16, color: colors.textSecondary), // [&>svg]:size-4
                    child: widget.action.icon,
                  ),
                ),
              ),
              if (_focused && interactive)
                Positioned(
                  left: -2, // outline-offset-2
                  top: -2,
                  right: -2,
                  bottom: -2,
                  child: IgnorePointer(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: colors.textBrand), // outline-text-brand
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Figma `Attachment`(109:667): 40px 썸네일과 이름·설명, 제거 버튼이 있는 옅은 카드입니다.
class HoronAttachment extends StatelessWidget {
  /// 첨부를 만듭니다.
  const HoronAttachment({
    super.key,
    required this.name,
    this.detail,
    this.imageUrl,
    this.onRemove,
    this.removeLabel = 'Remove',
  });

  /// 파일 이름입니다.
  final String name;

  /// 캡션입니다. 예: `PDF · 2.4 MB`.
  final String? detail;

  /// 이미지 썸네일 주소입니다. 없으면 문서 아이콘 타일을 그립니다.
  final String? imageUrl;

  /// 제거를 눌렀을 때입니다.
  final VoidCallback? onRemove;

  /// 제거 버튼의 접근성 이름입니다.
  final String removeLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduce = MediaQuery.disableAnimationsOf(context);

    final Widget card = Container(
      width: _attachmentWidth,
      padding: const EdgeInsets.only(left: 8, right: 8, top: 8, bottom: 8), // py-2 pr-2 pl-2
      decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(theme.radius.lg)),
      child: Row(
        spacing: 10, // gap-2.5
        children: <Widget>[
          ClipRRect(
            borderRadius: BorderRadius.circular(_attachmentRadius),
            child: SizedBox(
              width: _attachmentThumb,
              height: _attachmentThumb,
              child: imageUrl == null
                  ? ColoredBox(
                      // bg-accent-sky-500-16 text-text-brand
                      color: theme.colors.accentSky500_16,
                      child: Center(child: Icon(Icons.description_outlined, size: 20, color: theme.colors.textBrand)),
                    )
                  : Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (BuildContext context, Object error, StackTrace? stack) => ColoredBox(
                        color: theme.colors.accentSky500_16,
                        child: Center(child: Icon(Icons.description_outlined, size: 20, color: theme.colors.textBrand)),
                      ),
                    ),
            ),
          ),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 1, // gap-px
              children: <Widget>[
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                ),
                if (detail != null)
                  Text(
                    detail!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                  ),
              ],
            ),
          ),
          if (onRemove != null)
            // `IconButton size="sm"`입니다. 공유 버튼은 44px 터치 상자를 레이아웃에
            // 포함하므로, 카드 높이가 40px 썸네일을 넘지 않도록 높이만 썸네일에 맞춥니다
            // (React는 `after:` 의사 요소로 히트 영역을 흐름 밖에 그립니다).
            SizedBox(
              height: _attachmentThumb,
              child: HoronIconButton(
                size: HoronIconButtonSize.sm,
                icon: const Icon(Icons.close),
                label: removeLabel,
                onPressed: onRemove,
              ),
            ),
        ],
      ),
    );

    // React `motion-rise`: 220ms 동안 4px 아래에서 올라옵니다.
    if (reduce) return card;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: HoronMotion.riseDuration,
      curve: HoronMotion.riseCurve,
      builder: (BuildContext context, double value, Widget? child) => Opacity(
        opacity: value,
        child: Transform.translate(offset: Offset(0, (1 - value) * HoronMotion.riseOffset), child: child),
      ),
      child: card,
    );
  }
}

/// Figma `Code block`(109:667): 잉크 표면, 14 반경, 복사 버튼이 있는 6% 헤더, `text-code` 코드입니다.
class HoronCodeBlock extends StatefulWidget {
  /// 코드 블록을 만듭니다.
  const HoronCodeBlock({
    super.key,
    required this.code,
    this.language,
    this.copyLabel = 'Copy',
    this.copiedLabel = 'Copied',
  });

  /// 코드 본문입니다.
  final String code;

  /// 헤더에 표시할 언어입니다.
  final String? language;

  /// 복사 버튼 글자입니다.
  final String copyLabel;

  /// 복사한 뒤 글자입니다.
  final String copiedLabel;

  @override
  State<HoronCodeBlock> createState() => _HoronCodeBlockState();
}

class _HoronCodeBlockState extends State<HoronCodeBlock> {
  bool _copied = false;
  Timer? _reset;

  @override
  void dispose() {
    _reset?.cancel();
    super.dispose();
  }

  void _markCopied() {
    if (!mounted) return;
    setState(() => _copied = true);
    // React `useEffect`: copied가 참이 되면 1.5초 뒤 스스로 되돌립니다.
    _reset?.cancel();
    _reset = Timer(const Duration(milliseconds: 1500), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  Future<void> _copy() async {
    // React는 `navigator.clipboard?.writeText(code).then(onFulfilled, () => undefined)`로
    // 실패를 무시하고 성공에만 표시를 바꿉니다.
    try {
      await Clipboard.setData(ClipboardData(text: widget.code));
      _markCopied();
    } on Object {
      // 실패는 표시를 바꾸지 않습니다(React와 같은 계약).
    }
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(_codeRadius);

    return ClipRRect(
      borderRadius: radius,
      child: ColoredBox(
        color: theme.colors.surfaceInk,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Container(
              color: theme.colors.bgSurface6,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8), // py-2 pr-3.5 pl-3.5
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: Text(
                      widget.language ?? '',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.text.caption.copyWith(color: theme.colors.textOnInk.withValues(alpha: 0.7)),
                    ),
                  ),
                  Semantics(
                    button: true,
                    child: GestureDetector(
                      onTap: _copy,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        spacing: 4, // gap-1
                        children: <Widget>[
                          Icon(Icons.copy, size: 14, color: theme.colors.textOnInk), // size-3.5
                          SizedBox(
                            width: 40, // min-w-10
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: AnimatedSwitcher(
                                duration: MediaQuery.disableAnimationsOf(context)
                                    ? Duration.zero
                                    : HoronMotion.fadeInDuration, // animate-fade-in
                                child: Text(
                                  _copied ? widget.copiedLabel : widget.copyLabel,
                                  key: ValueKey<bool>(_copied),
                                  maxLines: 1,
                                  style: theme.text.caption.copyWith(color: theme.colors.textOnInk),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(left: 14, right: 14, top: 12, bottom: 14),
              child: Text(widget.code, softWrap: false, style: theme.text.code.copyWith(color: theme.colors.textOnInk)),
            ),
          ],
        ),
      ),
    );
  }
}
