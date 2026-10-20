import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@horon/web";

const items = [
  {
    value: "shipping",
    title: "배송은 얼마나 걸리나요?",
    body: "주문은 영업일 기준 하루 안에 출고되며, 지역에 따라 2~4일 걸립니다.",
  },
  {
    value: "returns",
    title: "반품은 어떻게 하나요?",
    body: "사용하지 않은 상품은 배송 후 30일 안에 전액 환불받을 수 있습니다.",
  },
  {
    value: "support",
    title: "문의는 어디로 하나요?",
    body: "도움말 패널에서 메시지를 보내면 영업일 기준 하루 안에 답변드립니다.",
  },
];

export default function AccordionDemo() {
  return (
    <>
      <Accordion className="w-96" defaultValue={["shipping"]}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionPanel>{item.body}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion className="w-96" multiple defaultValue={["shipping", "returns"]}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionPanel>{item.body}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
