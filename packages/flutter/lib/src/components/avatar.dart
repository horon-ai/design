import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `avatar.tsx`가 받는 크기입니다.
///
/// React는 `size?: "default" | "sm" | "lg"`를 받고 `data-[size=...]`로 클래스를
/// 바꿉니다. `default`는 Dart 예약어라 `defaultValue`입니다.
enum HoronAvatarSize {
  /// `size-8`(32). React의 기본값입니다.
  defaultValue,

  /// `size-6`(24).
  sm,

  /// `size-10`(40).
  lg,
}

/// `avatar.tsx`의 `ring-2`입니다. 겹친 아바타 사이를 배경색 띠로 가릅니다.
const double _avatarRingWidth = 2.0;

/// `avatar.tsx`의 `-space-x-2`입니다. 묶음에서 이웃한 아바타가 겹치는 거리입니다.
const double _avatarGroupOverlap = HoronSpace.s2;

/// 아바타 안쪽 조각이 크기와 이니셜을 읽는 범위입니다.
///
/// React는 `group-data-[size=...]/avatar`로 자식의 모양을 바꿉니다. Flutter에서는
/// 그 역할을 이 범위가 합니다.
class _HoronAvatarScope extends InheritedWidget {
  const _HoronAvatarScope({required this.size, required this.initials, required super.child});

  final HoronAvatarSize size;
  final String? initials;

  static _HoronAvatarScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronAvatarScope>();

  @override
  bool updateShouldNotify(_HoronAvatarScope oldWidget) => size != oldWidget.size || initials != oldWidget.initials;
}

/// 이름에서 이니셜을 만듭니다.
///
/// 두 단어 이상이면 각 단어의 첫 글자를, 한 단어면 앞의 두 글자를 씁니다. 모두
/// 대문자로 올립니다. 이미지가 실패했을 때 보여 줄 글자입니다.
String _initialsOf(String? name) {
  final String trimmed = name?.trim() ?? '';
  if (trimmed.isEmpty) return '';
  final List<String> words = trimmed.split(RegExp(r'\s+'));
  if (words.length >= 2) {
    return '${_firstRune(words.first)}${_firstRune(words[1])}'.toUpperCase();
  }
  final List<int> runes = trimmed.runes.toList();
  final int take = runes.length >= 2 ? 2 : 1;
  return String.fromCharCodes(runes.take(take)).toUpperCase();
}

String _firstRune(String word) {
  final List<int> runes = word.runes.toList();
  return runes.isEmpty ? '' : String.fromCharCodes(runes.take(1));
}

/// 크기별 지름입니다. React의 `size-6`/`size-8`/`size-10`입니다.
double _diameterFor(HoronAvatarSize size) => switch (size) {
  HoronAvatarSize.sm => HoronSpace.s6,
  HoronAvatarSize.defaultValue => HoronSpace.s8,
  HoronAvatarSize.lg => HoronSpace.s10,
};

/// 크기별 배지 지름입니다. React의 `size-2`/`size-2.5`/`size-3`입니다.
double _badgeSizeFor(HoronAvatarSize size) => switch (size) {
  HoronAvatarSize.sm => HoronSpace.s2,
  HoronAvatarSize.defaultValue => HoronSpace.s2_5,
  HoronAvatarSize.lg => HoronSpace.s3,
};

/// 사용자를 나타내는 둥근 아바타입니다.
///
/// `avatar.tsx`를 옮긴 것입니다. React는 `relative flex size-8 shrink-0 select-none
/// rounded-full after:border after:border-border`이고, 크기는 `data-[size=...]`가
/// 정합니다(기본 32, `sm` 24, `lg` 40). 테두리는 이미지 위에 얹히는 1px 링입니다.
///
/// [image]와 [badge]를 넘기면 [HoronAvatarImage]와 [HoronAvatarBadge]가 각자의
/// 자리에 놓입니다. [name]을 주면 이미지가 실패했을 때 그 이름의 이니셜이
/// [HoronAvatarFallback]으로 그려집니다.
///
/// ```dart
/// HoronAvatar(
///   name: '민열 김',
///   size: HoronAvatarSize.lg,
///   image: HoronAvatarImage(image: NetworkImage('https://example.com/a.png')),
///   badge: const HoronAvatarBadge(),
/// );
/// ```
class HoronAvatar extends StatelessWidget {
  /// 아바타 하나를 만듭니다.
  const HoronAvatar({
    super.key,
    this.size = HoronAvatarSize.defaultValue,
    this.name,
    this.image,
    this.fallback,
    this.badge,
    this.child,
    this.semanticsLabel,
  });

  /// 이 크기의 지름입니다. React의 `size-*` 값입니다.
  double get diameter => _diameterFor(size);

  /// 이름입니다. 이미지가 실패했을 때 이 값의 이니셜을 그립니다.
  final String? name;

  /// 크기입니다.
  final HoronAvatarSize size;

  /// 보여 줄 이미지입니다. 보통 [HoronAvatarImage]입니다.
  final Widget? image;

  /// 이미지가 없거나 실패했을 때 그릴 내용입니다. 없으면 [name]의 이니셜입니다.
  final Widget? fallback;

  /// 오른쪽 아래에 붙는 배지입니다. 보통 [HoronAvatarBadge]입니다.
  final Widget? badge;

  /// 위 슬롯 대신 원 안에 넣는 임의 내용입니다.
  final Widget? child;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticsLabel;

  /// [name]의 이니셜입니다. 이미지 실패 시 보여 줄 글자입니다.
  static String initials(String? name) => _initialsOf(name);

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final String initials = _initialsOf(name);
    final Widget content = child ?? image ?? fallback ?? HoronAvatarFallback(label: initials.isEmpty ? null : initials);

    return _HoronAvatarScope(
      size: size,
      initials: initials.isEmpty ? null : initials,
      child: Semantics(
        label: semanticsLabel,
        image: true,
        child: SizedBox.square(
          dimension: diameter,
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              Positioned.fill(child: ClipOval(child: content)),
              // React의 `after:border after:border-border`입니다. 이미지 위에 얹히는
              // 1px 테두리라 테두리가 이미지 가장자리를 덮습니다.
              Positioned.fill(
                child: IgnorePointer(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: scheme.outline),
                    ),
                  ),
                ),
              ),
              if (badge != null) Positioned(right: 0, bottom: 0, child: badge!),
            ],
          ),
        ),
      ),
    );
  }
}

/// `avatar.tsx`의 `AvatarImage`입니다.
///
/// 이미지가 아직 로드되지 않았거나 실패하면 [fallback]을 그립니다. [fallback]을
/// 넘기지 않으면 둘러싼 [HoronAvatar]의 [HoronAvatar.name] 이니셜을 씁니다. 이것이
/// React(Base UI)의 이미지·폴백 동작입니다.
class HoronAvatarImage extends StatefulWidget {
  /// 이미지 하나를 만듭니다.
  const HoronAvatarImage({super.key, required this.image, this.fallback, this.fit = BoxFit.cover});

  /// 로드할 이미지입니다.
  final ImageProvider<Object> image;

  /// 실패했을 때 그릴 내용입니다.
  final Widget? fallback;

  /// 이미지를 채우는 방식입니다. React의 `object-cover`에 해당합니다.
  final BoxFit fit;

  @override
  State<HoronAvatarImage> createState() => _HoronAvatarImageState();
}

class _HoronAvatarImageState extends State<HoronAvatarImage> {
  ImageStream? _stream;
  ImageStreamListener? _listener;
  ImageInfo? _info;
  bool _failed = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _resolve();
  }

  @override
  void didUpdateWidget(covariant HoronAvatarImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.image != widget.image) {
      _stopListening();
      _info = null;
      _failed = false;
      _resolve();
    }
  }

  @override
  void dispose() {
    _stopListening();
    super.dispose();
  }

  void _stopListening() {
    final ImageStream? stream = _stream;
    final ImageStreamListener? listener = _listener;
    if (stream != null && listener != null) stream.removeListener(listener);
    _stream = null;
    _listener = null;
  }

  void _resolve() {
    final ImageStream stream = widget.image.resolve(createLocalImageConfiguration(context));
    final ImageStreamListener listener = ImageStreamListener(
      (ImageInfo info, bool synchronousCall) {
        if (!mounted) return;
        setState(() {
          _info = info;
          _failed = false;
        });
      },
      onError: (Object error, StackTrace? stackTrace) {
        if (!mounted) return;
        setState(() => _failed = true);
      },
    );
    _stream = stream;
    _listener = listener;
    stream.addListener(listener);
  }

  @override
  Widget build(BuildContext context) {
    final ImageInfo? info = _info;
    if (info != null && !_failed) {
      return RawImage(image: info.image, fit: widget.fit, width: double.infinity, height: double.infinity);
    }
    return widget.fallback ?? HoronAvatarFallback(label: _HoronAvatarScope.maybeOf(context)?.initials);
  }
}

/// `avatar.tsx`의 `AvatarFallback`입니다.
///
/// React는 `flex size-full items-center justify-center rounded-full bg-muted text-xs
/// font-semibold text-muted-foreground`입니다. [label]을 주면 그 글자를 그리고,
/// [child]를 주면 그 위젯을 그립니다.
class HoronAvatarFallback extends StatelessWidget {
  /// 폴백 하나를 만듭니다.
  const HoronAvatarFallback({super.key, this.label, this.child});

  /// 보여 줄 글자입니다. 보통 이니셜입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.caption,
      fontWeight: HoronFontWeight.semibold,
      height: HoronLineHeight.none,
      color: scheme.onSurfaceVariant,
    );
    return DecoratedBox(
      decoration: BoxDecoration(color: scheme.surfaceContainerHighest, shape: BoxShape.circle),
      child: Center(
        child:
            child ??
            (label == null
                ? const SizedBox.shrink()
                : Text(label!, maxLines: 1, textAlign: TextAlign.center, style: style)),
      ),
    );
  }
}

/// `avatar.tsx`의 `AvatarBadge`입니다.
///
/// React는 오른쪽 아래에 붙는 `rounded-full bg-primary ring-2 ring-background`이고,
/// 지름은 아바타 크기를 따라 `size-2`/`size-2.5`/`size-3`입니다. [HoronAvatar]의
/// [HoronAvatar.badge]로 넘기면 오른쪽 아래 모서리에 놓입니다.
class HoronAvatarBadge extends StatelessWidget {
  /// 배지 하나를 만듭니다.
  const HoronAvatarBadge({super.key, this.child, this.color});

  /// 배지 안에 넣는 내용입니다. `sm` 크기에서는 React처럼 숨깁니다.
  final Widget? child;

  /// 배지 색입니다. 없으면 `primary`입니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronAvatarSize size = _HoronAvatarScope.maybeOf(context)?.size ?? HoronAvatarSize.defaultValue;
    final double diameter = _badgeSizeFor(size);
    final bool showChild = size != HoronAvatarSize.sm && child != null;

    return ExcludeSemantics(
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: color ?? scheme.primary,
          shape: BoxShape.circle,
          border: Border.all(color: scheme.surface, width: _avatarRingWidth),
        ),
        child: SizedBox.square(
          dimension: diameter,
          child: showChild ? Center(child: child) : null,
        ),
      ),
    );
  }
}

/// `avatar.tsx`의 `AvatarGroup`입니다.
///
/// React는 `flex -space-x-2`이고 각 아바타에 `ring-2 ring-background`를 겹칩니다.
/// 그래서 이웃한 아바타가 8px 겹치고, 겹친 자리에 배경색 띠가 보입니다.
class HoronAvatarGroup extends StatelessWidget {
  /// 아바타 묶음 하나를 만듭니다.
  const HoronAvatarGroup({super.key, this.size = HoronAvatarSize.defaultValue, this.children = const <Widget>[]});

  /// 묶음의 아바타 크기입니다. [HoronAvatarGroupCount]가 이 값을 따라갑니다.
  final HoronAvatarSize size;

  /// 묶음 안의 아바타들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double diameter = _diameterFor(size);
    final double slot = diameter + _avatarRingWidth * 2;
    final double stride = diameter - _avatarGroupOverlap;
    final double width = children.isEmpty ? 0 : stride * (children.length - 1) + slot;

    return _HoronAvatarGroupScope(
      size: size,
      child: SizedBox(
        width: width,
        height: slot,
        child: Stack(
          clipBehavior: Clip.none,
          children: <Widget>[
            for (int index = 0; index < children.length; index++)
              Positioned(
                left: stride * index,
                top: 0,
                width: slot,
                height: slot,
                child: Center(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: scheme.surface, width: _avatarRingWidth),
                    ),
                    child: children[index],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// 묶음의 크기를 [HoronAvatarGroupCount]에 알리는 범위입니다.
class _HoronAvatarGroupScope extends InheritedWidget {
  const _HoronAvatarGroupScope({required this.size, required super.child});

  final HoronAvatarSize size;

  static HoronAvatarSize sizeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronAvatarGroupScope>()?.size ?? HoronAvatarSize.defaultValue;

  @override
  bool updateShouldNotify(_HoronAvatarGroupScope oldWidget) => size != oldWidget.size;
}

/// `avatar.tsx`의 `AvatarGroupCount`입니다.
///
/// React는 `size-8 rounded-full bg-muted text-sm text-muted-foreground ring-2
/// ring-background`이고, 묶음의 아바타 크기를 따라 `lg`는 40, `sm`은 24가 됩니다.
class HoronAvatarGroupCount extends StatelessWidget {
  /// 남은 수를 보여 주는 칩 하나를 만듭니다.
  const HoronAvatarGroupCount({super.key, this.count, this.child});

  /// 보여 줄 수입니다. "+3"으로 그립니다.
  final int? count;

  /// 수 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronAvatarSize size = _HoronAvatarGroupScope.sizeOf(context);
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.body,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.none,
      color: scheme.onSurfaceVariant,
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        shape: BoxShape.circle,
        border: Border.all(color: scheme.surface, width: _avatarRingWidth),
      ),
      child: SizedBox.square(
        dimension: _diameterFor(size),
        child: Center(child: child ?? Text(count == null ? '' : '+$count', maxLines: 1, style: style)),
      ),
    );
  }
}
