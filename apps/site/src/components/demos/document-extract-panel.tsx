import { DocumentExtractPanel, ExtractHighlight } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const muted = "text-caption text-text-secondary";
const plain = "text-caption text-text-primary";

function InvoiceSheet() {
  return (
    <>
      <div className="flex items-center">
        <ExtractHighlight>
          <span className="text-label-lg text-text-primary">larkspur studio</span>
        </ExtractHighlight>
        <span className="min-w-0 flex-1" />
        <span className="text-label-lg text-text-primary">Invoice</span>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className={muted}>From</span>
          <span className={plain}>Larkspur Studio GmbH</span>
          <span className={plain}>Langstrasse 112</span>
          <span className={plain}>8004 Zürich, Switzerland</span>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className={muted}>Bill to</span>
          <span className={plain}>Fjord Analytics AG</span>
          <span className={plain}>Attn. Lena Brunner</span>
          <span className={plain}>Seefeldstrasse 45</span>
        </div>
      </div>
      <div className="h-px self-stretch bg-overlay-ink-8" />
      <div className="flex gap-2">
        <ExtractHighlight className="flex-1">
          <span className={muted}>Invoice no.</span>
          <span className={plain}>INV-2026-0418</span>
        </ExtractHighlight>
        <ExtractHighlight className="flex-1">
          <span className={muted}>Issue date</span>
          <span className={plain}>14 October 2026</span>
        </ExtractHighlight>
        <div className="flex flex-1 flex-col gap-px px-1 py-0.5">
          <span className={muted}>Payment terms</span>
          <span className={plain}>30 days net</span>
        </div>
      </div>
      <ExtractHighlight tone="brand" className="p-1">
        {[
          ["Product design sprint, week 41", "5 days", "7,000.00"],
          ["Usability testing sessions", "6", "1,560.00"],
          ["Design system audit", "1", "2,400.00"],
        ].map(([name, qty, amount]) => (
          <div key={name} className="flex gap-2 py-1.5">
            <span className={`${plain} flex-1`}>{name}</span>
            <span className={`${plain} w-10.5 text-end`}>{qty}</span>
            <span className={`${plain} w-15.5 text-end`}>{amount}</span>
          </div>
        ))}
      </ExtractHighlight>
      <div className="flex justify-end">
        <ExtractHighlight tone="neutral" className="w-52.5 gap-1">
          <div className="flex">
            <span className={muted}>Subtotal</span>
            <span className="min-w-0 flex-1" />
            <span className={plain}>11,005.00</span>
          </div>
          <div className="flex">
            <span className={plain}>Total due CHF</span>
            <span className="min-w-0 flex-1" />
            <span className={plain}>11,896.41</span>
          </div>
        </ExtractHighlight>
      </div>
      <div className="flex items-center gap-3">
        <span className={`${muted} w-24`}>IBAN</span>
        <ExtractHighlight tone="ink">
          <span className={plain}>CH56 0483 5012 3456 7800 9</span>
        </ExtractHighlight>
      </div>
    </>
  );
}

export default function DocumentExtractPanelDemo() {
  return (
    <Backdrop>
      <DocumentExtractPanel
        fileName="larkspur-invoice-0418.pdf"
        sheet={<InvoiceSheet />}
        bot={{ initial: "C", name: "Chief of staff", elapsed: "2.1s" }}
        groups={[
          {
            id: "invoice",
            label: "Invoice",
            fields: [
              { id: "vendor", label: "Vendor", value: "Larkspur Studio GmbH", type: "Text" },
              { id: "no", label: "Invoice no.", value: "INV-2026-0418", type: "Text" },
              { id: "issue", label: "Issue date", value: "2026-10-14", type: "Date" },
              { id: "due", label: "Due date", value: "2026-11-13", type: "Date", status: "check" },
              {
                id: "lines",
                label: "Line items",
                type: "Table",
                columns: [
                  { label: "Description" },
                  { label: "Qty", align: "end", width: 48 },
                  { label: "Unit price", align: "end", width: 70 },
                  { label: "Amount", align: "end", width: 70 },
                ],
                rows: [
                  ["Product design sprint, week 41", "5", "1,400.00", "7,000.00"],
                  ["Usability testing sessions", "6", "260.00", "1,560.00"],
                  ["Design system audit", "1", "2,400.00", "2,400.00"],
                ],
              },
            ],
          },
          {
            id: "totals",
            label: "Totals",
            fields: [
              { id: "currency", label: "Currency", value: "CHF", type: "Code" },
              { id: "subtotal", label: "Subtotal", value: "11,005.00", type: "Amount" },
              { id: "vat", label: "VAT", value: "891.41", type: "Amount" },
              { id: "total", label: "Total", value: "11,896.41", type: "Amount" },
            ],
          },
          {
            id: "payment",
            label: "Payment",
            fields: [{ id: "iban", label: "IBAN", value: "CH56 0483 5012 3456 7800 9", type: "IBAN" }],
          },
        ]}
      />
    </Backdrop>
  );
}
