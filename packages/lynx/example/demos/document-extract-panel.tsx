import { DocumentExtractPanel, ExtractHighlight } from "../../src/components/document-extract-panel";

const muted = "text-caption text-neutral-500";
const plain = "text-caption text-neutral-900";

const lines = [
  ["Product design sprint, week 41", "5 days", "7,000.00"],
  ["Usability testing sessions", "6", "1,560.00"],
  ["Design system audit", "1", "2,400.00"],
];

function InvoiceSheet() {
  return (
    <>
      <view className="flex flex-row items-center">
        <ExtractHighlight>
          <text className="text-label-lg text-neutral-900">larkspur studio</text>
        </ExtractHighlight>
        <view className="min-w-0 flex-1" />
        <text className="text-label-lg text-neutral-900">Invoice</text>
      </view>
      <view className="flex flex-row gap-6">
        <view className="flex flex-1 flex-col gap-0.5">
          <text className={muted}>From</text>
          <text className={plain}>Larkspur Studio GmbH</text>
          <text className={plain}>Langstrasse 112</text>
          <text className={plain}>8004 Zürich, Switzerland</text>
        </view>
        <view className="flex flex-1 flex-col gap-0.5">
          <text className={muted}>Bill to</text>
          <text className={plain}>Fjord Analytics AG</text>
          <text className={plain}>Attn. Lena Brunner</text>
          <text className={plain}>Seefeldstrasse 45</text>
        </view>
      </view>
      <view className="h-px self-stretch bg-neutral-900" style={{ opacity: 0.1 }} />
      <view className="flex flex-row gap-2">
        <ExtractHighlight className="flex-1">
          <text className={muted}>Invoice no.</text>
          <text className={plain}>INV-2026-0418</text>
        </ExtractHighlight>
        <ExtractHighlight className="flex-1">
          <text className={muted}>Issue date</text>
          <text className={plain}>14 October 2026</text>
        </ExtractHighlight>
        <view className="flex flex-1 flex-col gap-px px-1 py-0.5">
          <text className={muted}>Payment terms</text>
          <text className={plain}>30 days net</text>
        </view>
      </view>
      <ExtractHighlight tone="brand" className="p-1">
        {lines.map(([name, qty, amount]) => (
          <view key={name} className="flex flex-row gap-2 py-1.5">
            <view className="flex flex-1">
              <text className={plain}>{name}</text>
            </view>
            <view className="flex w-[42px] flex-row justify-end">
              <text className={`${plain} text-right`}>{qty}</text>
            </view>
            <view className="flex w-[62px] flex-row justify-end">
              <text className={`${plain} text-right`}>{amount}</text>
            </view>
          </view>
        ))}
      </ExtractHighlight>
      <view className="flex flex-row justify-end">
        <ExtractHighlight tone="neutral" className="w-[210px] gap-1">
          <view className="flex flex-row items-center">
            <text className={muted}>Subtotal</text>
            <view className="min-w-0 flex-1" />
            <text className={plain}>11,005.00</text>
          </view>
          <view className="flex flex-row items-center">
            <text className={plain}>Total due CHF</text>
            <view className="min-w-0 flex-1" />
            <text className={plain}>11,896.41</text>
          </view>
        </ExtractHighlight>
      </view>
      <view className="flex flex-row items-center gap-3">
        <view className="w-24">
          <text className={muted}>IBAN</text>
        </view>
        <ExtractHighlight tone="ink">
          <text className={plain}>CH56 0483 5012 3456 7800 9</text>
        </ExtractHighlight>
      </view>
    </>
  );
}

/** The invoice extractor: the sheet on the left, the Fields view with one row to check on the right. */
export default function DocumentExtractPanelDemo() {
  return (
    <view className="flex w-full flex-row justify-center p-4">
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
              { id: "customer", label: "Customer no.", value: "FJ-20931", type: "Text" },
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
                  ["Prototype hosting, October", "1", "45.00", "45.00"],
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
    </view>
  );
}
