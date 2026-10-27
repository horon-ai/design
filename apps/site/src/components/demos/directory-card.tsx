import { DirectoryCard } from "@horon-ai/react";
import { Folder, GithubLogo, Notebook } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function DirectoryCardDemo() {
  return (
    <Backdrop className="flex-col">
      <DirectoryCard
        className="w-full max-w-100"
        icon={<GithubLogo />}
        name="GitHub"
        description="Read issues, open pull requests, and review code."
      />
      <DirectoryCard
        className="w-full max-w-100"
        icon={<Notebook />}
        name="Notion"
        description="Search pages and databases, then draft new notes from a conversation with your team."
      />
      <DirectoryCard className="w-full max-w-100" icon={<Folder />} name="Local files" />
    </Backdrop>
  );
}
