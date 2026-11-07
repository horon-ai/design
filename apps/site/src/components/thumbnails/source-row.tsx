import { SourceRow } from "@horon-ai/react";
import { Globe } from "@phosphor-icons/react";

/* The desktop stage bars (4 × 44px) need about 470px of row; the tile is 400. These classes put the row on the
   component's own narrow layout — 24px bars — so the name, the pipeline and the percentage all fit. */
export default function SourceRowThumbnail() {
  return (
    <div className="w-[372px]">
      <SourceRow
        className="[&>span[aria-hidden]>span]:sm:w-6!"
        status="indexing"
        icon={<Globe aria-hidden />}
        name="wiki.horon.ai"
        detail="296 chunks · web"
        progress={62}
      />
    </div>
  );
}
