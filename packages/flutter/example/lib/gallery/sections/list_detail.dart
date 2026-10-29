import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/list_detail.dart';

/// `list_detail` 갤러리 섹션입니다.
///
/// 목록과 상세를 함께 놓은 완성형 하나와, 상세 패널을 이루는 조각(머리·메타 상자·
/// 지시문·파일 줄·바닥)을 따로 보여 줍니다. 폭이 좁으면 셀이 프레임 폭에 맞춰 줄고,
/// 완성형은 목록과 상세가 세로로 쌓입니다.
class HoronListDetailGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronListDetailGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double available = constraints.maxWidth.isFinite
              ? constraints.maxWidth
              : 720;
          final double full = math.min(available, 720);
          final double part = math.min(available, 420);
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              _Cell(
                label: '목록 + 상세 (md 이상에서 나란히)',
                width: full,
                child: HoronListDetail(
                  groups: _groups,
                  detailBuilder: (HoronListDetailItem item) =>
                      _SampleDetail(item: item),
                ),
              ),
              _Cell(
                label: 'Header — 40px 타일 · 18px 아이콘',
                width: part,
                child: const HoronListDetailHeader(
                  title: 'researcher',
                  description: '파일을 읽고 근거를 모으는 봇입니다',
                  icon: Icon(Icons.smart_toy_outlined),
                ),
              ),
              _Cell(
                label: 'Meta — 두 열 라벨/값',
                width: part,
                child: const HoronListDetailMeta(items: _meta),
              ),
              _Cell(
                label: 'Instructions — 편집 상자는 Edit로 열립니다',
                width: part,
                child: const HoronListDetailInstructions(
                  defaultValue: _instructions,
                  tag: 'AGENTS.md',
                ),
              ),
              _Cell(
                label: 'Files · Footer',
                width: part,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  spacing: theme.space.s5,
                  children: <Widget>[
                    const HoronListDetailFiles(
                      children: <Widget>[
                        _GlassChip(label: 'AGENTS.md'),
                        _GlassChip(label: 'memory.md'),
                        _GlassChip(label: 'tools.json'),
                      ],
                    ),
                    HoronListDetailFooter(
                      children: <Widget>[
                        const _GlassChip(label: 'Cancel'),
                        _GlassChip(label: 'Save', onTap: () {}),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

const List<HoronListDetailGroup> _groups = <HoronListDetailGroup>[
  HoronListDetailGroup(
    id: 'pinned',
    label: 'Pinned',
    items: <HoronListDetailItem>[
      HoronListDetailItem(
        id: 'researcher',
        title: 'researcher',
        meta: 'owner · alpox',
      ),
      HoronListDetailItem(
        id: 'summarizer',
        title: 'summarizer',
        meta: 'owner · design',
      ),
    ],
  ),
  HoronListDetailGroup(
    id: 'shared',
    label: 'Shared',
    items: <HoronListDetailItem>[
      HoronListDetailItem(id: 'archivist', title: 'archivist'),
    ],
  ),
];

const List<HoronListDetailMetaItem> _meta = <HoronListDetailMetaItem>[
  HoronListDetailMetaItem(id: 'scope', label: 'Scope', value: 'files.read'),
  HoronListDetailMetaItem(id: 'owner', label: 'Owner', value: 'alpox'),
  HoronListDetailMetaItem(id: 'runs', label: 'Runs', value: '1,284'),
  HoronListDetailMetaItem(id: 'updated', label: 'Updated', value: '2일 전'),
];

const String _instructions =
    'name: researcher\n---\ntools:\n  - search\n  - summarize';

/// 상세 패널 하나를 채우는 견본입니다.
class _SampleDetail extends StatelessWidget {
  const _SampleDetail({required this.item});

  final HoronListDetailItem item;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: theme.space.s5,
      children: <Widget>[
        HoronListDetailHeader(
          title: item.title,
          description: item.meta ?? '공유 봇입니다',
          icon: const Icon(Icons.smart_toy_outlined),
        ),
        const HoronListDetailMeta(items: _meta),
        const HoronListDetailInstructions(
          defaultValue: _instructions,
          tag: 'AGENTS.md',
        ),
        const HoronListDetailFiles(
          children: <Widget>[
            _GlassChip(label: 'AGENTS.md'),
            _GlassChip(label: 'memory.md'),
          ],
        ),
        HoronListDetailFooter(
          children: <Widget>[
            const _GlassChip(label: 'Duplicate'),
            _GlassChip(label: 'Save', onTap: () {}),
          ],
        ),
      ],
    );
  }
}

/// 캡션이 붙은 갤러리 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.width, required this.child});

  final String label;
  final double width;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return SizedBox(
      width: width,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s2,
        children: <Widget>[
          Text(
            label,
            style: theme.text.labelSm.copyWith(
              color: theme.colors.textPlaceholder,
            ),
          ),
          child,
        ],
      ),
    );
  }
}

/// 갤러리에서 버튼·칩 자리를 대신하는 작은 유리 알약입니다.
class _GlassChip extends StatelessWidget {
  const _GlassChip({required this.label, this.onTap});

  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: HoronLiquidGlass(
        borderRadius: BorderRadius.circular(theme.radius.full),
        child: SizedBox(
          height: theme.space.step(8),
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: theme.space.s3),
            child: Center(
              widthFactor: 1,
              child: Text(
                label,
                style: theme.text.labelMd.copyWith(
                  color: theme.colors.textPrimary,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
