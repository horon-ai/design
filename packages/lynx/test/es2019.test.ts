/**
 * Lynx's main thread runs ES2019 (PrimJS), so a library call added in ES2020 or
 * later (`String.prototype.replaceAll`, `Array.prototype.at`, `toSorted`, the
 * `dateStyle` option of `Intl.DateTimeFormat`) throws or silently degrades on
 * device while every web and test run passes. This gate typechecks the shipped
 * code against the ES2019 library alone, so such a call fails here first.
 */
import { expect, test } from "bun:test";
import { dirname, join, relative } from "node:path";
import ts from "typescript";

const pkg = join(import.meta.dir, "..");

/** Type-only names that exist in newer lib files but leave nothing at run time. */
const TYPE_ONLY = ["'Intl' has no exported member 'LocalesArgument'"];

test("the package and its gallery use no library API newer than ES2019", () => {
  const configPath = join(pkg, "tsconfig.json");
  const config = ts.readConfigFile(configPath, (path) => ts.sys.readFile(path));
  const parsed = ts.parseJsonConfigFileContent(
    {
      ...config.config,
      compilerOptions: { ...config.config.compilerOptions, lib: ["ES2019"], types: ["@lynx-js/rspeedy/client"] },
      include: ["src", "example"],
      exclude: ["example/dist", "node_modules"],
    },
    ts.sys,
    dirname(configPath),
  );
  const options = { ...parsed.options, noEmit: true, skipLibCheck: true };
  // Resolve `types` from this package, not from the directory `bun test` started in (the repo root in CI).
  const host = { ...ts.createCompilerHost(options), getCurrentDirectory: () => pkg };
  const program = ts.createProgram({ rootNames: parsed.fileNames, options, host });

  const problems = ts
    .getPreEmitDiagnostics(program)
    .map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file === undefined || diagnostic.start === undefined) return message;
      const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      return `${relative(pkg, diagnostic.file.fileName)}:${line + 1} ${message}`;
    })
    .filter((problem) => !TYPE_ONLY.some((allowed) => problem.includes(allowed)));

  expect(problems).toEqual([]);
  // A whole-package type check takes several seconds, past bun's 5 s default.
}, 60_000);
