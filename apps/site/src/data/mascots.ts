/**
 * Mascot cut catalog and brand palette. `name` is the asset name used in file
 * paths and stays locale-independent; the prose fields (`cut`, `use`, palette
 * `role`, artwork `format`) are `Localized` pairs.
 */
import type { Localized } from "@/i18n";

export type MascotCategory = "core" | "state";

export interface MascotEntry {
  slug: string;
  name: string;
  cut: Localized;
  use: Localized;
  category: MascotCategory;
}

export const mascotPalette: { token: string; hex: string; role: Localized }[] = [
  { token: "ink", hex: "#1C1A17", role: { ko: "후드, 몸, 날개, 눈", en: "Hood, body, wings, eyes" } },
  { token: "cream", hex: "#FBF7F0", role: { ko: "얼굴 판, 가슴 표식", en: "Face plate, chest mark" } },
  { token: "gold", hex: "#E0921F", role: { ko: "부리, 발", en: "Beak, feet" } },
];

export const mascotSpec = {
  size: "1254 × 1254",
  format: {
    ko: "PNG (RGBA, 투명 배경)",
    en: "PNG (RGBA, transparent background)",
  } satisfies Localized,
  count: 26,
};

export const mascots: MascotEntry[] = [
  {
    slug: "face",
    name: "face",
    cut: { ko: "아이콘 — 머리 클로즈업, 가슴 표식 없음", en: "Icon — head close-up, no chest mark" },
    use: { ko: "파비콘, 앱 아이콘", en: "Favicon, app icon" },
    category: "core",
  },
  {
    slug: "wave",
    name: "wave",
    cut: { ko: "인사 — 서서 한쪽 날개를 든 모습", en: "Greeting — standing with one wing raised" },
    use: { ko: "환영, 첫 진입", en: "Welcome, first visit" },
    category: "core",
  },
  {
    slug: "main",
    name: "main",
    cut: {
      ko: "히어로 — 3/4 각도로 서서 한쪽 날개를 든 모습",
      en: "Hero — standing at a three-quarter angle with one wing raised",
    },
    use: { ko: "랜딩 히어로, 대표 이미지", en: "Landing hero, lead image" },
    category: "core",
  },
  {
    slug: "front",
    name: "front",
    cut: { ko: "정면 — 두 날개를 내린 채 서 있음", en: "Front — standing with both wings down" },
    use: { ko: "기본 상태, 목록", en: "Default state, lists" },
    category: "core",
  },
  {
    slug: "think",
    name: "think",
    cut: { ko: "생각 — 날개를 턱에 댐", en: "Thinking — wing at the chin" },
    use: { ko: "고민, 추론 중", en: "Pondering, reasoning" },
    category: "core",
  },
  {
    slug: "sit",
    name: "sit",
    cut: { ko: "앉은 자세", en: "Sitting" },
    use: { ko: "대기, 준비", en: "Waiting, getting ready" },
    category: "core",
  },
  {
    slug: "cheer",
    name: "cheer",
    cut: { ko: "환호 — 두 날개를 들고 점프", en: "Cheering — jumping with both wings up" },
    use: { ko: "축하, 성과", en: "Celebration, milestones" },
    category: "core",
  },

  {
    slug: "welcome",
    name: "welcome",
    cut: { ko: "두 날개를 크게 벌린 환영 자세", en: "Welcome — both wings spread wide" },
    use: { ko: "온보딩, 빈 시작", en: "Onboarding, empty start" },
    category: "state",
  },
  {
    slug: "point",
    name: "point",
    cut: { ko: "한쪽 날개로 옆을 가리킴", en: "Pointing to the side with one wing" },
    use: { ko: "CTA, 다음 행동 안내", en: "Call to action, next-step guidance" },
    category: "state",
  },
  {
    slug: "search",
    name: "search",
    cut: { ko: "날개로 눈을 가리고 돋보기를 듦", en: "Covering eyes with a wing and holding a magnifier" },
    use: { ko: "검색, 결과 없음", en: "Search, no results" },
    category: "state",
  },
  {
    slug: "empty",
    name: "empty",
    cut: { ko: "어깨를 으쓱하고 고개를 기울임", en: "Shrugging with head tilted" },
    use: { ko: "데이터 없음", en: "No data" },
    category: "state",
  },
  {
    slug: "error",
    name: "error",
    cut: { ko: "찡그리며 머리를 긁고 땀방울", en: "Frowning, scratching head, with a sweat drop" },
    use: { ko: "오류, 실패", en: "Errors, failures" },
    category: "state",
  },
  {
    slug: "success",
    name: "success",
    cut: { ko: "한쪽 날개를 높이 들고 가슴을 폄", en: "One wing raised high, chest out" },
    use: { ko: "완료, 성공", en: "Completion, success" },
    category: "state",
  },
  {
    slug: "loading",
    name: "loading",
    cut: { ko: "두 날개를 모으고 위를 기대해 봄", en: "Wings together, looking up" },
    use: { ko: "로딩, 처리 중", en: "Loading, in progress" },
    category: "state",
  },
  {
    slug: "sleep",
    name: "sleep",
    cut: { ko: "눈을 감고 고개를 기울임", en: "Eyes closed, head tilted" },
    use: { ko: "유휴, 시간 초과", en: "Idle, timeout" },
    category: "state",
  },
  {
    slug: "notification",
    name: "notification",
    cut: { ko: "눈을 크게 뜨고 머리 위에 종", en: "Wide eyes with a bell overhead" },
    use: { ko: "알림, 새 항목", en: "Notifications, new items" },
    category: "state",
  },
  {
    slug: "work",
    name: "work",
    cut: { ko: "작은 노트북으로 작업", en: "Working on a small laptop" },
    use: { ko: "콘솔, 워크스페이스", en: "Console, workspace" },
    category: "state",
  },
  {
    slug: "chart",
    name: "chart",
    cut: { ko: "막대 차트 판을 들어 올림", en: "Lifting a bar chart board" },
    use: { ko: "결과, 분석", en: "Results, analytics" },
    category: "state",
  },
  {
    slug: "lost",
    name: "lost",
    cut: { ko: "고개를 돌리고 물음표와 함께 긁적임", en: "Head turned, scratching with a question mark" },
    use: { ko: "찾을 수 없음, 404", en: "Not found, 404" },
    category: "state",
  },
  {
    slug: "rocket",
    name: "rocket",
    cut: { ko: "금색 로켓을 타고 날개를 폄", en: "Riding a gold rocket with wings spread" },
    use: { ko: "출시, 릴리스", en: "Launch, release" },
    category: "state",
  },
  {
    slug: "lock",
    name: "lock",
    cut: { ko: "금색 자물쇠를 들어 올림", en: "Lifting a gold padlock" },
    use: { ko: "보안, 인증, 결제", en: "Security, auth, payments" },
    category: "state",
  },
  {
    slug: "team",
    name: "team",
    cut: { ko: "작은 병아리 옆에 서 있음", en: "Standing beside a small chick" },
    use: { ko: "협업, 초대", en: "Collaboration, invites" },
    category: "state",
  },
  {
    slug: "gift",
    name: "gift",
    cut: { ko: "금색 선물 상자를 들어 올림", en: "Lifting a gold gift box" },
    use: { ko: "보상, 업그레이드", en: "Rewards, upgrades" },
    category: "state",
  },
  {
    slug: "bell",
    name: "bell",
    cut: { ko: "머리 위에서 금색 종을 흔듦", en: "Ringing a gold bell overhead" },
    use: { ko: "알림, 활동", en: "Notifications, activity" },
    category: "state",
  },
  {
    slug: "puzzle",
    name: "puzzle",
    cut: { ko: "금색 퍼즐 조각을 들고 있음", en: "Holding a gold puzzle piece" },
    use: { ko: "연동, 설정", en: "Integrations, settings" },
    category: "state",
  },
  {
    slug: "coffee",
    name: "coffee",
    cut: { ko: "따뜻한 커피잔을 들고 있음", en: "Holding a warm coffee cup" },
    use: { ko: "휴식, 비번 상태", en: "Breaks, away status" },
    category: "state",
  },
];

export const coreMascots = mascots.filter((mascot) => mascot.category === "core");
export const stateMascots = mascots.filter((mascot) => mascot.category === "state");

export function mascotSourceUrl(slug: string): string {
  return `https://github.com/horon-ai/design/raw/main/assets/horon-mascot-${slug}.png`;
}

export function mascotImageUrl(slug: string): string {
  return `/mascots/horon-mascot-${slug}.webp`;
}
