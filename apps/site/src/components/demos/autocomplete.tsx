import { Autocomplete, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteList } from "@horon-ai/react";

const cities = ["서울", "부산", "대구", "인천", "광주", "대전", "제주"];

export default function AutocompleteDemo() {
  return (
    <>
      <Autocomplete items={cities}>
        <AutocompleteInput className="w-64" placeholder="도시 검색" />
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
          <AutocompleteEmpty>결과가 없습니다.</AutocompleteEmpty>
        </AutocompleteList>
      </Autocomplete>
      <Autocomplete items={cities} defaultValue="서울">
        <AutocompleteInput className="w-64" placeholder="도시 검색" />
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
          <AutocompleteEmpty>결과가 없습니다.</AutocompleteEmpty>
        </AutocompleteList>
      </Autocomplete>
    </>
  );
}
