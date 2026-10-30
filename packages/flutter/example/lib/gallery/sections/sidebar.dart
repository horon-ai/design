import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/sidebar.dart';

/// `sidebar` 갤러리 섹션입니다.
///
/// 데스크톱 폭에서 세 가지 바탕(glass·photo·flue)과 휴대폰 폭의 280 고정 기둥을
/// 나란히 보여 주고, 아래에 폭 조절 손잡이를 실제로 끌어 볼 수 있는 예를 둡니다.
class HoronSidebarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSidebarGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Wrap(
            spacing: theme.space.s6,
            runSpacing: theme.space.s6,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              _Sample(
                label: 'glass',
                child: SizedBox(
                  width: 280,
                  height: 560,
                  child: HoronSidebar(children: _content()),
                ),
              ),
              _Sample(
                label: 'photo',
                child: SizedBox(
                  width: 280,
                  height: 560,
                  child: HoronSidebar.photo(children: _content()),
                ),
              ),
              _Sample(
                label: 'flue',
                child: SizedBox(
                  width: 280,
                  height: 560,
                  child: HoronSidebar.flue(children: _content()),
                ),
              ),
              // 상자가 768보다 좁으므로 resizable이어도 손잡이가 없고 280으로 남습니다.
              _Sample(
                label: '휴대폰 폭 280 (고정)',
                child: SizedBox(
                  width: 280,
                  height: 560,
                  child: HoronSidebar(resizable: true, children: _content()),
                ),
              ),
            ],
          ),
          SizedBox(height: theme.space.s6),
          const _Sample(label: '폭 조절 (md 이상에서 손잡이)', child: _ResizableSample()),
        ],
      ),
    );
  }
}

/// 사이드바 한 벌입니다. 갤러리의 모든 예가 같은 내용을 씁니다.
List<Widget> _content() => <Widget>[
  HoronSidebarHeader(initial: 'H', name: 'Horon Workspace', onCollapse: () {}),
  HoronSidebarGroup(
    label: 'Workspace',
    children: <Widget>[
      HoronSidebarItem(
        icon: const Icon(Icons.inbox),
        label: 'Inbox',
        count: '12',
        current: true,
        onPressed: () {},
      ),
      HoronSidebarItem(
        icon: const Icon(Icons.send),
        label: 'Sent',
        onPressed: () {},
      ),
      HoronSidebarItem(
        icon: const Icon(Icons.schedule),
        label: 'Later',
        attention: true,
        onPressed: () {},
      ),
    ],
  ),
  HoronSidebarGroup(
    label: 'Projects',
    defaultOpen: false,
    children: <Widget>[
      HoronSidebarItem(
        icon: const Icon(Icons.folder),
        label: 'Research',
        onPressed: () {},
      ),
    ],
  ),
  HoronSidebarProject(
    icon: const HoronSidebarProjectTile(child: Icon(Icons.folder)),
    label: 'Paper',
    defaultOpen: true,
    actions: HoronSidebarProjectMore(onPressed: () {}),
    children: <Widget>[
      HoronSidebarItem(label: 'Design sync', onPressed: () {}),
      HoronSidebarItem(label: 'Weekly notes', count: '3', onPressed: () {}),
    ],
  ),
  const HoronSidebarSpacer(),
  HoronSidebarAddButton(label: 'Add project', onPressed: () {}),
  HoronSidebarAccount(
    initials: 'M',
    name: '민열',
    email: 'alpoxdev@horon.ai',
    onPressed: () {},
  ),
];

/// 폭 조절을 실제로 만져 보는 예입니다.
///
/// 오른쪽 가장자리 8px를 끌거나, 손잡이를 눌러 포커스를 준 뒤 화살표·Home·End를
/// 누르거나, 더블 탭해 기본 폭으로 돌아옵니다. 손잡이는 이 상자가 768보다 넓을 때만
/// 보입니다.
class _ResizableSample extends StatefulWidget {
  const _ResizableSample();

  @override
  State<_ResizableSample> createState() => _ResizableSampleState();
}

class _ResizableSampleState extends State<_ResizableSample> {
  double _width = 280;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      height: 560,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          HoronSidebar(
            resizable: true,
            onWidthChange: (double width) => setState(() => _width = width),
            children: _content(),
          ),
          Expanded(
            child: ColoredBox(
              color: theme.colors.bgSubtle,
              child: Center(
                child: Text(
                  '${_width.round()} px',
                  style: theme.text.titleMd.copyWith(
                    color: theme.colors.textSecondary,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// 변형 하나와 그 캡션입니다.
class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          label,
          style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
        ),
        SizedBox(height: theme.space.s2),
        child,
      ],
    );
  }
}
