import 'package:flutter/material.dart';

import '../tokens/horon_tokens.g.dart';

/// 필드 하나의 오류·비활성 상태를 그 안의 라벨·설명·오류·컨트롤이 함께 읽는
/// 스코프입니다.
///
/// React는 Base UI의 `Field.Root`가 `data-disabled`·`data-invalid`를 자손에게
/// 내려보내고, 라벨과 컨트롤이 그 속성을 보고 모양을 바꿉니다. Flutter에는 그
/// 속성이 없으므로 이 [InheritedWidget]이 같은 역할을 합니다. 스코프가 없으면 각
/// 위젯의 명시 인자가 그대로 쓰입니다.
class HoronFieldScope extends InheritedWidget {
  /// 스코프를 만듭니다.
  const HoronFieldScope({super.key, required this.invalid, required this.disabled, required super.child});

  /// 필드가 오류 상태인지 여부입니다.
  final bool invalid;

  /// 필드가 비활성 상태인지 여부입니다.
  final bool disabled;

  /// 가장 가까운 스코프입니다. 필드 밖이면 null입니다.
  static HoronFieldScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HoronFieldScope>();

  @override
  bool updateShouldNotify(HoronFieldScope oldWidget) => oldWidget.invalid != invalid || oldWidget.disabled != disabled;
}

/// `field.tsx`의 `Field`입니다.
///
/// React의 `flex w-full flex-col gap-2`를 그대로 옮깁니다. 안에 넣은
/// [HoronFieldLabel]·[HoronFieldDescription]·[HoronFieldError]와 `HoronInput`은
/// 상태를 따로 받지 않아도 [HoronFieldScope]를 통해 같은 오류·비활성을 그립니다.
///
/// React 소스에 `variants:` 블록이 없으므로 공개 변형 enum을 두지 않습니다.
class HoronField extends StatelessWidget {
  /// 필드를 만듭니다.
  const HoronField({
    super.key,
    required this.children,
    this.invalid = false,
    this.disabled = false,
    this.crossAxisAlignment = CrossAxisAlignment.start,
  });

  /// 세로로 쌓을 자식입니다.
  final List<Widget> children;

  /// 필드가 오류 상태인지 여부입니다.
  final bool invalid;

  /// 필드가 비활성 상태인지 여부입니다.
  final bool disabled;

  /// 가로 정렬입니다.
  final CrossAxisAlignment crossAxisAlignment;

  @override
  Widget build(BuildContext context) {
    return HoronFieldScope(
      invalid: invalid,
      disabled: disabled,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: crossAxisAlignment,
        spacing: HoronSpace.s2,
        children: children,
      ),
    );
  }
}

/// `field.tsx`의 `FieldLabel`입니다.
///
/// React의 `flex w-fit items-center gap-2 text-sm leading-none font-medium
/// select-none data-disabled:pointer-events-none data-disabled:opacity-50`에
/// 대응합니다. [HoronFieldScope]가 비활성이면 글자를 흐리게 그리고, 오류면
/// destructive 색으로 바꿉니다.
class HoronFieldLabel extends StatelessWidget {
  /// 필드 라벨을 만듭니다.
  const HoronFieldLabel({
    super.key,
    required this.label,
    this.icon,
    this.child,
    this.disabled,
    this.invalid,
    this.style,
  });

  /// 화면에 쓰는 문구입니다. 호스트가 넘깁니다.
  final String label;

  /// 문구 앞에 붙는 아이콘 슬롯입니다.
  final Widget? icon;

  /// 문구 뒤에 붙는 위젯 슬롯입니다.
  final Widget? child;

  /// 명시한 비활성 상태입니다. null이면 스코프를 따릅니다.
  final bool? disabled;

  /// 명시한 오류 상태입니다. null이면 스코프를 따릅니다.
  final bool? invalid;

  /// 문구 스타일을 덮어쓸 때 씁니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronFieldScope? scope = HoronFieldScope.maybeOf(context);
    final bool isDisabled = disabled ?? (scope?.disabled ?? false);
    final bool isInvalid = invalid ?? (scope?.invalid ?? false);
    final Color color = isDisabled
        ? scheme.onSurface.withValues(alpha: _disabledOpacity)
        : (isInvalid ? scheme.error : scheme.onSurface);
    final TextStyle resolved = (style ?? theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      color: color,
      fontSize: HoronText.body,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.none,
    );
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      spacing: HoronSpace.s2,
      children: <Widget>[
        ?icon,
        Flexible(child: Text(label, style: resolved)),
        ?child,
      ],
    );
  }
}

/// `field.tsx`의 `FieldDescription`입니다.
///
/// React의 `text-xs text-muted-foreground`에 대응합니다.
class HoronFieldDescription extends StatelessWidget {
  /// 설명을 만듭니다.
  const HoronFieldDescription({super.key, required this.description, this.style, this.maxLines});

  /// 화면에 쓰는 문구입니다. 호스트가 넘깁니다.
  final String description;

  /// 문구 스타일을 덮어쓸 때 씁니다.
  final TextStyle? style;

  /// 표시할 최대 줄 수입니다.
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle resolved = (style ?? theme.textTheme.bodySmall ?? const TextStyle()).copyWith(
      color: scheme.onSurfaceVariant,
      fontSize: HoronText.caption,
      height: HoronLineHeight.normal,
    );
    return Text(description, style: resolved, maxLines: maxLines);
  }
}

/// `field.tsx`의 `FieldError`입니다.
///
/// React에서는 오류가 없으면 Base UI가 이 자리를 비웁니다. 같은 규칙으로
/// [message]가 비었고 [child]도 없으면 아무것도 그리지 않습니다. 그래서 빈 필수
/// 필드를 제출했을 때만 오류 줄이 나타납니다.
class HoronFieldError extends StatelessWidget {
  /// 오류 문구를 만듭니다.
  const HoronFieldError({super.key, this.message, this.child, this.style});

  /// 화면에 쓰는 문구입니다. 호스트나 검증기가 넘깁니다.
  final String? message;

  /// 문구 대신 그릴 위젯입니다.
  final Widget? child;

  /// 문구 스타일을 덮어쓸 때 씁니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final String? text = message;
    final bool hasText = text != null && text.isNotEmpty;
    final Widget? replacement = child;
    if (!hasText && replacement == null) return const SizedBox.shrink();

    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle resolved = (style ?? theme.textTheme.bodySmall ?? const TextStyle()).copyWith(
      color: scheme.error,
      fontSize: HoronText.caption,
      height: HoronLineHeight.normal,
    );
    return Semantics(liveRegion: true, child: hasText ? Text(text, style: resolved) : replacement);
  }
}

/// `field.tsx`의 `FieldGroup`입니다.
///
/// React의 `flex w-full flex-col gap-4`에 대응합니다.
class HoronFieldGroup extends StatelessWidget {
  /// 필드 묶음을 만듭니다.
  const HoronFieldGroup({super.key, required this.children, this.crossAxisAlignment = CrossAxisAlignment.stretch});

  /// 세로로 쌓을 자식입니다.
  final List<Widget> children;

  /// 가로 정렬입니다.
  final CrossAxisAlignment crossAxisAlignment;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: crossAxisAlignment,
      spacing: HoronSpace.s4,
      children: children,
    );
  }
}

/// `field.tsx`의 `FieldSet`입니다.
///
/// React의 `flex w-full flex-col gap-4 border-0 p-0`에 대응합니다. 테두리와 여백이
/// 없으므로 [HoronFieldGroup]과 배치는 같고, 묶음의 의미만 다릅니다.
class HoronFieldSet extends StatelessWidget {
  /// 필드 집합을 만듭니다.
  const HoronFieldSet({
    super.key,
    required this.children,
    this.legend,
    this.crossAxisAlignment = CrossAxisAlignment.stretch,
  });

  /// 세로로 쌓을 자식입니다.
  final List<Widget> children;

  /// 집합 전체의 제목입니다. 없으면 그리지 않습니다.
  final Widget? legend;

  /// 가로 정렬입니다.
  final CrossAxisAlignment crossAxisAlignment;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: crossAxisAlignment,
      spacing: HoronSpace.s4,
      children: <Widget>[?legend, ...children],
    );
  }
}

/// React의 `data-disabled:opacity-50`과 같은 값입니다.
const double _disabledOpacity = 0.5;
