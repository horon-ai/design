import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Breadcrumb, BreadcrumbItem } from "../../src/components/breadcrumb";
import { HoronProvider } from "../../src/provider";

test("tapping a linked crumb calls its handler and the current crumb does not", async () => {
  const visited: string[] = [];
  const { findByText } = render(
    <HoronProvider>
      <Breadcrumb>
        <BreadcrumbItem href="/" onTap={() => visited.push("home")}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/projects" onTap={() => visited.push("projects")}>
          Projects
        </BreadcrumbItem>
        <BreadcrumbItem current>Horon</BreadcrumbItem>
      </Breadcrumb>
    </HoronProvider>,
  );

  fireEvent.tap((await findByText("Projects")).parentElement!);
  expect(visited).toEqual(["projects"]);

  fireEvent.tap((await findByText("Horon")).parentElement!);
  expect(visited).toEqual(["projects"]);
});

test("a crumb without href is inert even when it has a handler", async () => {
  let taps = 0;
  const { findByText } = render(
    <HoronProvider>
      <Breadcrumb>
        <BreadcrumbItem onTap={() => (taps += 1)}>Bare</BreadcrumbItem>
      </Breadcrumb>
    </HoronProvider>,
  );

  fireEvent.tap((await findByText("Bare")).parentElement!);
  expect(taps).toBe(0);
});

test("the tray carries the accessible trail name and one caret between crumbs", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Breadcrumb surface="solid" aria-label="You are here">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
        <BreadcrumbItem current>Horon</BreadcrumbItem>
      </Breadcrumb>
    </HoronProvider>,
  );

  await findByText("Home");
  const tray = container.querySelector('[accessibility-label="You are here"]');
  expect(tray).not.toBeNull();
  expect(tray?.querySelectorAll("svg").length).toBe(2);
});

test("the current crumb is marked selected and reads primary", async () => {
  const { findByText } = render(
    <HoronProvider>
      <Breadcrumb>
        <BreadcrumbItem current>Horon</BreadcrumbItem>
      </Breadcrumb>
    </HoronProvider>,
  );

  const current = (await findByText("Horon")).parentElement!;
  expect(current.getAttribute("accessibility-traits")).toBe("selected");
});
