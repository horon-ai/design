import { DocumentExtractPanel } from "@horon-ai/react";

function ReceiptSheet() {
  return (
    <>
      <span className="text-label-lg text-neutral-900">Receipt</span>
      <div className="flex flex-col gap-0.5 text-caption text-neutral-900">
        <span>Harbour Coffee Roasters</span>
        <span>12 October 2026 · 09:41</span>
        <span>4 items · CHF 38.60</span>
      </div>
    </>
  );
}

export default function DocumentExtractPanelFooter() {
  return (
    <div className="flex w-full justify-center">
      <DocumentExtractPanel
        fileName="receipt-1012.pdf"
        defaultZoom={100}
        sheet={<ReceiptSheet />}
        bot={{ initial: "C", name: "Chief of staff", elapsed: "2.1s" }}
        onOpenFile={() => undefined}
        onAcceptAll={() => undefined}
        groups={[
          {
            id: "receipt",
            label: "Receipt",
            fields: [
              { id: "merchant", label: "Merchant", value: "Harbour Coffee Roasters", type: "Text" },
              { id: "date", label: "Date", value: "2026-10-12", type: "Date" },
              { id: "sum", label: "Total", value: "38.60", type: "Amount" },
              { id: "vat", label: "VAT", value: "2.68", type: "Amount", status: "check" },
            ],
          },
        ]}
      />
    </div>
  );
}
