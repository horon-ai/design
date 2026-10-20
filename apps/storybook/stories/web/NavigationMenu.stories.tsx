import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@horon-ai/react/components/navigation-menu";

const meta = {
  title: "Web/NavigationMenu",
  component: NavigationMenu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const products = [
  {
    href: "/products/agents",
    title: "Agents",
    description: "Run autonomous coding agents on your repo.",
  },
  {
    href: "/products/console",
    title: "Console",
    description: "Inspect sessions, logs, and costs in one place.",
  },
  {
    href: "/products/worktrees",
    title: "Worktrees",
    description: "Isolate parallel work in throwaway checkouts.",
  },
  {
    href: "/products/reviews",
    title: "Reviews",
    description: "Gate every merge behind evidence and QA.",
  },
] as const;

const resources = [
  {
    href: "/docs/quickstart",
    title: "Quickstart",
    description: "Install and ship your first component.",
  },
  {
    href: "/docs/design-system",
    title: "Design system",
    description: "Tokens, components, and the house patterns.",
  },
  {
    href: "/changelog",
    title: "Changelog",
    description: "What shipped in the latest release.",
  },
] as const;

export const Playground: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 list-none grid-cols-2 gap-1 p-0">
              {products.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink href={item.href}>
                    <div className="text-sm font-medium">{item.title}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-72 list-none flex-col gap-1 p-0">
              {resources.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink href={item.href}>
                    <div className="text-sm font-medium">{item.title}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" className="h-9">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
