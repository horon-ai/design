import { DirectoryCard } from "@horon-ai/react";
import { GithubLogo } from "@phosphor-icons/react";

export default function DirectoryCardThumbnail() {
  return (
    <DirectoryCard
      className="w-[310px]"
      icon={<GithubLogo />}
      name="GitHub"
      description="Issues and pull requests."
      onAdd={() => undefined}
    />
  );
}
