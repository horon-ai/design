import { Field, FieldDescription, FieldError, FieldLabel, FieldSet, Input } from "@horon/web";

export default function FieldDemo() {
  return (
    <>
      <FieldSet className="w-72">
        <Field>
          <FieldLabel>이름</FieldLabel>
          <Input placeholder="민열" />
          <FieldDescription>다른 사람에게 보이는 이름입니다.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>이메일</FieldLabel>
          <Input defaultValue="minyeol@" aria-invalid />
          <FieldDescription>답장을 받을 주소입니다.</FieldDescription>
          <FieldError match>올바른 이메일 주소를 입력해 주세요.</FieldError>
        </Field>
      </FieldSet>
      <FieldSet className="w-72">
        <Field>
          <FieldLabel>별명</FieldLabel>
          <Input placeholder="없어도 됩니다" />
          <FieldDescription>비워 두어도 괜찮습니다.</FieldDescription>
        </Field>
      </FieldSet>
    </>
  );
}
