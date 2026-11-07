import { DirectoryCard } from "@horon-ai/react";
import { Folder, GithubLogo, Notebook } from "@phosphor-icons/react";

export default function DirectoryCardAdd() {
  return (
    <div className="flex w-full flex-col gap-3">
      <DirectoryCard
        icon={<GithubLogo />}
        name="GitHub"
        description="Read issues, open pull requests, and review code."
        onAdd={() => undefined}
        addLabel="Connect GitHub"
      />
      <DirectoryCard
        icon={<Notebook />}
        name="Notion"
        description="Search pages and databases, then draft notes from a conversation."
        onAdd={() => undefined}
        addLabel="Connect Notion"
      />
      <DirectoryCard
        icon={<Folder />}
        name="Local files"
        description="Index a folder on this device."
        onAdd={() => undefined}
        addLabel="Choose folder"
      />
    </div>
  );
}
