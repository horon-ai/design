// `integration-row`의 Flutter 대응입니다.
//
// React는 두꺼운 유리 표면 위에 40px 타일과 상태 컨트롤을 얹습니다. 다시 연결이 필요한
// 상태만 위험 테두리를 덧그립니다. 폭이 `breakpoints.sm`보다 좁으면 상태 컨트롤이
// 글자 아래로 내려갑니다.

import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 통합의 연결 상태입니다. React `IntegrationStatus`와 값이 같습니다.
enum HoronIntegrationStatus {
  /// 연결되어 있습니다. 점이 있는 알약을 그립니다.
  connected,

  /// 다시 연결해야 합니다. 위험 테두리와 Reconnect 버튼을 그립니다.
  reconnect,

  /// 연결되지 않았습니다. Plug 아이콘이 있는 Connect 버튼을 그립니다.
  notConnected,
}

/// Figma `Integration row`입니다.
///
/// 두꺼운 유리 위에 40px 타일과 이름·설명, 오른쪽 상태 컨트롤을 놓습니다. 타일 색은
/// 상태를 따릅니다.
class HoronIntegrationRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronIntegrationRow({
    super.key,
    required this.icon,
    required this.name,
    required this.status,
    this.detail,
    this.onAction,
    this.connectedLabel = 'Connected',
    this.reconnectLabel = 'Reconnect',
    this.connectLabel = 'Connect',
  });

  /// 타일 안의 20px 아이콘입니다.
  final Widget icon;

  /// 14/20 이름입니다. 한 줄로 잘립니다.
  final String name;

  /// 연결 상태입니다.
  final HoronIntegrationStatus status;

  /// 계정·스코프 또는 다시 연결해야 하는 이유입니다.
  final String? detail;

  /// Reconnect·Connect 버튼을 누를 때 부릅니다.
  final VoidCallback? onAction;

  /// 연결됨 알약의 글자입니다.
  final String connectedLabel;

  /// 다시 연결 버튼의 글자입니다.
  final String reconnectLabel;

  /// 연결 버튼의 글자입니다.
  final String connectLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final Widget tile = _tile(theme);
    final Widget text = _textColumn(theme);
    final Widget control = _control(theme);

    final Widget body = Padding(
      padding: EdgeInsets.fromLTRB(
        theme.space.s3, // pl-3
        theme.space.s3, // py-3
        theme.space.s3_5, // pr-3.5
        theme.space.s3,
      ),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final bool wide = !constraints.maxWidth.isFinite || constraints.maxWidth >= theme.breakpoints.sm;
          if (wide) {
            return Row(
              spacing: theme.space.s3, // gap-3
              children: <Widget>[
                tile,
                Expanded(child: text),
                control,
              ],
            );
          }
          return Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: theme.space.s3,
            children: <Widget>[
              Row(
                spacing: theme.space.s3,
                children: <Widget>[
                  tile,
                  Expanded(child: text),
                ],
              ),
              Align(alignment: Alignment.centerRight, child: control),
            ],
          );
        },
      ),
    );

    final Widget glass = HoronLiquidGlass(
      tier: HoronGlassTier.thick,
      borderRadius: BorderRadius.circular(theme.radius.xl2), // rounded-[16px]
      child: body,
    );
    if (status != HoronIntegrationStatus.reconnect) return glass;
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(theme.radius.xl2),
        border: Border.all(color: theme.colors.borderDanger), // border-border-danger
      ),
      child: glass,
    );
  }

  Widget _tile(HoronThemeData theme) {
    final Color background = switch (status) {
      HoronIntegrationStatus.connected => HoronPalette.sky500, // bg-sky-500
      HoronIntegrationStatus.reconnect => HoronPalette.sky700, // bg-sky-700
      HoronIntegrationStatus.notConnected => theme.colors.interactivePrimary, // bg-interactive-primary
    };
    return SizedBox(
      width: theme.space.step(10), // size-10 = 40
      height: theme.space.step(10),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(theme.space.s2_5), // rounded-[10px]
        ),
        child: IconTheme.merge(
          // [&>svg]:size-5, text-text-inverse
          data: IconThemeData(size: theme.space.step(5), color: theme.colors.textInverse),
          child: Center(child: icon),
        ),
      ),
    );
  }

  Widget _textColumn(HoronThemeData theme) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s0_5, // gap-0.5
      children: <Widget>[
        Text(
          name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis, // truncate
          style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
        ),
        if (detail != null)
          Text(
            detail!,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            // text-caption, 다시 연결이면 위험 색
            style: theme.text.caption.copyWith(
              color: status == HoronIntegrationStatus.reconnect ? theme.colors.textDanger : theme.colors.textSecondary,
            ),
          ),
      ],
    );
  }

  Widget _control(HoronThemeData theme) {
    if (status == HoronIntegrationStatus.connected) {
      return Container(
        height: theme.space.step(7.5), // h-7.5 = 30
        padding: EdgeInsets.symmetric(horizontal: theme.space.s3), // px-3
        decoration: BoxDecoration(
          color: theme.colors.accentSky500_18, // bg-accent-sky-500-18
          borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: theme.space.s1_5, // gap-1.5
          children: <Widget>[
            SizedBox(
              width: theme.space.s1_5, // size-1.5 = 6
              height: theme.space.s1_5,
              child: const DecoratedBox(
                decoration: BoxDecoration(color: HoronPalette.sky500, shape: BoxShape.circle),
              ),
            ),
            Text(connectedLabel, maxLines: 1, style: theme.text.labelSm.copyWith(color: theme.colors.textPrimary)),
          ],
        ),
      );
    }

    final bool reconnect = status == HoronIntegrationStatus.reconnect;
    return _ActionPill(
      label: reconnect ? reconnectLabel : connectLabel,
      background: reconnect ? theme.colors.accentRed500_14 : theme.colors.interactivePrimary,
      foreground: reconnect ? theme.colors.textDanger : theme.colors.textInverse,
      icon: reconnect ? null : const Icon(Icons.power),
      onPressed: onAction,
    );
  }
}

/// 30px 높이의 상태 버튼입니다. `motion-press`로 눌린 느낌을 냅니다.
class _ActionPill extends StatefulWidget {
  const _ActionPill({
    required this.label,
    required this.background,
    required this.foreground,
    this.icon,
    this.onPressed,
  });

  final String label;
  final Color background;
  final Color foreground;
  final Widget? icon;
  final VoidCallback? onPressed;

  @override
  State<_ActionPill> createState() => _ActionPillState();
}

class _ActionPillState extends State<_ActionPill> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool reduce = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      enabled: widget.onPressed != null,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: widget.onPressed == null ? null : (TapDownDetails details) => setState(() => _pressed = true),
        onTapUp: widget.onPressed == null ? null : (TapUpDetails details) => setState(() => _pressed = false),
        onTapCancel: widget.onPressed == null ? null : () => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: AnimatedScale(
          scale: _pressed && !reduce ? HoronMotion.pressScale : 1, // motion-press
          duration: reduce ? Duration.zero : HoronMotion.pressDuration,
          curve: HoronMotion.pressCurve,
          child: Container(
            height: theme.space.step(7.5), // h-7.5 = 30
            padding: EdgeInsets.symmetric(horizontal: theme.space.s3), // px-3
            decoration: BoxDecoration(
              color: widget.background,
              borderRadius: BorderRadius.circular(theme.radius.full), // rounded-full
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: theme.space.s1_5, // gap-1.5
              children: <Widget>[
                if (widget.icon != null)
                  IconTheme.merge(
                    data: IconThemeData(
                      size: theme.space.s3_5, // Plug size-3.5 = 14
                      color: widget.foreground,
                    ),
                    child: widget.icon!,
                  ),
                Text(widget.label, maxLines: 1, style: theme.text.labelSm.copyWith(color: widget.foreground)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
