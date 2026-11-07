import { Icon } from "../../src/icons";
import { DirectoryCard } from "../../src/components/directory-card";
import { Backdrop } from "./backdrop";

/** Two cards with an add button and one without, on one surface. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <DirectoryCard
        surface={surface}
        className="w-full max-w-[400px]"
        icon={<Icon name="GithubLogo" />}
        name="GitHub"
        description="Read issues, open pull requests, and review code."
        onAdd={() => undefined}
      />
      <DirectoryCard
        surface={surface}
        className="w-full max-w-[400px]"
        icon={<Icon name="Notebook" />}
        name="Notion"
        description="Search pages and databases, then draft new notes from a conversation with your team."
        onAdd={() => undefined}
      />
      <DirectoryCard
        surface={surface}
        className="w-full max-w-[400px]"
        icon={<Icon name="Folder" />}
        name="Local files"
      />
    </view>
  );
}

/** Solid and glass directories, mirroring the site demo. */
export default function DirectoryCardDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex w-full flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
