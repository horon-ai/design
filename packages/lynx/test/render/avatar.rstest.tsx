import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Avatar } from "../../src/components/avatar";
import { HoronProvider } from "../../src/provider";

/**
 * The render harness dispatches user events (`tap`, `focus`, …) but has no way to report an image
 * load or failure, so these tests pin the two states the component decides on its own: the fallback
 * it shows before a picture arrives, and the fallback it shows when there is no picture at all.
 */
test("initials are drawn at the size the avatar was given", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Avatar size="lg">MY</Avatar>
    </HoronProvider>,
  );

  const label = await findByText("MY");
  expect(label).toBeInTheDocument();
  expect(container.querySelector(".size-10")).not.toBeNull();
  expect(label.getAttribute("class")).toContain("text-label-lg");
});

test("an image avatar without a source keeps its initials and draws no picture", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Avatar type="image" size="md">
        H
      </Avatar>
    </HoronProvider>,
  );

  expect(await findByText("H")).toBeInTheDocument();
  expect(container.querySelector("image")).toBeNull();
});

test("an image avatar shows the initials until the picture has loaded", () => {
  const { container } = render(
    <HoronProvider>
      <Avatar type="image" src="https://example.test/face.webp" alt="Horon">
        H
      </Avatar>
    </HoronProvider>,
  );

  const picture = container.querySelector("image");
  expect(picture).not.toBeNull();
  expect(picture?.getAttribute("src")).toBe("https://example.test/face.webp");
  expect(picture?.getAttribute("mode")).toBe("aspectFill");
  expect(container.textContent).toBe("H");
});

test("the bot avatar draws the robot mark and no initials", () => {
  const { container } = render(
    <HoronProvider>
      <Avatar type="bot" size="sm">
        MY
      </Avatar>
    </HoronProvider>,
  );

  expect(container.textContent).toBe("");
  expect(container.querySelector("svg")).not.toBeNull();
  expect(container.querySelector(".size-6")).not.toBeNull();
});

test("the sky tone tints the initials, and the neutral tone does not", () => {
  const neutral = render(
    <HoronProvider>
      <Avatar>MY</Avatar>
    </HoronProvider>,
  );
  expect(neutral.container.querySelector(".bg-sky-100")).toBeNull();

  const sky = render(
    <HoronProvider>
      <Avatar tone="sky">MY</Avatar>
    </HoronProvider>,
  );
  const circle = sky.container.querySelector(".bg-sky-100");
  expect(circle).not.toBeNull();
  expect(sky.container.querySelector("text")?.getAttribute("class")).toContain("text-sky-700");
});

test("the live dot only exists when it is asked for, and takes the ring colour it is given", () => {
  const quiet = render(
    <HoronProvider>
      <Avatar live={false}>MY</Avatar>
    </HoronProvider>,
  );
  expect(quiet.container.querySelector(".bg-status-live")).toBeNull();

  const defaultRing = render(
    <HoronProvider>
      <Avatar live>MY</Avatar>
    </HoronProvider>,
  );
  expect(defaultRing.container.querySelector(".bg-status-live")?.getAttribute("class")).toContain("border-bg-surface");

  const customRing = render(
    <HoronProvider>
      <Avatar live liveRingClassName="border-glass-rim">
        MY
      </Avatar>
    </HoronProvider>,
  );
  expect(customRing.container.querySelector(".bg-status-live")?.getAttribute("class")).toContain("border-glass-rim");
});
