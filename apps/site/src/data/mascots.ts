export type MascotCategory = "core" | "state";

export interface MascotEntry {
  slug: string;
  name: string;
  cut: string;
  use: string;
  category: MascotCategory;
}

export const mascotPalette = [
  { token: "ink", hex: "#1C1A17", role: "후드, 몸, 날개, 눈" },
  { token: "cream", hex: "#FBF7F0", role: "얼굴 판, 가슴 표식" },
  { token: "gold", hex: "#E0921F", role: "부리, 발" },
];

export const mascotSpec = {
  size: "1254 × 1254",
  format: "PNG (RGBA, 투명 배경)",
  count: 26,
};

export const mascots: MascotEntry[] = [
  { slug: "face", name: "face", cut: "아이콘 — 머리 클로즈업, 가슴 표식 없음", use: "파비콘, 앱 아이콘", category: "core" },
  { slug: "wave", name: "wave", cut: "인사 — 서서 한쪽 날개를 든 모습", use: "환영, 첫 진입", category: "core" },
  { slug: "main", name: "main", cut: "히어로 — 3/4 각도로 서서 한쪽 날개를 든 모습", use: "랜딩 히어로, 대표 이미지", category: "core" },
  { slug: "front", name: "front", cut: "정면 — 두 날개를 내린 채 서 있음", use: "기본 상태, 목록", category: "core" },
  { slug: "think", name: "think", cut: "생각 — 날개를 턱에 댐", use: "고민, 추론 중", category: "core" },
  { slug: "sit", name: "sit", cut: "앉은 자세", use: "대기, 준비", category: "core" },
  { slug: "cheer", name: "cheer", cut: "환호 — 두 날개를 들고 점프", use: "축하, 성과", category: "core" },

  { slug: "welcome", name: "welcome", cut: "두 날개를 크게 벌린 환영 자세", use: "온보딩, 빈 시작", category: "state" },
  { slug: "point", name: "point", cut: "한쪽 날개로 옆을 가리킴", use: "CTA, 다음 행동 안내", category: "state" },
  { slug: "search", name: "search", cut: "날개로 눈을 가리고 돋보기를 듦", use: "검색, 결과 없음", category: "state" },
  { slug: "empty", name: "empty", cut: "어깨를 으쓱하고 고개를 기울임", use: "데이터 없음", category: "state" },
  { slug: "error", name: "error", cut: "찡그리며 머리를 긁고 땀방울", use: "오류, 실패", category: "state" },
  { slug: "success", name: "success", cut: "한쪽 날개를 높이 들고 가슴을 폄", use: "완료, 성공", category: "state" },
  { slug: "loading", name: "loading", cut: "두 날개를 모으고 위를 기대해 봄", use: "로딩, 처리 중", category: "state" },
  { slug: "sleep", name: "sleep", cut: "눈을 감고 고개를 기울임", use: "유휴, 시간 초과", category: "state" },
  { slug: "notification", name: "notification", cut: "눈을 크게 뜨고 머리 위에 종", use: "알림, 새 항목", category: "state" },
  { slug: "work", name: "work", cut: "작은 노트북으로 작업", use: "콘솔, 워크스페이스", category: "state" },
  { slug: "chart", name: "chart", cut: "막대 차트 판을 들어 올림", use: "결과, 분석", category: "state" },
  { slug: "lost", name: "lost", cut: "고개를 돌리고 물음표와 함께 긁적임", use: "찾을 수 없음, 404", category: "state" },
  { slug: "rocket", name: "rocket", cut: "금색 로켓을 타고 날개를 폄", use: "출시, 릴리스", category: "state" },
  { slug: "lock", name: "lock", cut: "금색 자물쇠를 들어 올림", use: "보안, 인증, 결제", category: "state" },
  { slug: "team", name: "team", cut: "작은 병아리 옆에 서 있음", use: "협업, 초대", category: "state" },
  { slug: "gift", name: "gift", cut: "금색 선물 상자를 들어 올림", use: "보상, 업그레이드", category: "state" },
  { slug: "bell", name: "bell", cut: "머리 위에서 금색 종을 흔듦", use: "알림, 활동", category: "state" },
  { slug: "puzzle", name: "puzzle", cut: "금색 퍼즐 조각을 들고 있음", use: "연동, 설정", category: "state" },
  { slug: "coffee", name: "coffee", cut: "따뜻한 커피잔을 들고 있음", use: "휴식, 비번 상태", category: "state" },
];

export const coreMascots = mascots.filter((mascot) => mascot.category === "core");
export const stateMascots = mascots.filter((mascot) => mascot.category === "state");

export function mascotSourceUrl(slug: string): string {
  return `https://github.com/horon-ai/design/raw/main/assets/horon-mascot-${slug}.png`;
}

export function mascotImageUrl(slug: string): string {
  return `/mascots/horon-mascot-${slug}.webp`;
}
