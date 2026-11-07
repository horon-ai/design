import { InputGroup, InputGroupSegment } from "../../src/components/input-group";

import { Backdrop } from "./backdrop";

/**
 * The segments here are fixed text: `Select` and `Combobox` with
 * `variant="segment"` are ported in their own lanes and slot in unchanged once
 * they land, because both read the group through `useInputGroup()`.
 */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <view className="flex flex-row flex-wrap items-end justify-center gap-3">
        <InputGroup
          className="w-52"
          surface={surface}
          size="sm"
          placeholder="Small"
          prefix={
            <InputGroupSegment>
              <text className="text-body-sm text-text-primary">+82</text>
            </InputGroupSegment>
          }
        />
        <InputGroup
          className="w-52"
          surface={surface}
          placeholder="Medium"
          prefix={
            <InputGroupSegment>
              <text className="text-body-md text-text-primary">+82</text>
            </InputGroupSegment>
          }
        />
        <InputGroup
          className="w-52"
          surface={surface}
          size="lg"
          placeholder="Large"
          prefix={
            <InputGroupSegment>
              <text className="text-body-lg text-text-primary">+82</text>
            </InputGroupSegment>
          }
        />
      </view>
      <InputGroup
        className="w-full max-w-80"
        surface={surface}
        placeholder="Website"
        prefix={
          <InputGroupSegment>
            <text className="text-body-md text-text-primary">https://</text>
          </InputGroupSegment>
        }
      />
      <InputGroup
        className="w-full max-w-80"
        surface={surface}
        placeholder="Amount"
        suffix={
          <InputGroupSegment>
            <text className="text-body-md text-text-primary">KRW</text>
          </InputGroupSegment>
        }
      />
      <InputGroup
        className="w-full max-w-80"
        surface={surface}
        invalid
        defaultValue="12"
        suffix={
          <InputGroupSegment>
            <text className="text-body-md text-text-primary">KRW</text>
          </InputGroupSegment>
        }
      />
      <InputGroup
        className="w-full max-w-80"
        surface={surface}
        disabled
        placeholder="Phone number"
        prefix={
          <InputGroupSegment>
            <text className="text-body-md text-text-primary">+82</text>
          </InputGroupSegment>
        }
      />
    </view>
  );
}

export default function InputGroupDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex w-full flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
