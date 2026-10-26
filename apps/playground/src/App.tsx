import { Button, Field, FieldDescription, FieldLabel, IconButton, Input } from "@horon-ai/react";
import { MagnifyingGlass, Moon, Plus, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/components/theme-provider";

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-title-md text-text-primary">horon web</h1>
          <p className="text-body-sm text-text-secondary">
            Components from <code>@horon-ai/react</code>, built on Base UI with the Horon tokens.
          </p>
        </div>
        <IconButton
          variant="glass"
          icon={dark ? <Sun /> : <Moon />}
          label={dark ? "Light mode" : "Dark mode"}
          onClick={() => setTheme(dark ? "light" : "dark")}
        />
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-title-sm text-text-primary">Buttons</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button icon={<Plus />}>New bot</Button>
          <Button variant="glass">Later</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-title-sm text-text-primary">Field</h2>
        <Field className="max-w-80">
          <FieldLabel>Search</FieldLabel>
          <Input surface="solid" className="w-full" icon={<MagnifyingGlass />} placeholder="Search bots" />
          <FieldDescription>Find a bot by name or role.</FieldDescription>
        </Field>
      </section>
    </div>
  );
}
