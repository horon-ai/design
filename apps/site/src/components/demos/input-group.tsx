import { InputGroup } from "@horon-ai/react";
import { CaretDown } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function InputGroupDemo() {
  return (
    <Backdrop className="flex-col">
      <InputGroup
        className="w-80"
        placeholder="Phone number"
        prefix={
          <>
            +82 <CaretDown />
          </>
        }
      />
      <InputGroup
        className="w-80"
        placeholder="Amount"
        suffix={
          <>
            KRW <CaretDown />
          </>
        }
      />
      <InputGroup
        className="w-80"
        invalid
        defaultValue="12"
        suffix={
          <>
            KRW <CaretDown />
          </>
        }
      />
      <InputGroup
        className="w-80"
        disabled
        placeholder="Phone number"
        prefix={
          <>
            +82 <CaretDown />
          </>
        }
      />
    </Backdrop>
  );
}
