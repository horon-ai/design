import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `input-group.tsx`의 addon 정렬 변형입니다.
///
/// React의 cva가 선언한 `align` 그룹의 두 키(`inline-start`, `inline-end`)를 그대로
/// 옮긴 것입니다. `inline-start`는 `order-first`, `inline-end`는 `order-last`이므로
/// addon이 입력 앞뒤 중 어디에 붙는지를 정합니다. 이 파일의 공개 enum은 이것 하나이며,
/// React가 이 파일에서 선언한 변형 그룹도 이것 하나입니다.
enum HoronInputGroupAddonAlign {
  /// 입력 앞에 붙습니다. React의 `inline-start`입니다.
  inlineStart,

  /// 입력 뒤에 붙습니다. React의 `inline-end`입니다.
  inlineEnd,
}

/// `input-group.tsx`의 `InputGroup`입니다.
///
/// 입력과 addon·버튼을 하나의 테두리로 묶습니다. React의 `h-[37px] w-full min-w-0
/// rounded-sm border border-input bg-card pr-1.5 pl-3 gap-2`와 `focus-within` 링,
/// `has-[input:disabled]`·`has-[input[aria-invalid]]` 상태를 그대로 옮깁니다.
/// Flutter에는 그 선택자가 없으므로 상태는 [disabled]·[invalid]로 받고, 묶음이
/// 자손의 포커스를 추적해 `focus-within`을 냅니다.
///
/// addon의 자리는 [HoronInputGroupAddon.align]이 정합니다. React는 `order-first`/
/// `order-last`로 순서를 바꾸므로, 여기서도 자식 순서와 무관하게 정렬해 그립니다.
/// addon이 아닌 첫 자식이 입력 자리를 차지하고 남는 폭을 채웁니다.
class HoronInputGroup extends StatefulWidget {
  /// 입력 묶음을 만듭니다.
  const HoronInputGroup({super.key, required this.children, this.invalid = false, this.disabled = false});

  /// 묶음 안의 자식입니다. 보통 [HoronInputGroupInput] 하나와 addon·버튼입니다.
  final List<Widget> children;

  /// 묶음이 오류 상태인지 여부입니다. React의 `has-[input[aria-invalid]]`에 대응합니다.
  final bool invalid;

  /// 묶음이 입력을 받지 않을 상태입니다. React의 `has-[input:disabled]`에 대응합니다.
  final bool disabled;

  @override
  State<HoronInputGroup> createState() => _HoronInputGroupState();
}

class _HoronInputGroupState extends State<HoronInputGroup> {
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final bool invalid = widget.invalid;
    final bool disabled = widget.disabled;

    final Color borderColor = invalid
        ? (isDark ? scheme.error.withValues(alpha: _invalidBorderAlphaDark) : scheme.error)
        : (_focused ? horon.ring : scheme.outline);
    final Color fill = disabled ? _disabledFill(scheme, isDark) : scheme.surfaceContainerLow;
    final Color? ring = invalid
        ? scheme.error.withValues(alpha: isDark ? _invalidRingAlphaDark : _invalidRingAlphaLight)
        : (_focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null);

    final List<Widget> leading = <Widget>[];
    final List<Widget> fields = <Widget>[];
    final List<Widget> trailing = <Widget>[];
    for (final Widget child in widget.children) {
      if (child is HoronInputGroupAddon) {
        (child.align == HoronInputGroupAddonAlign.inlineStart ? leading : trailing).add(child);
      } else {
        fields.add(child);
      }
    }

    final Widget body = DecoratedBox(
      decoration: BoxDecoration(
        color: fill,
        borderRadius: BorderRadius.circular(HoronRadiusRole.input),
        border: Border.all(color: borderColor),
        boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _ringWidth)],
      ),
      child: Padding(
        padding: const EdgeInsetsDirectional.only(start: HoronSpace.s3, end: HoronSpace.s1_5),
        child: Row(
          spacing: HoronSpace.s2,
          children: <Widget>[
            ...leading,
            if (fields.isNotEmpty) Expanded(child: fields.first),
            ...fields.skip(1),
            ...trailing,
          ],
        ),
      ),
    );

    // `focus-within`은 자손이 포커스를 받으면 참이 됩니다. 이 노드는 스스로 포커스를
    // 받지 않으므로 탭 순서에 끼지 않습니다.
    return _HoronInputGroupScope(
      invalid: invalid,
      disabled: disabled,
      child: Focus(
        canRequestFocus: false,
        skipTraversal: true,
        onFocusChange: (bool hasFocus) {
          if (_focused == hasFocus) return;
          setState(() => _focused = hasFocus);
        },
        child: Opacity(
          opacity: disabled ? _disabledOpacity : 1,
          child: SizedBox(height: _groupHeight, child: body),
        ),
      ),
    );
  }

  /// React `has-[input:disabled]:bg-input/50`(다크는 `/80`)입니다.
  ///
  /// Tailwind의 `/50`은 `--input` 색의 알파를 절반으로 줄입니다. `--input`은 이미
  /// 12% 검정이므로 결과는 6%이고, 알파를 새로 정하면 React보다 어두워집니다.
  Color _disabledFill(ColorScheme scheme, bool isDark) => Color.alphaBlend(
    scheme.outline.withValues(alpha: scheme.outline.a * (isDark ? _disabledFillAlphaDark : _disabledFillAlpha)),
    scheme.surfaceContainerLow,
  );
}

/// `input-group.tsx`의 `InputGroupAddon`입니다.
///
/// React의 `h-full shrink-0 items-center justify-center gap-1.5 text-[13px]
/// font-medium text-muted-foreground select-none`에 대응합니다. [align]이 자리
/// 순서를 정합니다.
class HoronInputGroupAddon extends StatelessWidget {
  /// addon을 만듭니다.
  const HoronInputGroupAddon({super.key, required this.child, this.align = HoronInputGroupAddonAlign.inlineStart});

  /// addon 안에 그릴 위젯입니다. 아이콘이나 짧은 글자입니다.
  final Widget child;

  /// addon이 입력 앞에 붙는지 뒤에 붙는지입니다.
  final HoronInputGroupAddonAlign align;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle style = (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      color: scheme.onSurfaceVariant,
      fontSize: _addonTextSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.none,
    );
    return ExcludeSemantics(
      child: DefaultTextStyle.merge(
        style: style,
        child: IconTheme.merge(
          data: IconThemeData(size: _addonIconSize, color: scheme.onSurfaceVariant),
          child: Row(mainAxisSize: MainAxisSize.min, spacing: HoronSpace.s1_5, children: <Widget>[child]),
        ),
      ),
    );
  }
}

/// `input-group.tsx`의 `InputGroupInput`입니다.
///
/// 묶음 안에서 쓰는 입력입니다. React의 `h-full min-w-0 flex-1 rounded-none border-0
/// bg-transparent p-0`에 대응하므로, 테두리·채움·반경은 묶음이 그리고 여기서는
/// 투명하게 비웁니다. 비활성·오류는 [_HoronInputGroupScope]에서 물려받습니다.
/// `TextField`를 그대로 노출하지 않는 이유는 묶음 밖에서 쓰는 `HoronInput`과 같습니다.
/// 포커스·비활성 모양을 한 곳에서 소유해야 테마가 바뀌어도 모양이 갈라지지 않습니다.
class HoronInputGroupInput extends StatelessWidget {
  /// 묶음 입력을 만듭니다.
  const HoronInputGroupInput({
    super.key,
    this.controller,
    this.focusNode,
    this.hintText,
    this.disabled,
    this.invalid,
    this.keyboardType,
    this.textInputAction,
    this.obscureText = false,
    this.readOnly = false,
    this.inputFormatters,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.semanticsLabel,
  });

  /// 텍스트를 읽고 쓰는 컨트롤러입니다.
  final TextEditingController? controller;

  /// 포커스를 관리하는 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 값이 비었을 때 보이는 안내 문구입니다.
  final String? hintText;

  /// 입력을 받지 않을 상태입니다. null이면 묶음을 따릅니다.
  final bool? disabled;

  /// 오류 상태입니다. null이면 묶음을 따릅니다.
  final bool? invalid;

  /// 키보드 종류입니다.
  final TextInputType? keyboardType;

  /// 키보드의 완료 키 동작입니다.
  final TextInputAction? textInputAction;

  /// 입력을 가릴지 여부입니다.
  final bool obscureText;

  /// 값을 읽기만 할지 여부입니다.
  final bool readOnly;

  /// 입력 형식 제한입니다.
  final List<TextInputFormatter>? inputFormatters;

  /// 값이 바뀔 때 부릅니다.
  final ValueChanged<String>? onChanged;

  /// 키보드의 완료 키를 눌렀을 때 부릅니다.
  final ValueChanged<String>? onSubmitted;

  /// 필드를 눌렀을 때 부릅니다.
  final VoidCallback? onTap;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticsLabel;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final _HoronInputGroupScope? scope = _HoronInputGroupScope.maybeOf(context);
    final bool isDisabled = disabled ?? (scope?.disabled ?? false);
    final bool isInvalid = invalid ?? (scope?.invalid ?? false);
    final TextStyle style = (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      color: scheme.onSurface,
      fontSize: HoronText.body,
    );

    return Semantics(
      label: semanticsLabel,
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        enabled: !isDisabled,
        readOnly: readOnly,
        obscureText: obscureText,
        keyboardType: keyboardType,
        textInputAction: textInputAction,
        inputFormatters: inputFormatters,
        onChanged: onChanged,
        onSubmitted: onSubmitted,
        onTap: onTap,
        cursorColor: HoronTheme.of(context).ring,
        style: style,
        decoration: InputDecoration(
          filled: false,
          isDense: true,
          isCollapsed: true,
          hintText: hintText,
          hintStyle: style.copyWith(color: isInvalid ? scheme.error : scheme.onSurfaceVariant),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          disabledBorder: InputBorder.none,
          errorBorder: InputBorder.none,
          focusedErrorBorder: InputBorder.none,
        ),
      ),
    );
  }
}

/// `input-group.tsx`의 `InputGroupButton`입니다.
///
/// React는 이 자리에 `Button`을 `variant="ghost" size="icon-xs"`로 넣습니다. 버튼
/// 컴포넌트는 다른 slug의 파일이므로 여기서 import하지 않고, 그 기본값이 그리는
/// 모양(아이콘 버튼 24, 투명 배경, muted 전경)만 이 자리에서 냅니다. 그래서 이
/// 파일의 변형 어휘는 React가 이 파일에서 선언한 `align` 하나로 유지됩니다.
class HoronInputGroupButton extends StatelessWidget {
  /// 묶음 안 버튼을 만듭니다.
  const HoronInputGroupButton({super.key, required this.child, this.onPressed, this.tooltip, this.semanticsLabel});

  /// 버튼 안에 그릴 위젯입니다. 보통 아이콘입니다.
  final Widget child;

  /// 눌렀을 때 부를 콜백입니다. null이면 누를 수 없습니다.
  final VoidCallback? onPressed;

  /// 길게 눌렀을 때 보이는 설명입니다.
  final String? tooltip;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticsLabel;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronInputGroupScope? scope = _HoronInputGroupScope.maybeOf(context);
    final bool enabled = onPressed != null && !(scope?.disabled ?? false);
    final Widget button = Semantics(
      button: true,
      enabled: enabled,
      label: semanticsLabel,
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(HoronRadiusRole.control),
        child: InkWell(
          onTap: enabled ? onPressed : null,
          borderRadius: BorderRadius.circular(HoronRadiusRole.control),
          child: SizedBox(
            width: HoronButtonMetrics.heightIconXs,
            height: HoronButtonMetrics.heightIconXs,
            child: IconTheme.merge(
              data: IconThemeData(
                size: _addonIconSize,
                color: enabled ? scheme.onSurfaceVariant : scheme.onSurfaceVariant.withValues(alpha: _disabledOpacity),
              ),
              child: Center(widthFactor: 1, child: child),
            ),
          ),
        ),
      ),
    );
    final String? message = tooltip;
    return message == null ? button : Tooltip(message: message, child: button);
  }
}

/// 묶음이 자기 상태를 자손 입력과 버튼에 내려보내는 스코프입니다.
class _HoronInputGroupScope extends InheritedWidget {
  const _HoronInputGroupScope({required this.invalid, required this.disabled, required super.child});

  final bool invalid;
  final bool disabled;

  static _HoronInputGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronInputGroupScope>();

  @override
  bool updateShouldNotify(_HoronInputGroupScope oldWidget) =>
      oldWidget.invalid != invalid || oldWidget.disabled != disabled;
}

/// React `input-group.tsx`의 `h-[37px]`입니다.
///
/// 생성된 메트릭에는 입력 높이 항목이 없습니다. `HoronButtonMetrics.height`도 같은
/// 값이지만 그것은 버튼이 그리는 크기라 여기서 빌려 쓰지 않습니다.
const double _groupHeight = 37;

/// React addon의 `text-[13px]`입니다. 13은 생성 스케일(12·14)에 없는 값이지만
/// React가 그 값을 적어 두었으므로 그대로 옮깁니다.
const double _addonTextSize = 13;

/// React addon 아이콘의 `size-4`입니다.
const double _addonIconSize = 16;

/// React `focus-within:ring-3`의 링 두께입니다.
const double _ringWidth = 3;

/// React `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// React `ring-destructive/20`입니다.
const double _invalidRingAlphaLight = 0.2;

/// React `dark:ring-destructive/40`입니다.
const double _invalidRingAlphaDark = 0.4;

/// React `dark:border-destructive/50`입니다.
const double _invalidBorderAlphaDark = 0.5;

/// React `has-[input:disabled]:bg-input/50`입니다.
const double _disabledFillAlpha = 0.5;

/// React `dark:has-[input:disabled]:bg-input/80`입니다.
const double _disabledFillAlphaDark = 0.8;

/// React `has-[input:disabled]:opacity-50`입니다.
const double _disabledOpacity = 0.5;
