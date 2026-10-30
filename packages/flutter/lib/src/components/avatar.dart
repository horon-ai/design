import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `avatar.tsx`의 `AvatarSize`입니다.
enum HoronAvatarSize {
  /// `size="sm"` — 24px, `label-sm`.
  sm,

  /// `size="md"` — 32px, `label-md`. 기본값입니다.
  md,

  /// `size="lg"` — 40px, `label-lg`.
  lg,

  /// `size="xl"` — 56px, `title-sm`.
  xl,
}

/// `sizeClass`의 값입니다.
const Map<HoronAvatarSize, double> _avatarSide = <HoronAvatarSize, double>{
  HoronAvatarSize.sm: 24,
  HoronAvatarSize.md: 32,
  HoronAvatarSize.lg: 40,
  HoronAvatarSize.xl: 56,
};

/// `botIconClass`의 값입니다.
const Map<HoronAvatarSize, double> _botIconSize = <HoronAvatarSize, double>{
  HoronAvatarSize.sm: 13,
  HoronAvatarSize.md: 18,
  HoronAvatarSize.lg: 22,
  HoronAvatarSize.xl: 31,
};

/// `liveClass`의 값입니다. 상태 점의 지름입니다.
const Map<HoronAvatarSize, double> _liveDotSize = <HoronAvatarSize, double>{
  HoronAvatarSize.sm: 10,
  HoronAvatarSize.md: 11,
  HoronAvatarSize.lg: 13,
  HoronAvatarSize.xl: 18,
};

/// Figma `Avatar`(61:347): 이니셜·봇·이미지 세 모양을 네 크기로 그리고 상태 점을 붙일 수 있습니다.
///
/// `avatar.tsx`의 `type`은 props 안의 인라인 유니온이라 variant 어휘가 아니므로,
/// 세 모양을 이름 있는 생성자로 엽니다: [HoronAvatar.initials],
/// [HoronAvatar.bot], [HoronAvatar.image]. 크기([size])와 색조([tone])는 React가
/// 유니온으로 export하므로 enum입니다.
class HoronAvatar extends StatefulWidget {
  /// 이니셜 아바타를 만듭니다.
  const HoronAvatar.initials(
    this.initials, {
    super.key,
    this.size = HoronAvatarSize.md,
    this.sky = false,
    this.live = false,
  }) : _kind = _AvatarKind.initials,
       imageUrl = null,
       alt = '';

  /// 봇 아바타를 만듭니다. 브랜드 바탕에 로봇 아이콘이 놓입니다.
  const HoronAvatar.bot({super.key, this.size = HoronAvatarSize.md, this.live = false})
    : _kind = _AvatarKind.bot,
      initials = null,
      sky = false,
      imageUrl = null,
      alt = '';

  /// 이미지 아바타를 만듭니다. 이미지가 없거나 실패하면 [initials]가 보입니다.
  const HoronAvatar.image({
    super.key,
    required this.imageUrl,
    this.initials,
    this.alt = '',
    this.size = HoronAvatarSize.md,
    this.live = false,
  }) : _kind = _AvatarKind.image,
       sky = false;

  final _AvatarKind _kind;

  /// 이니셜 또는 대체 글자입니다.
  final String? initials;

  /// 이미지 주소입니다.
  final String? imageUrl;

  /// 이미지 대체 텍스트입니다.
  final String alt;

  /// 크기입니다.
  final HoronAvatarSize size;

  /// `tone="sky"` 자리입니다. React의 `tone`이 props 안의 인라인 유니온이라
  /// variant 어휘가 아니므로 enum 대신 플래그로 받습니다(Paper 계정 아바타).
  final bool sky;

  /// 오른쪽 아래에 상태 점을 붙입니다.
  final bool live;

  @override
  State<HoronAvatar> createState() => _HoronAvatarState();
}

class _HoronAvatarState extends State<HoronAvatar> with SingleTickerProviderStateMixin {
  late final AnimationController _dot = AnimationController(vsync: this, duration: HoronMotion.popInDuration);

  @override
  void initState() {
    super.initState();
    if (widget.live) _dot.forward();
  }

  @override
  void didUpdateWidget(HoronAvatar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.live && !oldWidget.live) _dot.forward(from: 0);
  }

  @override
  void dispose() {
    _dot.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final double side = _avatarSide[widget.size]!;
    final TextStyle label = switch (widget.size) {
      HoronAvatarSize.sm => theme.text.labelSm,
      HoronAvatarSize.md => theme.text.labelMd,
      HoronAvatarSize.lg => theme.text.labelLg,
      HoronAvatarSize.xl => theme.text.titleSm,
    };

    final (Color background, Color foreground) = switch (widget._kind) {
      _AvatarKind.bot => (theme.colors.bgBrand, theme.colors.textBrand),
      _AvatarKind.image => (HoronPalette.sky200, theme.colors.textSecondary),
      _AvatarKind.initials =>
        widget.sky ? (HoronPalette.sky100, HoronPalette.sky700) : (theme.colors.bgSubtle, theme.colors.textSecondary),
    };

    final Widget face = Container(
      width: side,
      height: side,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: background, shape: BoxShape.circle),
      child: switch (widget._kind) {
        _AvatarKind.bot => Icon(Icons.smart_toy_outlined, size: _botIconSize[widget.size], color: foreground),
        _AvatarKind.image => ClipOval(
          child: Image.network(
            widget.imageUrl!,
            width: side,
            height: side,
            fit: BoxFit.cover,
            semanticLabel: widget.alt.isEmpty ? null : widget.alt,
            errorBuilder: (BuildContext context, Object error, StackTrace? stack) =>
                _initialsFace(label.copyWith(color: foreground), foreground),
          ),
        ),
        _AvatarKind.initials => _initialsFace(label.copyWith(color: foreground), foreground),
      },
    );

    if (!widget.live) return face;

    final double dot = _liveDotSize[widget.size]!;
    return SizedBox(
      width: side,
      height: side,
      child: Stack(
        clipBehavior: Clip.none,
        children: <Widget>[
          face,
          Positioned(
            right: -2,
            bottom: -2,
            child: ScaleTransition(
              scale: _dot.drive(CurveTween(curve: HoronMotion.popInCurve)),
              child: Container(
                width: dot,
                height: dot,
                decoration: BoxDecoration(
                  color: theme.colors.statusLive,
                  shape: BoxShape.circle,
                  border: Border.all(color: theme.colors.bgDefault, width: 2),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _initialsFace(TextStyle style, Color foreground) {
    final String? text = widget.initials;
    if (text == null || text.isEmpty) {
      return Icon(Icons.person_outline, size: _botIconSize[widget.size], color: foreground);
    }
    return Text(text, style: style, maxLines: 1, textAlign: TextAlign.center);
  }
}

enum _AvatarKind { initials, bot, image }
