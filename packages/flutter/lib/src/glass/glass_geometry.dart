// 글래스 재료의 순수 계산입니다. 위젯도 셰이더도 아닙니다.
//
// 값의 출처는 `packages/tokens/src/glass.ts`이고, 생성된 `HoronGlassTokens`가 모든
// 수치를 들고 있습니다. 웹·데스크톱·모바일이 같은 재료를 그리도록 층은 셋입니다.
//
//   1. 뒤 배경 — `blur`만큼 흐린 뒤 `saturate`만큼 채도를 올립니다.
//   2. 채움     — 티어 색(glass-clear/regular/thick) 한 겹.
//   3. 림       — 표면 안쪽 1px, 위에서 아래로 가는 그라디언트.
//
// 굴절·질감·안쪽 그늘·광택은 없습니다. 이 파일에는 Flutter 위젯이 없으므로
// `flutter test`에서 전부 단위 테스트할 수 있습니다.

import 'dart:ui' as ui;

import 'package:flutter/painting.dart';

import '../tokens/horon_tokens.g.dart';

/// 채움의 두께입니다. React `liquid-glass.tsx`의 `tier`와 같은 세 값입니다.
///
/// `clear`는 버튼·칩, `regular`은 배너·토스트·탭 바, `thick`은 카드·사이드바가 씁니다.
enum HoronGlassTier {
  /// `glass-clear` — 흰색 20%(다크 30%). 가장 옅은 유리입니다.
  clear,

  /// `glass-regular` — 흰색 55%(다크 60%).
  regular,

  /// `glass-thick` — 흰색 80%(다크 80%). 뒤 내용이 거의 비치지 않습니다.
  thick,
}

/// 채움 두께에 대응하는 채움 색입니다.
///
/// 색은 이미 토큰에 있습니다(`glass-clear` → `colors.glassClear`).
Color horonGlassTierFill(HoronGlassTier tier, HoronColors colors) => switch (tier) {
  HoronGlassTier.clear => colors.glassClear,
  HoronGlassTier.regular => colors.glassRegular,
  HoronGlassTier.thick => colors.glassThick,
};

/// 뒤 배경에 거는 필터입니다.
///
/// 안쪽에서 바깥쪽으로 적용되므로 먼저 [HoronGlassTokens.blur]만큼 흐리고, 그 결과에
/// [HoronGlassTokens.saturate]의 채도 행렬을 겁니다. CSS
/// `backdrop-filter: blur(20px) saturate(1.8)`과 같은 순서이고, 두 플랫폼 모두 가우스
/// 표준편차를 받으므로 같은 수치를 그대로 넘깁니다.
ui.ImageFilter horonGlassBackdropFilter(HoronGlassTokens glass) => ui.ImageFilter.compose(
  outer: ui.ColorFilter.matrix(glass.saturateMatrix),
  inner: ui.ImageFilter.blur(sigmaX: glass.blur, sigmaY: glass.blur, tileMode: ui.TileMode.mirror),
);
