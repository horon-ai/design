import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `input_otp` 갤러리 섹션입니다.
///
/// React `input-otp.tsx`에는 cva 변형이 없으므로 나열할 변형은 칸 구성(한 묶음·두 묶음)과
/// 자릿수이고, 상태는 빈 값·일부 입력·채운 값·비활성 넷입니다.
class HoronInputOtpGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputOtpGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Input OTP',
      variants: <Widget>[
        const _OtpCell(label: 'Four slots', child: _CodeField(length: 4)),
        const _OtpCell(
          label: 'Six slots, grouped',
          child: _CodeField(length: 6),
        ),
        const _OtpCell(
          label: 'Filled',
          child: _CodeField(length: 6, value: '482913'),
        ),
      ],
      states: <Widget>[
        const _OtpCell(label: 'Empty', child: _CodeField(length: 6)),
        const _OtpCell(
          label: 'Partially filled',
          child: _CodeField(length: 6, value: '482'),
        ),
        const _OtpCell(
          label: 'Disabled',
          child: _CodeField(length: 6, value: '482913', disabled: true),
        ),
      ],
      notes:
          '한 칸은 `size-9`(36)이고 반경은 `rounded-sm`(8)입니다. 그룹의 첫 칸만 왼쪽 테두리와 왼쪽 모서리를, '
          '마지막 칸만 오른쪽 모서리를 갖습니다. 활성 칸은 금색 테두리와 `ring-3 ring-ring/50`을 얻고 '
          '커서가 깜박입니다. 붙여넣기에서 숫자만 남고, 자리를 다 채우면 완료 콜백이 그 코드로 불립니다.',
    );
  }
}

/// 자릿수와 초기값을 받아 칸을 반으로 나눠 그리는 코드 입력입니다.
///
/// 컨트롤러를 소유해야 하므로 상태 위젯입니다. `build`마다 컨트롤러를 만들면 매 프레임
/// 새 객체가 생기고 이전 것이 해제되지 않습니다.
class _CodeField extends StatefulWidget {
  const _CodeField({required this.length, this.value, this.disabled = false});

  final int length;
  final String? value;
  final bool disabled;

  @override
  State<_CodeField> createState() => _CodeFieldState();
}

class _CodeFieldState extends State<_CodeField> {
  late final TextEditingController _controller = TextEditingController(
    text: widget.value ?? '',
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 네 자리는 한 묶음으로, 여섯 자리는 3+3 두 묶음으로 나눕니다. React 갤러리의
    // 두 구성과 같은 모양입니다.
    final bool grouped = widget.length > 4;
    final int firstGroup = grouped ? (widget.length / 2).ceil() : widget.length;
    return HoronInputOtp(
      length: widget.length,
      controller: _controller,
      disabled: widget.disabled,
      children: <Widget>[
        HoronInputOtpGroup(
          children: <Widget>[
            for (int index = 0; index < firstGroup; index++)
              HoronInputOtpSlot(index: index),
          ],
        ),
        if (grouped) ...<Widget>[
          const HoronInputOtpSeparator(),
          HoronInputOtpGroup(
            children: <Widget>[
              for (int index = firstGroup; index < widget.length; index++)
                HoronInputOtpSlot(index: index),
            ],
          ),
        ],
      ],
    );
  }
}

/// 한 변형을 이름과 함께 보여 주는 칸입니다.
class _OtpCell extends StatelessWidget {
  const _OtpCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(label, style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: HoronSpace.s1),
        child,
      ],
    );
  }
}
