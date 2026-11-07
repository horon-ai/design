import { DirectoryCard } from "@horon-ai/react";
import { Folder, GithubLogo, Notebook } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function DirectoryCardGlass() {
  return (
    <Backdrop className="flex-col">
      <DirectoryCard
        className="w-full max-w-100"
        surface="glass"
        icon={<GithubLogo />}
        name="GitHub"
        description="Read issues, open pull requests, and review code."
        onAdd={() => undefined}
        addLabel="Connect GitHub"
      />
      <DirectoryCard
        className="w-full max-w-100"
        surface="glass"
        icon={<Notebook />}
        name="Notion"
        description="Search pages and databases."
        onAdd={() => undefined}
        addLabel="Connect Notion"
      />
      <DirectoryCard
        className="w-full max-w-100"
        surface="glass"
        icon={<Folder />}
        name="Local files"
        description="Index a folder on this device."
      />
    </Backdrop>
  );
}
