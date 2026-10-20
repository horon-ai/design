import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@horon/web";
import { CalendarIcon, CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";

export default function CommandDemo() {
  return (
    <Command className="w-80 rounded-md border border-border">
      <CommandInput placeholder="명령어 검색" />
      <CommandList>
        <CommandEmpty>결과가 없습니다.</CommandEmpty>
        <CommandGroup heading="제안">
          <CommandItem>
            <CalendarIcon />
            <span>일정</span>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>설정</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="계정">
          <CommandItem>
            <UserIcon />
            <span>프로필</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>결제</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
