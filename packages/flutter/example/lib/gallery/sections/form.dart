import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/form.dart';
import 'package:horon_ui/src/components/input.dart';
import 'package:horon_ui/src/components/textarea.dart';

import '../section_scaffold.dart';

/// `form` 갤러리 섹션입니다.
///
/// React `form.tsx`에는 cva 변형이 없으므로 나열할 변형은 필드 조합이고, 상태는
/// default·invalid(검증 실패)·disabled 셋입니다.
class HoronFormGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFormGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Form',
      variants: <Widget>[
        const _FormCell(
          child: HoronForm(
            child: HoronFormField(
              name: 'email',
              validator: _required,
              builder: _textField,
            ),
          ),
        ),
        const _FormCell(
          child: HoronForm(
            child: HoronFormField(name: 'bio', builder: _textarea),
          ),
        ),
        const _FormCell(
          child: HoronForm(
            child: HoronFormField(
              name: 'locked',
              enabled: false,
              validator: _required,
              builder: _textField,
            ),
          ),
        ),
      ],
      states: <Widget>[
        const _FormCell(
          label: 'Default',
          child: HoronForm(
            child: HoronFormField(name: 'default', builder: _textField),
          ),
        ),
        const _FormCell(
          label: 'Invalid',
          child: HoronForm(
            autovalidateMode: AutovalidateMode.always,
            child: HoronFormField(
              name: 'invalid',
              validator: _required,
              builder: _textField,
            ),
          ),
        ),
        const _FormCell(
          label: 'Disabled',
          child: HoronForm(
            child: HoronFormField(
              name: 'disabled',
              enabled: false,
              builder: _textField,
            ),
          ),
        ),
      ],
      notes:
          'React `form.tsx`에는 cva 변형이 없습니다. 검증은 Flutter `FormField`에 '
          '얹었고, 오류는 `HoronFormMessage`가 destructive 12px로 그립니다.',
    );
  }

  static String? _required(String? value) =>
      (value == null || value.isEmpty) ? 'Required.' : null;

  static Widget _textField(BuildContext context, FormFieldState<String> field) {
    return HoronFormItem(
      children: <Widget>[
        const HoronFormLabel(label: 'Email'),
        HoronFormControl(
          child: HoronInput(
            hintText: 'name@horon.ai',
            onChanged: field.didChange,
          ),
        ),
        const HoronFormDescription(description: 'Used to sign in.'),
        const HoronFormMessage(),
      ],
    );
  }

  static Widget _textarea(BuildContext context, FormFieldState<String> field) {
    return HoronFormItem(
      children: <Widget>[
        const HoronFormLabel(label: 'Bio'),
        HoronFormControl(
          child: HoronTextarea(
            hintText: 'Tell us about yourself',
            onChanged: field.didChange,
          ),
        ),
        const HoronFormMessage(),
      ],
    );
  }
}

/// 한 변형을 보여 주는 칸입니다.
class _FormCell extends StatelessWidget {
  const _FormCell({this.label, required this.child});

  final String? label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final String? caption = label;
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (caption != null) ...<Widget>[
            Text(caption, style: Theme.of(context).textTheme.labelSmall),
            const SizedBox(height: HoronSpace.s1),
          ],
          child,
        ],
      ),
    );
  }
}
