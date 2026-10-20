import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@horon/web";

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu defaultValue="products">
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>제품</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 list-none grid-cols-2 gap-1 p-0">
              <li>
                <NavigationMenuLink href="#agents">
                  <div className="text-sm font-medium">에이전트</div>
                  <p className="text-xs text-muted-foreground">저장소 작업 실행</p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#console">
                  <div className="text-sm font-medium">콘솔</div>
                  <p className="text-xs text-muted-foreground">세션과 비용 조회</p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" className="h-9">
            요금
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
