import { DocumentExtractPanel, ExtractHighlight } from "@horon-ai/react";

const muted = "text-caption text-neutral-500";
const plain = "text-caption text-neutral-900";

function NoteSheet() {
  return (
    <>
      <span className="text-label-lg text-neutral-900">Call notes</span>
      <div className="flex flex-col gap-1">
        <span className={muted}>Account</span>
        <ExtractHighlight>
          <span className={plain}>Fjord Analytics AG</span>
        </ExtractHighlight>
      </div>
      <div className="flex flex-col gap-1">
        <span className={muted}>Owner</span>
        <ExtractHighlight tone="brand">
          <span className={plain}>Lena Brunner</span>
        </ExtractHighlight>
      </div>
      <div className="flex flex-col gap-1">
        <span className={muted}>Next step</span>
        <ExtractHighlight tone="neutral">
          <span className={plain}>Send the revised SOW by Friday</span>
        </ExtractHighlight>
      </div>
      <div className="flex flex-col gap-1">
        <span className={muted}>Renewal</span>
        <ExtractHighlight tone="ink">
          <span className={plain}>Renews 1 January 2027</span>
        </ExtractHighlight>
      </div>
    </>
  );
}

export default function DocumentExtractPanelHighlight() {
  return (
    <div className="flex w-full justify-center">
      <DocumentExtractPanel
        fileName="fjord-call-notes.pdf"
        sheet={<NoteSheet />}
        groups={[
          {
            id: "notes",
            label: "Call notes",
            fields: [
              { id: "account", label: "Account", value: "Fjord Analytics AG", type: "Text" },
              { id: "owner", label: "Owner", value: "Lena Brunner", type: "Person" },
              { id: "next", label: "Next step", value: "Send the revised SOW by Friday", type: "Text" },
              { id: "renewal", label: "Renewal", value: "2027-01-01", type: "Date", status: "check" },
            ],
          },
        ]}
      />
    </div>
  );
}
