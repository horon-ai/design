import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../overlay/horon_modal.dart';
import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `command.tsx`의 `max-h-[300px]`입니다. 목록이 이 높이에서 스크롤됩니다.
const double _commandListMaxHeight = 300.0;

/// `command.tsx`의 `text-sm`입니다.
const double _commandFontSize = HoronText.body;

/// `command.tsx`의 `text-xs`입니다. 그룹 제목과 단축키에 씁니다.
const double _commandSmallFontSize = HoronText.caption;

/// `command.tsx`의 `px-2`입니다. 그룹 제목과 항목의 좌우 여백입니다.
const double _commandItemPaddingHorizontal = HoronSpace.s2;

/// `command.tsx`의 `py-1.5`입니다. 항목과 그룹 제목의 위아래 여백입니다.
const double _commandItemPaddingVertical = HoronSpace.s1_5;

/// `command.tsx`의 `p-1`입니다. 그룹의 안쪽 여백입니다.
const double _commandGroupPadding = HoronSpace.s1;

/// `command.tsx`의 `py-6`입니다. 빈 상태의 위아래 여백입니다.
const double _commandEmptyPadding = HoronSpace.s6;

/// `command.tsx`의 `gap-2`입니다. 아이콘·글자·단축키 사이 간격입니다.
const double _commandGap = HoronSpace.s2;

/// `command.tsx`의 `px-3`입니다. 입력 줄의 좌우 여백입니다.
const double _commandInputPaddingHorizontal = HoronSpace.s3;

/// `command.tsx`의 `size-4`입니다. 입력 줄의 돋보기 크기입니다.
const double _commandSearchIconSize = HoronSpace.s4;

/// `command.tsx`의 `h-9`입니다. 입력 줄의 높이입니다.
const double _commandInputRowHeight = HoronSpace.s9;

/// `command.tsx`의 `h-10`입니다. 입력 상자의 높이입니다.
const double _commandInputHeight = HoronSpace.s10;

/// `command.tsx`의 `tracking-widest`입니다. 단축키 글자의 자간입니다.
const double _commandShortcutTracking = 0.1;

/// `command.tsx`의 `opacity-50`입니다. 비활성 항목과 돋보기의 불투명도입니다.
const double _commandMutedOpacity = 0.5;

/// 시트로 열린 명령 목록의 최대 폭입니다. React `CommandDialog`의 `sm:max-w-lg`입니다.
const double _commandSheetMaxWidth = 512.0;

/// 명령 목록의 검색어를 담는 컨트롤러입니다.
///
/// `command.tsx`는 검색 상태를 `cmdk`에 맡기지만, 이 패키지는 같은 일을 Dart로
/// 직접 합니다. 검색어를 이 컨트롤러가 들고, [HoronCommandInput]이 값을 바꾸고,
/// [HoronCommandList]가 그 값으로 자식을 거릅니다.
///
/// ```dart
/// final HoronCommandController controller = HoronCommandController();
/// controller.query = '파일';
/// ```
class HoronCommandController extends ChangeNotifier {
  String _query = '';

  /// 지금 검색어입니다. 앞뒤 공백을 지우고 소문자로 맞춥니다.
  String get query => _query;

  /// 검색어를 바꿉니다. 값이 같으면 아무 일도 하지 않습니다.
  set query(String value) {
    final String next = value.trim().toLowerCase();
    if (next == _query) return;
    _query = next;
    notifyListeners();
  }
}

/// 검색어가 [text]에 맞는지 판단합니다.
///
/// 검색어를 공백으로 나눠 모든 낱말이 [text]에 들어 있으면 맞는다고 봅니다.
/// 대소문자는 구분하지 않습니다. React의 `cmdk`는 항목마다 점수를 매기지만, 이
/// 패키지는 포함 여부만 봅니다. 계획이 요구한 것은 "검색어로 목록이 좁혀지는지"와
/// "결과 0건에서 빈 상태가 보이는지"입니다.
bool horonCommandMatches(String text, String query, {List<String> keywords = const <String>[]}) {
  final String normalized = query.trim().toLowerCase();
  if (normalized.isEmpty) return true;
  final String haystack = <String>[text, ...keywords].join(' ').toLowerCase();
  return normalized.split(RegExp(r'\s+')).every(haystack.contains);
}

/// 명령 목록의 뿌리입니다.
///
/// `command.tsx`의 `Command`입니다. React는 `flex h-full w-full flex-col
/// overflow-hidden rounded-md bg-popover text-popover-foreground`입니다.
///
/// 검색어를 [controller]가 들고, [HoronCommandInput]이 그 값을 바꿉니다.
/// [HoronCommandList]는 그 값을 읽어 항목과 그룹을 거릅니다. 필터는 Dart로 직접
/// 계산합니다. `cmdk`를 흉내 내지 않고, 포함 여부만 봅니다
/// ([horonCommandMatches]).
///
/// ```dart
/// HoronCommand(
///   children: <Widget>[
///     const HoronCommandInput(hintText: '명령을 찾습니다'),
///     HoronCommandList(
///       children: <Widget>[
///         const HoronCommandEmpty(),
///         HoronCommandGroup(
///           label: '파일',
///           children: <Widget>[
///             HoronCommandItem(value: '새 파일', onSelected: () {}),
///           ],
///         ),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronCommand extends StatefulWidget {
  /// 명령 목록 하나를 만듭니다.
  const HoronCommand({super.key, required this.children, this.controller, this.initialQuery = '', this.onQueryChanged});

  /// 목록의 자식들입니다. 보통 [HoronCommandInput]과 [HoronCommandList]입니다.
  final List<Widget> children;

  /// 검색어를 들고 있는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final HoronCommandController? controller;

  /// 처음 검색어입니다.
  final String initialQuery;

  /// 검색어가 바뀔 때 부릅니다.
  final ValueChanged<String>? onQueryChanged;

  @override
  State<HoronCommand> createState() => _HoronCommandState();
}

class _HoronCommandState extends State<HoronCommand> {
  HoronCommandController? _ownedController;

  HoronCommandController get _controller => widget.controller ?? (_ownedController ??= HoronCommandController());

  @override
  void initState() {
    super.initState();
    _controller.query = widget.initialQuery;
  }

  @override
  void didUpdateWidget(HoronCommand oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      _ownedController?.dispose();
      _ownedController = null;
      _controller.query = widget.initialQuery;
    }
  }

  @override
  void dispose() {
    _ownedController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;

    return _HoronCommandScope(
      controller: _controller,
      onQueryChanged: widget.onQueryChanged,
      child: Material(
        type: MaterialType.transparency,
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _commandFontSize,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중
            // 밑줄이 새어 들어오지 않게 명시합니다.
            decoration: TextDecoration.none,
          ),
          child: ClipRRect(
            // `rounded-md bg-popover`
            borderRadius: BorderRadius.circular(HoronRadiusRole.card),
            child: ColoredBox(
              color: scheme.surfaceContainerHigh,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: widget.children,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 명령 목록의 컨트롤러를 자식에게 내려 줍니다.
class _HoronCommandScope extends InheritedNotifier<HoronCommandController> {
  const _HoronCommandScope({
    required HoronCommandController controller,
    required this.onQueryChanged,
    required super.child,
  }) : super(notifier: controller);

  final ValueChanged<String>? onQueryChanged;

  static _HoronCommandScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronCommandScope>();
}

/// 명령 목록의 검색 입력입니다.
///
/// `command.tsx`의 `CommandInput`입니다. React는 `h-9 items-center gap-2 border-b
/// border-border px-3`인 줄 안에 `h-10 w-full rounded-sm bg-transparent py-3
/// text-sm`인 입력을 둡니다. 돋보기는 `size-4 shrink-0 opacity-50`입니다.
///
/// 돋보기를 [icon]으로 갈아 끼울 수 있습니다. 이 패키지는 아이콘 폰트를
/// 번들하지 않으므로(`icon_slot.dart`) 기본값은 같은 모양을 선으로 그립니다.
class HoronCommandInput extends StatefulWidget {
  /// 검색 입력 하나를 만듭니다.
  const HoronCommandInput({super.key, this.hintText, this.icon, this.autofocus = false, this.controller});

  /// 값이 비었을 때 보이는 안내 문구입니다.
  final String? hintText;

  /// 돋보기 대신 쓸 아이콘입니다.
  final Widget? icon;

  /// 화면이 열릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 텍스트를 읽고 쓰는 컨트롤러입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final TextEditingController? controller;

  @override
  State<HoronCommandInput> createState() => _HoronCommandInputState();
}

class _HoronCommandInputState extends State<HoronCommandInput> {
  TextEditingController? _ownedController;

  TextEditingController get _controller => widget.controller ?? (_ownedController ??= TextEditingController());

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleChanged);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // `HoronCommand.initialQuery`는 컨트롤러의 검색어만 세웁니다. 입력 상자가
    // 그 값을 자기 글자로 받지 않으면, 목록은 좁혀졌는데 입력은 비어 보입니다
    // (2026-10-22 캡처에서 확인). 스코프의 검색어를 한 번 옮겨 옵니다.
    final _HoronCommandScope? scope = _HoronCommandScope.maybeOf(context);
    if (scope == null) return;
    final String query = scope.notifier!.query;
    if (query.isNotEmpty && _controller.text.isEmpty && !_seeded) {
      _seeded = true;
      _controller.text = query;
    }
  }

  /// 처음 한 번만 스코프의 검색어를 입력에 옮깁니다.
  bool _seeded = false;

  @override
  void didUpdateWidget(HoronCommandInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _ownedController)?.removeListener(_handleChanged);
      _controller.addListener(_handleChanged);
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_handleChanged);
    _ownedController?.dispose();
    super.dispose();
  }

  void _handleChanged() {
    final _HoronCommandScope? scope = _HoronCommandScope.maybeOf(context);
    if (scope == null) return;
    final String text = _controller.text;
    if (scope.notifier!.query == text.trim().toLowerCase()) return;
    scope.notifier!.query = text;
    scope.onQueryChanged?.call(text);
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _commandFontSize,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: scheme.outline)),
      ),
      child: SizedBox(
        height: _commandInputRowHeight,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(left: _commandInputPaddingHorizontal),
              child: Opacity(
                // `opacity-50`
                opacity: _commandMutedOpacity,
                child: SizedBox.square(
                  dimension: _commandSearchIconSize,
                  child: IconTheme.merge(
                    data: IconThemeData(size: _commandSearchIconSize, color: scheme.onSurfaceVariant),
                    child:
                        widget.icon ?? CustomPaint(painter: _HoronCommandSearchPainter(color: scheme.onSurfaceVariant)),
                  ),
                ),
              ),
            ),
            const SizedBox(width: _commandGap),
            Expanded(
              child: SizedBox(
                height: _commandInputHeight,
                child: TextField(
                  controller: _controller,
                  autofocus: widget.autofocus,
                  style: style,
                  cursorColor: horon.ring,
                  decoration: InputDecoration(
                    filled: false,
                    isDense: true,
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: HoronSpace.s3),
                    hintText: widget.hintText,
                    hintStyle: style.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ),
              ),
            ),
            const SizedBox(width: _commandInputPaddingHorizontal),
          ],
        ),
      ),
    );
  }
}

/// 돋보기 글리프를 그립니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않으므로(`icon_slot.dart`) `lucide`의
/// `search`를 같은 두께의 선으로 옮겨 그립니다.
class _HoronCommandSearchPainter extends CustomPainter {
  const _HoronCommandSearchPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint stroke = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 2 / 24
      ..strokeCap = StrokeCap.round;

    final Offset center = Offset(size.width * 11 / 24, size.height * 11 / 24);
    canvas.drawCircle(center, size.shortestSide * 8 / 24, stroke);
    canvas.drawLine(
      Offset(size.width * 16.65 / 24, size.height * 16.65 / 24),
      Offset(size.width * 21 / 24, size.height * 21 / 24),
      stroke,
    );
  }

  @override
  bool shouldRepaint(_HoronCommandSearchPainter oldDelegate) => color != oldDelegate.color;
}

/// 명령 목록의 스크롤 영역입니다.
///
/// `command.tsx`의 `CommandList`입니다. React는 `max-h-[300px] scroll-py-1
/// overflow-x-hidden overflow-y-auto`입니다.
///
/// 걸러 내는 일이 여기서 일어납니다. 검색어에 맞지 않는 [HoronCommandItem]은
/// 빠지고, 남는 항목이 없는 [HoronCommandGroup]은 제목까지 빠집니다. 남는 항목이
/// 0개이면 [HoronCommandEmpty]만 그립니다. 그래서 빈 상태의 판단이 항목 수와
/// 어긋나지 않습니다.
class HoronCommandList extends StatelessWidget {
  /// 목록 하나를 만듭니다.
  const HoronCommandList({super.key, required this.children, this.maxHeight = _commandListMaxHeight});

  /// 목록의 자식들입니다.
  final List<Widget> children;

  /// 목록이 넘지 않을 높이입니다. 기본값은 `max-h-[300px]`입니다.
  final double maxHeight;

  @override
  Widget build(BuildContext context) {
    final _HoronCommandScope? scope = _HoronCommandScope.maybeOf(context);
    final String query = scope?.notifier?.query ?? '';

    final List<Widget> emptyWidgets = <Widget>[
      for (final Widget child in children)
        if (child is HoronCommandEmpty) child,
    ];
    final List<Widget> content = <Widget>[
      for (final Widget child in children)
        if (child is! HoronCommandEmpty) child,
    ];

    final _HoronCommandFilterResult result = _filterCommandChildren(content, query);

    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: maxHeight),
      child: ScrollConfiguration(
        // 스크롤바는 데스크톱에서만 뜨고, 목록 높이가 300이라 손잡이가 목록을
        // 가립니다. 웹의 `overflow-y-auto`처럼 손잡이 없이 스크롤합니다.
        behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: result.itemCount == 0 ? emptyWidgets : result.visible,
          ),
        ),
      ),
    );
  }
}

/// 걸러 낸 자식들과, 남은 항목 수입니다.
class _HoronCommandFilterResult {
  const _HoronCommandFilterResult(this.visible, this.itemCount);

  final List<Widget> visible;
  final int itemCount;
}

/// 검색어로 자식 목록을 거릅니다.
///
/// 항목은 [HoronCommandItem]이 들고 있는 값으로 판단하고, 묶음은 자기 자식을 같은
/// 규칙으로 거른 뒤 남는 것이 없으면 통째로 빠집니다. 구분선은 양옆에 그릴 것이
/// 있을 때만 남기므로, 걸러 낸 뒤 목록 끝에 선이 매달리지 않습니다.
_HoronCommandFilterResult _filterCommandChildren(List<Widget> children, String query) {
  final List<Widget?> slots = <Widget?>[];
  int itemCount = 0;

  for (final Widget child in children) {
    if (child is HoronCommandItem) {
      if (!child.matchesQuery(query)) continue;
      itemCount++;
      slots.add(child);
      continue;
    }
    if (child is HoronCommandGroup) {
      final _HoronCommandFilterResult inner = _filterCommandChildren(child.children, query);
      if (inner.itemCount == 0) continue;
      itemCount += inner.itemCount;
      slots.add(child.rebuildWith(inner.visible));
      continue;
    }
    if (child is HoronCommandSeparator) {
      slots.add(child);
      continue;
    }
    // 모르는 위젯은 그대로 그립니다. 항목 수에는 세지 않습니다.
    slots.add(child);
  }

  // 구분선이 맨 앞·맨 뒤·연속으로 남지 않게 정리합니다.
  final List<Widget> visible = <Widget>[];
  for (int index = 0; index < slots.length; index++) {
    final Widget? slot = slots[index];
    if (slot == null) continue;
    if (slot is HoronCommandSeparator) {
      final bool hasBefore = visible.isNotEmpty && visible.last is! HoronCommandSeparator;
      final bool hasAfter = slots.skip(index + 1).any((Widget? next) => next != null && next is! HoronCommandSeparator);
      if (!hasBefore || !hasAfter) continue;
    }
    visible.add(slot);
  }

  return _HoronCommandFilterResult(visible, itemCount);
}

/// 검색 결과가 없을 때의 안내입니다.
///
/// `command.tsx`의 `CommandEmpty`입니다. React는 `py-6 text-center text-sm
/// text-muted-foreground`입니다. [HoronCommandList]가 맞는 항목이 0개일 때만
/// 그리므로, 이 위젯은 스스로를 감추지 않습니다.
class HoronCommandEmpty extends StatelessWidget {
  /// 빈 상태 하나를 만듭니다.
  const HoronCommandEmpty({super.key, this.child});

  /// 안내 내용입니다. 없으면 테마의 `noResults` 문구를 씁니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: _commandEmptyPadding),
      child: Center(
        child: DefaultTextStyle.merge(
          style: TextStyle(
            fontFamily: HoronFont.body,
            fontFamilyFallback: HoronFont.fontFamilyFallback,
            fontSize: _commandFontSize,
            height: HoronLineHeight.normal,
            color: scheme.onSurfaceVariant,
            decoration: TextDecoration.none,
          ),
          child: child ?? Text(HoronTheme.of(context).strings.noResults, textAlign: TextAlign.center),
        ),
      ),
    );
  }
}

/// 명령 목록의 한 묶음입니다.
///
/// `command.tsx`의 `CommandGroup`입니다. React는 `overflow-hidden p-1
/// text-foreground`이고 제목은 `px-2 py-1.5 text-xs font-medium
/// text-muted-foreground`입니다.
///
/// 안의 항목이 하나도 맞지 않으면 제목까지 함께 사라집니다. 판단은
/// [HoronCommandList]가 하며, 걸러 낸 자식으로 이 위젯을 다시 만듭니다.
class HoronCommandGroup extends StatelessWidget {
  /// 묶음 하나를 만듭니다.
  const HoronCommandGroup({super.key, required this.children, this.label});

  /// 묶음의 항목들입니다.
  final List<Widget> children;

  /// 묶음 위에 붙는 제목입니다.
  final String? label;

  /// 걸러 낸 자식으로 같은 묶음을 다시 만듭니다.
  HoronCommandGroup rebuildWith(List<Widget> visible) => HoronCommandGroup(key: key, label: label, children: visible);

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(_commandGroupPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (label != null)
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: _commandItemPaddingHorizontal,
                vertical: _commandItemPaddingVertical,
              ),
              child: Text(
                label!,
                style: TextStyle(
                  fontFamily: HoronFont.body,
                  fontFamilyFallback: HoronFont.fontFamilyFallback,
                  fontSize: _commandSmallFontSize,
                  fontWeight: HoronFontWeight.medium,
                  height: HoronLineHeight.snug,
                  color: scheme.onSurfaceVariant,
                  decoration: TextDecoration.none,
                ),
              ),
            ),
          ...children,
        ],
      ),
    );
  }
}

/// 명령 목록의 한 항목입니다.
///
/// `command.tsx`의 `CommandItem`입니다. React의 클래스는 `relative flex
/// cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none
/// data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground
/// data-[disabled=true]:opacity-50`입니다.
class HoronCommandItem extends StatefulWidget {
  /// 항목 하나를 만듭니다.
  const HoronCommandItem({
    super.key,
    required this.value,
    this.child,
    this.keywords = const <String>[],
    this.icon,
    this.trailing,
    this.onSelected,
    this.selected = false,
    this.enabled = true,
  });

  /// 항목의 검색 기준 글자입니다.
  ///
  /// 화면에 그리는 글자와 같게 두는 것이 보통입니다. 다른 글자를 그리고 싶으면
  /// [child]를 넘기고 이 값은 검색에만 씁니다.
  final String value;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 검색에 더할 낱말입니다. 영문 이름이나 동의어를 넣습니다.
  final List<String> keywords;

  /// 글자 앞에 붙는 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 오른쪽 끝에 붙는 슬롯입니다. 보통 [HoronCommandShortcut]입니다.
  final Widget? trailing;

  /// 항목을 골랐을 때 부릅니다.
  final VoidCallback? onSelected;

  /// 지금 강조되어 있는지입니다. React의 `data-[selected=true]`에 대응합니다.
  final bool selected;

  /// 꺼져 있으면 골라도 콜백을 부르지 않고 흐리게 그립니다.
  final bool enabled;

  /// [query]가 이 항목에 맞는지입니다.
  bool matchesQuery(String query) => horonCommandMatches(value, query, keywords: keywords);

  @override
  State<HoronCommandItem> createState() => _HoronCommandItemState();
}

class _HoronCommandItemState extends State<HoronCommandItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool highlighted = widget.selected || _hovered;

    final TextStyle labelStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _commandFontSize,
      height: HoronLineHeight.normal,
      color: highlighted ? scheme.onSecondaryContainer : scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final Widget content = DecoratedBox(
      decoration: BoxDecoration(
        // `data-[selected=true]:bg-accent`
        color: highlighted ? scheme.secondaryContainer : Colors.transparent,
        borderRadius: BorderRadius.circular(HoronRadius.sm),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: _commandItemPaddingHorizontal,
          vertical: _commandItemPaddingVertical,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            if (widget.icon != null) ...<Widget>[
              IconTheme.merge(
                data: IconThemeData(size: HoronSpace.s4, color: scheme.onSurfaceVariant),
                child: widget.icon!,
              ),
              const SizedBox(width: _commandGap),
            ],
            Expanded(
              child: DefaultTextStyle.merge(
                style: labelStyle,
                child: widget.child ?? Text(widget.value, maxLines: 1, overflow: TextOverflow.ellipsis),
              ),
            ),
            if (widget.trailing != null) ...<Widget>[const SizedBox(width: _commandGap), widget.trailing!],
          ],
        ),
      ),
    );

    return Opacity(
      // `data-[disabled=true]:opacity-50`
      opacity: widget.enabled ? 1 : _commandMutedOpacity,
      child: Semantics(
        button: true,
        enabled: widget.enabled,
        label: widget.value,
        child: MouseRegion(
          onEnter: (PointerEnterEvent event) => setState(() => _hovered = true),
          onExit: (PointerExitEvent event) => setState(() => _hovered = false),
          cursor: widget.enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.enabled ? widget.onSelected : null,
            child: content,
          ),
        ),
      ),
    );
  }
}

/// 오른쪽 끝의 단축키 표시입니다.
///
/// `command.tsx`의 `CommandShortcut`입니다. React는 `ml-auto text-xs
/// tracking-widest text-muted-foreground`라 오른쪽으로 붙고 자간이 넓습니다.
/// [HoronCommandItem.trailing]에 넣어 씁니다.
class HoronCommandShortcut extends StatelessWidget {
  /// 단축키 표시 하나를 만듭니다.
  const HoronCommandShortcut({super.key, this.label, this.child})
    : assert(label != null || child != null, 'HoronCommandShortcut needs a label or a child.');

  /// 단축키 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.mono,
      // `⌘` 같은 기호는 고정폭 패밀리에 없습니다. 대체 패밀리를 두지 않으면
      // 빈 네모로 그려집니다(2026-10-22 캡처에서 확인).
      fontFamilyFallback: const <String>[HoronFont.latin, HoronFont.body],
      fontSize: _commandSmallFontSize,
      fontWeight: HoronFontWeight.regular,
      letterSpacing: _commandShortcutTracking,
      height: HoronLineHeight.snug,
      color: Theme.of(context).colorScheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );
    if (label != null) {
      return Text(label!, maxLines: 1, softWrap: false, style: style);
    }
    return DefaultTextStyle(style: style, child: child!);
  }
}

/// 명령 목록의 구분선입니다.
///
/// `command.tsx`의 `CommandSeparator`입니다. React는 `-mx-1 h-px bg-border`라
/// 그룹의 안쪽 여백을 넘어 양옆으로 4씩 나갑니다.
class HoronCommandSeparator extends StatelessWidget {
  /// 구분선 하나를 만듭니다.
  const HoronCommandSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: _commandGroupPadding),
      child: SizedBox(height: 1, child: ColoredBox(color: Theme.of(context).colorScheme.outline)),
    );
  }
}

/// 명령 목록을 시트로 엽니다.
///
/// `command.tsx`의 `CommandDialog` 자리입니다. React는 `Dialog` 안에 명령 목록을
/// 넣지만, 이 패키지는 계획이 정한 대로 화면 아래에 붙는 시트로 엽니다. 라우트는
/// [showHoronModal]이 만들므로 스크림 색과 전환 시간이 다른 모달과 같습니다.
///
/// [shortcut]을 넘기면 그 키 조합으로도 열립니다. 기본값은 없습니다. 하드웨어
/// 키보드가 있는 화면에서 호스트가 ⌘K 같은 조합을 정해 넘깁니다.
///
/// ```dart
/// HoronCommandDialog(
///   trigger: const HoronButton(child: Text('명령')),
///   builder: (BuildContext context) => HoronCommand(
///     children: <Widget>[
///       const HoronCommandInput(hintText: '명령을 찾습니다'),
///       HoronCommandList(children: <Widget>[...]),
///     ],
///   ),
/// );
/// ```
class HoronCommandDialog extends StatefulWidget {
  /// 시트 하나를 만듭니다.
  const HoronCommandDialog({
    super.key,
    required this.trigger,
    required this.builder,
    this.shortcut,
    this.semanticLabel,
    this.onOpenChanged,
  });

  /// 시트를 여는 트리거입니다.
  final Widget trigger;

  /// 시트 안에 그릴 명령 목록입니다.
  final WidgetBuilder builder;

  /// 시트를 여는 키 조합입니다. 없으면 키로 열지 않습니다.
  final ShortcutActivator? shortcut;

  /// 트리거의 보조 기술 이름입니다.
  final String? semanticLabel;

  /// 열림 상태가 바뀔 때 부릅니다.
  final ValueChanged<bool>? onOpenChanged;

  @override
  State<HoronCommandDialog> createState() => _HoronCommandDialogState();
}

class _HoronCommandDialogState extends State<HoronCommandDialog> {
  bool _open = false;

  Future<void> _openSheet() async {
    if (_open) return;
    _setOpen(true);
    await showHoronModal<void>(
      context,
      builder: (BuildContext context) => Align(
        alignment: Alignment.bottomCenter,
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.all(HoronSpace.s3),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: _commandSheetMaxWidth),
              child: widget.builder(context),
            ),
          ),
        ),
      ),
    );
    if (mounted) _setOpen(false);
  }

  void _setOpen(bool open) {
    if (_open == open) return;
    setState(() => _open = open);
    widget.onOpenChanged?.call(open);
  }

  @override
  Widget build(BuildContext context) {
    final Widget body = Semantics(
      button: true,
      label: widget.semanticLabel,
      child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: _openSheet, child: widget.trigger),
    );

    final ShortcutActivator? shortcut = widget.shortcut;
    if (shortcut == null) return body;

    return CallbackShortcuts(
      bindings: <ShortcutActivator, VoidCallback>{shortcut: _openSheet},
      child: Focus(autofocus: true, child: body),
    );
  }
}
