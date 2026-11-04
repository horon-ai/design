import { Button, Field, FieldLabel, FlueBackground, HoronWordmark, Input } from "@horon-ai/react";

import { AppleMark, GoogleMark, HoronEye, KeyGlyph, MailGlyph, PasskeyMark } from "../auth-marks";
import { DemoSidebar } from "./sidebar";

/** The Sidebar page's sidebar, with the sky under its glass. */
function SidebarExample() {
  return (
    <div className="flex shrink-0 overflow-clip rounded-xl border border-border-default">
      <DemoSidebar background={<FlueBackground variant="sidebar" />} />
    </div>
  );
}

/* Class strings from `web/src/app/(site)/login/_components/login-form.tsx`, desktop breakpoint. */
const LABEL = "text-label-md font-medium tracking-[-0.04px]";
const SOCIAL_LABEL = "text-label-md font-medium";
const BUTTON_LABEL = "text-body-md/[22px] w-full font-medium tracking-[-0.08px]";

/**
 * The web sign-in screen (`web/src/app/(site)/login`, `web/src/features/auth/auth-layout.tsx`) at desktop
 * width: the eye and wordmark, mascot and line in the left 744fr column, the glass card in the right 696fr
 * column, the sky over the whole screen. Icons are the web ones, copied into `../auth-marks`.
 */
function AuthExample() {
  return (
    <div className="relative isolate grid min-h-220 w-full grid-cols-[744fr_696fr] overflow-clip rounded-xl border border-border-default text-text-primary">
      <FlueBackground variant="auth" />

      <div className="col-start-1 row-start-1 flex items-center gap-3 self-start px-14 pt-12">
        <HoronEye className="h-[19.32px] w-11 shrink-0 text-text-primary" />
        <HoronWordmark title="" aria-hidden className="h-[26px] w-[100px] shrink-0" />
      </div>

      <div className="col-start-1 row-start-1 mt-2 flex flex-col self-center px-14">
        <span
          aria-hidden
          className="pointer-events-none size-60 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/mascots/horon-mascot-welcome.webp)" }}
        />
        <p className="mt-5 max-w-[560px] text-[40px]/[48px] font-bold tracking-[-1px]">
          AI that turns ideas into action.
        </p>
        <p className="mt-3 max-w-[560px] text-body-md">The vision of Horus. The power to act.</p>
      </div>

      <p className="col-start-1 row-start-1 self-end px-14 pb-12 text-caption tracking-[0.06px]">
        © 2026 Horon · Horus × ON
      </p>

      <div className="col-start-2 row-start-1 self-center p-8">
        <div className="relative flex w-full flex-col gap-6 overflow-clip rounded-xl bg-bg-surface-80 bg-[linear-gradient(#5454540F,#5454540F)] p-10 shadow-[inset_0_0_0_1px_#FFFFFFB3,0_0_0_1px_#00000008] backdrop-blur-[45px]">
          <div className="flex flex-col gap-2">
            <h3 className="text-[28px]/[36px] font-bold tracking-[-0.56px]">Welcome back</h3>
            <p className="text-body-sm text-text-secondary">Sign in to keep your bots working.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="glass"
              size="lg"
              icon={<GoogleMark />}
              className={`${SOCIAL_LABEL} gap-2.5 border border-[#747775] bg-[#FFFFFF] px-4 font-['Roboto',system-ui,sans-serif] tracking-[0.25px] text-[#1F1F1F] hover:bg-[#F7F8F8] [&_.liquid-layers]:hidden`}
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              size="lg"
              icon={<AppleMark />}
              className={`${SOCIAL_LABEL} gap-2.5 border border-[#000000] bg-[#000000] px-4 tracking-[-0.04px] hover:not-data-disabled:bg-[#000000]`}
            >
              Continue with Apple
            </Button>
            <Button
              type="button"
              variant="glass"
              size="lg"
              icon={<PasskeyMark />}
              className={`${SOCIAL_LABEL} gap-2.5 border border-border-strong bg-[#FFFFFF] px-4 tracking-[-0.04px] [&_.liquid-layers]:hidden`}
            >
              Sign in with a passkey
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px flex-1 bg-border-strong" />
            <span className="text-caption text-text-secondary">or sign in with email</span>
            <span aria-hidden className="h-px flex-1 bg-border-strong" />
          </div>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel className={LABEL}>Email</FieldLabel>
              <Input
                size="lg"
                surface="solid"
                type="email"
                placeholder="you@horon.ai"
                icon={<MailGlyph />}
                className="w-full"
              />
            </Field>
            <Field>
              <div className="flex w-full items-center justify-between gap-3">
                <FieldLabel className={LABEL}>Password</FieldLabel>
                <span className={`${LABEL} text-text-brand`}>Forgot password?</span>
              </div>
              <Input size="lg" surface="solid" type="password" icon={<KeyGlyph />} className="w-full" />
            </Field>
          </div>
          <Button type="button" size="lg" className={BUTTON_LABEL}>
            Sign in
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-body-sm text-text-secondary">Don&apos;t have an account?</span>
            <span className="text-label-md font-medium text-text-brand">Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlueBackgroundDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Sidebar</p>
        <SidebarExample />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Auth screen</p>
        <AuthExample />
      </div>
    </div>
  );
}
