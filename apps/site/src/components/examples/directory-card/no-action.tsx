import { DirectoryCard } from "@horon-ai/react";
import { Folder, HardDrives } from "@phosphor-icons/react";

export default function DirectoryCardNoAction() {
  return (
    <div className="flex w-full flex-col gap-3">
      <DirectoryCard icon={<Folder />} name="Product" description="Specs, research and launch notes." />
      <DirectoryCard icon={<HardDrives />} name="Archive" description="Closed work from 2025." />
    </div>
  );
}
