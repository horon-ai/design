#!/usr/bin/env node
// 문서 사이트(apps/site)가 npm에 게시된 @horon-ai/react·@horon-ai/tokens를 그대로 쓰도록
// CI 작업 공간을 바꿉니다. publish.yml의 site 잡이 실행하며 저장소에는 커밋하지 않습니다.
//
// 저장소에서는 사이트가 `workspace:*`로 패키지 소스를 직접 씁니다. 새 컴포넌트와 데모를 한
// 커밋에 넣을 수 있어야 하기 때문입니다. 배포할 때만 게시본으로 바꿉니다.
//
// Bun은 의존 버전이 워크스페이스 패키지의 버전과 같으면(`npm:` 별칭이어도) npm 대신
// 저장소 폴더를 연결합니다. 그래서 워크스페이스 쪽 버전을 게시될 수 없는 값으로 바꿔
// 사이트의 의존이 항상 레지스트리에서 풀리게 합니다.
//
// 사용법: node .github/scripts/site-use-published.mjs <version>

import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
	console.error(`::error::게시 버전이 필요합니다(X.Y.Z). 받은 값: ${version}`);
	process.exit(1);
}

const WORKSPACE_VERSION = "0.0.0-workspace";
const PACKAGES = ["@horon-ai/tokens", "@horon-ai/react"];

function edit(file, change) {
	const json = JSON.parse(readFileSync(file, "utf8"));
	change(json);
	writeFileSync(file, `${JSON.stringify(json, null, "\t")}\n`);
}

for (const dir of ["packages/tokens", "packages/react"]) {
	edit(`${dir}/package.json`, (json) => {
		json.version = WORKSPACE_VERSION;
	});
}

edit("apps/site/package.json", (json) => {
	for (const name of PACKAGES) {
		if (!json.dependencies?.[name]) {
			console.error(`::error::apps/site/package.json에 ${name} 의존이 없습니다.`);
			process.exit(1);
		}
		json.dependencies[name] = version;
	}
});

console.log(`apps/site → ${PACKAGES.map((name) => `${name}@${version}`).join(", ")}`);
