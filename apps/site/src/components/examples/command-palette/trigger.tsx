import { Button, CommandPalette, DialogTrigger } from "@horon-ai/react";

const groups = [
  {
    label: "Bots",
    items: [
      { value: "chief", label: "Chief of staff", meta: "Horon HQ", tile: "C" },
      { value: "recruiter", label: "Recruiter", meta: "Horon HQ", tile: "R" },
    ],
  },
];

export default function CommandPaletteTrigger() {
  return (
    <CommandPalette
      groups={groups}
      placeholder="Search bots"
      trigger={<DialogTrigger render={<Button variant="solid" />}>Search bots</DialogTrigger>}
    />
  );
}
