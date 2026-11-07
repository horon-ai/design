import { Composer } from "@horon-ai/react";

export default function ComposerThumbnail() {
  // Text in the field swaps the voice button for the ink send button, the state
  // that shows the whole control.
  return <Composer className="w-80" defaultValue="Draft a weekly summary" />;
}
