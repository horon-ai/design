/// 컴포넌트가 공유하는 표면 어휘입니다.
///
/// React는 컴포넌트마다 `surface?: "solid" | "glass"` 같은 인라인 유니온을
/// 씁니다. 그런 유니온은 `export type`이 아니라 variants 게이트가 컴포넌트별
/// 어휘로 읽지 않으므로, Flutter에서는 계약 파일에 한 번만 정의해 나눠 씁니다.
library;

/// 기본 표면입니다.
enum HoronSurface {
  /// 불투명 `bg-surface`와 `border-default` 1px. 기본값입니다.
  solid,

  /// 유리 레이어를 까는 표면입니다. 이미지나 유리 패널 위에 씁니다.
  glass,
}

/// 카드의 표면입니다. React `card.tsx`의 `glass | frost | solid`.
enum HoronCardSurface {
  /// 불투명 `bg-surface`와 `border-default` 1px. 기본값입니다.
  solid,

  /// 두꺼운 유리 레이어 위의 카드입니다.
  glass,

  /// 서리 채움과 24px 배경 흐림, 바깥 그림자를 쓰는 카드입니다.
  frost,
}

/// 달력의 표면입니다. React `calendar.tsx`의 `glass | flat | solid`.
enum HoronCalendarSurface {
  /// 불투명 `bg-surface`와 `border-default` 1px. 기본값입니다.
  solid,

  /// 두꺼운 유리 레이어 위의 달력입니다.
  glass,

  /// 80% 흰 채움만 쓰고 유리 레이어는 없는 달력입니다.
  flat,
}

/// 시간·요일 선택 필드의 표면입니다. React `schedule.tsx`의 `solid | glass | inset`.
enum HoronPickerSurface {
  /// 불투명 `bg-surface`와 `border-default` 1px. 기본값입니다.
  solid,

  /// 유리 레이어를 까는 표면입니다.
  glass,

  /// 4% 잉크 트랙 위의 표면입니다.
  inset,
}
