"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "cn";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />;
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive ? "" : undefined}
      className={cn(
        "relative flex size-9 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-sm first:border-l last:rounded-r-sm",
        isActive && "z-10 border-ring ring-3 ring-ring/50",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret ? (
        <div
          data-slot="input-otp-caret"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            data-slot="input-otp-caret-line"
            className="h-4 w-px animate-pulse bg-foreground motion-reduce:animate-none"
          />
        </div>
      ) : null}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("text-muted-foreground [&>svg]:size-4", className)}
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
