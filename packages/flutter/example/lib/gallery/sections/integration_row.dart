import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `integration_row` 갤러리 섹션입니다.
///
/// 세 상태를 나란히 놓습니다. 연결됨은 점이 있는 알약, 다시 연결은 위험 테두리와
/// Reconnect 버튼, 연결 안 됨은 Plug 아이콘이 있는 Connect 버튼입니다. 마지막 칸은
/// 폭이 좁을 때 컨트롤이 글자 아래로 내려가는 모습입니다.
class HoronIntegrationRowGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronIntegrationRowGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double available = constraints.maxWidth.isFinite
              ? constraints.maxWidth
              : 640;
          final double wide = math.min(available, 640);
          final double narrow = math.min(available, 360);
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              _Cell(
                label: 'connected — 점이 있는 알약',
                width: wide,
                child: const HoronIntegrationRow(
                  icon: Icon(Icons.cloud_outlined),
                  name: 'Google Drive',
                  detail: 'alpox@gmail.com · files.read',
                  status: HoronIntegrationStatus.connected,
                ),
              ),
              _Cell(
                label: 'reconnect — 위험 테두리와 Reconnect',
                width: wide,
                child: HoronIntegrationRow(
                  icon: Icon(Icons.mail_outline),
                  name: 'Gmail',
                  detail: '권한이 만료되었습니다. 다시 연결해 주세요',
                  status: HoronIntegrationStatus.reconnect,
                  onAction: () {},
                ),
              ),
              _Cell(
                label: 'not-connected — Plug 아이콘이 있는 Connect',
                width: wide,
                child: HoronIntegrationRow(
                  icon: Icon(Icons.calendar_today_outlined),
                  name: 'Google Calendar',
                  detail: '아직 연결하지 않았습니다',
                  status: HoronIntegrationStatus.notConnected,
                  onAction: () {},
                ),
              ),
              _Cell(
                label: '좁은 폭 — 컨트롤이 글자 아래로',
                width: narrow,
                child: HoronIntegrationRow(
                  icon: Icon(Icons.chat_bubble_outline),
                  name: 'Slack',
                  detail: '워크스페이스 하나가 만료되었습니다',
                  status: HoronIntegrationStatus.reconnect,
                  onAction: () {},
                ),
              ),
            ],
          );
        },
      ),
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
