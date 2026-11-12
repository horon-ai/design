/**
 * License guard. The repository root `LICENSE` is the single source; each
 * published package ships a byte-identical copy so a tarball carries the terms
 * on its own, and `package.json` must point at that copy. Without this gate the
 * copies drift silently and an installed package can end up with terms that no
 * longer match the repository.
 */
import { describe, expect, test } from "bun:test";

const repo = `${import.meta.dir}/..`;
const read = (path: string) => Bun.file(`${repo}/${path}`).text();

const PUBLISHED = ["packages/react", "packages/lynx", "packages/tokens"];

/** Unpublished (path-only) packages still carry the terms next to their code. */
const UNPUBLISHED = ["packages/flutter"];

/** Packages that vendor or bundle third-party artwork, so they ship its notice. */
const WITH_NOTICES = ["packages/react", "packages/lynx"];

const rootLicense = await read("LICENSE");
const rootNotices = await read("THIRD_PARTY_NOTICES.md");

describe("license", () => {
  test("root LICENSE is PolyForm Strict 1.0.0", () => {
    expect(rootLicense.split("\n")[0]).toBe("# PolyForm Strict License 1.0.0");
    expect(rootLicense).toContain("<https://polyformproject.org/licenses/strict/1.0.0>");
  });

  for (const dir of PUBLISHED) {
    test(`${dir} ships the same LICENSE`, async () => {
      expect(await read(`${dir}/LICENSE`)).toBe(rootLicense);
    });

    test(`${dir} declares and publishes its LICENSE`, async () => {
      const manifest = JSON.parse(await read(`${dir}/package.json`)) as {
        license?: string;
        files?: string[];
      };

      expect(manifest.license).toBe("SEE LICENSE IN LICENSE");
      expect(manifest.files).toContain("LICENSE");
    });
  }

  for (const dir of UNPUBLISHED) {
    test(`${dir} ships the same LICENSE`, async () => {
      expect(await read(`${dir}/LICENSE`)).toBe(rootLicense);
    });
  }

  for (const dir of WITH_NOTICES) {
    test(`${dir} ships the same third-party notices`, async () => {
      expect(await read(`${dir}/THIRD_PARTY_NOTICES.md`)).toBe(rootNotices);

      const manifest = JSON.parse(await read(`${dir}/package.json`)) as { files?: string[] };

      expect(manifest.files).toContain("THIRD_PARTY_NOTICES.md");
    });
  }
});
