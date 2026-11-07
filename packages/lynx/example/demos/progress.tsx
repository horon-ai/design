import { Progress } from "../../src/components/progress";

/**
 * The four states a bar can be in: the indeterminate sweep, an untouched track and two determinate
 * values. The site demo shows the same four, in the same order.
 */
export default function ProgressDemo() {
  return (
    <view className="flex flex-col gap-4 p-4">
      <Progress aria-label="Loading" />
      <Progress value={0} aria-label="Not started" />
      <Progress value={40} aria-label="In progress" />
      <Progress value={100} aria-label="Done" />
    </view>
  );
}
