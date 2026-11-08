import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

test("an icon paints every color slot without String.prototype.replaceAll, which Lynx's ES2019 main thread lacks", () => {
  const proto = String.prototype as { replaceAll?: unknown };
  const original = proto.replaceAll;
  delete proto.replaceAll;
  try {
    const { container } = render(
      <HoronProvider scheme="light">
        <Icon name="MagnifyingGlass" weight="bold" color="#123456" />
      </HoronProvider>,
    );
    const content = container.querySelector("svg")?.getAttribute("content") ?? "";
    expect(content).toContain("#123456");
    expect(content).not.toContain("__COLOR__");
  } finally {
    proto.replaceAll = original;
  }
});
