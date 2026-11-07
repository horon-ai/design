import { Input } from "@horon-ai/react";
import { MagnifyingGlass, PaperPlaneTilt } from "@phosphor-icons/react";

export default function InputWithIcon() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Input
        className="w-full max-w-72"
        type="search"
        icon={<MagnifyingGlass />}
        placeholder="Search bots"
        aria-label="Search bots"
      />
      <Input
        className="w-full max-w-72"
        icon={<PaperPlaneTilt />}
        defaultValue="Weekly summary for the team"
        aria-label="Message"
      />
      <Input
        className="w-full max-w-72"
        size="lg"
        icon={<MagnifyingGlass />}
        placeholder="Search everything"
        aria-label="Search everything"
      />
    </div>
  );
}
