import 'package:flutter/material.dart';

import 'button.dart';
import 'dialog.dart';

/// 확인을 요구하는 대화상자입니다.
///
/// `alert-dialog.tsx`를 옮긴 것입니다. [HoronDialog]와 다른 점은 두 가지입니다.
/// 바닥 버튼이 고정되어 취소·확인이 항상 있고, [destructive]가 참이면 확인 버튼이
/// 파괴적 색을 씁니다.
class HoronAlertDialog extends StatelessWidget {
  /// 확인 대화상자를 만듭니다.
  const HoronAlertDialog({
    super.key,
    required this.trigger,
    required this.title,
    this.description,
    this.children = const <Widget>[],
    this.cancelLabel,
    this.confirmLabel,
    this.onConfirm,
    this.destructive = false,
    this.dismissible = true,
  });

  /// 대화상자를 여는 위젯입니다.
  final Widget trigger;

  /// 제목입니다.
  final String title;

  /// 설명입니다.
  final String? description;

  /// 본문입니다.
  final List<Widget> children;

  /// 취소 버튼 글자입니다. 없으면 `Cancel`입니다.
  final String? cancelLabel;

  /// 확인 버튼 글자입니다. 없으면 `Continue`입니다.
  final String? confirmLabel;

  /// 확인을 눌렀을 때 부를 함수입니다. 부른 뒤 대화상자를 닫습니다.
  final VoidCallback? onConfirm;

  /// 확인 버튼을 파괴적 색으로 그릴지입니다.
  final bool destructive;

  /// 스크림을 눌렀을 때 닫을지입니다.
  final bool dismissible;

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (BuildContext context) => HoronDialog(
        trigger: trigger,
        title: title,
        description: description,
        showCloseButton: false,
        dismissible: dismissible,
        footer: Builder(
          builder: (BuildContext footerContext) => HoronAlertDialogFooter(
            cancelLabel: cancelLabel,
            confirmLabel: confirmLabel,
            destructive: destructive,
            onCancel: () => Navigator.of(footerContext).maybePop(),
            onConfirm: () {
              Navigator.of(footerContext).maybePop();
              onConfirm?.call();
            },
          ),
        ),
        children: children,
      ),
    );
  }
}

/// 확인 대화상자의 두 버튼입니다.
class HoronAlertDialogFooter extends StatelessWidget {
  /// 두 버튼을 만듭니다.
  const HoronAlertDialogFooter({
    super.key,
    required this.onCancel,
    required this.onConfirm,
    this.cancelLabel,
    this.confirmLabel,
    this.destructive = false,
  });

  /// 취소를 눌렀을 때입니다.
  final VoidCallback onCancel;

  /// 확인을 눌렀을 때입니다.
  final VoidCallback onConfirm;

  /// 취소 글자입니다.
  final String? cancelLabel;

  /// 확인 글자입니다.
  final String? confirmLabel;

  /// 확인 버튼을 파괴적 색으로 그릴지입니다.
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    return HoronDialogFooter(
      children: <Widget>[
        HoronButton(label: cancelLabel ?? 'Cancel', variant: HoronButtonVariant.outline, onPressed: onCancel),
        HoronButton(
          label: confirmLabel ?? 'Continue',
          variant: destructive ? HoronButtonVariant.destructive : HoronButtonVariant.defaultValue,
          onPressed: onConfirm,
        ),
      ],
    );
  }
}
