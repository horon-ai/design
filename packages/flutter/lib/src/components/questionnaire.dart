import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'checkbox.dart';
import 'progress.dart';

/// `questionnaire.tsx`의 `gap-6`입니다. 질문 사이의 간격입니다.
const double _questionnaireGap = HoronSpace.s6;

/// `questionnaire-item`의 `gap-5`입니다. 질문 제목과 선택지 사이의 간격입니다.
const double _questionnaireItemGap = HoronSpace.s5;

/// `questionnaire-options`의 `gap-3`입니다. 선택지 사이의 간격입니다.
const double _questionnaireOptionsGap = HoronSpace.s3;

/// `questionnaire-progress`의 `gap-3`입니다. 진행 라벨과 막대 사이의 간격입니다.
const double _questionnaireProgressGap = HoronSpace.s3;

/// `questionnaire-progress-label`의 `min-w-[14ch]`입니다.
///
/// `ch`는 글꼴의 `0` 폭이라 픽셀로 고정되지 않습니다. 12px 글자에서 14자가 96px에
/// 가까우므로 4px 눈금의 [HoronSpace.s24]를 씁니다.
const double _questionnaireProgressLabelMinWidth = HoronSpace.s24;

/// `questionnaire-option`의 `min-h-11`입니다.
const double _questionnaireOptionMinHeight = HoronSpace.s11;

/// `questionnaire-option`의 `px-4`입니다.
const double _questionnaireOptionHorizontalPadding = HoronSpace.s4;

/// `questionnaire-option`의 `py-3`입니다.
const double _questionnaireOptionVerticalPadding = HoronSpace.s3;

/// `questionnaire-option`의 `gap-3`입니다. 표시와 글자 사이의 간격입니다.
const double _questionnaireOptionGap = HoronSpace.s3;

/// 표시 상자의 `size-4`입니다.
const double _questionnaireIndicatorSize = HoronSpace.s4;

/// 라디오 점의 `size-2`입니다.
const double _questionnaireDotSize = HoronSpace.s2;

/// 체크 표시의 `size-3.5`입니다.
const double _questionnaireCheckSize = HoronSpace.s3_5;

/// `bg-input/20`의 20% 불투명도입니다.
const double _questionnaireOptionFillAlpha = 0.2;

/// `hover:bg-input/40`의 40% 불투명도입니다.
const double _questionnaireOptionHoverAlpha = 0.4;

/// `has-[:checked]:bg-primary/10`의 10% 불투명도입니다.
const double _questionnaireOptionCheckedAlpha = 0.1;

/// `has-[:checked]:border-primary/40`의 40% 불투명도입니다.
const double _questionnaireOptionCheckedBorderAlpha = 0.4;

/// `has-[:disabled]:opacity-50`입니다.
const double _questionnaireDisabledOpacity = 0.5;

/// `ring-ring/50`의 50% 불투명도입니다.
const double _questionnaireRingAlpha = 0.5;

/// 포커스 링이 번지는 거리입니다. React `ring-3`을 4px 눈금의 2px 단계로 옮겼습니다.
const double _questionnaireRingSpread = HoronSpace.s0_5;

/// 선택지 종류입니다.
///
/// React `questionnaire.tsx`의 `type` prop(`radio` | `checkbox`)은 cva 변형 그룹이 아니므로
/// 공개 enum을 두지 않습니다. 호출자는 [HoronQuestionnaireOption.radio]와
/// [HoronQuestionnaireOption.checkbox]로 고릅니다.
enum _HoronQuestionnaireOptionType { radio, checkbox }

/// 라디오 선택지를 묶고 하나만 선택되게 하는 스코프입니다.
///
/// React는 `<input type="radio" name=…>`의 브라우저 동작으로 같은 일을 합니다. Flutter에는
/// 그 동작이 없으므로 [HoronQuestionnaireOptions]가 값을 소유하고 선택지를 그 값과
/// 비교합니다.
class _HoronQuestionnaireOptionsScope<T> extends InheritedWidget {
  const _HoronQuestionnaireOptionsScope({
    required this.value,
    required this.onChanged,
    required this.enabled,
    required super.child,
  });

  final T? value;
  final ValueChanged<T>? onChanged;
  final bool enabled;

  static _HoronQuestionnaireOptionsScope<T>? maybeOf<T>(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronQuestionnaireOptionsScope<T>>();

  @override
  bool updateShouldNotify(_HoronQuestionnaireOptionsScope<T> oldWidget) =>
      value != oldWidget.value || onChanged != oldWidget.onChanged || enabled != oldWidget.enabled;
}

/// `questionnaire.tsx`의 `Questionnaire`입니다.
///
/// React는 `flex w-full min-w-0 flex-col gap-6`입니다. 진행 헤더와 질문을 세로로 쌓습니다.
///
/// ```dart
/// HoronQuestionnaire(
///   children: <Widget>[
///     const HoronQuestionnaireProgress(label: '2 / 4', value: 2, max: 4),
///     HoronQuestionnaireItem(children: <Widget>[...]),
///   ],
/// );
/// ```
class HoronQuestionnaire extends StatelessWidget {
  /// 설문 하나를 만듭니다.
  const HoronQuestionnaire({super.key, required this.children});

  /// 진행 헤더와 질문 항목입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: _questionnaireGap,
      children: children,
    );
  }
}

/// `questionnaire.tsx`의 `QuestionnaireProgress`입니다.
///
/// React는 라벨(`min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums`)과
/// [HoronProgress]를 가로로 나란히 둡니다. [value]가 없으면 막대를 그리지 않고 라벨만
/// 남습니다.
class HoronQuestionnaireProgress extends StatelessWidget {
  /// 진행 헤더 하나를 만듭니다.
  const HoronQuestionnaireProgress({super.key, required this.label, this.value, this.max = 1});

  /// 막대 앞에 붙는 문구입니다. 보통 `1 / 4` 같은 진행 표시입니다.
  final String label;

  /// 지금 값입니다. `null`이면 막대를 그리지 않습니다.
  final double? value;

  /// 전체 값입니다. [value]를 이 값으로 나눠 막대 비율을 만듭니다.
  final double max;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double? value = this.value;
    final double? ratio = value == null || max <= 0 ? null : (value / max).clamp(0.0, 1.0);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      spacing: _questionnaireProgressGap,
      children: <Widget>[
        ConstrainedBox(
          constraints: const BoxConstraints(minWidth: _questionnaireProgressLabelMinWidth),
          child: Text(
            label,
            maxLines: 1,
            style: TextStyle(
              fontFamily: HoronFont.body,
              fontFamilyFallback: HoronFont.fontFamilyFallback,
              fontSize: HoronText.caption,
              fontWeight: HoronFontWeight.medium,
              height: HoronLineHeight.normal,
              color: scheme.onSurfaceVariant,
              fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
            ),
          ),
        ),
        if (value != null) Expanded(child: HoronProgress(value: ratio)),
      ],
    );
  }
}

/// `questionnaire.tsx`의 `QuestionnaireItem`입니다.
///
/// React는 `flex min-w-0 flex-col gap-5 border-0 p-0 outline-none`인 `fieldset`입니다.
/// Flutter에는 대응하는 `Fieldset` 위젯이 없으므로 [Semantics]로 묶고 세로 [Column]으로
/// 그립니다.
class HoronQuestionnaireItem extends StatelessWidget {
  /// 질문 하나를 만듭니다.
  const HoronQuestionnaireItem({super.key, required this.children, this.semanticLabel});

  /// 질문 제목과 선택지 그룹입니다.
  final List<Widget> children;

  /// 보조 기술이 읽을 질문 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: semanticLabel,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: _questionnaireItemGap,
        children: children,
      ),
    );
  }
}

/// `questionnaire.tsx`의 `QuestionnaireOptions`입니다.
///
/// React는 `group/questionnaire-options grid min-w-0 gap-3`입니다. 한 열짜리 격자라 세로
/// [Column]과 같습니다.
///
/// [value]와 [onChanged]를 넘기면 이 묶음이 라디오 선택을 소유합니다. 안의
/// [HoronQuestionnaireOption.radio]는 자기가 고른 값인지 스코프에서 읽고, 다른 값을
/// 고르면 [onChanged]로 올립니다. 체크박스 선택지는 이 스코프를 쓰지 않습니다.
class HoronQuestionnaireOptions<T> extends StatelessWidget {
  /// 선택지 묶음 하나를 만듭니다.
  const HoronQuestionnaireOptions({
    super.key,
    required this.children,
    this.value,
    this.onChanged,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 세로로 쌓을 선택지입니다.
  final List<Widget> children;

  /// 지금 선택된 라디오 값입니다.
  final T? value;

  /// 다른 라디오 값을 골랐을 때 부릅니다.
  final ValueChanged<T>? onChanged;

  /// 묶음 전체가 누름과 포커스를 받을지 여부입니다.
  final bool enabled;

  /// 보조 기술이 읽을 묶음 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: semanticLabel,
      child: _HoronQuestionnaireOptionsScope<T>(
        value: value,
        onChanged: onChanged,
        enabled: enabled && onChanged != null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: _questionnaireOptionsGap,
          children: children,
        ),
      ),
    );
  }
}

/// `questionnaire.tsx`의 `QuestionnaireOption`입니다.
///
/// React는 `label` 하나를 카드로 그립니다: `min-h-11 cursor-pointer gap-3 rounded-lg
/// border border-input bg-input/20 px-4 py-3 text-sm`, 선택되면 `border-primary/40
/// bg-primary/10`, 비활성이면 `opacity-50`, 포커스면 링이 붙습니다. 안에는 투명한
/// `input`이 전체를 덮고, 그 옆에 표시 상자(`radio`는 원, `checkbox`는 둥근 사각형)가
/// 있습니다.
///
/// 표시 모양은 [HoronQuestionnaireOption.radio]가 원, [HoronQuestionnaireOption.checkbox]가
/// 둥근 사각형이고 나머지 모양은 둘이 같습니다. 체크 표시는 [HoronCheckMarkPainter]가
/// 그리므로 체크박스 컴포넌트와 같은 획을 씁니다.
///
/// ```dart
/// HoronQuestionnaireOptions<int>(
///   value: choice,
///   onChanged: (int value) => setState(() => choice = value),
///   children: <Widget>[
///     const HoronQuestionnaireOption<int>.radio(value: 0, child: Text('아주 만족합니다')),
///     const HoronQuestionnaireOption<int>.radio(value: 1, child: Text('보통입니다')),
///   ],
/// );
/// ```
class HoronQuestionnaireOption<T> extends StatefulWidget {
  /// 라디오 선택지를 만듭니다.
  const HoronQuestionnaireOption.radio({
    super.key,
    required this.value,
    required this.child,
    this.enabled,
    this.semanticLabel,
  }) : _type = _HoronQuestionnaireOptionType.radio,
       selected = false,
       onChanged = null;

  /// 체크박스 선택지를 만듭니다.
  ///
  /// 라디오와 달리 묶음의 스코프를 쓰지 않으므로 선택 상태를 직접 받습니다.
  const HoronQuestionnaireOption.checkbox({
    super.key,
    this.selected = false,
    this.onChanged,
    required this.child,
    this.enabled,
    this.semanticLabel,
  }) : _type = _HoronQuestionnaireOptionType.checkbox,
       value = null;

  /// 라디오 선택지가 나타내는 값입니다. 체크박스에서는 `null`입니다.
  final T? value;

  /// 체크박스의 선택 상태입니다. 라디오는 묶음의 [HoronQuestionnaireOptions.value]를 씁니다.
  final bool selected;

  /// 체크박스의 선택이 바뀔 때 부릅니다. 라디오는 묶음의
  /// [HoronQuestionnaireOptions.onChanged]를 씁니다.
  final ValueChanged<bool>? onChanged;

  /// 선택지 글자입니다.
  final Widget child;

  /// 누름과 포커스를 받을지 여부입니다. 없으면 묶음의 값을 따릅니다.
  final bool? enabled;

  /// 보조 기술이 읽을 이름입니다. 없으면 [child]를 읽습니다.
  final String? semanticLabel;

  final _HoronQuestionnaireOptionType _type;

  /// 테스트가 선택지 카드를 찾는 키입니다.
  static const Key boxKey = ValueKey<String>('horon-questionnaire-option-box');

  /// 테스트가 표시 상자를 찾는 키입니다.
  static const Key indicatorKey = ValueKey<String>('horon-questionnaire-option-indicator');

  @override
  State<HoronQuestionnaireOption<T>> createState() => _HoronQuestionnaireOptionState<T>();
}

class _HoronQuestionnaireOptionState<T> extends State<HoronQuestionnaireOption<T>> {
  bool _hovered = false;
  bool _focused = false;

  /// 라디오인지 여부입니다.
  bool get _radio => widget._type == _HoronQuestionnaireOptionType.radio;

  /// 지금 선택 상태입니다.
  bool get _selected {
    if (_radio) {
      final _HoronQuestionnaireOptionsScope<T>? scope = _HoronQuestionnaireOptionsScope.maybeOf<T>(context);
      return scope != null && scope.value == widget.value;
    }
    return widget.selected;
  }

  /// 누름과 포커스를 받을 수 있는지 여부입니다.
  bool get _enabled {
    final bool? explicit = widget.enabled;
    if (explicit == false) return false;
    if (_radio) {
      final _HoronQuestionnaireOptionsScope<T>? scope = _HoronQuestionnaireOptionsScope.maybeOf<T>(context);
      return scope != null && scope.enabled;
    }
    return widget.onChanged != null;
  }

  void _toggle() {
    if (!_enabled) return;
    if (_radio) {
      final _HoronQuestionnaireOptionsScope<T>? scope = _HoronQuestionnaireOptionsScope.maybeOf<T>(context);
      final T? value = widget.value;
      if (scope?.onChanged == null || value == null) return;
      scope!.onChanged!(value);
      return;
    }
    widget.onChanged?.call(!widget.selected);
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool selected = _selected;
    final bool enabled = _enabled;

    // `border-input bg-input/20`, hover `bg-input/40`, 선택 `border-primary/40 bg-primary/10`.
    //
    // `bg-input/20`은 이미 12%인 `input` 색에 20%를 **곱한** 값입니다(실효 2.4%).
    // `withValues(alpha:)`는 알파를 대입하므로, 곱한 값을 직접 넘깁니다.
    final Color border = _focused
        ? horon.ring
        : selected
        ? scheme.primary.withValues(alpha: _questionnaireOptionCheckedBorderAlpha)
        : scheme.outline;
    final Color inputFill = scheme.outline;
    final double inputAlpha =
        inputFill.a * (_hovered && enabled ? _questionnaireOptionHoverAlpha : _questionnaireOptionFillAlpha);
    final Color fill = selected
        ? scheme.primary.withValues(alpha: _questionnaireOptionCheckedAlpha)
        : inputFill.withValues(alpha: inputAlpha);

    final Widget indicator = Container(
      key: HoronQuestionnaireOption.indicatorKey,
      width: _questionnaireIndicatorSize,
      height: _questionnaireIndicatorSize,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: selected ? scheme.primary : scheme.surface,
        borderRadius: BorderRadius.circular(_radio ? HoronRadius.full : HoronRadius.xs),
        border: Border.all(color: selected ? scheme.primary : scheme.outline),
      ),
      child: selected
          ? (_radio
                ? Container(
                    width: _questionnaireDotSize,
                    height: _questionnaireDotSize,
                    decoration: BoxDecoration(
                      color: scheme.onPrimary,
                      borderRadius: BorderRadius.circular(HoronRadius.full),
                    ),
                  )
                : SizedBox.square(
                    dimension: _questionnaireCheckSize,
                    child: CustomPaint(
                      painter: HoronCheckMarkPainter(
                        color: scheme.onPrimary,
                        indeterminate: false,
                        strokeWidth: HoronSpace.s0_5,
                      ),
                    ),
                  ))
          : null,
    );

    final Widget body = ConstrainedBox(
      constraints: const BoxConstraints(minHeight: _questionnaireOptionMinHeight),
      child: DecoratedBox(
        key: HoronQuestionnaireOption.boxKey,
        decoration: BoxDecoration(
          color: fill,
          borderRadius: BorderRadius.circular(HoronRadius.lg),
          border: Border.all(color: border),
          boxShadow: _focused
              ? <BoxShadow>[
                  BoxShadow(
                    color: horon.ring.withValues(alpha: _questionnaireRingAlpha),
                    spreadRadius: _questionnaireRingSpread,
                  ),
                ]
              : null,
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: _questionnaireOptionHorizontalPadding,
            vertical: _questionnaireOptionVerticalPadding,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            spacing: _questionnaireOptionGap,
            children: <Widget>[
              indicator,
              Expanded(
                child: DefaultTextStyle(
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: HoronText.body,
                    fontWeight: HoronFontWeight.regular,
                    height: HoronLineHeight.snug,
                    color: scheme.onSurface,
                  ),
                  child: widget.child,
                ),
              ),
            ],
          ),
        ),
      ),
    );

    return Semantics(
      container: true,
      checked: selected,
      inMutuallyExclusiveGroup: _radio,
      enabled: enabled,
      label: widget.semanticLabel,
      onTap: enabled ? _toggle : null,
      child: Opacity(
        opacity: enabled ? 1 : _questionnaireDisabledOpacity,
        child: MouseRegion(
          cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          onEnter: (_) => setState(() => _hovered = true),
          onExit: (_) => setState(() => _hovered = false),
          child: FocusableActionDetector(
            enabled: enabled,
            onShowFocusHighlight: (bool value) => setState(() => _focused = value),
            actions: <Type, Action<Intent>>{
              ActivateIntent: CallbackAction<ActivateIntent>(
                onInvoke: (ActivateIntent intent) {
                  _toggle();
                  return null;
                },
              ),
            },
            child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: enabled ? _toggle : null, child: body),
          ),
        ),
      ),
    );
  }
}
