import { Radio, RadioGroup } from "../../src/components/radio-group";

/** The three rungs, then a list with one disabled radio. */
export default function RadioGroupDemo() {
  return (
    <view className="flex flex-col gap-4 p-4">
      <view className="flex flex-row flex-wrap gap-8">
        <RadioGroup aria-label="Report to, small" size="sm" defaultValue="email">
          <Radio value="email" label="Small" />
          <Radio value="slack" label="Slack" />
        </RadioGroup>
        <RadioGroup aria-label="Report to" defaultValue="email">
          <Radio value="email" label="Medium" />
          <Radio value="slack" label="Slack" />
        </RadioGroup>
        <RadioGroup aria-label="Report to, large" size="lg" defaultValue="email">
          <Radio value="email" label="Large" />
          <Radio value="slack" label="Slack" />
        </RadioGroup>
      </view>
      <RadioGroup aria-label="Report to" defaultValue="email">
        <Radio value="email" label="Email" />
        <Radio value="slack" label="Slack" />
        <Radio value="none" label="Don't report" disabled />
      </RadioGroup>
    </view>
  );
}
