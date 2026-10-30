import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'bot_instructions_panel.dart';

/// `document-extract-panel.tsx`의 `ExtractFieldStatus`입니다.
enum HoronExtractFieldStatus {
  /// `status="filled"` — 값이 채워졌습니다. 확인 표시만 있고 누를 수 없습니다.
  filled,

  /// `status="check"` — 값은 읽혔지만 확인이 필요합니다. 값 상자가 위험 색 테두리를 두릅니다.
  check,
}

/// `rounded-[24px]` — 패널 반경 24px입니다. 토큰 단계(16, 20)에 없는 값입니다.
const double _panelRadius = 24;

/// `rounded-[10px]` — 확인이 필요한 값 상자의 반경입니다.
const double _fieldRadius = 10;

/// `border-[1.2px]` — `ExtractHighlight` 상자의 테두리 두께입니다.
const double _highlightBorder = 1.2;

/// `size-3.5` — 캐럿·아이콘 14px입니다.
const double _smallIconSize = 14;

/// `size-4` — 파일 아이콘 16px입니다.
const double _fileIconSize = 16;

/// `h-px` — 구분선 두께 1px입니다.
const double _hairline = 1;

/// `disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `ZOOM_MIN`·`ZOOM_MAX`·`ZOOM_STEP`·`ZOOM_FIT`입니다.
const int _zoomMin = 30;
const int _zoomMax = 150;
const int _zoomStepPercent = 10;
const int _zoomFit = 70;

/// `transition-[scale] duration-220 ease-out-quint`입니다.
const Duration _zoomTransition = Duration(milliseconds: 220);

/// 문서에서 읽은 값 하나입니다.
final class HoronExtractField extends HoronExtractEntry {
  /// 필드를 만듭니다.
  const HoronExtractField({required super.id, required super.label, required this.value, super.type, this.status});

  /// 읽어 낸 값입니다.
  final String value;

  /// 확인 상태입니다. 없으면 확인이 필요 없는 값으로 그립니다.
  final HoronExtractFieldStatus? status;
}

/// 문서에서 읽은 표의 열입니다.
final class HoronExtractColumn {
  /// 열을 만듭니다.
  const HoronExtractColumn(this.label, {this.alignEnd = false, this.width});

  /// 열 제목입니다.
  final String label;

  /// React `align="end"`입니다. 참이면 오른쪽 정렬합니다.
  final bool alignEnd;

  /// React `width`(px)입니다. 없으면 남는 폭을 나눠 씁니다.
  final double? width;
}

/// 문서에서 읽은 표입니다.
final class HoronExtractTable extends HoronExtractEntry {
  /// 표를 만듭니다.
  const HoronExtractTable({
    required super.id,
    required super.label,
    super.type,
    required this.columns,
    required this.rows,
  });

  /// 열 정의입니다.
  final List<HoronExtractColumn> columns;

  /// 행 값입니다. 행마다 [columns] 순서의 셀입니다.
  final List<List<String>> rows;
}

/// `ExtractField | ExtractTable`의 공통 부분입니다.
sealed class HoronExtractEntry {
  const HoronExtractEntry({required this.id, required this.label, this.type});

  /// 항목 식별자입니다. 확인 상태를 이 값으로 기억합니다.
  final String id;

  /// 화면 왼쪽에 보이는 이름입니다.
  final String label;

  /// 행 끝에 보이는 형식 이름입니다. 예를 들어 `Text`, `Date`입니다.
  final String? type;
}

/// 문서의 한 묶음입니다.
final class HoronExtractGroup {
  /// 묶음을 만듭니다.
  const HoronExtractGroup({required this.id, required this.label, required this.fields});

  /// 묶음 식별자입니다.
  final String id;

  /// 묶음 제목입니다.
  final String label;

  /// 이 묶음의 필드와 표입니다.
  final List<HoronExtractEntry> fields;
}

/// `highlightTone`의 네 가지 톤입니다.
///
/// React는 `tone?: keyof typeof highlightTone`이라는 인라인 유니온이라 variant 게이트가
/// enum 어휘로 읽지 않습니다. 그래서 public enum 대신 값 객체로 두고, 색은 build에서
/// 테마로 풉니다.
final class HoronExtractHighlightTone {
  const HoronExtractHighlightTone._(this._kind);

  final _ExtractHighlightKind _kind;

  /// `tone="sky"` — 기본값입니다. 하늘 테두리와 12% 하늘 바탕입니다.
  static const HoronExtractHighlightTone sky = HoronExtractHighlightTone._(_ExtractHighlightKind.sky);

  /// `tone="brand"` — 남색 테두리와 12% 남색 바탕입니다.
  static const HoronExtractHighlightTone brand = HoronExtractHighlightTone._(_ExtractHighlightKind.brand);

  /// `tone="neutral"` — 회색 테두리와 12% 회색 바탕입니다.
  static const HoronExtractHighlightTone neutral = HoronExtractHighlightTone._(_ExtractHighlightKind.neutral);

  /// `tone="ink"` — 잉크 테두리와 12% 잉크 바탕입니다.
  static const HoronExtractHighlightTone ink = HoronExtractHighlightTone._(_ExtractHighlightKind.ink);
}

/// `highlightTone`의 키입니다. [HoronExtractHighlightTone]이 감싸는 값입니다.
enum _ExtractHighlightKind { sky, brand, neutral, ink }

/// 패널 아래쪽에 보이는 봇입니다.
final class HoronExtractBot {
  /// 봇을 만듭니다.
  const HoronExtractBot({required this.initial, required this.name, this.elapsed});

  /// 한 글자 머리글자입니다.
  final String initial;

  /// 봇 이름입니다.
  final String name;

  /// 걸린 시간입니다. 예를 들어 `12s`입니다.
  final String? elapsed;
}

/// `ExtractHighlight` — 종이 위에서 읽어 낸 값에 두르는 상자입니다.
///
/// `rounded-sm border-[1.2px] px-1 py-0.5`에 톤별 테두리·바탕색을 씁니다. Paper가
/// 값 위에 그리는 1.2px 상자를 옮긴 것입니다.
class HoronExtractHighlight extends StatelessWidget {
  /// 강조 상자를 만듭니다.
  const HoronExtractHighlight({super.key, required this.child, this.tone = HoronExtractHighlightTone.sky});

  /// 강조할 내용입니다.
  final Widget child;

  /// 상자의 색입니다.
  final HoronExtractHighlightTone tone;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final (Color border, Color fill) = switch (tone._kind) {
      _ExtractHighlightKind.sky => (colors.accentSky500_90, colors.accentSky500_12),
      _ExtractHighlightKind.brand => (colors.accentSky700_90, colors.accentSky700_12),
      _ExtractHighlightKind.neutral => (colors.textPlaceholder90, colors.textPlaceholder12),
      _ExtractHighlightKind.ink => (colors.interactivePrimary, colors.overlayInk12),
    };
    return Container(
      padding: EdgeInsets.symmetric(horizontal: space.s1, vertical: space.s0_5), // px-1 py-0.5
      decoration: BoxDecoration(
        color: fill,
        borderRadius: BorderRadius.circular(theme.radius.sm), // rounded-sm
        border: Border.all(color: border, width: _highlightBorder),
      ),
      child: child,
    );
  }
}

/// Figma `DocumentExtractPanel`(Paper `YUT-1` / `GWP-0`)입니다.
///
/// 왼쪽에 확대·축소가 되는 문서 뷰어, 오른쪽에 필드 / JSON / Schema 보기와 확인 체크,
/// 아래에 `Accept all` 바닥줄을 둡니다. React의 `@container`·`@4xl:flex-row`는 가장
/// 가까운 브레이크포인트인 `lg`(1024)에서 두 단으로 바뀌는 레이아웃으로 옮겼습니다.
class HoronDocumentExtractPanel extends StatefulWidget {
  /// 패널을 만듭니다.
  const HoronDocumentExtractPanel({
    super.key,
    required this.fileName,
    this.pageLabel = '1 / 1',
    required this.sheet,
    required this.groups,
    this.defaultZoom = _zoomFit,
    this.bot,
    this.onExtract,
    this.onAcceptAll,
  });

  /// 뷰어 머리말의 파일 이름입니다.
  final String fileName;

  /// 쪽 표시입니다. 기본값은 `1 / 1`입니다.
  final String pageLabel;

  /// 종이 시트 내용입니다. 읽어 낸 값은 [HoronExtractHighlight]로 감싸 표시합니다.
  final Widget sheet;

  /// 오른쪽에 보이는 묶음들입니다.
  final List<HoronExtractGroup> groups;

  /// 처음 확대 비율(%)입니다. 기본값은 [HoronDocumentExtractPanel]의 `ZOOM_FIT`인 70입니다.
  final int defaultZoom;

  /// 바닥줄에 보이는 봇입니다.
  final HoronExtractBot? bot;

  /// `Extract`를 눌렀을 때 부릅니다.
  final VoidCallback? onExtract;

  /// `Accept all`을 눌렀을 때 부릅니다.
  final VoidCallback? onAcceptAll;

  @override
  State<HoronDocumentExtractPanel> createState() => _HoronDocumentExtractPanelState();
}

/// 오른쪽의 세 가지 보기입니다(React의 `view` 상태).
enum _ExtractView { fields, json, schema }

class _HoronDocumentExtractPanelState extends State<HoronDocumentExtractPanel> {
  late int _zoom = widget.defaultZoom.clamp(_zoomMin, _zoomMax);
  _ExtractView _view = _ExtractView.fields;
  final Set<String> _resolved = <String>{};

  /// React의 `run` 상태입니다. 다시 추출하면 내용을 새로 그립니다.
  int _run = 0;

  List<HoronExtractEntry> get _flat => <HoronExtractEntry>[
    for (final HoronExtractGroup group in widget.groups) ...group.fields,
  ];

  /// `isChecked` — 확인이 필요한데 아직 사용자가 누르지 않은 항목입니다.
  bool _needsCheck(HoronExtractEntry entry) =>
      entry is HoronExtractField && entry.status == HoronExtractFieldStatus.check && !_resolved.contains(entry.id);

  void _resolve(String id) => setState(() => _resolved.add(id));

  void _acceptAll() {
    setState(() => _resolved.addAll(_flat.map((HoronExtractEntry entry) => entry.id)));
    widget.onAcceptAll?.call();
  }

  /// `JSON.stringify(data, null, 2)`입니다.
  String _json(List<HoronExtractEntry> flat) {
    final Map<String, Object?> data = <String, Object?>{};
    for (final HoronExtractEntry entry in flat) {
      data[entry.label] = entry is HoronExtractTable
          ? <Map<String, String?>>[
              for (final List<String> row in entry.rows)
                <String, String?>{
                  for (var index = 0; index < entry.columns.length; index++)
                    entry.columns[index].label: index < row.length ? row[index] : null,
                },
            ]
          : (entry as HoronExtractField).value;
    }
    return const JsonEncoder.withIndent('  ').convert(data);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final BorderRadius radius = BorderRadius.circular(_panelRadius);

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: space.step(280)), // max-w-280 = 1120
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.bgSurface, // bg-bg-surface
          borderRadius: radius,
          border: Border.all(color: colors.borderDefault), // border-border-default
        ),
        child: ClipRRect(
          borderRadius: radius, // overflow-clip
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              final bool sideBySide = constraints.maxWidth >= theme.breakpoints.lg; // @4xl:flex-row
              final Widget viewer = _viewer(theme, space, colors);
              final Widget extract = _extract(theme, space, colors);
              if (!sideBySide) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[viewer, const _PanelDivider(), extract],
                );
              }
              final double leftWidth = math.min(space.step(135), constraints.maxWidth * 0.6); // @4xl:w-135
              return Stack(
                children: <Widget>[
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      SizedBox(width: leftWidth, child: viewer),
                      const SizedBox(width: _hairline),
                      Expanded(child: extract),
                    ],
                  ),
                  Positioned(
                    left: leftWidth,
                    top: 0,
                    bottom: 0,
                    width: _hairline,
                    child: ColoredBox(color: colors.overlayInk8), // Divider vertical
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  /// 왼쪽 단 — 머리말과 문서 뷰어입니다.
  Widget _viewer(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Padding(
          padding: EdgeInsets.fromLTRB(space.step(3.5), space.s3, space.s3, space.s3), // py-3 pr-3 pl-3.5
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              final Widget file = Row(
                children: <Widget>[
                  Container(
                    width: space.step(7), // size-7 = 28
                    height: space.step(7),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: colors.overlayInk5, // bg-overlay-ink-5
                      borderRadius: BorderRadius.circular(theme.radius.lg), // rounded-lg = 14
                    ),
                    child: Icon(Icons.picture_as_pdf, size: _fileIconSize, color: colors.textDanger), // FilePdf size-4
                  ),
                  SizedBox(width: space.s2),
                  Expanded(
                    child: Row(
                      children: <Widget>[
                        Flexible(
                          child: Text(
                            widget.fileName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis, // truncate
                            style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                          ),
                        ),
                        Icon(
                          Icons.expand_more,
                          size: _smallIconSize,
                          color: colors.textSecondary,
                        ), // CaretDown size-3.5
                      ],
                    ),
                  ),
                ],
              );
              final Widget controls = Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text(
                    widget.pageLabel,
                    maxLines: 1,
                    style: theme.text.caption.copyWith(color: colors.textSecondary), // text-caption
                  ),
                  SizedBox(width: space.s2),
                  _zoomTrack(theme, space, colors),
                  SizedBox(width: space.s2),
                  _TapSurface(
                    onTap: () => setState(() => _zoom = _zoomFit),
                    radius: theme.radius.full,
                    height: space.step(7.5), // h-7.5 = 30
                    padding: EdgeInsets.only(left: space.s3, right: space.step(3.5)), // pl-3 pr-3.5
                    color: colors.overlayInk6,
                    hoverColor: colors.overlayInk8,
                    child: Text('Fit', maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textPrimary)),
                  ),
                ],
              );
              // React는 한 줄 고정입니다. 420px 아래에서는 파일 줄과 컨트롤을 두 줄로 나눠
              // 좁은 화면에서도 넘치지 않게 합니다.
              if (constraints.maxWidth >= space.step(105)) {
                return Row(
                  children: <Widget>[
                    Expanded(child: file),
                    SizedBox(width: space.s2),
                    controls,
                  ],
                );
              }
              return Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: <Widget>[
                  file,
                  SizedBox(height: space.s2),
                  controls,
                ],
              );
            },
          ),
        ),
        Container(
          constraints: BoxConstraints(minHeight: space.step(120)), // min-h-120 = 480
          width: double.infinity,
          alignment: Alignment.topCenter,
          clipBehavior: Clip.hardEdge, // overflow-hidden
          padding: EdgeInsets.symmetric(horizontal: space.s6, vertical: space.s5), // px-6 py-5
          decoration: BoxDecoration(color: colors.overlayInk7), // bg-overlay-ink-7
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              final double sheetWidth = math.min(space.step(117.5), constraints.maxWidth); // w-117.5 = 470
              final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
              return AnimatedScale(
                scale: _zoom / _zoomFit, // style={{ scale: zoom / ZOOM_FIT }}
                alignment: Alignment.topCenter, // origin-top
                duration: reduceMotion ? Duration.zero : _zoomTransition,
                curve: HoronMotion.easeOutQuint, // ease-out-quint
                child: Container(
                  width: sheetWidth,
                  padding: EdgeInsets.fromLTRB(space.step(6.5), space.step(6.5), space.step(6.5), space.s5),
                  decoration: BoxDecoration(
                    color: colors.bgSurface, // bg-bg-surface
                    boxShadow: <BoxShadow>[
                      // [filter:drop-shadow(0_2px_4px_#00000014)]
                      BoxShadow(
                        color: HoronPalette.baseBlack.withValues(alpha: 0.08),
                        offset: const Offset(0, 2),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: space.s3_5, // gap-3.5 = 14
                    children: <Widget>[
                      DefaultTextStyle.merge(
                        style: theme.text.bodyMd.copyWith(color: colors.textPrimary), // text-text-primary
                        child: widget.sheet,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  /// 확대 컨트롤 — `h-7.5 gap-0.5 rounded-full bg-overlay-ink-5 px-1`입니다.
  Widget _zoomTrack(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    return Container(
      height: space.step(7.5),
      padding: EdgeInsets.symmetric(horizontal: space.s1), // px-1 = 4
      decoration: BoxDecoration(color: colors.overlayInk5, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s0_5, // gap-0.5 = 2
        children: <Widget>[
          _zoomStep(
            theme,
            space,
            colors,
            Icons.remove,
            _zoom > _zoomMin,
            () => setState(() => _zoom -= _zoomStepPercent),
          ), // Zoom out
          SizedBox(
            width: space.step(9), // w-9 = 36
            child: Text(
              '$_zoom%',
              textAlign: TextAlign.center,
              maxLines: 1,
              style: theme.text.labelSm.copyWith(color: colors.textPrimary), // text-label-sm tabular-nums
            ),
          ),
          _zoomStep(
            theme,
            space,
            colors,
            Icons.add,
            _zoom < _zoomMax,
            () => setState(() => _zoom += _zoomStepPercent),
          ), // Zoom in
        ],
      ),
    );
  }

  /// `size-6 rounded-full` 확대 단계 버튼입니다.
  Widget _zoomStep(
    HoronThemeData theme,
    HoronSpaceSpec space,
    HoronColors colors,
    IconData icon,
    bool enabled,
    VoidCallback onTap,
  ) {
    return _TapSurface(
      onTap: onTap,
      enabled: enabled,
      radius: theme.radius.full,
      height: space.step(6), // size-6 = 24
      hoverColor: colors.overlayInk8,
      child: SizedBox(
        width: space.step(6),
        child: Center(
          child: Icon(icon, size: _smallIconSize, color: colors.textPrimary),
        ),
      ),
    );
  }

  /// 오른쪽 단 — 보기 탭, 내용, 바닥줄입니다.
  Widget _extract(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors) {
    final List<HoronExtractEntry> flat = _flat;
    final int total = flat.length;
    final int toCheck = flat.where(_needsCheck).length;
    final int filled = total - toCheck;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Padding(
          padding: EdgeInsets.fromLTRB(space.s3, space.s3, space.step(3.5), space.s3), // py-3 pr-3.5 pl-4
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Flexible(
                child: HoronPanelPillTabs(
                  semanticLabel: 'Extraction view',
                  items: const <HoronPanelPillTab>[
                    HoronPanelPillTab(value: 'fields', label: 'Fields'),
                    HoronPanelPillTab(value: 'json', label: 'JSON'),
                    HoronPanelPillTab(value: 'schema', label: 'Schema'),
                  ],
                  value: _view.name,
                  onValueChange: (String next) {
                    setState(() => _view = _ExtractView.values.firstWhere((_ExtractView view) => view.name == next));
                  },
                ),
              ),
              SizedBox(width: space.s2),
              _TapSurface(
                onTap: () {
                  setState(() => _run++);
                  widget.onExtract?.call();
                },
                radius: theme.radius.full,
                height: space.step(8), // h-8 = 32
                padding: EdgeInsets.only(left: space.s3, right: space.step(3.5)),
                color: colors.overlayInk6,
                hoverColor: colors.overlayInk8,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: space.s1_5,
                  children: <Widget>[
                    Icon(Icons.document_scanner_outlined, size: _smallIconSize, color: colors.textPrimary), // Scan
                    Text('Extract', maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textPrimary)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const _PanelDivider(),
        Padding(
          padding: EdgeInsets.fromLTRB(
            space.step(4.5), // pt-3.5 pl-4.5
            space.step(3.5),
            space.step(4.5),
            space.s4, // pb-4
          ),
          child: KeyedSubtree(
            key: ValueKey<String>('${_view.name}-$_run'),
            child: switch (_view) {
              _ExtractView.fields => _fields(theme, space, colors, flat, total),
              _ExtractView.json => _jsonView(theme, space, colors, flat),
              _ExtractView.schema => _schema(theme, space, colors, flat),
            },
          ),
        ),
        const _PanelDivider(),
        _footer(theme, space, colors, flat, total, filled, toCheck),
      ],
    );
  }

  /// Fields 보기입니다.
  Widget _fields(
    HoronThemeData theme,
    HoronSpaceSpec space,
    HoronColors colors,
    List<HoronExtractEntry> flat,
    int total,
  ) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: space.s1_5, // gap-1.5 = 6
      children: <Widget>[
        Text('$total fields filled from this document', style: theme.text.bodySm.copyWith(color: colors.textSecondary)),
        for (final HoronExtractGroup group in widget.groups)
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: space.s1_5,
            children: <Widget>[
              Padding(
                padding: EdgeInsets.only(top: space.s3, bottom: space.s1), // pt-3 pb-1
                child: Row(
                  children: <Widget>[
                    Container(
                      width: space.step(1.75), // size-1.75 = 7
                      height: space.step(1.75),
                      decoration: BoxDecoration(color: HoronPalette.sky500, shape: BoxShape.circle), // bg-sky-500
                    ),
                    SizedBox(width: space.s2),
                    Flexible(
                      child: Text(
                        group.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.labelMd.copyWith(color: colors.textPrimary), // h4 text-label-md
                      ),
                    ),
                  ],
                ),
              ),
              for (final HoronExtractEntry entry in group.fields)
                if (entry is HoronExtractTable)
                  _table(theme, space, colors, entry)
                else
                  _fieldRow(theme, space, colors, entry as HoronExtractField),
            ],
          ),
      ],
    );
  }

  /// 필드 한 줄 — `flex items-center gap-3`입니다.
  Widget _fieldRow(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors, HoronExtractField field) {
    final bool needsCheck = _needsCheck(field);
    return Row(
      children: <Widget>[
        SizedBox(
          width: space.step(25), // w-25 = 100
          child: Text(
            field.label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.text.bodySm.copyWith(color: colors.textSecondary),
          ),
        ),
        SizedBox(width: space.s3), // gap-3 = 12
        Expanded(
          child: Align(
            alignment: Alignment.centerLeft,
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: space.step(75)), // max-w-75 = 300
              child: _TapSurface(
                onTap: needsCheck ? () => _resolve(field.id) : null,
                radius: _fieldRadius,
                height: space.step(9), // h-9 = 36
                padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3
                color: needsCheck ? colors.overlayInk12 : colors.overlayInk4,
                hoverColor: needsCheck ? colors.overlayInk14 : null,
                borderColor: needsCheck
                    ? HoronPalette.red500.withValues(alpha: 0.9)
                    : Colors.transparent, // border-red-500/90
                child: Row(
                  spacing: space.s2, // gap-2 = 8
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        field.value,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis, // truncate
                        style: theme.text.bodySm.copyWith(color: colors.textPrimary),
                      ),
                    ),
                    if (needsCheck)
                      Text(
                        'Check',
                        maxLines: 1,
                        style: theme.text.caption.copyWith(color: colors.textDanger), // text-text-danger
                      )
                    else
                      _PopIn(
                        child: Icon(Icons.check, size: _smallIconSize, color: colors.textSecondary), // Check size-3.5
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
        if (field.type != null) ...<Widget>[
          SizedBox(width: space.s3),
          SizedBox(
            width: space.step(14), // w-14 = 56
            child: Text(
              field.type!,
              textAlign: TextAlign.end,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: theme.text.caption.copyWith(color: colors.textSecondary),
            ),
          ),
        ],
      ],
    );
  }

  /// 표 한 덩어리입니다.
  Widget _table(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors, HoronExtractTable table) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: space.s1_5,
      children: <Widget>[
        Row(
          children: <Widget>[
            SizedBox(
              width: space.step(25),
              child: Text(
                table.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.bodySm.copyWith(color: colors.textSecondary),
              ),
            ),
            Expanded(child: SizedBox(width: space.s3)), // min-w-0 flex-1 자리
            if (table.type != null)
              SizedBox(
                width: space.step(14),
                child: Text(
                  table.type!,
                  textAlign: TextAlign.end,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.caption.copyWith(color: colors.textSecondary),
                ),
              ),
          ],
        ),
        Container(
          padding: EdgeInsets.symmetric(horizontal: space.s3, vertical: space.s0_5), // px-3 py-0.5
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(theme.radius.xl), // rounded-xl = 20
            border: Border.all(color: colors.overlayInk10), // border-overlay-ink-10
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              _tableRow(
                theme,
                space,
                colors,
                <String>[for (final HoronExtractColumn column in table.columns) column.label],
                table.columns,
                theme.text.caption.copyWith(color: colors.textSecondary),
              ),
              for (final List<String> row in table.rows)
                _tableRow(
                  theme,
                  space,
                  colors,
                  row,
                  table.columns,
                  theme.text.caption.copyWith(color: colors.textPrimary),
                ),
            ],
          ),
        ),
      ],
    );
  }

  /// 표의 한 줄입니다. 열에 `width`가 있으면 고정, 없으면 남는 폭을 나눠 씁니다.
  Widget _tableRow(
    HoronThemeData theme,
    HoronSpaceSpec space,
    HoronColors colors,
    List<String> cells,
    List<HoronExtractColumn> columns,
    TextStyle style,
  ) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: space.s2), // py-2 = 8
      child: Row(
        spacing: space.s2, // gap-2 = 8
        children: <Widget>[
          for (var index = 0; index < cells.length; index++)
            _tableCell(theme, space, cells[index], index < columns.length ? columns[index] : null, style),
        ],
      ),
    );
  }

  Widget _tableCell(
    HoronThemeData theme,
    HoronSpaceSpec space,
    String value,
    HoronExtractColumn? column,
    TextStyle style,
  ) {
    final Widget text = Text(
      value,
      textAlign: column?.alignEnd ?? false ? TextAlign.end : TextAlign.start,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: style,
    );
    final double? width = column?.width;
    if (width == null) return Expanded(child: text);
    return SizedBox(width: width, child: text);
  }

  /// JSON 보기입니다. React는 `whitespace-pre`에 가로 스크롤을 두지만, 이 패널은
  /// 컨트롤 가로 스크롤을 금지하므로 긴 줄을 접어 그립니다.
  Widget _jsonView(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors, List<HoronExtractEntry> flat) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(space.s3), // p-3 = 12
      decoration: BoxDecoration(color: colors.overlayInk4, borderRadius: BorderRadius.circular(theme.radius.xl)),
      child: Text(
        _json(flat),
        // font-mono text-caption — 패밀리는 code 토큰에서 가져옵니다.
        style: theme.text.caption.copyWith(
          fontFamily: theme.text.code.fontFamily,
          fontFamilyFallback: theme.text.code.fontFamilyFallback,
          color: colors.textPrimary,
        ),
      ),
    );
  }

  /// Schema 보기입니다.
  Widget _schema(HoronThemeData theme, HoronSpaceSpec space, HoronColors colors, List<HoronExtractEntry> flat) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: space.s1_5,
      children: <Widget>[
        for (final HoronExtractEntry entry in flat)
          Row(
            children: <Widget>[
              SizedBox(
                width: space.step(35), // w-35 = 140
                child: Text(
                  entry.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                ),
              ),
              SizedBox(width: space.s3),
              Flexible(
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: space.s1_5, vertical: space.step(0.25)), // px-1.5 py-px
                  decoration: BoxDecoration(
                    color: colors.overlayInk6, // bg-overlay-ink-6
                    borderRadius: BorderRadius.circular(theme.radius.md), // rounded-md
                  ),
                  child: Text(
                    entry.type ?? 'Text',
                    maxLines: 1,
                    style: theme.text.caption.copyWith(color: colors.textSecondary),
                  ),
                ),
              ),
            ],
          ),
      ],
    );
  }

  /// 바닥줄 — 진행 점, 요약, 봇, `Accept all`입니다.
  Widget _footer(
    HoronThemeData theme,
    HoronSpaceSpec space,
    HoronColors colors,
    List<HoronExtractEntry> flat,
    int total,
    int filled,
    int toCheck,
  ) {
    final HoronExtractBot? bot = widget.bot;
    final Widget dots = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: space.s1, // gap-1 = 4
      children: <Widget>[
        for (final HoronExtractEntry entry in flat)
          Container(
            width: space.s2, // size-2 = 8
            height: space.s2,
            decoration: BoxDecoration(
              color: _needsCheck(entry) ? HoronPalette.red500 : HoronPalette.sky500, // bg-red-500 / bg-sky-500
              shape: BoxShape.circle,
            ),
          ),
      ],
    );
    final Widget summary = Text(
      '$filled of $total filled · $toCheck to check',
      style: theme.text.bodySm.copyWith(color: colors.textSecondary),
    );
    final Widget accept = _TapSurface(
      onTap: _acceptAll,
      radius: theme.radius.full,
      height: space.step(9), // h-9 = 36
      padding: EdgeInsets.only(left: space.s3, right: space.step(3.5)),
      color: colors.interactivePrimary, // bg-interactive-primary
      hoverColor: colors.interactivePrimaryHover,
      child: Text('Accept all', maxLines: 1, style: theme.text.labelSm.copyWith(color: colors.textInverse)),
    );
    final List<Widget> botWidgets = <Widget>[
      if (bot != null) ...<Widget>[
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: space.s2,
          children: <Widget>[
            Container(
              width: space.step(5), // size-5 = 20
              height: space.step(5),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: colors.interactivePrimary,
                borderRadius: BorderRadius.circular(theme.radius.md), // rounded-md
              ),
              child: Text(bot.initial, style: theme.text.labelSm.copyWith(color: colors.textInverse)),
            ),
            Flexible(
              child: Text(
                bot.elapsed == null ? bot.name : '${bot.name} · ${bot.elapsed}',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.text.caption.copyWith(color: colors.textSecondary),
              ),
            ),
          ],
        ),
      ],
      accept,
    ];

    return Padding(
      padding: EdgeInsets.fromLTRB(space.step(4.5), space.s3, space.step(3.5), space.s3), // py-3 pr-3.5 pl-4.5
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final Widget left = Wrap(
            spacing: space.s3, // gap-3 = 12
            runSpacing: space.s3,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: <Widget>[dots, summary],
          );
          final Widget right = Wrap(
            spacing: space.s3,
            runSpacing: space.s3,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: botWidgets,
          );
          // React의 `flex-wrap`은 한 줄에 다 들어가면 버튼 묶음을 오른쪽 끝으로 밉니다.
          if (constraints.maxWidth >= space.step(100)) {
            return Row(
              children: <Widget>[
                Expanded(child: left),
                right,
              ],
            );
          }
          return Wrap(
            spacing: space.s3,
            runSpacing: space.s3,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: <Widget>[dots, summary, ...botWidgets],
          );
        },
      ),
    );
  }
}

/// `animate-pop-in` — 확인 표시가 0.6배에서 1배로 자랍니다.
class _PopIn extends StatelessWidget {
  const _PopIn({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    if (reduceMotion) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double value, Widget? child) => Transform.scale(scale: value, child: child),
      child: child,
    );
  }
}

/// `Divider` — `bg-overlay-ink-8`의 1px 선입니다.
class _PanelDivider extends StatelessWidget {
  const _PanelDivider();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: _hairline,
      child: ColoredBox(color: HoronTheme.of(context).colors.overlayInk8),
    );
  }
}

/// `motion-press`·`motion-colors`와 `focus-visible:outline-2`를 쓰는 누름 표면입니다.
class _TapSurface extends StatefulWidget {
  const _TapSurface({
    required this.child,
    required this.radius,
    this.onTap,
    this.color,
    this.hoverColor,
    this.borderColor,
    this.height,
    this.padding,
    this.enabled = true,
  });

  final Widget child;
  final double radius;
  final VoidCallback? onTap;
  final Color? color;
  final Color? hoverColor;
  final Color? borderColor;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final bool enabled;

  @override
  State<_TapSurface> createState() => _TapSurfaceState();
}

class _TapSurfaceState extends State<_TapSurface> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.enabled && widget.onTap != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final Color rest = widget.color ?? Colors.transparent;
    final Color surfaceColor = !interactive
        ? rest
        : _hovered && widget.hoverColor != null
        ? widget.hoverColor!
        : rest;

    return Opacity(
      opacity: widget.enabled ? 1 : _disabledOpacity, // disabled:opacity-40
      child: AnimatedScale(
        scale: _pressed && interactive ? HoronMotion.pressScale : 1, // motion-press scale .97
        duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
        curve: HoronMotion.pressCurve,
        child: FocusableActionDetector(
          enabled: interactive,
          mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
          onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          shortcuts: const <ShortcutActivator, Intent>{
            SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
            SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
          },
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                widget.onTap?.call();
                return null;
              },
            ),
          },
          child: GestureDetector(
            onTap: interactive ? widget.onTap : null,
            onTapDown: (TapDownDetails details) {
              if (interactive) setState(() => _pressed = true);
            },
            onTapUp: (TapUpDetails details) {
              if (_pressed) setState(() => _pressed = false);
            },
            onTapCancel: () {
              if (_pressed) setState(() => _pressed = false);
            },
            child: _FocusRing(
              visible: _focused && interactive,
              radius: widget.radius,
              gap: space.s0_5,
              width: space.s0_5,
              color: theme.colors.textBrand,
              child: AnimatedContainer(
                duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration, // motion-colors
                curve: HoronMotion.colorsCurve,
                height: widget.height,
                padding: widget.padding,
                decoration: BoxDecoration(
                  color: surfaceColor,
                  borderRadius: BorderRadius.circular(widget.radius),
                  border: widget.borderColor == null ? null : Border.all(color: widget.borderColor!),
                ),
                child: widget.child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `focus-visible:outline-2 outline-offset-2 outline-text-brand`입니다.
class _FocusRing extends StatelessWidget {
  const _FocusRing({
    required this.visible,
    required this.radius,
    required this.gap,
    required this.width,
    required this.color,
    required this.child,
  });

  final bool visible;
  final double radius;
  final double gap;
  final double width;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -gap,
          top: -gap,
          right: -gap,
          bottom: -gap,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + gap),
                border: Border.all(color: color, width: width),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
