import { ToolCall } from "../../src/components/tool-call";
import { Icon } from "../../src/icons";

/**
 * A finished call with its arguments and result open, and a failed call whose
 * error notice replaces the result section. Mirrors the site demo.
 */
export default function ToolCallDemo() {
  return (
    <view className="flex w-full max-w-[640px] flex-col gap-3 p-4">
      <ToolCall
        defaultOpen
        truncated
        status="done"
        tool={{ icon: <Icon name="MagnifyingGlass" size={16} color="text-secondary" />, name: "Web search" }}
        summary="Searched the web for 'CRM pricing 2026'"
        elapsed="1.6s"
        args={{ query: "CRM pricing 2026 small sales team", max_results: 5 }}
        result={{ results: [{ title: "HubSpot pricing", price: 20 }], took_ms: 1600 }}
      />
      <ToolCall
        status="failed"
        tool={{ icon: <Icon name="MagnifyingGlass" size={16} color="text-secondary" />, name: "Web search" }}
        summary="Searched the web for 'CRM pricing 2026'"
        elapsed="8.0s"
        error="Request timed out after 8s."
        onRetry={() => undefined}
      />
    </view>
  );
}
