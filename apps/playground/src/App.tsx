import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@horon/web";
import { useTheme } from "@/components/theme-provider";

export function App() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">horon web</h1>
          <p className="text-sm text-muted-foreground">
            Web-only components from <code>@horon/web</code> — shadcn/ui on Base UI, styled with the shared Horon
            tokens.
          </p>
        </div>
        <Button variant="outline" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? "Light" : "Dark"} mode
        </Button>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Buttons</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Card &amp; form</h2>
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>A web-only card built from shadcn/ui on Base UI.</CardDescription>
            <CardAction>
              <Badge variant="secondary">New</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button>Save</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
