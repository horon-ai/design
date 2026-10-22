import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

const String _dartSample = '''final String name = 'horon';
final List<int> numbers = <int>[1, 2, 3];
print(name.length + numbers.length);''';

const String _shellSample =
    'dart format --output=none --set-exit-if-changed lib test';

/// `code_block` 갤러리 섹션입니다.
class HoronCodeBlockGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCodeBlockGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'CodeBlock',
      variants: <Widget>[
        SizedBox(
          width: 520,
          child: HoronCodeBlock(
            code: _dartSample,
            children: const <Widget>[
              HoronCodeBlockHeader(
                title: 'dart',
                trailing: HoronCodeBlockCopyButton(),
              ),
              HoronCodeBlockContent(),
            ],
          ),
        ),
        SizedBox(
          width: 520,
          child: HoronCodeBlock(
            code: _shellSample,
            children: const <Widget>[
              HoronCodeBlockHeader(
                title: 'bash',
                trailing: HoronCodeBlockCopyButton(),
              ),
              HoronCodeBlockContent(),
            ],
          ),
        ),
      ],
      states: <Widget>[
        SizedBox(
          width: 520,
          child: HoronCodeBlock(
            code: _dartSample,
            children: const <Widget>[
              HoronCodeBlockHeader(title: 'No copy button'),
              HoronCodeBlockContent(),
            ],
          ),
        ),
        SizedBox(
          width: 520,
          child: HoronCodeBlock(
            code: _shellSample,
            children: const <Widget>[
              HoronCodeBlockHeader(
                title: 'Custom label',
                trailing: HoronCodeBlockCopyButton(
                  copyLabel: 'Copy the command',
                ),
              ),
              HoronCodeBlockContent(),
            ],
          ),
        ),
        SizedBox(
          width: 520,
          child: HoronCodeBlock(
            code:
                'const String veryLongLine = '
                "'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
            children: const <Widget>[
              HoronCodeBlockHeader(
                title: 'Overflow scrolls',
                trailing: HoronCodeBlockCopyButton(),
              ),
              HoronCodeBlockContent(),
            ],
          ),
        ),
      ],
      notes:
          'React `code-block.tsx`의 네 부분 중 셋을 옮겼습니다(상자·헤더·본문)과 복사 '
          '버튼. 복사는 `Clipboard.setData`를 부르고 2000ms 동안 체크 표시로 바뀝니다. '
          '본문은 `SelectableText`라 직접 골라 복사할 수도 있고, 구문 강조는 하지 않습니다.',
    );
  }
}
