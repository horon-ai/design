import type { APIRoute } from "astro";
import { componentGroups, components, componentsInGroup } from "@/data/components";
import { foundationsNav } from "@/data/nav";

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://design.horon.ai";
  const link = (path: string) => new URL(path, origin).toString();

  const lines = [
    "# HORON Design System",
    "",
    "> HORON 제품을 위한 디자인 시스템. 토큰 하나에서 웹 CSS와 네이티브 값이 함께 나오고, @horon/web 컴포넌트가 그 값을 참조합니다.",
    "",
    "## Docs",
    "",
    `- [Get Started](${link("/get-started")}): 설치와 첫 화면 구성`,
    `- [Foundations](${link("/foundations")}): 색, 타이포, 간격, 반경, 높이, 모션, 유리 표면`,
    `- [Components](${link("/components")}): 컴포넌트 전체 목록`,
    `- [Updates](${link("/updates")}): 변경 기록`,
    "",
    "## Foundations",
    "",
    ...foundationsNav.slice(1).map((item) => `- [${item.label}](${link(item.href)})`),
    "",
    "## Components",
    "",
  ];

  for (const group of componentGroups) {
    lines.push(`### ${group.title}`, "");
    for (const component of componentsInGroup(group.id)) {
      lines.push(`- [${component.title}](${link(`/components/${component.slug}`)}): ${component.description}`);
    }
    lines.push("");
  }

  lines.push(`총 ${components.length}개 컴포넌트.`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
