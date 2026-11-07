import { ToolPermissions } from "@horon-ai/react";

export default function ToolPermissionsLongList() {
  return (
    <div className="flex w-full justify-center">
      <ToolPermissions
        title="Workspace tools"
        tools={[
          { name: "search_documents", description: "Full-text search across documents", defaultValue: "allow" },
          { name: "read_document", description: "Read one document with its metadata", defaultValue: "allow" },
          { name: "create_document", description: "Create a document in a folder", defaultValue: "ask" },
          { name: "update_document", description: "Replace a document's body" },
          { name: "share_document", description: "Grant another member access" },
          { name: "delete_document", description: "Remove a document permanently", defaultValue: "off" },
        ]}
      />
    </div>
  );
}
