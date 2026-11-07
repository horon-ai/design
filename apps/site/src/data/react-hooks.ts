/**
 * One page per hook exported from `@horon-ai/react`.
 *
 * Every field is copied from the hook's own source in
 * `packages/react/src/hooks/`: the signature from the exported declaration, the
 * parameters and their defaults from the JSDoc `@param` tags and the function
 * signature, the return description from `@returns` plus the shape it names,
 * the behavior notes from the implementation, and the example from the JSDoc
 * `@example` block.
 */
import type { Localized } from "@/i18n";

export interface ReactHookDoc {
  slug: string;
  name: string;
  summary: Localized;
  /** The exported declaration as written in the source, one line per type. */
  signature: string;
  params: { name: string; type: string; defaultValue?: string; description: Localized }[];
  returns: Localized;
  notes: Localized[];
  /** The JSDoc `@example` body, import line included. */
  example: string;
  /** File name shown above the example. */
  exampleFile: string;
}

export const reactHooks: ReactHookDoc[] = [
  {
    slug: "use-active-indicator",
    name: "useActiveIndicator",
    summary: {
      ko: "트랙 안에서 활성 항목의 위치를 재서 인디케이터를 슬라이드할 수 있게 합니다.",
      en: "Measure the active item inside a track so one indicator can slide between items.",
    },
    signature: `export type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function useActiveIndicator(
  track: RefObject<HTMLElement | null>,
  selector: string,
): { rect: IndicatorRect | null; animate: boolean }`,
    params: [
      {
        name: "track",
        type: "RefObject<HTMLElement | null>",
        description: {
          ko: "항목을 담은 위치 지정 트랙 요소의 ref입니다.",
          en: "Ref to the positioned track element that holds the items.",
        },
      },
      {
        name: "selector",
        type: "string",
        description: {
          ko: "트랙 안에서 활성 항목을 찾는 CSS 선택자입니다. 항목이 없으면 rect가 null이 됩니다.",
          en: "CSS selector for the active item, queried inside the track; a missing item yields a null rect.",
        },
      },
    ],
    returns: {
      ko: "측정한 rect와 첫 프레임용 animate 플래그를 돌려줍니다. rect는 첫 측정 전까지 null입니다.",
      en: "The measured rect (or null before the first measurement) and an animate flag for the first frame.",
    },
    notes: [
      {
        ko: "rect의 네 값은 활성 항목의 offsetLeft, offsetTop, offsetWidth, offsetHeight에서 읽습니다.",
        en: "The four rect values come from the active item's offsetLeft, offsetTop, offsetWidth and offsetHeight.",
      },
      {
        ko: "측정은 레이아웃 이펙트에서 하므로 서버 렌더는 인디케이터를 그리지 않습니다. 첫 클라이언트 패스에서 페인트 전에 자리를 잡고, animate는 그때까지 false입니다.",
        en: "Measuring happens in a layout effect, so a server render draws no indicator: rect starts null, and the first client pass places the item before paint while animate stays false.",
      },
      {
        ko: "rect는 속성 변화와 크기 변화를 따라갑니다. 트랙과 그 자식에 ResizeObserver를, 트랙의 속성과 하위 트리, 자식 목록에 MutationObserver를 겁니다.",
        en: "The rect follows attribute changes and resizes: a ResizeObserver watches the track and its children, a MutationObserver watches attributes, the subtree and the child list.",
      },
      {
        ko: "animate는 첫 배치 다음 프레임에 true가 되어 인디케이터가 0,0에서 미끄러져 들어오지 않고 제자리에 나타납니다.",
        en: "animate turns true one frame after the first placement, so the indicator lands in place instead of sliding in from 0,0.",
      },
    ],
    example: `import { useRef } from "react";

import { useActiveIndicator } from "@horon-ai/react";

function Tabs({ items, value }: { items: string[]; value: string }) {
  const track = useRef<HTMLDivElement>(null);
  const { rect, animate } = useActiveIndicator(track, '[aria-current="page"]');
  return (
    <div ref={track} className="relative flex gap-1">
      {items.map((item) => (
        <button key={item} aria-current={item === value ? "page" : undefined}>
          {item}
        </button>
      ))}
      <span
        aria-hidden
        className={animate ? "pointer-events-none absolute rounded-full motion-indicator" : "pointer-events-none absolute rounded-full"}
        style={{ ...rect, opacity: rect ? 1 : 0 }}
      />
    </div>
  );
}`,
    exampleFile: "tabs.tsx",
  },
  {
    slug: "use-color-scheme",
    name: "useColorScheme",
    summary: {
      ko: "html 요소의 .dark 클래스에서 현재 색상 스킴을 읽습니다.",
      en: "Read the active color scheme from the .dark class on the html element.",
    },
    signature: `export type ColorScheme = "light" | "dark";

export function useColorScheme(): ColorScheme`,
    params: [],
    returns: {
      ko: "루트 요소에 .dark 클래스가 있으면 dark, 없으면 light입니다. 서버 렌더에서는 light입니다.",
      en: "dark while the root element carries the .dark class, light otherwise.",
    },
    notes: [
      {
        ko: ".dark 클래스가 유일한 소스입니다. prefers-color-scheme은 보지 않습니다. 테마는 OS를 따르지 않고 명시적으로 전환합니다.",
        en: "The .dark class is the only source; prefers-color-scheme is deliberately ignored, because the theme is an explicit switch, not an OS follow.",
      },
      {
        ko: "MutationObserver로 html의 class 속성을 지켜보므로 페이지 어디서든 테마를 바꾸면 이 훅을 쓰는 모든 컴포넌트가 다시 렌더됩니다.",
        en: "A MutationObserver watches the class attribute on the html element, so a toggle anywhere on the page re-renders every caller.",
      },
      {
        ko: "서버 렌더와 하이드레이션 전에는 light를 돌려줍니다. 클라이언트에서 클래스를 읽은 뒤에 실제 값이 나옵니다.",
        en: "A server render reports light until the class is read on the client.",
      },
    ],
    example: `import { Button, useColorScheme } from "@horon-ai/react";

function ThemeToggle() {
  const scheme = useColorScheme();
  return (
    <Button variant="link" onClick={() => document.documentElement.classList.toggle("dark")}>
      {scheme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}`,
    exampleFile: "theme-toggle.tsx",
  },
  {
    slug: "use-copy-to-clipboard",
    name: "useCopyToClipboard",
    summary: {
      ko: "클립보드에 쓰고 확인 상태를 스스로 지웁니다.",
      en: "Write to the clipboard with a confirmation flag that clears itself.",
    },
    signature: `export type CopyToClipboard = {
  copied: boolean;
  copy: (text: string) => void;
};

export function useCopyToClipboard(resetMs = 1500): CopyToClipboard`,
    params: [
      {
        name: "resetMs",
        type: "number",
        defaultValue: "1500",
        description: {
          ko: "쓰기에 성공한 뒤 copied가 true로 남아 있는 시간입니다(밀리초).",
          en: "How long copied stays true after a successful write, in milliseconds.",
        },
      },
    ],
    returns: {
      ko: "현재 copied 플래그와 참조가 고정된 copy 함수를 돌려줍니다.",
      en: "The current copied flag and a stable copy function.",
    },
    notes: [
      {
        ko: "쓰기가 끝나면 copied가 true가 되고 resetMs가 지나면 다시 false가 됩니다. 버튼이 따로 타이머를 두지 않아도 됩니다.",
        en: "copied turns true when the write resolves and back to false after resetMs, so a button needs no timer of its own.",
      },
      {
        ko: "navigator.clipboard로 쓰기 때문에 보안 컨텍스트와 사용자 제스처가 필요합니다. 그 API가 없는 환경에서는 호출이 아무 일도 하지 않고 copied는 true가 되지 않습니다.",
        en: "The write goes through navigator.clipboard, so it needs a secure context and a user gesture; where that API is missing the call is a no-op and copied never turns true.",
      },
      {
        ko: "쓰기가 실패하면 예외를 던지지 않고 copied를 false로 둡니다.",
        en: "A failed write leaves copied false instead of throwing.",
      },
      {
        ko: "타이머는 컴포넌트가 사라지거나 resetMs가 바뀔 때 정리됩니다.",
        en: "The timer is cleared when the component unmounts or resetMs changes.",
      },
    ],
    example: `import { Button, useCopyToClipboard } from "@horon-ai/react";

function CopyRow({ value }: { value: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <Button variant="glass" onClick={() => copy(value)}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}`,
    exampleFile: "copy-row.tsx",
  },
  {
    slug: "use-device",
    name: "useDevice",
    summary: {
      ko: "기기 클래스와 기본 입력, 키 안내를 쓸 수 있는지를 한 번에 알려줍니다.",
      en: "The device class, its primary input and whether key hints can be reached.",
    },
    signature: `export type DeviceType = "mobile" | "tablet" | "desktop";
export type DeviceInput = "touch" | "pointer";

export type Device = {
  type: DeviceType;
  input: DeviceInput;
  keyboardHints: boolean;
};

export function useDevice(): Device`,
    params: [],
    returns: {
      ko: "현재 Device를 돌려줍니다. type, input, keyboardHints 세 필드입니다.",
      en: "The current Device: type, input and keyboardHints.",
    },
    notes: [
      {
        ko: "type은 768px 아래에서 mobile, 그 위에서 포인터가 거칠면 tablet, 나머지는 desktop입니다.",
        en: "type is mobile below 768px, tablet for a coarse pointer above that, desktop otherwise.",
      },
      {
        ko: "input은 포인터가 거칠면 touch, 정밀하면 pointer입니다.",
        en: "input is touch for a coarse pointer and pointer for a fine one.",
      },
      {
        ko: "keyboardHints는 호버되는 정밀 포인터에서만 true입니다. 키 칩을 실제로 누를 수 있는 입력이 그때뿐이기 때문입니다.",
        en: "keyboardHints is true only for a hovering fine pointer, the input that can actually reach a key chip.",
      },
      {
        ko: "세 쿼리는 useMediaQuery를 거치므로 서버 렌더와 첫 하이드레이션 패스에서는 아무것도 읽지 않습니다. 그 패스는 데스크톱, pointer, 키 안내 켜짐을 보고합니다.",
        en: "The three queries go through useMediaQuery, so nothing is read during a server render or the first hydration pass: that pass reports desktop / pointer with keyboardHints on.",
      },
      {
        ko: "같은 기기 값에는 같은 객체 참조를 돌려줍니다.",
        en: "The returned object is shared, so a re-render with the same device hands back the same reference.",
      },
    ],
    example: `import { Kbd, useDevice } from "@horon-ai/react";

function ComposeFooter() {
  const { type, keyboardHints } = useDevice();
  return (
    <footer className="flex items-center gap-2">
      <span className="text-caption">{type}</span>
      {keyboardHints && <Kbd keys="Mod+Enter" />}
    </footer>
  );
}`,
    exampleFile: "compose-footer.tsx",
  },
  {
    slug: "use-hotkey",
    name: "useHotkey",
    summary: {
      ko: "document의 keydown이 단축키와 맞으면 핸들러를 실행합니다.",
      en: "Run a handler when a document keydown matches a shortcut.",
    },
    signature: `export type HotkeyOptions = {
  enabled?: boolean;
};

export function useHotkey(
  keys: string,
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
): void`,
    params: [
      {
        name: "keys",
        type: "string",
        description: {
          ko: "Mod+K, Mod+Shift+Enter, Escape 같은 단축키 문자열입니다. Kbd가 그리는 것과 같은 문법을 씁니다.",
          en: "Shortcut string such as Mod+K, Mod+Shift+Enter or Escape, in the same syntax Kbd draws.",
        },
      },
      {
        name: "handler",
        type: "(event: KeyboardEvent) => void",
        description: {
          ko: "preventDefault 뒤에 일치한 keydown 이벤트를 받습니다.",
          en: "Called with the matching keydown event after preventDefault().",
        },
      },
      {
        name: "options",
        type: "HotkeyOptions",
        defaultValue: "{}",
        description: {
          ko: "enabled가 유일한 스위치이고 기본값은 true입니다. false면 리스너를 떼어 단축키가 동작하지 않습니다.",
          en: "The only switch is enabled; when false the listener is detached and the hotkey does nothing (default true).",
        },
      },
    ],
    returns: {
      ko: "돌려주는 값은 없습니다. 컴포넌트가 사라지거나 keys, enabled가 바뀌면 리스너를 정리합니다.",
      en: "Nothing; the listener is cleaned up when the component unmounts or keys/enabled change.",
    },
    notes: [
      {
        ko: "Mod는 OS의 수정 키를 따릅니다. macOS와 iOS에서는 ⌘, Windows, Linux, Android에서는 Ctrl이고, OS를 아직 모르는 동안에는 둘 다 받습니다.",
        en: "Mod follows the OS modifier key: ⌘ on macOS and iOS, Ctrl on Windows, Linux and Android, and either one while the OS is still unknown.",
      },
      {
        ko: "일치하면 preventDefault를 먼저 부르고 핸들러를 실행합니다. 텍스트 입력은 포커스를 잃지 않아 입력 중에 팔레트 단축키가 동작합니다.",
        en: "A match calls preventDefault() before the handler, and text inputs keep their focus, so a palette shortcut still fires mid-typing.",
      },
      {
        ko: "리스너는 이펙트에서 붙이므로 서버 렌더는 아무것도 바인딩하지 않습니다.",
        en: "The listener is attached in an effect, so a server render binds nothing.",
      },
      {
        ko: "핸들러는 ref에 담아 두므로 인라인 화살표 함수를 넘겨도 렌더마다 다시 붙지 않습니다. keys, enabled, OS가 바뀔 때만 다시 구독합니다.",
        en: "The handler is held in a ref, so a caller can pass an inline arrow without re-binding on every render; only keys, enabled and the OS re-subscribe.",
      },
    ],
    example: `import { Kbd, useHotkey } from "@horon-ai/react";

function PaletteShortcut({ open }: { open: () => void }) {
  useHotkey("Mod+K", open);
  return <Kbd keys="Mod+K" />;
}`,
    exampleFile: "palette-shortcut.tsx",
  },
  {
    slug: "use-media-query",
    name: "useMediaQuery",
    summary: {
      ko: "matchMedia 쿼리 하나를 추적하고, 서버와 첫 클라이언트 렌더에서는 같은 값을 씁니다.",
      en: "Track one matchMedia query, agreeing with the server on the first render.",
    },
    signature: `export function useMediaQuery(query: string, serverValue = false): boolean`,
    params: [
      {
        name: "query",
        type: "string",
        description: {
          ko: "(max-width: 767px)나 (prefers-reduced-motion: reduce) 같은 미디어 쿼리입니다.",
          en: "A media query such as (max-width: 767px) or (prefers-reduced-motion: reduce).",
        },
      },
      {
        name: "serverValue",
        type: "boolean",
        defaultValue: "false",
        description: {
          ko: "서버 렌더와 matchMedia가 없을 때 보고할 값입니다.",
          en: "Result to report while rendering on the server or before matchMedia is available.",
        },
      },
    ],
    returns: {
      ko: "쿼리가 지금 일치하는지 여부입니다. 서버와 첫 패스에서는 serverValue를 돌려줍니다.",
      en: "Whether the query currently matches, or serverValue on the server and in the first pass.",
    },
    notes: [
      {
        ko: "서버 렌더와 첫 클라이언트 렌더가 serverValue를 쓰므로 정적 썸네일과 하이드레이션이 브라우저의 실제 상태를 읽기 전에 서로 맞습니다.",
        en: "The server render and the first client render use serverValue, so static thumbnails and hydration agree before the browser reports the real state.",
      },
      {
        ko: "query가 바뀌면 구독을 다시 만듭니다. 캐시 키가 문자열 자체이므로 렌더 사이에 값이 바뀌지 않는 리터럴을 넘깁니다.",
        en: "The subscription is rebuilt when query changes, and the cache key is the string itself, so the query must be a literal the caller keeps stable across renders.",
      },
      {
        ko: "window.matchMedia가 없으면 서버 스냅샷과 클라이언트 스냅샷 모두 serverValue로 돌아갑니다.",
        en: "Both the server snapshot and the snapshot taken before window.matchMedia exists fall back to serverValue.",
      },
    ],
    example: `import { type ReactNode } from "react";

import { useMediaQuery } from "@horon-ai/react";

function Columns({ children }: { children: ReactNode }) {
  const wide = useMediaQuery("(min-width: 768px)");
  return <div className={wide ? "grid grid-cols-3 gap-4" : "flex flex-col gap-3"}>{children}</div>;
}`,
    exampleFile: "columns.tsx",
  },
  {
    slug: "use-platform",
    name: "usePlatform",
    summary: {
      ko: "현재 OS와 실행 셸, Mod가 가리키는 키를 알려줍니다.",
      en: "The current OS, the shell the page runs in and the key behind Mod.",
    },
    signature: `export type ModKey = "meta" | "ctrl";

export type Platform = {
  os: "macos" | "windows" | "linux" | "ios" | "android" | "unknown";
  runtime: "web" | "desktop";
  modKey: ModKey;
};

export function usePlatform(): Platform`,
    params: [],
    returns: {
      ko: "현재 Platform을 돌려줍니다. os, runtime, modKey 세 필드입니다.",
      en: "The current Platform: os, runtime and modKey.",
    },
    notes: [
      {
        ko: "os는 navigator와 window에서 한 번만 읽고 페이지가 살아 있는 동안 그 값을 재사용합니다. 구독할 저장소가 없어 훅이 스스로 다시 렌더되지 않습니다.",
        en: "The value is read from navigator and window once and cached for the life of the page: there is no store to subscribe to, so the hook never re-renders on its own.",
      },
      {
        ko: "서버 렌더와 첫 하이드레이션 패스는 unknown, web, meta를 받아 Mac 키를 그립니다. 클라이언트에서는 첫 렌더부터 감지한 플랫폼을 보고합니다.",
        en: "A server render and the first hydration pass get unknown, web and meta, which draws the Mac keys; on the client the first render already reports the detected platform.",
      },
      {
        ko: "os는 macos, windows, linux, ios, android, unknown 중 하나입니다. 서버에서는 unknown입니다.",
        en: "os is one of macos, windows, linux, ios, android or unknown, and unknown on the server.",
      },
      {
        ko: "runtime은 Tauri나 Electron 안에서 desktop, 그 밖에는 서버를 포함해 web입니다.",
        en: "runtime is desktop inside the Tauri shell or Electron, and web everywhere else including the server.",
      },
      {
        ko: "modKey는 windows, linux, android에서 ctrl이고 나머지는 meta입니다. keydown 검사에 그대로 쓸 수 있습니다.",
        en: "modKey is ctrl on Windows, Linux and Android and meta elsewhere, ready for a keydown check.",
      },
    ],
    example: `import { isModKey, usePlatform } from "@horon-ai/react";

function Composer({ onStart }: { onStart: () => void }) {
  const { os } = usePlatform();
  return (
    <textarea
      onKeyDown={(event) => {
        if (event.key === "Enter" && isModKey(event, os)) onStart();
      }}
    />
  );
}`,
    exampleFile: "composer.tsx",
  },
  {
    slug: "use-reduced-motion",
    name: "useReducedMotion",
    summary: {
      ko: "OS가 모션 줄이기를 요청하는 동안 true입니다.",
      en: "True while the OS asks for reduced motion.",
    },
    signature: `export function useReducedMotion(): boolean`,
    params: [],
    returns: {
      ko: "사용자가 모션 줄이기를 선호하는지 여부입니다. 서버 렌더와 첫 패스에서는 false입니다.",
      en: "Whether the user prefers reduced motion; false during a server render and the first pass.",
    },
    notes: [
      {
        ko: "(prefers-reduced-motion: reduce) 쿼리를 useMediaQuery로 읽는 얇은 훅입니다.",
        en: "A thin reading of useMediaQuery over (prefers-reduced-motion: reduce).",
      },
      {
        ko: "같은 설정의 CSS 쪽은 globals.css의 모션 유틸리티가 맡고, 그 유틸리티가 재생 시간을 0에 가깝게 줄입니다.",
        en: "The CSS side of the same preference is handled by the motion utilities in globals.css, which collapse their durations.",
      },
    ],
    example: `import { type ReactNode } from "react";

import { useReducedMotion } from "@horon-ai/react";

function Reveal({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return <div className={reducedMotion ? undefined : "motion-rise"}>{children}</div>;
}`,
    exampleFile: "reveal.tsx",
  },
];
