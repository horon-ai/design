import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@horon/web";

const fruits = ["사과", "바나나", "체리", "포도"];

export default function ComboboxDemo() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Combobox items={fruits}>
        <ComboboxInput className="w-64" placeholder="과일 검색" />
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
          <ComboboxEmpty>결과 없음</ComboboxEmpty>
        </ComboboxList>
      </Combobox>
      <Combobox items={fruits} defaultValue="바나나">
        <ComboboxInput className="w-64" placeholder="과일 검색" />
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
          <ComboboxEmpty>결과 없음</ComboboxEmpty>
        </ComboboxList>
      </Combobox>
    </div>
  );
}
