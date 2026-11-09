#!/usr/bin/env node
// main에 올라온 커밋으로 게시할 버전을 정합니다. publish.yml이 실행합니다.
//
// - 버전 라인(major.minor)은 packages/{tokens,react,lynx}/package.json이 정합니다. 세 값은 같아야 합니다.
// - npm에 아직 아무것도 없으면 `<라인>.0`(지금은 0.1.0)으로 시작합니다.
// - 이미 게시된 버전이 있으면 PATCH만 하나 올립니다. npm의 라인과 package.json의 라인이
//   다르면(MAJOR·MINOR 변경) 게시하지 않고 실패합니다.
// - 직전 실행이 일부 패키지만 올리고 도중에 실패했다면, 빠진 패키지만 같은 버전으로 채웁니다.
//
// 사용법: node .github/scripts/release-version.mjs [--write] [--prerelease <id>]
//   --write             계산한 버전을 세 package.json에 적습니다(CI 작업 공간 안에서만, 커밋하지 않음).
//   --prerelease <id>   다음 PATCH의 프리릴리스(`0.1.4-rc.0`, `0.1.4-rc.1` …)를 고릅니다. 정식 버전
//                       계산에는 영향을 주지 않습니다. 빠진 패키지가 있으면 같은 번호로 채웁니다.
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
	return Object.keys(body.versions ?? {});
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

// 정식 버전 계산에는 X.Y.Z만 씁니다. 프리릴리스(0.1.4-rc.0, 0.0.0-stage 등)는 --prerelease 계산에만 씁니다.
const allPublished = new Map();
for (const m of manifests) allPublished.set(m.name, await publishedVersions(m.name));
const published = new Map([...allPublished].map(([name, versions]) => [name, versions.filter((v) => STABLE.test(v))]));

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

const prereleaseAt = process.argv.indexOf("--prerelease");
if (prereleaseAt !== -1) {
	const id = process.argv[prereleaseAt + 1] ?? "";
	if (!/^[a-z]+$/.test(id)) fail(`--prerelease 값 ${id || "(없음)"}은 rc 같은 영문 소문자여야 합니다.`);
	// 빠진 PATCH를 채우는 중이어도 프리릴리스는 아직 게시되지 않은 다음 PATCH를 바탕으로 만듭니다.
	const base = maxPatch < 0 ? `${line}.0` : `${line}.${maxPatch + 1}`;
	const pattern = new RegExp(`^${base.replaceAll(".", "\\.")}-${id}\\.(\\d+)$`);
	let maxPre = -1;
	for (const versions of allPublished.values()) {
		for (const version of versions) {
			const match = pattern.exec(version);
			if (match) maxPre = Math.max(maxPre, Number(match[1]));
		}
	}
	const latestPre = `${base}-${id}.${maxPre}`;
	const missingPre = maxPre < 0 ? [] : [...allPublished].filter(([, versions]) => !versions.includes(latestPre));
	next = missingPre.length > 0 ? latestPre : `${base}-${id}.${maxPre + 1}`;
	console.log(`프리릴리스 ${next}`);
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
