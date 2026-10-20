import { Tabs, TabsContent, TabsList, TabsTrigger } from "@horon-ai/react";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="activity">활동</TabsTrigger>
        <TabsTrigger value="settings">설정</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">워크스페이스에서 일어나는 일을 한눈에 봅니다.</TabsContent>
      <TabsContent value="activity">최근 변경, 댓글, 리뷰가 이곳에 쌓입니다.</TabsContent>
      <TabsContent value="settings">멤버, 결제, 연동을 관리합니다.</TabsContent>
    </Tabs>
  );
}
