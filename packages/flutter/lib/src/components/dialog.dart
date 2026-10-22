import 'package:flutter/material.dart';

import '../contracts/horon_strings.dart';
import '../overlay/horon_modal.dart';
import '../tokens/horon_tokens.g.dart';

/// 대화상자 하나를 만듭니다.
///
/// `dialog.tsx`를 옮긴 것입니다. 트리거를 누르면 [showHoronModal]이 유리 패널을
/// 띄우고, 배경은 토큰 스크림으로 덮습니다. Material의 `showDialog`는 쓰지
/// 않습니다.
class HoronDialog extends StatelessWidget {
  /// 대화상자를 만듭니다.
  const HoronDialog({
    super.key,
    required this.trigger,
    required this.title,
    this.description,
    this.children = const <Widget>[],
    this.footer,
    this.showCloseButton = true,
    this.dismissible = true,
    this.semanticLabel,
  });

  /// 대화상자를 여는 위젯입니다.
  final Widget trigger;

  /// 제목입니다.
  final String title;

  /// 제목 아래 설명입니다.
  final String? description;

  /// 본문에 쌓을 위젯입니다.
  final List<Widget> children;

  /// 바닥에 붙는 버튼 줄입니다.
  final Widget? footer;

  /// 오른쪽 위 닫기 버튼을 그릴지입니다. React의 `showCloseButton`입니다.
  final bool showCloseButton;

  /// 스크림을 눌렀을 때 닫을지입니다.
  final bool dismissible;

  /// 스크린리더가 읽을 이름입니다. 없으면 [title]을 씁니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (BuildContext context) => GestureDetector(
        onTap: () => showHoronModal<void>(
          context,
          dismissible: dismissible,
          barrierLabel: semanticLabel ?? title,
          builder: (BuildContext modalContext) => Center(
            child: HoronModalSurface(
              maxWidth: _maxWidthOf(modalContext),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  if (showCloseButton)
                    Align(
                      alignment: AlignmentDirectional.topEnd,
                      child: _CloseButton(onPressed: () => Navigator.of(modalContext).maybePop()),
                    ),
                  HoronDialogHeader(title: title, description: description),
                  if (children.isNotEmpty) ...<Widget>[const SizedBox(height: HoronSpace.s3), ...children],
                  if (footer != null) ...<Widget>[const SizedBox(height: HoronSpace.s4), footer!],
                ],
              ),
            ),
          ),
        ),
        child: trigger,
      ),
    );
  }

  /// React의 `max-w-sm`입니다. 화면이 좁으면 여백을 남기고 줄입니다.
  double _maxWidthOf(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;
    return width < 448 ? width - HoronSpace.s8 : 384;
  }
}

/// 대화상자의 머리말입니다.
class HoronDialogHeader extends StatelessWidget {
  /// 머리말을 만듭니다.
  const HoronDialogHeader({super.key, required this.title, this.description});

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    final String? hint = description;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          title,
          style: text.titleMedium?.copyWith(color: scheme.onSurface, fontWeight: HoronFontWeight.semibold, height: 1),
        ),
        if (hint != null)
          Padding(
            padding: const EdgeInsets.only(top: HoronSpace.s2),
            child: Text(hint, style: text.bodySmall?.copyWith(color: scheme.onSurfaceVariant)),
          ),
      ],
    );
  }
}

/// 대화상자의 바닥 버튼 줄입니다.
///
/// React는 `flex-col-reverse`로 좁을 때 세로, 넓을 때 가로입니다. Flutter에서는
/// 폭을 보고 정합니다.
class HoronDialogFooter extends StatelessWidget {
  /// 버튼 줄을 만듭니다.
  const HoronDialogFooter({super.key, required this.children});

  /// 버튼들입니다. 좁은 화면에서는 역순으로 세로로 쌓입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool narrow = MediaQuery.sizeOf(context).width < 448;

    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: scheme.outline)),
        color: scheme.surfaceContainer,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(HoronRadiusRole.panel)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(HoronSpace.s4),
        child: narrow
            ? Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: children.reversed.toList(),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: <Widget>[
                  for (int index = 0; index < children.length; index++) ...<Widget>[
                    if (index > 0) const SizedBox(width: HoronSpace.s2),
                    children[index],
                  ],
                ],
              ),
      ),
    );
  }
}

/// 대화상자의 닫기 버튼입니다.
class HoronDialogClose extends StatelessWidget {
  /// 닫기 버튼을 만듭니다.
  const HoronDialogClose({super.key, this.label, this.onPressed});

  /// 버튼 글자입니다. 없으면 [HoronStrings.close]를 씁니다.
  final String? label;

  /// 직접 처리할 콜백입니다. 없으면 지금 라우트를 닫습니다.
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final String text = label ?? const HoronStringsEn().close;
    return TextButton(onPressed: onPressed ?? () => Navigator.of(context).maybePop(), child: Text(text));
  }
}

class _CloseButton extends StatelessWidget {
  const _CloseButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Semantics(
      button: true,
      label: const HoronStringsEn().close,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(HoronRadius.sm),
        child: Padding(
          padding: const EdgeInsets.all(HoronSpace.s1),
          child: Icon(Icons.close, size: 16, color: scheme.onSurfaceVariant),
        ),
      ),
    );
  }
}
