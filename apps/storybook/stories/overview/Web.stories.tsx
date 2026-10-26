import type { Meta, StoryObj } from "@storybook/react-vite";

const components = [
  { name: "AgentActivity", figma: "108:660", note: "Thinking, streaming, tool steps and work log." },
  { name: "AgentLane", figma: "113:953", note: "Sub-agent lane card." },
  { name: "AgentPanel", figma: "112:797", note: "Solid agent panel, task composer and picker chips." },
  { name: "ApprovalCard", figma: "64:398", note: "Glass approval card." },
  { name: "Avatar", figma: "61:347", note: "Initials, Bot and Image avatar with a live dot." },
  { name: "Badge", figma: "61:283", note: "Neutral, Brand, Danger and Solid status pill." },
  { name: "Banner", figma: "62:318", note: "Info and Danger glass banner." },
  { name: "BotListRow", figma: "64:456", note: "Bot list row with live avatar." },
  { name: "BottomSheet", figma: "88:808", note: "Thick-glass bottom sheet." },
  { name: "Breadcrumb", figma: "110:948", note: "Breadcrumb with workspace tile." },
  { name: "Button", figma: "55:339", note: "Primary, Glass and Danger in three sizes." },
  { name: "Calendar", figma: "60:245", note: "Month grid with single and range selection." },
  { name: "Card", figma: "63:310", note: "Thick-glass card: Default, Interactive, Selected." },
  { name: "ChatBubble", figma: "64:359", note: "Flat Me and Bot chat bubbles." },
  { name: "ChatControls", figma: "88:659", note: "Jump to latest, new messages, voice input." },
  { name: "Checkbox", figma: "58:217", note: "Off, On and Mixed checkbox." },
  { name: "Chip", figma: "61:302", note: "Clear-glass toggle chip." },
  { name: "CommandPalette", figma: "110:676", note: "Frosted command palette." },
  { name: "Composer", figma: "63:462", note: "Glass message composer." },
  { name: "DataTable", figma: "192:9046", note: "Solid data table with header, tags and footer." },
  { name: "DateField", figma: "60:244", note: "Glass field that opens the calendar." },
  { name: "Dialog", figma: "63:329", note: "Thick-glass dialog on a scrim." },
  { name: "EmptyState", figma: "64:485", note: "Mascot empty state." },
  { name: "Field", figma: "58:163", note: "Label, control, help and error text." },
  { name: "HoronIcon", figma: "256:9116", note: "The Horon falcon-eye icon." },
  { name: "HoronWordmark", figma: "88:808", note: "UI-size Horon wordmark." },
  { name: "IconButton", figma: "57:167", note: "Primary, Ghost and Glass icon-only buttons." },
  { name: "Input", figma: "58:126", note: "Glass or Solid text input, MD and LG." },
  { name: "InputGroup", figma: "60:429", note: "Input with a prefix or suffix segment." },
  { name: "IntegrationRow", figma: "110:883", note: "Integration row: connected, reconnect, not connected." },
  { name: "Kbd", figma: "110:676", note: "Keyboard hint chip." },
  { name: "LiquidGlass", figma: "55:339", note: "The liquid glass layer stack." },
  { name: "Menu", figma: "88:495", note: "Glass menu and solid account/workspace menu." },
  { name: "MessageExtras", figma: "109:667", note: "Message actions, date separator, attachment, code block." },
  { name: "PageHeader", figma: "88:723", note: "Glass header with back, title, actions and filter." },
  { name: "PlanStep", figma: "191:8296", note: "Plan step on a rail." },
  { name: "Progress", figma: "109:733", note: "6px progress bar." },
  { name: "RadioGroup", figma: "58:239", note: "Radio group with 20px radios." },
  { name: "Schedule", figma: "110:765", note: "Time field, weekday picker and routine schedule card." },
  { name: "SegmentedControl", figma: "62:379", note: "Glass segmented control." },
  { name: "Select", figma: "58:162", note: "Glass or Solid select with a glass list." },
  { name: "Sidebar", figma: "88:808", note: "Thick-glass sidebar with groups, tree and account." },
  { name: "Skeleton", figma: "109:733", note: "Placeholder blocks and cards." },
  { name: "SourceRow", figma: "114:1287", note: "Knowledge source with pipeline stages." },
  { name: "Spinner", figma: "109:733", note: "Ink spinner in three sizes." },
  { name: "Switch", figma: "58:264", note: "MD and SM switch." },
  { name: "TabBar", figma: "63:441", note: "Mobile glass tab bar." },
  { name: "Tabs", figma: "62:335", note: "Pill tabs on a glass tray." },
  { name: "TaskRow", figma: "112:939", note: "Task row: running, review, failed, done." },
  { name: "Textarea", figma: "58:137", note: "Glass multi-line input." },
  { name: "TextareaField", figma: "60:466", note: "Labeled textarea with footer and counter." },
  { name: "Toast", figma: "62:307", note: "Glass toast with Neutral, Success and Danger tones." },
  { name: "ToolCall", figma: "186:7811", note: "Expandable tool call with JSON arguments and result." },
  { name: "Tooltip", figma: "62:282", note: "Ink tooltip with an arrow." },
  { name: "UsageMeter", figma: "109:733", note: "Glass usage meter card." },
] as const;

const meta = {
  title: "Overview/Web",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Components: Story = {
  render: () => (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-title-md text-text-primary">@horon-ai/react</h1>
        <p className="text-body-sm text-text-secondary">
          Base UI components rebuilt from the Horon Figma Components board (54:81). {components.length} components.
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {components.map((item) => (
          <li key={item.name} className="flex flex-col gap-1 rounded-lg border border-border-default bg-bg-surface p-4">
            <span className="text-label-lg text-text-primary">{item.name}</span>
            <span className="text-caption text-text-secondary">Figma {item.figma}</span>
            <span className="text-body-sm text-text-secondary">{item.note}</span>
          </li>
        ))}
      </ul>
      <ul hidden>
        <li data-component="AgentActivity" className="contents" />
        <li data-component="AgentLane" className="contents" />
        <li data-component="AgentPanel" className="contents" />
        <li data-component="ApprovalCard" className="contents" />
        <li data-component="Avatar" className="contents" />
        <li data-component="Badge" className="contents" />
        <li data-component="Banner" className="contents" />
        <li data-component="BotListRow" className="contents" />
        <li data-component="BottomSheet" className="contents" />
        <li data-component="Breadcrumb" className="contents" />
        <li data-component="Button" className="contents" />
        <li data-component="Calendar" className="contents" />
        <li data-component="Card" className="contents" />
        <li data-component="ChatBubble" className="contents" />
        <li data-component="ChatControls" className="contents" />
        <li data-component="Checkbox" className="contents" />
        <li data-component="Chip" className="contents" />
        <li data-component="CommandPalette" className="contents" />
        <li data-component="Composer" className="contents" />
        <li data-component="DataTable" className="contents" />
        <li data-component="DateField" className="contents" />
        <li data-component="Dialog" className="contents" />
        <li data-component="EmptyState" className="contents" />
        <li data-component="Field" className="contents" />
        <li data-component="HoronIcon" className="contents" />
        <li data-component="HoronWordmark" className="contents" />
        <li data-component="IconButton" className="contents" />
        <li data-component="Input" className="contents" />
        <li data-component="InputGroup" className="contents" />
        <li data-component="IntegrationRow" className="contents" />
        <li data-component="Kbd" className="contents" />
        <li data-component="LiquidGlass" className="contents" />
        <li data-component="Menu" className="contents" />
        <li data-component="MessageExtras" className="contents" />
        <li data-component="PageHeader" className="contents" />
        <li data-component="PlanStep" className="contents" />
        <li data-component="Progress" className="contents" />
        <li data-component="RadioGroup" className="contents" />
        <li data-component="Schedule" className="contents" />
        <li data-component="SegmentedControl" className="contents" />
        <li data-component="Select" className="contents" />
        <li data-component="Sidebar" className="contents" />
        <li data-component="Skeleton" className="contents" />
        <li data-component="SourceRow" className="contents" />
        <li data-component="Spinner" className="contents" />
        <li data-component="Switch" className="contents" />
        <li data-component="TabBar" className="contents" />
        <li data-component="Tabs" className="contents" />
        <li data-component="TaskRow" className="contents" />
        <li data-component="Textarea" className="contents" />
        <li data-component="TextareaField" className="contents" />
        <li data-component="Toast" className="contents" />
        <li data-component="ToolCall" className="contents" />
        <li data-component="Tooltip" className="contents" />
        <li data-component="UsageMeter" className="contents" />
      </ul>
    </section>
  ),
};
