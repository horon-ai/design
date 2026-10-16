import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireOption,
  QuestionnaireOptions,
  QuestionnaireProgress,
} from "@horon/web/components/questionnaire";

const meta = {
  title: "Web/Questionnaire",
  component: Questionnaire,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Questionnaire>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Questionnaire className="w-96">
      <QuestionnaireProgress value={1} max={3}>
        Question 1 of 3
      </QuestionnaireProgress>
      <QuestionnaireItem>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Where should the palette live?</span>
          <span className="text-sm text-muted-foreground">Pick the package that owns the single source of truth.</span>
        </div>
        <QuestionnaireOptions>
          <QuestionnaireOption>
            <span className="font-medium">@horon/tokens</span>
            <span className="text-xs text-muted-foreground">One package every surface imports.</span>
          </QuestionnaireOption>
          <QuestionnaireOption>
            <span className="font-medium">Each app keeps its own copy</span>
            <span className="text-xs text-muted-foreground">Values drift between web, app, and canvas.</span>
          </QuestionnaireOption>
          <QuestionnaireOption>
            <span className="font-medium">A shared CSS file</span>
            <span className="text-xs text-muted-foreground">No typed access for native code.</span>
          </QuestionnaireOption>
        </QuestionnaireOptions>
      </QuestionnaireItem>
    </Questionnaire>
  ),
};

export const MultipleChoice: Story = {
  render: () => (
    <Questionnaire className="w-96">
      <QuestionnaireProgress value={2} max={3}>
        Question 2 of 3
      </QuestionnaireProgress>
      <QuestionnaireItem>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Which surfaces should use glass?</span>
          <span className="text-sm text-muted-foreground">Select every surface that floats above content.</span>
        </div>
        <QuestionnaireOptions>
          <QuestionnaireOption type="checkbox">
            <span className="font-medium">Popovers and menus</span>
          </QuestionnaireOption>
          <QuestionnaireOption type="checkbox">
            <span className="font-medium">Dialogs and sheets</span>
          </QuestionnaireOption>
          <QuestionnaireOption type="checkbox">
            <span className="font-medium">Cards and lists</span>
          </QuestionnaireOption>
        </QuestionnaireOptions>
      </QuestionnaireItem>
    </Questionnaire>
  ),
};
