# Horon design assets

Brand mascot assets for Horon — recolored to the Horon brand palette and cut out on a transparent background.

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

All files are 1254×1254 PNG with a **transparent background** (RGBA, alpha).

| File                     | Cut                                            |
| ------------------------ | ---------------------------------------------- |
| `horon-mascot-face.png`  | icon — head close-up, no chest mark            |
| `horon-mascot-wave.png`  | greeting — standing, one wing raised           |
| `horon-mascot-main.png`  | hero — three-quarter standing, one wing raised |
| `horon-mascot-front.png` | front-facing standing, both wings down         |
| `horon-mascot-think.png` | thinking — wing to the chin                    |
| `horon-mascot-sit.png`   | sitting                                        |
| `horon-mascot-cheer.png` | cheering — both wings up, mid-jump             |

## Provenance

- Source originals live in `core/.hyper/image-maker/호론-캐릭터/` (navy character on a navy field).
- Each file is a **color-only edit** of its original: the drawing, pose, framing, and lighting are unchanged;
  only the palette was swapped to the brand colors above on a light cream field.
- Recolor run 2026-10-14 through the `image-maker` skill over the `codex-chatgpt-web` bridge:
  `codex exec --model chatgpt-web/gpt-6-pro -i <source.png>` with an explicit
  "keep the design identical, change only these colors" instruction.
- Background removal: the cream field and the soft contact shadow were cut with `rembg`
  (U²-Net), then the alpha was kept at 1254×1254. The flat contact shadow is intentionally removed.
- Exact recolor prompts: `design/.omo/imgedit-face2.txt`, `design/.omo/imgedit-wave2.txt`,
  `design/.omo/imgedit-main.txt` … `imgedit-cheer.txt` (and `/tmp/horon-prompt-<cut>.txt` at run time).
