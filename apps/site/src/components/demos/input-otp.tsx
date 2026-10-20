import * as React from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@horon/web";

export default function InputOtpDemo() {
  const [value, setValue] = React.useState("");

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">인증 코드</span>
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">입력된 코드</span>
        <InputOTP maxLength={6} value="123456" disabled>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </>
  );
}
