import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { ChatBubble } from "../../src/components/chat-bubble";
import { HoronProvider } from "../../src/provider";

/** The bubble view that wraps one message's text. */
const bubbleOf = (container: HTMLElement, message: string): Element => {
  const text = [...container.querySelectorAll("text")].find((element) => element.textContent === message);
  const bubble = text?.parentElement;
  if (!bubble) throw new Error(`no bubble for ${message}`);
  return bubble;
};

test("a `me` bubble aligns right on the ink fill and a `bot` bubble stays left on the subtle fill", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <ChatBubble from="me">Mine</ChatBubble>
        <ChatBubble from="bot">Theirs</ChatBubble>
      </view>
    </HoronProvider>,
  );

  const mine = bubbleOf(container, "Mine");
  const theirs = bubbleOf(container, "Theirs");

  expect(mine.className).toContain("ml-auto");
  expect(mine.className).toContain("bg-interactive-primary");
  expect(theirs.className).toContain("bg-bg-subtle");
  expect(theirs.className).not.toContain("ml-auto");
});

test("the size rung moves to the inner text and `me` keeps its inverse text colour", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <ChatBubble from="me" size="lg">
          Large
        </ChatBubble>
        <ChatBubble from="bot" size="sm">
          Small
        </ChatBubble>
      </view>
    </HoronProvider>,
  );

  const large = bubbleOf(container, "Large");
  const small = bubbleOf(container, "Small");
  expect(large.className).toContain("px-5");
  expect(small.className).toContain("px-3");

  const largeText = large.querySelector("text");
  const smallText = small.querySelector("text");
  expect(largeText?.className).toContain("text-body-lg");
  expect(largeText?.className).toContain("text-interactive-on-primary");
  expect(smallText?.className).toContain("text-body-sm");
  expect(smallText?.className).toContain("text-text-primary");
});

test("an empty bubble still renders no text instead of a placeholder", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <ChatBubble />
    </HoronProvider>,
  );

  const text = container.querySelector("text");
  expect(text).not.toBeNull();
  expect(text?.textContent).toBe("");
});
