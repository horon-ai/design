import { DirectoryCard } from "@horon-ai/react";
import { Folder, GithubLogo, Notebook } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <DirectoryCard
        surface={surface}
        className="w-full max-w-100"
        icon={<GithubLogo />}
        name="GitHub"
        description="Read issues, open pull requests, and review code."
        onAdd={() => undefined}
      />
      <DirectoryCard
        surface={surface}
        className="w-full max-w-100"
        icon={<Notebook />}
        name="Notion"
        description="Search pages and databases, then draft new notes from a conversation with your team."
        onAdd={() => undefined}
      />
      <DirectoryCard surface={surface} className="w-full max-w-100" icon={<Folder />} name="Local files" />
    </div>
  );
}

export default function DirectoryCardDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
