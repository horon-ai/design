import { MenuItem, SplitButton } from "@horon-ai/react";
import { Plus, Rocket } from "@phosphor-icons/react";

export default function SplitButtonNoMenu() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <SplitButton icon={<Rocket />}>Deploy</SplitButton>
      <SplitButton
        icon={<Plus />}
        menu={
          <>
            <MenuItem>New document</MenuItem>
            <MenuItem>New folder</MenuItem>
          </>
        }
      >
        Create
      </SplitButton>
    </div>
  );
}
