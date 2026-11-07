import { DocumentExtractPanel, ExtractHighlight } from "@horon-ai/react";

const muted = "text-caption text-neutral-500";
const plain = "text-caption text-neutral-900";

function InvoiceSheet() {
  return (
    <>
      <div className="flex items-center">
        <ExtractHighlight>
          <span className="text-label-lg text-neutral-900">larkspur studio</span>
        </ExtractHighlight>
        <span className="min-w-0 flex-1" />
        <span className="text-label-lg text-neutral-900">Invoice</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={muted}>Bill to</span>
        <span className={plain}>Fjord Analytics AG</span>
        <span className={plain}>Seefeldstrasse 45, 8008 Zürich</span>
      </div>
      <div className="flex gap-2">
        <ExtractHighlight className="flex-1">
          <span className={muted}>Invoice no.</span>
          <span className={plain}>INV-2026-0418</span>
        </ExtractHighlight>
        <ExtractHighlight className="flex-1">
          <span className={muted}>Issue date</span>
          <span className={plain}>14 October 2026</span>
        </ExtractHighlight>
      </div>
      <div className="flex items-center gap-3">
        <span className={`${muted} w-24`}>Total due CHF</span>
        <ExtractHighlight tone="ink">
          <span className={plain}>11,896.41</span>
        </ExtractHighlight>
      </div>
    </>
  );
}

export default function DocumentExtractPanelFields() {
  return (
    <div className="flex w-full justify-center">
      <DocumentExtractPanel
        fileName="larkspur-invoice-0418.pdf"
        pageLabel="1 / 2"
        sheet={<InvoiceSheet />}
        groups={[
          {
            id: "invoice",
            label: "Invoice",
            fields: [
              { id: "vendor", label: "Vendor", value: "Larkspur Studio GmbH", type: "Text" },
              { id: "no", label: "Invoice no.", value: "INV-2026-0418", type: "Text" },
              { id: "issue", label: "Issue date", value: "2026-10-14", type: "Date" },
              { id: "due", label: "Due date", value: "2026-11-13", type: "Date", status: "check" },
            ],
          },
          {
            id: "totals",
            label: "Totals",
            fields: [
              { id: "currency", label: "Currency", value: "CHF", type: "Code" },
              { id: "total", label: "Total", value: "11,896.41", type: "Amount" },
            ],
          },
        ]}
      />
    </div>
  );
}
