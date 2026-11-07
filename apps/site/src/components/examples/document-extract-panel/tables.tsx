import { DocumentExtractPanel } from "@horon-ai/react";

function LineSheet() {
  return (
    <>
      <span className="text-label-lg text-neutral-900">Statement of work</span>
      {[
        ["Product design sprint, week 41", "5 days", "7,000.00"],
        ["Usability testing sessions", "6", "1,560.00"],
        ["Design system audit", "1", "2,400.00"],
      ].map(([name, qty, amount]) => (
        <div key={name} className="flex gap-2 text-caption text-neutral-900">
          <span className="min-w-0 flex-1">{name}</span>
          <span className="w-10.5 text-end">{qty}</span>
          <span className="w-15.5 text-end">{amount}</span>
        </div>
      ))}
    </>
  );
}

export default function DocumentExtractPanelTables() {
  return (
    <div className="flex w-full justify-center">
      <DocumentExtractPanel
        fileName="larkspur-sow.pdf"
        sheet={<LineSheet />}
        groups={[
          {
            id: "lines",
            label: "Line items",
            fields: [
              {
                id: "items",
                label: "Line items",
                type: "Table",
                columns: [
                  { label: "Description" },
                  { label: "Qty", align: "end", width: 48 },
                  { label: "Amount", align: "end", width: 72 },
                ],
                rows: [
                  ["Product design sprint, week 41", "5", "7,000.00"],
                  ["Usability testing sessions", "6", "1,560.00"],
                  ["Design system audit", "1", "2,400.00"],
                ],
              },
              { id: "subtotal", label: "Subtotal", value: "11,005.00", type: "Amount" },
              {
                id: "vat",
                label: "VAT",
                value: "891.41",
                type: "Amount",
                status: "check",
              },
            ],
          },
        ]}
        onExtract={() => undefined}
      />
    </div>
  );
}
