#!/usr/bin/env node
// main에 올라온 커밋으로 게시할 버전을 정합니다. publish.yml이 실행합니다.
//
// - 버전 라인(major.minor)은 packages/{tokens,react,lynx}/package.json이 정합니다. 세 값은 같아야 합니다.
// - npm에 아직 아무것도 없으면 `<라인>.0`(지금은 0.1.0)으로 시작합니다.
// - 이미 게시된 버전이 있으면 PATCH만 하나 올립니다. npm의 라인과 package.json의 라인이
//   다르면(MAJOR·MINOR 변경) 게시하지 않고 실패합니다.
// - 직전 실행이 일부 패키지만 올리고 도중에 실패했다면, 빠진 패키지만 같은 버전으로 채웁니다.
//
// 사용법: node .github/scripts/release-version.mjs [--write]
//   --write  계산한 버전을 세 package.json에 적습니다(CI 작업 공간 안에서만, 커밋하지 않음).
// 결과 버전은 표준 출력 마지막 줄과, GITHUB_OUTPUT이 있으면 `version=` 줄로 남깁니다.

import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const PACKAGES = [
	{ name: "@horon-ai/tokens", file: "packages/tokens/package.json" },
	{ name: "@horon-ai/react", file: "packages/react/package.json" },
	{ name: "@horon-ai/lynx", file: "packages/lynx/package.json" },
];
const REGISTRY = process.env.NPM_REGISTRY_URL ?? "https://registry.npmjs.org";
const STABLE = /^(\d+)\.(\d+)\.(\d+)$/;

function fail(message) {
	console.error(`::error::${message}`);
	process.exit(1);
}

function parse(version, where) {
	const match = STABLE.exec(version);
	if (!match) fail(`${where}의 버전 ${version}은 X.Y.Z 형식이 아닙니다.`);
	return match.slice(1).map(Number);
}

async function publishedVersions(name) {
	const response = await fetch(`${REGISTRY}/${encodeURIComponent(name)}`, {
		headers: { accept: "application/vnd.npm.install-v1+json" },
	});
	if (response.status === 404) return [];
	if (!response.ok) fail(`${name} 조회 실패: HTTP ${response.status}`);
	const body = await response.json();
	// 프리릴리스(0.1.0-beta 등)는 이 흐름이 만들지 않으므로 계산에서 뺍니다.
	return Object.keys(body.versions ?? {}).filter((v) => STABLE.test(v));
}

const manifests = PACKAGES.map((pkg) => {
	const text = readFileSync(pkg.file, "utf8");
	return { ...pkg, text, version: JSON.parse(text).version };
});

const [first] = manifests;
for (const m of manifests) {
	if (m.version !== first.version) {
		fail(
			`${first.name}(${first.version})와 ${m.name}(${m.version})의 package.json 버전이 다릅니다. 세 패키지는 같은 버전으로 게시합니다.`,
		);
	}
}
const [major, minor] = parse(first.version, first.file);
const line = `${major}.${minor}`;

const published = new Map();
for (const m of manifests) published.set(m.name, await publishedVersions(m.name));

let maxPatch = -1;
for (const [name, versions] of published) {
	for (const version of versions) {
		const [ma, mi, pa] = parse(version, `npm ${name}`);
		if (ma !== major || mi !== minor) {
			fail(
				`npm의 ${name}@${version}은 package.json 라인 ${line}.x와 다릅니다. 자동 게시는 PATCH만 올립니다. MAJOR·MINOR를 바꾸려면 이 스크립트의 규칙부터 바꾸세요.`,
			);
		}
		maxPatch = Math.max(maxPatch, pa);
	}
}

let next;
if (maxPatch < 0) {
	next = `${line}.0`;
	console.log(`npm에 게시된 버전이 없습니다. ${next}으로 시작합니다.`);
} else {
	const latest = `${line}.${maxPatch}`;
	const missing = [...published].filter(([, versions]) => !versions.includes(latest)).map(([name]) => name);
	if (missing.length > 0) {
		next = latest;
		console.log(`${missing.join(", ")}에 ${latest}이 빠져 있습니다. 같은 버전으로 채웁니다.`);
	} else {
		next = `${line}.${maxPatch + 1}`;
		console.log(`npm 최신 ${latest} → ${next}`);
	}
}

if (process.argv.includes("--write")) {
	for (const m of manifests) {
		// `bun pm pack`은 `workspace:*`를 package.json이 아니라 bun.lock에 적힌 워크스페이스
		// 버전(0.1.0)으로 바꿉니다. 그래서 형제 패키지 의존도 여기서 같은 버전으로 직접 고정합니다.
		let updated = m.text.replace(/("version"\s*:\s*)"[^"]*"/, `$1"${next}"`);
		for (const sibling of manifests) {
			updated = updated.replace(new RegExp(`("${sibling.name}"\\s*:\\s*)"workspace:[^"]*"`, "g"), `$1"${next}"`);
		}
		writeFileSync(m.file, updated);
	}
}

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${next}\n`);
console.log(next);
