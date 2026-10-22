import 'package:flutter/material.dart';

import '../tokens/horon_tokens.g.dart';
import 'field.dart';
import 'label.dart';

/// `form.tsx`의 `Form`입니다.
///
/// React는 react-hook-form의 `FormProvider`이고, 필드 등록·검증은 `FormField`와
/// `FormItem`이 나눠 맡습니다. Flutter에는 같은 역할을 하는 `Form`과 `FormField`가
/// 이미 있으므로 그 위에 얹습니다. 이 위젯이 검증 상태를 소유하고, 폼 안의
/// [HoronFormField]가 각 필드의 검증 결과를 [HoronFormMessage]로 내려보냅니다.
///
/// React 소스에 `variants:` 블록이 없으므로 공개 변형 enum을 두지 않습니다.
class HoronForm extends StatefulWidget {
  /// 폼을 만듭니다.
  const HoronForm({super.key, required this.child, this.onSubmit, this.autovalidateMode = AutovalidateMode.disabled});

  /// 폼 안의 자식입니다.
  final Widget child;

  /// 검증이 끝난 뒤 유효 여부를 받는 콜백입니다. [HoronFormState.submit]이 부릅니다.
  final ValueChanged<bool>? onSubmit;

  /// 필드를 언제 다시 검증할지 정합니다.
  final AutovalidateMode autovalidateMode;

  /// 가장 가까운 [HoronForm]의 상태입니다. 폼 밖이면 null입니다.
  static HoronFormState? maybeOf(BuildContext context) => context.findAncestorStateOfType<HoronFormState>();

  @override
  State<HoronForm> createState() => HoronFormState();
}

/// [HoronForm]의 상태입니다.
///
/// 화면 코드가 `GlobalKey<FormState>`를 직접 들고 다니지 않도록, 검증·제출·초기화를
/// 한 자리에 모읍니다.
class HoronFormState extends State<HoronForm> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  /// 모든 필드를 검증하고, 전부 유효한지 돌려줍니다.
  bool validate() => _formKey.currentState?.validate() ?? true;

  /// 모든 필드를 검증한 뒤 [HoronForm.onSubmit]을 부릅니다.
  ///
  /// 빈 필수 필드가 있으면 `false`로 불리고, 각 필드의 [HoronFormMessage]가 그
  /// 오류 문구를 그립니다.
  bool submit() {
    final bool valid = validate();
    widget.onSubmit?.call(valid);
    return valid;
  }

  /// 모든 필드를 처음 값으로 되돌립니다.
  void reset() => _formKey.currentState?.reset();

  @override
  Widget build(BuildContext context) {
    return Form(key: _formKey, autovalidateMode: widget.autovalidateMode, child: widget.child);
  }
}

/// `form.tsx`의 `FormField`입니다.
///
/// React의 `Controller` 자리입니다. Flutter의 `FormField<String>` 하나를 등록하고,
/// 그 검증 상태를 [builder]에 넘기며, 같은 오류를 [_HoronFormFieldScope]로 자손에게
/// 내려보냅니다. 그래서 [HoronFormLabel]·[HoronFormControl]·[HoronFormMessage]가
/// 오류를 따로 받지 않아도 한 필드 안에서 같은 상태를 그립니다.
class HoronFormField extends StatelessWidget {
  /// 폼 필드를 만듭니다.
  const HoronFormField({
    super.key,
    required this.name,
    required this.builder,
    this.validator,
    this.initialValue,
    this.enabled = true,
  });

  /// 필드 이름입니다. React의 `name`과 같습니다.
  final String name;

  /// 필드 본문을 만드는 함수입니다. 검증 상태를 함께 받습니다.
  final Widget Function(BuildContext context, FormFieldState<String> field) builder;

  /// 값을 검증하는 함수입니다. 오류가 없으면 null을 돌려줍니다.
  final FormFieldValidator<String>? validator;

  /// 시작 값입니다.
  final String? initialValue;

  /// 값을 받을지 여부입니다. 비활성이면 검증하지 않습니다.
  ///
  /// HTML에서 `disabled` 컨트롤은 제약 검증에서 빠집니다. 같은 규칙을 써서, 채울 수
  /// 없는 필드에 "입력해 주세요" 오류를 띄우지 않습니다.
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return FormField<String>(
      initialValue: initialValue,
      validator: enabled ? validator : null,
      enabled: enabled,
      builder: (FormFieldState<String> field) => _HoronFormFieldScope(
        name: name,
        hasError: field.hasError,
        errorText: field.errorText,
        enabled: enabled,
        child: Builder(builder: (BuildContext context) => builder(context, field)),
      ),
    );
  }
}

/// `form.tsx`의 `FormItem`입니다.
///
/// React의 `grid gap-2`에 대응합니다. 라벨·컨트롤·설명·메시지를 세로로 쌓습니다.
class HoronFormItem extends StatelessWidget {
  /// 폼 항목을 만듭니다.
  const HoronFormItem({super.key, required this.children, this.crossAxisAlignment = CrossAxisAlignment.stretch});

  /// 세로로 쌓을 자식입니다.
  final List<Widget> children;

  /// 가로 정렬입니다.
  final CrossAxisAlignment crossAxisAlignment;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: crossAxisAlignment,
      spacing: HoronSpace.s2,
      children: children,
    );
  }
}

/// `form.tsx`의 `FormLabel`입니다.
///
/// React는 오류가 있으면 `data-error`를 붙여 destructive 색으로 바꿉니다. 여기서는
/// [_HoronFormFieldScope]의 오류를 읽어 [HoronLabel]에 그대로 넘깁니다.
class HoronFormLabel extends StatelessWidget {
  /// 폼 라벨을 만듭니다.
  const HoronFormLabel({super.key, required this.label, this.icon, this.child, this.style});

  /// 화면에 쓰는 문구입니다. 호스트가 넘깁니다.
  final String label;

  /// 문구 앞에 붙는 아이콘 슬롯입니다.
  final Widget? icon;

  /// 문구 뒤에 붙는 위젯 슬롯입니다.
  final Widget? child;

  /// 문구 스타일을 덮어쓸 때 씁니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final _HoronFormFieldScope? scope = _HoronFormFieldScope.maybeOf(context);
    return HoronLabel(
      label: label,
      icon: icon,
      style: style,
      invalid: scope?.hasError,
      disabled: scope == null ? null : !scope.enabled,
      child: child,
    );
  }
}

/// `form.tsx`의 `FormControl`입니다.
///
/// React는 자식 엘리먼트를 복제해 `aria-invalid`를 주입합니다. Flutter에서는 자식의
/// 인자를 바꿀 수 없으므로 [HoronFieldScope]로 오류·비활성 상태를 내려보냅니다.
/// `HoronInput`과 `HoronTextarea`는 `invalid`·`disabled`를 넘기지 않으면 이 스코프를
/// 따르므로, 이 위젯 안에 넣기만 하면 오류 테두리가 함께 그려집니다.
class HoronFormControl extends StatelessWidget {
  /// 컨트롤을 감쌉니다.
  const HoronFormControl({super.key, required this.child});

  /// 감쌀 컨트롤입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final _HoronFormFieldScope? scope = _HoronFormFieldScope.maybeOf(context);
    return HoronFieldScope(
      invalid: scope?.hasError ?? false,
      disabled: scope == null ? false : !scope.enabled,
      child: child,
    );
  }
}

/// `form.tsx`의 `FormDescription`입니다.
///
/// React의 `text-xs text-muted-foreground`에 대응합니다.
class HoronFormDescription extends StatelessWidget {
  /// 설명을 만듭니다.
  const HoronFormDescription({super.key, required this.description, this.maxLines});

  /// 화면에 쓰는 문구입니다. 호스트가 넘깁니다.
  final String description;

  /// 표시할 최대 줄 수입니다.
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle style = (theme.textTheme.bodySmall ?? const TextStyle()).copyWith(
      color: scheme.onSurfaceVariant,
      fontSize: HoronText.caption,
      height: HoronLineHeight.normal,
    );
    return Text(description, style: style, maxLines: maxLines);
  }
}

/// `form.tsx`의 `FormMessage`입니다.
///
/// React는 오류가 있으면 그 문구를, 없으면 [child]를 그리고, 둘 다 없으면 null을
/// 돌려줍니다. 같은 규칙이라 오류가 없을 때 빈 줄이 생기지 않습니다.
class HoronFormMessage extends StatelessWidget {
  /// 오류 문구를 그립니다.
  const HoronFormMessage({super.key, this.child});

  /// 오류가 없을 때 대신 그릴 위젯입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final String? error = _HoronFormFieldScope.maybeOf(context)?.errorText;
    final bool hasError = error != null && error.isNotEmpty;
    if (!hasError) return child ?? const SizedBox.shrink();

    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle style = (theme.textTheme.bodySmall ?? const TextStyle()).copyWith(
      color: scheme.error,
      fontSize: HoronText.caption,
      height: HoronLineHeight.normal,
    );
    return Semantics(liveRegion: true, child: Text(error, style: style));
  }
}

/// 필드 하나의 이름·오류·비활성 상태를 자손에게 내려보내는 스코프입니다.
class _HoronFormFieldScope extends InheritedWidget {
  const _HoronFormFieldScope({
    required this.name,
    required this.hasError,
    required this.errorText,
    required this.enabled,
    required super.child,
  });

  final String name;
  final bool hasError;
  final String? errorText;
  final bool enabled;

  static _HoronFormFieldScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronFormFieldScope>();

  @override
  bool updateShouldNotify(_HoronFormFieldScope oldWidget) =>
      oldWidget.errorText != errorText || oldWidget.enabled != enabled || oldWidget.name != name;
}
