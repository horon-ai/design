import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../overlay/horon_overlay.dart';
import 'dropdown_menu.dart';

/// 길게 누르거나 보조 버튼으로 눌렀을 때 그 자리에 열리는 메뉴입니다.
///
/// `context-menu.tsx`를 옮긴 것입니다. React는 Base UI의 `ContextMenu.Root`가
/// 트리거 위의 포인터 자리를 기준으로 팝업을 놓습니다. 여기서도 메뉴는 트리거의
/// 사각형이 아니라 **누른 지점**에 붙습니다. 그래서 트리거 위에 0 크기 상자를 그
/// 지점에 세우고, 그 상자를 [HoronOverlay]의 기준으로 씁니다. 배치 규칙은 공유
/// 유틸이 그대로 맡습니다.
///
/// 여는 방법은 두 가지입니다.
///
/// - **길게 누르기**: [HapticFeedback.mediumImpact]를 먼저 울리고 연다. 햅틱을
///   건너뛰는 경로는 없습니다.
/// - **보조 클릭**(오른쪽 버튼, 두 손가락 탭): 연다. 포인터 입력에는 진동이 어울리지
///   않으므로 햅틱을 울리지 않습니다.
///
/// ```dart
/// HoronContextMenu(
///   trigger: const Text('길게 눌러 보세요'),
///   children: <Widget>[
///     HoronContextMenuItem(label: '복사', onSelected: copy),
///     HoronContextMenuSeparator(),
///     HoronContextMenuItem(label: '삭제', onSelected: remove),
///   ],
/// );
/// ```
class HoronContextMenu extends StatefulWidget {
  /// 컨텍스트 메뉴를 만듭니다.
  const HoronContextMenu({
    super.key,
    required this.trigger,
    required this.children,
    this.enabled = true,
    this.semanticLabel,
    this.onOpenChanged,
  });

  /// 오른쪽 클릭·길게 누르기를 받는 영역입니다.
  final Widget trigger;

  /// 메뉴에 담을 항목입니다.
  final List<Widget> children;

  /// 열 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 메뉴 이름입니다.
  final String? semanticLabel;

  /// 열림 상태가 바뀔 때 부릅니다.
  final ValueChanged<bool>? onOpenChanged;

  @override
  State<HoronContextMenu> createState() => _HoronContextMenuState();
}

class _HoronContextMenuState extends State<HoronContextMenu> {
  final HoronOverlayController _controller = HoronOverlayController();
  final Object _tapGroup = Object();
  final FocusNode _panelFocus = FocusNode(debugLabel: 'horon-context-menu');

  /// 마지막으로 누른 지점입니다. 트리거 영역의 왼쪽 위가 원점입니다.
  Offset _point = Offset.zero;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onOpenChanged);
  }

  @override
  void dispose() {
    _controller.removeListener(_onOpenChanged);
    _controller.dispose();
    _panelFocus.dispose();
    super.dispose();
  }

  void _onOpenChanged() => widget.onOpenChanged?.call(_controller.isOpen);

  void _close() {
    if (!_controller.isOpen) return;
    _controller.hide();
    _panelFocus.unfocus();
  }

  /// 누른 지점을 먼저 기록하고, 그 지점이 배치된 다음 프레임에 연다.
  ///
  /// [HoronOverlay]는 트리거 상자의 사각형을 재서 패널을 놓습니다. 지점을 바꾸는
  /// 같은 프레임에 바로 열면 아직 옛 지점이 재어져 메뉴가 엉뚱한 자리에 뜹니다.
  /// 그래서 [setState]로 프레임을 예약하고, 그 프레임이 끝난 뒤에 연다. 고정
  /// 지연이 아니라 프레임 경계에 맞추는 것이라 테스트가 `pump`만으로 결정적으로
  /// 재현합니다.
  void _openAt(Offset point) {
    setState(() => _point = point);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !widget.enabled) return;
      _controller.show();
    });
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
      _close();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (BuildContext context, Widget? child) => HoronPopupMenuScope(
        groupId: _tapGroup,
        open: _controller.isOpen,
        close: _close,
        child: TapRegion(
          groupId: _tapGroup,
          onTapOutside: (_) => _close(),
          child: Stack(
            clipBehavior: Clip.none,
            children: <Widget>[
              Listener(
                // 오른쪽 버튼과 길게 누르기가 같은 지점을 쓰도록 포인터가 닿는 즉시
                // 기록합니다. 이 기록이 없으면 보조 클릭은 제스처가 확정된 뒤에야
                // 지점을 알게 되어 한 프레임 늦습니다.
                onPointerDown: (PointerDownEvent event) => _point = event.localPosition,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onLongPressStart: widget.enabled
                      ? (LongPressStartDetails details) {
                          unawaited(HapticFeedback.mediumImpact());
                          _openAt(details.localPosition);
                        }
                      : null,
                  onSecondaryTapDown: widget.enabled
                      ? (TapDownDetails details) => _openAt(details.localPosition)
                      : null,
                  child: widget.trigger,
                ),
              ),
              // 기준 상자입니다. 0 크기라 눈에 보이지 않고, 누른 지점에만 놓입니다.
              Positioned(
                left: _point.dx,
                top: _point.dy,
                child: HoronOverlay(
                  controller: _controller,
                  position: const HoronOverlayPosition(),
                  trigger: const SizedBox.shrink(),
                  panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => TapRegion(
                    groupId: _tapGroup,
                    child: HoronPopupMenuScope(
                      groupId: _tapGroup,
                      open: true,
                      close: _close,
                      level: 1,
                      child: Focus(
                        focusNode: _panelFocus,
                        autofocus: true,
                        onKeyEvent: _onKey,
                        child: HoronContextMenuContent(
                          maxHeight: placement.maxHeight,
                          semanticLabel: widget.semanticLabel,
                          children: widget.children,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// `context-menu.tsx`의 `ContextMenuTrigger`입니다.
///
/// React의 클래스는 `select-none` 하나뿐입니다. 여기서도 트리거는 자기 모양을 정하지
/// 않고 감싸는 위젯의 모양을 그대로 씁니다. 글자 선택만 막습니다.
class HoronContextMenuTrigger extends StatelessWidget {
  /// 트리거를 만듭니다.
  const HoronContextMenuTrigger({super.key, required this.child});

  /// 트리거 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) => SelectionContainer.disabled(child: child);
}

/// `context-menu.tsx`의 `ContextMenuContent`입니다.
///
/// 표면·여백·스크롤은 `dropdown_menu`의 [HoronDropdownMenuContent]와 같습니다.
/// React도 두 파일이 같은 클래스를 반복하므로, 한 위젯을 두 이름으로 엽니다.
class HoronContextMenuContent extends StatelessWidget {
  /// 패널 내용을 만듭니다.
  const HoronContextMenuContent({
    super.key,
    required this.children,
    this.minWidth = horonPopupMenuMinWidth,
    this.maxHeight,
    this.semanticLabel,
  });

  /// 패널 안에 세로로 쌓을 항목입니다.
  final List<Widget> children;

  /// 패널의 최소 폭입니다.
  final double minWidth;

  /// 패널이 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  /// 스크린리더가 읽을 메뉴 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    explicitChildNodes: true,
    label: semanticLabel,
    child: HoronDropdownMenuContent(minWidth: minWidth, maxHeight: maxHeight, children: children),
  );
}

/// `context-menu.tsx`의 `ContextMenuItem`입니다.
///
/// 모양과 동작은 [HoronDropdownMenuItem]과 같습니다. React도 두 파일이 같은
/// 클래스를 반복하므로, 한 위젯을 두 이름으로 엽니다.
class HoronContextMenuItem extends StatelessWidget {
  /// 항목을 만듭니다.
  const HoronContextMenuItem({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.trailing,
    this.onSelected,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 항목 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다.
  final Widget? icon;

  /// 오른쪽 끝에 붙는 내용입니다.
  final Widget? trailing;

  /// 항목을 골랐을 때 부릅니다.
  final VoidCallback? onSelected;

  /// 고를 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) => HoronDropdownMenuItem(
    label: label,
    icon: icon,
    trailing: trailing,
    onSelected: onSelected,
    enabled: enabled,
    semanticLabel: semanticLabel,
    child: child,
  );
}

/// `context-menu.tsx`의 `ContextMenuSeparator`입니다.
class HoronContextMenuSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronContextMenuSeparator({super.key});

  @override
  Widget build(BuildContext context) => const HoronDropdownMenuSeparator();
}

/// `context-menu.tsx`의 `ContextMenuLabel`입니다.
class HoronContextMenuLabel extends StatelessWidget {
  /// 라벨을 만듭니다.
  const HoronContextMenuLabel({super.key, required this.label});

  /// 라벨 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) => HoronDropdownMenuLabel(label: label);
}
