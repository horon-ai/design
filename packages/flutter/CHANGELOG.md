## 0.1.0

- 패키지 골격을 만들었습니다. 버전 상수, 공개 이름 정책, 아이콘 계약, 문자열 표면
  (`HoronStringsKo`·`HoronStringsEn`), 그리고 갤러리 섹션 등록부를 넣었습니다.
- 라디오 그룹을 `RadioGroup`·`RawRadio` 위로 옮겼습니다. Tab이 선택된 항목 하나에만
  들어가고, 화살표가 선택과 포커스를 함께 옮기며 양 끝에서 순환하고, Space가 포커스된
  항목을 고릅니다. 이미 선택된 항목을 다시 눌러도 콜백을 부르지 않으며, 웹에서는 Enter로
  선택되지 않습니다.
- 툴팁을 `RawTooltip` 위로 옮겼습니다. 트리거가 `tooltip` 시맨틱으로 문구를 알리고,
  한 번에 하나만 보이며, 열기·닫기 애니메이션은 없습니다.
- 다이얼로그·바텀시트·`showHoronModal` 라우트를 `RawDialogRoute` 위로 옮겼습니다. 모달
  밖을 읽지 않는 `scopesRoute` 경계가 생기고, 접이식 기기에서는 서브 화면 하나 안에만
  그려집니다. 스크림 색·블러와 전환 시간은 그대로입니다.
- 메뉴·셀렉트·콤보박스·날짜 필드·시간 선택기의 팝업을 공용 `HoronMenuAnchor`
  (`RawMenuAnchor`)로 옮겼습니다. 셀렉트와 콤보박스가 Escape로 닫힙니다.
- 팝업이 조상 스크롤이나 화면 크기가 바뀔 때 닫힙니다. `RawMenuAnchor`의 기본 동작이며
  메뉴·셀렉트·콤보박스·날짜 필드·시간 선택기 모두에 적용됩니다.
- 날짜 필드와 시간 선택기에서 Material 메뉴(`MenuAnchor`, `MenuItemButton`) 의존을
  걷어냈습니다. 필드 8px 아래에 열리고, 아래 공간이 모자라면 위로 뒤집히며, 양쪽 모두
  좁으면 들어가는 만큼으로 줄여 안에서 스크롤합니다.
- veil 표면 재료를 추가했습니다. React `globals.css`의 `.veil-field`·`.veil-overlay`·
  `.veil-drop`을 `HoronVeil` 하나로 옮겼고, 블러 8·채도 1.6·1px 링과 라이트·다크 채움은
  토큰 생성기가 만드는 `HoronVeilTokens`를 `HoronThemeData.veil`에서 읽습니다. React가
  `LiquidGlass`를 지운 자리(입력·입력 그룹·텍스트영역·텍스트영역 필드·작성기·셀렉트·
  콤보박스·날짜 필드·스케줄·달력·메뉴·다이얼로그·바텀시트·커맨드 팔레트·토스트·
  파일 드롭)는 veil 한 겹으로 바꿨고, `HoronSurface`에 `veilField`·`veilOverlay`를
  더했습니다.
- 폼과 긴 글을 담는 `HoronModal`을 추가했습니다. 폭 400·560·720(`HoronModalSize`),
  solid·glass 표면(`HoronModalSurfaceKind`), 머리글·스크롤 본문·푸터 세 부분, 32% 스크림과
  6px 흐림을 씁니다. `HoronModalSurface`라는 이름은 기존 패널 위젯이 이미 쓰고 있어
  enum에는 `Kind` 접미사를 붙였습니다.
- 탭에 `HoronTabsListVariant.underline`을 추가했습니다. 쟁반과 표면 없이 폭을 채우고,
  아래 1px 테두리 위를 2px 링크 색 막대가 따라갑니다. 탭 높이·여백·타이포를 26/30/36
  눈금으로 맞추고 hover는 글자색만 올립니다.
- 사이드바에 `HoronSidebar.plain()`을 추가했습니다. 채움과 유리 없이 오른쪽 1px 테두리만
  그립니다. `HoronSidebarItem.href`가 있으면 링크 시맨틱을 갖고, 프로젝트 행 hover는
  4% 잉크로 낮췄습니다.
- `HoronStreamingText`에 `streaming`·`smooth`를 추가했습니다. 초당 90자로 글자를 드러내고
  남은 글자가 쌓이면 최대 3배까지 따라잡으며, 캐럿은 마지막 글자 뒤에서 함께 줄바꿈됩니다.
  모션 축소면 즉시 전체를 보여 주고, 화면 낭독기는 완료된 답을 한 번만 읽습니다.
- Flue 배경에 주야간 팔레트와 변형을 넣었습니다. `HoronFlueConfig.sky`·`night`를 테마
  밝기로 고르고 `HoronFlueVariant.defaultValue`·`sidebar`·`auth` 튜닝을 얹습니다. `cursor`
  기본값이 0이 되어 포인터가 없으면 가상 포인터로 움직이고, 색조는 `defaultValue`의
  라이트에서만 얹습니다.
- 나머지 컴포넌트를 React 변경에 맞췄습니다. 정적 카드를 `bg-surface`+`border-default`로
  바꾸고, 표·행·배지·배너·빈 상태·스켈레톤·에이전트 패널·도구 호출·대화·문서 패널의
  타이포·간격·반경을 토큰으로 맞췄으며, `HoronKbd`에 배경·글자 덮어쓰기, `HoronButton`과
  사이드바 항목에 `href`·`current` 링크 계약을 더했습니다.
- README에 "React 변경 따라잡기" 절차를 넣었습니다. 기준 커밋 diff → audit 표 → 레인
  병렬 포팅 → `integrate` → analyze·format·test 게이트 순서와 공유 파일 소유 규칙입니다.
