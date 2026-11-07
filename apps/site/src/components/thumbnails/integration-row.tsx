import { IntegrationRow } from "@horon-ai/react";
import { EnvelopeSimple } from "@phosphor-icons/react";

export default function IntegrationRowThumbnail() {
  return (
    <IntegrationRow
      className="w-90"
      icon={<EnvelopeSimple />}
      name="Gmail"
      detail="Read and draft emails"
      status="connected"
    />
  );
}
