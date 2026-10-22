import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `command` 갤러리 섹션입니다.
///
/// 검색어로 걸러지는 명령 목록, 그룹·구분선·단축키·비활성 항목, 결과 없음 상태,
/// 그리고 단축키로 여는 대화상자 형태를 보여 줍니다.
class HoronCommandGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronCommandGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Command',
      variants: <Widget>[
        SizedBox(
          width: 420,
          child: HoronCommand(
            children: <Widget>[
              const HoronCommandInput(hintText: '명령을 입력하세요'),
              HoronCommandList(
                children: <Widget>[
                  HoronCommandGroup(
                    label: '이동',
                    children: <Widget>[
                      HoronCommandItem(value: '받은 편지함', onSelected: () {}),
                      HoronCommandItem(value: '보낸 편지함', onSelected: () {}),
                      HoronCommandItem(value: '휴지통', onSelected: () {}),
                    ],
                  ),
                  const HoronCommandSeparator(),
                  HoronCommandGroup(
                    label: '작업',
                    children: <Widget>[
                      HoronCommandItem(
                        value: '새 메시지',
                        onSelected: () {},
                        trailing: const HoronCommandShortcut(label: 'Cmd N'),
                      ),
                      HoronCommandItem(
                        value: '보관',
                        onSelected: () {},
                        trailing: const HoronCommandShortcut(label: 'Cmd E'),
                      ),
                      const HoronCommandItem(value: '삭제', enabled: false),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
      states: <Widget>[
        // 결과 없음 상태입니다. 그룹이 스스로 사라지고 빈 안내가 남습니다.
        SizedBox(
          width: 420,
          child: HoronCommand(
            initialQuery: '없는검색어',
            children: <Widget>[
              const HoronCommandInput(),
              HoronCommandList(
                children: <Widget>[
                  HoronCommandGroup(
                    label: '이동',
                    children: <Widget>[
                      HoronCommandItem(value: '받은 편지함', onSelected: () {}),
                      HoronCommandItem(value: '보낸 편지함', onSelected: () {}),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        // 대화상자 형태입니다. Cmd+K로도 열립니다.
        HoronCommandDialog(
          trigger: HoronButton(
            label: '명령 열기',
            variant: HoronButtonVariant.outline,
          ),
          shortcut: const SingleActivator(LogicalKeyboardKey.keyK, meta: true),
          builder: (BuildContext context) => HoronCommand(
            children: <Widget>[
              const HoronCommandInput(hintText: '무엇을 할까요?', autofocus: true),
              HoronCommandList(
                children: <Widget>[
                  HoronCommandGroup(
                    label: '최근',
                    children: <Widget>[
                      HoronCommandItem(value: '설정 열기', onSelected: () {}),
                      HoronCommandItem(value: '테마 바꾸기', onSelected: () {}),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
      notes:
          'React `command.tsx`를 옮겼습니다. `HoronCommand`가 검색어를 들고 '
          '`HoronCommandScope`로 내려보내면, 항목이 자기 `value`와 `keywords`로 스스로를 '
          '걸러집니다. 그래서 그룹과 구분선은 남은 항목이 없으면 스스로 사라집니다. '
          '`HoronCommandDialog`는 같은 목록을 모달로 열고 단축키도 받습니다.',
    );
  }
}
