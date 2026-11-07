import { InputGroup } from "@horon-ai/react";
import { CaretDown } from "@phosphor-icons/react";

/** The select segment as it renders inline: `Select variant="segment"` needs a hydrated popup, so the
 * tinted prefix is drawn with the same classes its trigger uses. */
function CountrySegment() {
  return (
    <div className="relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-md text-text-primary [&_svg]:size-4 [&_svg]:text-text-secondary">
      +82
      <CaretDown aria-hidden />
    </div>
  );
}

export default function InputGroupThumbnail() {
  return <InputGroup className="w-80" placeholder="Phone number" prefix={<CountrySegment />} />;
}
