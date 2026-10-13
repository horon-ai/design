# Horon design assets

Brand mascot assets for Horon, generated for the design system.

## Character

Horon's mascot is a round falcon chick (the product name is Horus + ON). Design invariants:

- Head: one heavily rounded square with two short feather tufts on the crown.
- Face plate: a large soft oval in warm cream, framed by a dark rounded hood.
- Eyes: two large round dark eyes, each with one small white highlight.
- Beak: a short soft triangular beak, tilted very slightly to the character's left.
- Chest mark (full-body cuts only): a modern geometric eye — a shallow arc over a small dot over an inverted arc.
- Material: soft matte clay, broad rounded bevels, one flat contact shadow under the feet.

## Brand palette

| Token | Hex       | Role                                     |
| ----- | --------- | ---------------------------------------- |
| ink   | `#1C1A17` | hood, body, wings, eyes                  |
| cream | `#FBF7F0` | face plate, field background, chest mark |
| gold  | `#E0921F` | beak, feet                               |

## Files

| File                    | Cut                                                      | Canvas    |
| ----------------------- | -------------------------------------------------------- | --------- |
| `horon-mascot-face.png` | icon — head close-up, no chest mark, no shadow           | 1254×1254 |
| `horon-mascot-wave.png` | greeting — standing, one wing raised, chest mark visible | 1254×1254 |

## Provenance

- Generated 2026-10-14 via the `image-maker` skill over the `codex-chatgpt-web` bridge
  (`codex exec --model chatgpt-web/gpt-6-pro`), whose own `image_gen` tool produced each cut.
- The character design follows the source set in `core/.hyper/image-maker/호론-캐릭터/` (navy-on-navy
  originals); these cuts keep the character but recolor it to the Horon brand palette above on a light
  cream field, so they sit correctly next to the design system.
- Exact prompts: `design/.omo/imgprompt-face.txt`, `design/.omo/imgprompt-wave.txt`.
