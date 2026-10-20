import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@horon-ai/react";

const steps = [
  { value: "order", title: "주문" },
  { value: "shipping", title: "배송" },
  { value: "payment", title: "결제" },
];

export default function StepperDemo() {
  return (
    <Stepper defaultValue="shipping" className="w-full max-w-md">
      {steps.map((step, index) => (
        <StepperItem key={step.value} step={step.value}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>{step.title}</StepperTitle>
          </StepperTrigger>
          {index < steps.length - 1 ? <StepperSeparator /> : null}
        </StepperItem>
      ))}
    </Stepper>
  );
}
