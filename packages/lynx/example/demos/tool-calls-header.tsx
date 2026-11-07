import { ToolCall } from "../../src/components/tool-call";
import { ToolCallsHeader } from "../../src/components/tool-calls-header";
import { Icon } from "../../src/icons";

const search = <Icon name="MagnifyingGlass" size={14} color="text-secondary" />;
const doc = <Icon name="FileText" size={14} color="text-secondary" />;
const list = <Icon name="ListBullets" size={14} color="text-secondary" />;

/**
 * An open group of three tool chips with two calls under it, and a closed group
 * that stays folded until its header is tapped. Mirrors the site demo.
 */
export default function ToolCallsHeaderDemo() {
  return (
    <view className="flex w-full max-w-[560px] flex-col gap-6 p-4">
      <ToolCallsHeader icons={[search, doc, list]} elapsed="4.0s">
        <ToolCall
          status="done"
          tool={{ icon: search, name: "Web search" }}
          summary="Q3 revenue benchmarks"
          elapsed="1.2s"
          args={{ query: "Q3 SaaS revenue benchmarks" }}
          result={{ hits: 8 }}
        />
        <ToolCall status="running" tool={{ icon: doc, name: "Docs" }} summary="Investor update template" />
      </ToolCallsHeader>
      <ToolCallsHeader defaultOpen={false} icons={[search]} title="Used 1 tool" elapsed="1.2s">
        <ToolCall
          status="done"
          tool={{ icon: search, name: "Web search" }}
          summary="Q3 revenue benchmarks"
          elapsed="1.2s"
        />
      </ToolCallsHeader>
    </view>
  );
}
