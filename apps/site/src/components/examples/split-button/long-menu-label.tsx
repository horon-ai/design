import { MenuItem, SplitButton } from "@horon-ai/react";
import { PaperPlaneTilt } from "@phosphor-icons/react";

const publish = (
  <>
    <MenuItem>Schedule publish</MenuItem>
    <MenuItem>Save as draft</MenuItem>
  </>
);

export default function SplitButtonLongMenuLabel() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <SplitButton icon={<PaperPlaneTilt />} menu={publish}>
        Publish
      </SplitButton>
      <SplitButton menuLabel="Publish options" icon={<PaperPlaneTilt />} menu={publish}>
        Publish
      </SplitButton>
    </div>
  );
}
