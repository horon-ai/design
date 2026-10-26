import 'package:flutter/material.dart';

import '../tokens/horon_tokens.g.dart';
import 'field.dart';

/// `label.tsx`의 라벨입니다.
///
/// React의 `flex items-center gap-2 text-sm leading-none font-normal select-none`
/// 에 대응합니다. 연결된 컨트롤의 비활성·오류 상태는 [HoronFieldScope]에서
/// 물려받습니다. `peer-disabled:opacity-50`은 요소 전체가 아니라 글자만 흐려지므로
/// 전경색의 투명도로 같은 결과를 냅니다.
///
/// React 소스에 `variants:` 블록이 없으므로 공개 변형 enum을 두지 않습니다.
class HoronLabel extends StatelessWidget {
  /// 라벨을 만듭니다.
  const HoronLabel({
    super.key,
    required this.label,
    this.icon,
    this.child,
    this.disabled,
    this.invalid,
    this.style,
    this.textAlign,
  });

  /// 화면에 쓰는 문구입니다. 호스트가 넘깁니다.
  final String label;

  /// 문구 앞에 붙는 아이콘 슬롯입니다.
  final Widget? icon;

  /// 문구 뒤에 붙는 위젯 슬롯입니다. 필수 표시나 짧은 보조 문구에 씁니다.
  final Widget? child;

  /// 비활성 상태입니다. null이면 [HoronFieldScope]를 따릅니다.
  final bool? disabled;

  /// 오류 상태입니다. null이면 [HoronFieldScope]를 따릅니다.
  final bool? invalid;

  /// 문구 스타일을 덮어쓸 때 씁니다. 색은 상태가 정하므로 넘긴 색은 무시됩니다.
  final TextStyle? style;

  /// 문구 정렬입니다.
  final TextAlign? textAlign;

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
      height: HoronLineHeight.none,
    );
    final Widget? leading = icon;
    final Widget? trailing = child;
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        if (leading != null) ...<Widget>[leading, const SizedBox(width: HoronSpace.s2)],
        Flexible(
          child: Text(label, style: resolved, textAlign: textAlign),
        ),
        if (trailing != null) ...<Widget>[const SizedBox(width: HoronSpace.s2), trailing],
      ],
    );
  }
}

/// React `peer-disabled:opacity-50`과 같은 값입니다.
const double _disabledOpacity = 0.5;
