import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import 'gallery_strings.dart';
import 'registry.dart';
import 'section_scaffold.dart';

/// 폭 토글이 고를 수 있는 미리보기 폭입니다.
enum GalleryWidth {
  /// 좁은 휴대폰입니다.
  compact(360),

  /// 큰 휴대폰과 작은 태블릿입니다.
  medium(600),

  /// 태블릿 가로입니다.
  expanded(900),

  /// 데스크톱 창입니다.
  wide(1280);

  const GalleryWidth(this.logicalPixels);

  /// 미리보기 영역에 적용하는 논리 픽셀 폭입니다.
  final double logicalPixels;

  /// 토글에 보이는 값입니다.
  String get label => logicalPixels.toInt().toString();
}

/// 레일 검색 필드입니다.
const Key gallerySearchFieldKey = Key('gallery-search-field');

/// 폭이 적용되는 미리보기 프레임입니다.
const Key galleryPreviewFrameKey = Key('gallery-preview-frame');

/// 밝기 선택지의 라벨입니다.
Key galleryBrightnessKey(Brightness brightness) =>
    ValueKey<String>('gallery-brightness-${brightness.name}');

/// 폭 선택지의 라벨입니다.
Key galleryWidthKey(GalleryWidth width) =>
    ValueKey<String>('gallery-width-${width.name}');

/// 언어 선택지의 라벨입니다.
Key galleryLanguageKey(GalleryLanguage language) =>
    ValueKey<String>('gallery-language-${language.name}');

/// 갤러리 셸입니다.
///
/// 레일에서 섹션을 고르고, 밝기와 폭과 언어를 바꿔 같은 섹션을 다시 봅니다.
/// 테마와 문구는 앱 루트가 소유하고, 셸은 바꾸려는 값만 위로 올립니다.
class GalleryShell extends StatefulWidget {
  /// 기본 생성자입니다.
  const GalleryShell({
    super.key,
    this.brightness = Brightness.light,
    this.onBrightnessChanged,
    this.language = GalleryLanguage.ko,
    this.onLanguageChanged,
    this.sections = gallerySections,
    this.sectionBuilder,
  });

  /// 현재 밝기입니다.
  final Brightness brightness;

  /// 밝기 토글이 부르는 콜백입니다.
  final ValueChanged<Brightness>? onBrightnessChanged;

  /// 현재 언어입니다.
  final GalleryLanguage language;

  /// 언어 토글이 부르는 콜백입니다.
  final ValueChanged<GalleryLanguage>? onLanguageChanged;

  /// 레일에 나열할 섹션입니다. 테스트가 자기 목록을 넣을 수 있게 열어 둡니다.
  final List<GallerySection> sections;

  /// 섹션 본문을 만드는 함수입니다. 없으면 자리표시자를 그립니다.
  ///
  /// `null`을 돌려주면 그 슬러그는 미등록이므로 셸이 자리표시자를 그립니다.
  final Widget? Function(BuildContext context, GallerySection section)?
  sectionBuilder;

  @override
  State<GalleryShell> createState() => _GalleryShellState();
}

class _GalleryShellState extends State<GalleryShell> {
  GalleryWidth _width = GalleryWidth.medium;
  String _query = '';
  String? _selectedSlug;

  GalleryStrings get _strings => widget.language.strings;

  List<GallerySection> get _visibleSections {
    final String query = _query.trim().toLowerCase();
    if (query.isEmpty) return widget.sections;
    return widget.sections
        .where(
          (GallerySection section) =>
              section.slug.toLowerCase().contains(query) ||
              section.title.toLowerCase().contains(query),
        )
        .toList();
  }

  GallerySection? get _selected {
    final String? slug = _selectedSlug;
    if (slug == null) return null;
    for (final GallerySection section in widget.sections) {
      if (section.slug == slug) return section;
    }
    return null;
  }

  @override
  void initState() {
    super.initState();
    _selectedSlug = _firstSlug(widget.sections);
  }

  @override
  void didUpdateWidget(covariant GalleryShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (_selectedSlug == null || _selected == null) {
      _selectedSlug = _firstSlug(widget.sections);
    }
  }

  String? _firstSlug(List<GallerySection> sections) =>
      sections.isEmpty ? null : sections.first.slug;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Scaffold(
      backgroundColor: scheme.surface,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final bool twoPane = constraints.maxWidth >= 720;
            final Widget rail = _GalleryRail(
              strings: _strings,
              sections: _visibleSections,
              isEmpty: widget.sections.isEmpty,
              selectedSlug: _selectedSlug,
              onQueryChanged: (String value) => setState(() => _query = value),
              onSelected: (GallerySection section) =>
                  setState(() => _selectedSlug = section.slug),
            );
            final Widget preview = _GalleryPreview(
              strings: _strings,
              width: _width,
              section: _selected,
              sectionBuilder: widget.sectionBuilder,
            );

            return Column(
              children: <Widget>[
                _GalleryControls(
                  strings: _strings,
                  brightness: widget.brightness,
                  width: _width,
                  language: widget.language,
                  onBrightnessChanged: widget.onBrightnessChanged,
                  onWidthChanged: (GalleryWidth value) =>
                      setState(() => _width = value),
                  onLanguageChanged: widget.onLanguageChanged,
                ),
                Divider(height: 1, color: scheme.outline),
                Expanded(
                  child: twoPane
                      ? Row(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: <Widget>[
                            SizedBox(width: 280, child: rail),
                            VerticalDivider(width: 1, color: scheme.outline),
                            Expanded(child: preview),
                          ],
                        )
                      : Column(
                          children: <Widget>[
                            SizedBox(height: 200, child: rail),
                            Divider(height: 1, color: scheme.outline),
                            Expanded(child: preview),
                          ],
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _GalleryControls extends StatelessWidget {
  const _GalleryControls({
    required this.strings,
    required this.brightness,
    required this.width,
    required this.language,
    required this.onBrightnessChanged,
    required this.onWidthChanged,
    required this.onLanguageChanged,
  });

  final GalleryStrings strings;
  final Brightness brightness;
  final GalleryWidth width;
  final GalleryLanguage language;
  final ValueChanged<Brightness>? onBrightnessChanged;
  final ValueChanged<GalleryWidth> onWidthChanged;
  final ValueChanged<GalleryLanguage>? onLanguageChanged;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        HoronSpace.s4,
        HoronSpace.s3,
        HoronSpace.s4,
        HoronSpace.s3,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(
                Icons.grid_view_rounded,
                size: 18,
                color: scheme.onSurfaceVariant,
              ),
              const SizedBox(width: HoronSpace.s2),
              Expanded(
                child: Text(
                  strings.title,
                  overflow: TextOverflow.ellipsis,
                  style: text.titleSmall?.copyWith(
                    color: scheme.onSurface,
                    fontWeight: HoronFontWeight.semibold,
                    letterSpacing: -0.2,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: HoronSpace.s3),
          // 컨트롤 세 묶음은 좁은 폭에서 한 줄에 다 들어가지 않습니다.
          // 가로 스크롤에 넣으면 네 번째 폭 값이 `12…`로 잘려 보이므로
          // (2026-10-22 시뮬레이터 캡처), 폭이 모자라면 다음 줄로 흘립니다.
          Wrap(
            spacing: HoronSpace.s5,
            runSpacing: HoronSpace.s3,
            crossAxisAlignment: WrapCrossAlignment.end,
            children: <Widget>[
              _GalleryControlGroup(
                label: strings.brightness,
                child: SegmentedButton<Brightness>(
                  showSelectedIcon: false,
                  segments: <ButtonSegment<Brightness>>[
                    ButtonSegment<Brightness>(
                      value: Brightness.light,
                      label: Text(
                        strings.light,
                        key: galleryBrightnessKey(Brightness.light),
                      ),
                    ),
                    ButtonSegment<Brightness>(
                      value: Brightness.dark,
                      label: Text(
                        strings.dark,
                        key: galleryBrightnessKey(Brightness.dark),
                      ),
                    ),
                  ],
                  selected: <Brightness>{brightness},
                  onSelectionChanged: (Set<Brightness> selection) =>
                      onBrightnessChanged?.call(selection.first),
                ),
              ),
              _GalleryControlGroup(
                label: strings.width,
                child: SegmentedButton<GalleryWidth>(
                  showSelectedIcon: false,
                  segments: <ButtonSegment<GalleryWidth>>[
                    for (final GalleryWidth value in GalleryWidth.values)
                      ButtonSegment<GalleryWidth>(
                        value: value,
                        label: Text(value.label, key: galleryWidthKey(value)),
                      ),
                  ],
                  selected: <GalleryWidth>{width},
                  onSelectionChanged: (Set<GalleryWidth> selection) =>
                      onWidthChanged(selection.first),
                ),
              ),
              _GalleryControlGroup(
                label: strings.language,
                child: SegmentedButton<GalleryLanguage>(
                  showSelectedIcon: false,
                  segments: <ButtonSegment<GalleryLanguage>>[
                    for (final GalleryLanguage value in GalleryLanguage.values)
                      ButtonSegment<GalleryLanguage>(
                        value: value,
                        label: Text(
                          value.label,
                          key: galleryLanguageKey(value),
                        ),
                      ),
                  ],
                  selected: <GalleryLanguage>{language},
                  onSelectionChanged: (Set<GalleryLanguage> selection) =>
                      onLanguageChanged?.call(selection.first),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _GalleryControlGroup extends StatelessWidget {
  const _GalleryControlGroup({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.only(
            left: HoronSpace.s1,
            bottom: HoronSpace.s1_5,
          ),
          child: Text(
            label.toUpperCase(),
            style: Theme.of(context).textTheme.labelSmall
                ?.copyWith(color: scheme.onSurfaceVariant, letterSpacing: 0.6),
          ),
        ),
        child,
      ],
    );
  }
}

class _GalleryRail extends StatelessWidget {
  const _GalleryRail({
    required this.strings,
    required this.sections,
    required this.isEmpty,
    required this.selectedSlug,
    required this.onQueryChanged,
    required this.onSelected,
  });

  final GalleryStrings strings;
  final List<GallerySection> sections;
  final bool isEmpty;
  final String? selectedSlug;
  final ValueChanged<String> onQueryChanged;
  final ValueChanged<GallerySection> onSelected;

  /// 레일에 그릴 항목을 그룹 헤더와 섹션으로 펼칩니다.
  ///
  /// 등록부는 이미 그룹 순서로 정렬되어 있으므로, 앞 섹션과 그룹이 달라지는
  /// 자리에만 헤더를 하나 넣습니다. 검색으로 걸러진 결과에도 같은 규칙이
  /// 적용되므로 좁힌 뒤에도 그룹 이름이 따라옵니다.
  List<_RailEntry> _entries() {
    final List<_RailEntry> entries = <_RailEntry>[];
    String? previousGroup;
    for (final GallerySection section in sections) {
      if (section.group != previousGroup) {
        entries.add(_RailEntry.group(strings.groupLabel(section.group)));
        previousGroup = section.group;
      }
      entries.add(_RailEntry.section(section));
    }
    return entries;
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return ColoredBox(
      color: scheme.surfaceContainerLow,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(HoronSpace.s3),
            child: TextField(
              key: gallerySearchFieldKey,
              onChanged: onQueryChanged,
              style: text.bodyMedium,
              decoration: InputDecoration(
                hintText: strings.search,
                prefixIcon: const Icon(Icons.search, size: 18),
              ),
            ),
          ),
          Expanded(
            child: sections.isEmpty
                ? Padding(
                    padding: const EdgeInsets.fromLTRB(
                      HoronSpace.s4,
                      HoronSpace.s2,
                      HoronSpace.s4,
                      HoronSpace.s4,
                    ),
                    child: Text(
                      isEmpty ? strings.noSections : strings.noMatches,
                      style: text.bodySmall?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(
                      HoronSpace.s2,
                      0,
                      HoronSpace.s2,
                      HoronSpace.s3,
                    ),
                    itemCount: _entries().length,
                    itemBuilder: (BuildContext context, int index) {
                      final _RailEntry entry = _entries()[index];
                      final String? group = entry.groupLabel;
                      if (group != null) {
                        return Padding(
                          padding: const EdgeInsets.fromLTRB(
                            HoronSpace.s3,
                            HoronSpace.s3,
                            HoronSpace.s3,
                            HoronSpace.s1,
                          ),
                          child: Text(
                            group,
                            style: text.labelSmall?.copyWith(
                              color: scheme.onSurfaceVariant,
                              fontWeight: HoronFontWeight.semibold,
                              letterSpacing: 0.4,
                            ),
                          ),
                        );
                      }
                      final GallerySection section = entry.section!;
                      final bool selected = section.slug == selectedSlug;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: HoronSpace.s0_5),
                        child: Material(
                          color: selected
                              ? scheme.secondaryContainer
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(HoronRadius.sm),
                          child: InkWell(
                            key: ValueKey<String>(
                              'gallery-rail-${section.slug}',
                            ),
                            onTap: () => onSelected(section),
                            borderRadius: BorderRadius.circular(HoronRadius.sm),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: HoronSpace.s3,
                                vertical: HoronSpace.s2,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(
                                    section.title,
                                    style: text.bodyMedium?.copyWith(
                                      color: selected
                                          ? scheme.onSecondaryContainer
                                          : scheme.onSurface,
                                      fontWeight: selected
                                          ? HoronFontWeight.semibold
                                          : HoronFontWeight.regular,
                                    ),
                                  ),
                                  Text(
                                    '${section.group} · ${section.slug}',
                                    style: text.labelSmall?.copyWith(
                                      color: selected
                                          ? scheme.onSecondaryContainer
                                                .withValues(alpha: 0.7)
                                          : scheme.onSurfaceVariant,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _GalleryPreview extends StatelessWidget {
  const _GalleryPreview({
    required this.strings,
    required this.width,
    required this.section,
    required this.sectionBuilder,
  });

  final GalleryStrings strings;
  final GalleryWidth width;
  final GallerySection? section;
  final Widget? Function(BuildContext context, GallerySection section)?
  sectionBuilder;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    final GallerySection? current = section;

    return ColoredBox(
      color: scheme.surfaceDim,
      child: Padding(
        padding: const EdgeInsets.all(HoronSpace.s4),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SizedBox(
            key: galleryPreviewFrameKey,
            width: width.logicalPixels,
            height: double.infinity,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: scheme.surface,
                borderRadius: BorderRadius.circular(HoronRadius.xl),
                border: Border.all(color: scheme.outline),
                boxShadow: HoronShadow.popover,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.fromLTRB(
                      HoronSpace.s4,
                      HoronSpace.s3,
                      HoronSpace.s4,
                      HoronSpace.s3,
                    ),
                    child: Row(
                      children: <Widget>[
                        Expanded(
                          child: Text(
                            current == null
                                ? strings.noSections
                                : '${current.group} · ${current.slug}',
                            overflow: TextOverflow.ellipsis,
                            style: text.labelMedium?.copyWith(
                              color: scheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                        Text(
                          '${width.label} px',
                          style: text.labelSmall?.copyWith(
                            color: scheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Divider(height: 1, color: scheme.outline),
                  Expanded(
                    child: LayoutBuilder(
                      builder:
                          (BuildContext context, BoxConstraints constraints) {
                            // 섹션 본문은 프레임보다 길 수 있습니다(컴포넌트 하나가
                            // 변형과 상태를 모두 늘어놓으므로). 스크롤을 두지 않으면
                            // 셸 테스트가 RenderFlex 오버플로로 실패합니다.
                            return SingleChildScrollView(
                              child: MediaQuery(
                                data: MediaQuery.of(context)
                                    .copyWith(size: constraints.biggest),
                                child: current == null
                                    ? Center(
                                        child: Padding(
                                          padding: const EdgeInsets.all(
                                            HoronSpace.s6,
                                          ),
                                          child: Text(
                                            strings.noSections,
                                            textAlign: TextAlign.center,
                                            style: text.bodyMedium?.copyWith(
                                              color: scheme.onSurfaceVariant,
                                            ),
                                          ),
                                        ),
                                      )
                                    : sectionBuilder?.call(context, current) ??
                                          GallerySectionScaffold(
                                            title: current.title,
                                            variants: const <Widget>[],
                                            states: const <Widget>[],
                                            notes: strings.notImplemented,
                                          ),
                              ),
                            );
                          },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 레일의 한 줄입니다. 그룹 헤더이거나 섹션 하나입니다.
///
/// 등록부는 그룹 순서로 정렬되어 있고, 레일은 그 위에 그룹 이름을 한 번씩만
/// 얹습니다. 두 종류를 한 목록에 담아 `ListView.builder`가 인덱스로 그리게
/// 하려고 한 타입으로 묶었습니다.
class _RailEntry {
  const _RailEntry.group(this.groupLabel) : section = null;

  const _RailEntry.section(this.section) : groupLabel = null;

  /// 그룹 헤더일 때의 이름입니다.
  final String? groupLabel;

  /// 섹션 줄일 때의 섹션입니다.
  final GallerySection? section;
}
