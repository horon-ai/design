# Horon design assets

Brand mascot assets for Horon — in the Horon brand palette, cut out on a transparent background.

## Character

Horon's mascot is a round falcon chick (the product name is Horus + ON). Design invariants:

- Head: one heavily rounded square with two short feather tufts on the crown.
- Face plate: a large soft oval in warm cream, framed by a dark rounded hood.
- Eyes: two large round dark eyes, each with one small white highlight.
- Beak: a short soft triangular beak, tilted very slightly to the character's left.
- Chest mark (full-body cuts only): a modern geometric eye — a shallow arc over a small dot over an inverted arc.
- Material: soft matte clay, broad rounded bevels.

## Brand palette

| Token | Hex       | Role                    |
| ----- | --------- | ----------------------- |
| ink   | `#1C1A17` | hood, body, wings, eyes |
| cream | `#FBF7F0` | face plate, chest mark  |
| gold  | `#E0921F` | beak, feet              |

## Files

All files are 1254×1254 PNG with a **transparent background** (RGBA, alpha). 26 cuts total.

### Core poses

| File                     | Cut                                            |
| ------------------------ | ---------------------------------------------- |
| `horon-mascot-face.png`  | icon — head close-up, no chest mark            |
| `horon-mascot-wave.png`  | greeting — standing, one wing raised           |
| `horon-mascot-main.png`  | hero — three-quarter standing, one wing raised |
| `horon-mascot-front.png` | front-facing standing, both wings down         |
| `horon-mascot-think.png` | thinking — wing to the chin                    |
| `horon-mascot-sit.png`   | sitting                                        |
| `horon-mascot-cheer.png` | cheering — both wings up, mid-jump             |

### Product & platform states (SaaS · Web · App)

| File                            | Cut                                        | Use                     |
| ------------------------------- | ------------------------------------------ | ----------------------- |
| `horon-mascot-welcome.png`      | both wings open wide, welcoming            | onboarding, empty start |
| `horon-mascot-point.png`        | one wing pointing out to the side          | CTA, call to action     |
| `horon-mascot-search.png`       | wing shading the eyes, holding a magnifier | search, empty results   |
| `horon-mascot-empty.png`        | shrugging, wings spread, head tilted       | no data state           |
| `horon-mascot-error.png`        | wincing, scratching the head, sweat drop   | error, failure          |
| `horon-mascot-success.png`      | one wing raised high, chest out            | completed, done         |
| `horon-mascot-loading.png`      | wings clasped, looking up expectantly      | loading, processing     |
| `horon-mascot-sleep.png`        | eyes closed, head tilted, wings tucked     | idle, timeout           |
| `horon-mascot-notification.png` | eyes wide, wing up, bell overhead          | alert, new item         |
| `horon-mascot-work.png`         | working at a small laptop                  | console, workspace      |
| `horon-mascot-chart.png`        | holding up a bar-chart board               | results, analytics      |
| `horon-mascot-lost.png`         | head turned, scratching, question mark     | not found, 404          |
| `horon-mascot-rocket.png`       | riding a gold rocket, wings up             | launch, release         |
| `horon-mascot-lock.png`         | holding up a gold padlock                  | security, auth, billing |
| `horon-mascot-team.png`         | standing beside a smaller chick            | collaboration, invite   |
| `horon-mascot-gift.png`         | holding up a gold gift box                 | reward, upgrade         |
| `horon-mascot-bell.png`         | ringing a gold bell overhead               | notifications, activity |
| `horon-mascot-puzzle.png`       | holding a gold puzzle piece                | integrations, setup     |
| `horon-mascot-coffee.png`       | holding a warm coffee cup                  | break, off-duty         |

## Provenance

- Source originals live in `core/.hyper/image-maker/호론-캐릭터/` (navy character on a navy field).
- The seven core poses are **color-only edits** of those originals: the drawing, pose, framing, and lighting
  are unchanged; only the palette was swapped to the brand colors above on a light cream field.
- The nineteen product-state cuts are **new poses of the same character**, generated 2026-10-14 through the
  `image-maker` skill over the `codex-chatgpt-web` bridge. Each was produced by attaching two finished brand
  cuts as the character reference (`codex exec -i ref-front.png -i ref-main.png`) with a
  "the attached images ARE the character — same design, new pose only" instruction, so the design stays
  identical across every cut.
- Background removal: the cream field and the soft contact shadow were cut with `rembg` (U²-Net), then the
  alpha was kept at 1254×1254. The flat contact shadow is intentionally removed.
- Recolor prompts: `design/.omo/imgedit-*.txt`. Pose generation prompts: `/tmp/p-<cut>.txt` at run time.

## Canvas

These cuts are placed in the `horon-design.pen` canvas board `06 Mascots` (26 cards, 1254×1254 image fills).
The pen document keeps its own copy under `images/` next to the `.pen` file.
