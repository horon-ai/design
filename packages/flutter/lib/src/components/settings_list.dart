import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'switch.dart';

/// `settings-list.tsx`의 `rounded-2xl`입니다.
const double _listRadius = 16;

/// `settings-list.tsx`의 `px-5`입니다.
const double _listPaddingX = 20;

/// `settings-list.tsx`의 `py-4`입니다.
const double _rowPaddingY = 16;

/// `settings-list.tsx`의 `py-[13px]`입니다. 아이콘이 있을 때의 세로 여백입니다.
const double _rowPaddingWithLeadingY = 13;

/// `settings-list.tsx`의 `gap-4`입니다.
const double _rowGap = 16;

/// `settings-list.tsx`의 `gap-3`입니다. 아이콘이 있을 때의 간격입니다.
const double _rowGapWithLeading = 12;

/// `settings-list.tsx`의 `rounded-[9px]`입니다. 행 아이콘 타일의 반경입니다.
const double _iconTileRadius = 9;

/// `settings-list.tsx`의 `rounded-[6px]`입니다. 키캡의 반경입니다.
const double _keycapRadius = 6;

/// Paper `Settings list`(1VD8-0): 16px 라운드의 두꺼운 유리 카드에 구분선이 있는 행을 담습니다.
class HoronSettingsList extends StatelessWidget {
  /// 목록을 만듭니다.
  const HoronSettingsList({super.key, required this.children});

  /// 행들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final BorderRadius radius = BorderRadius.circular(_listRadius);
    return ClipRRect(
      borderRadius: radius,
      child: Stack(
        children: <Widget>[
          Positioned.fill(
            child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: const SizedBox.expand()),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: _listPaddingX),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: children,
            ),
          ),
        ],
      ),
    );
  }
}

/// 설정 한 행입니다. 왼쪽에 제목·부제, 오른쪽에 컨트롤을 놓습니다.
///
/// React는 `last:border-b-0`으로 마지막 행의 구분선을 지웁니다. Flutter는 CSS의
/// 가상 클래스를 알 수 없으므로 [last]로 같은 자리를 표시합니다.
class HoronSettingsRow extends StatelessWidget {
  /// 행을 만듭니다.
  const HoronSettingsRow({
    super.key,
    required this.title,
    this.description,
    this.leading,
    this.control,
    this.last = false,
  });

  /// 제목입니다.
  final String title;

  /// 부제입니다.
  final String? description;

  /// 제목 앞 슬롯입니다. 보통 [HoronSettingsRowIcon]입니다.
  final Widget? leading;

  /// 오른쪽 컨트롤 슬롯입니다.
  final Widget? control;

  /// 마지막 행이면 구분선을 그리지 않습니다.
  final bool last;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool hasLeading = leading != null;

    return DecoratedBox(
      decoration: BoxDecoration(
        border: last ? null : Border(bottom: BorderSide(color: theme.colors.borderDefault)),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: hasLeading ? _rowPaddingWithLeadingY : _rowPaddingY),
        child: Row(
          children: <Widget>[
            if (hasLeading) ...<Widget>[leading!, const SizedBox(width: _rowGapWithLeading)],
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(title, style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary)),
                  if (description != null) ...<Widget>[
                    const SizedBox(height: 2),
                    Text(
                      description!,
                      style: theme.text.caption.copyWith(
                        fontSize: 13,
                        height: 18 / 13,
                        color: theme.colors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (control != null) ...<Widget>[const SizedBox(width: _rowGap), control!],
          ],
        ),
      ),
    );
  }
}

/// 설정 행의 아이콘 타일입니다. 32px, 9px 반경, 옅은 표면에 16px 글리프입니다.
class HoronSettingsRowIcon extends StatelessWidget {
  /// 타일을 만듭니다.
  const HoronSettingsRowIcon({super.key, required this.icon});

  /// 16px로 그릴 아이콘입니다.
  final Widget icon;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Container(
      width: 32,
      height: 32,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(_iconTileRadius)),
      child: IconTheme.merge(
        data: IconThemeData(size: 16, color: theme.colors.textPrimary),
        child: icon,
      ),
    );
  }
}

/// 행의 컨트롤 슬롯에 미리 맞춰 둔 스위치입니다(md, 44x26).
class HoronSettingsSwitch extends StatelessWidget {
  /// 스위치를 만듭니다.
  const HoronSettingsSwitch({super.key, required this.value, this.onChanged, this.label});

  /// 켜짐 여부입니다.
  final bool value;

  /// 바뀔 때 부릅니다.
  final ValueChanged<bool>? onChanged;

  /// 접근성 이름입니다.
  final String? label;

  @override
  Widget build(BuildContext context) {
    return HoronSwitch(value: value, onChanged: onChanged, size: HoronSwitchSize.md, label: label);
  }
}

/// 설정 행의 키캡 하나입니다. 26px 높이, 6px 반경, neutral-50 바탕에 헤어라인입니다.
class HoronSettingsKey extends StatelessWidget {
  /// 키캡을 만듭니다.
  const HoronSettingsKey({super.key, required this.label});

  /// 키 이름입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    return Container(
      height: 26,
      alignment: Alignment.center,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: isDark ? HoronPalette.neutral800 : HoronPalette.neutral50,
        borderRadius: BorderRadius.circular(_keycapRadius),
        border: Border.all(color: theme.colors.borderDefault),
      ),
      child: Text(
        label,
        style: theme.text.caption.copyWith(
          fontSize: 12,
          height: 16 / 12,
          fontWeight: HoronFontWeight.medium,
          color: theme.colors.textPrimary,
        ),
      ),
    );
  }
}

/// 키캡 두 개를 4px 간격으로 잇는 묶음입니다.
class HoronSettingsKeys extends StatelessWidget {
  /// 묶음을 만듭니다.
  const HoronSettingsKeys({super.key, required this.keys});

  /// 키 이름들입니다.
  final List<String> keys;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        for (int index = 0; index < keys.length; index++) ...<Widget>[
          if (index > 0) const SizedBox(width: 4),
          HoronSettingsKey(label: keys[index]),
        ],
      ],
    );
  }
}
