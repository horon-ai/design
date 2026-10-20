import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useForm,
} from "@horon/web";

type ProfileValues = {
  email: string;
};

export default function FormDemo() {
  const form = useForm<ProfileValues>({
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="flex w-80 flex-col gap-6">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "이메일을 입력해 주세요." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>답장을 받을 주소입니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">저장</Button>
      </form>
    </Form>
  );
}
