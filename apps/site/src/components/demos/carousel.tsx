import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@horon-ai/react";

const slides = [
  { title: "현장 조사", body: "구조가 어떻게 세워지고 바뀌었는지 기록합니다." },
  { title: "지역 재료", body: "가까운 곳에서 얻은 돌과 목재로 기후에 맞춥니다." },
  { title: "보수 우선", body: "버티는 구조는 헐지 않고 고쳐서 다시 씁니다." },
];

export default function CarouselDemo() {
  return (
    <div className="w-full max-w-md px-12">
      <Carousel className="h-40 w-full">
        <CarouselContent className="h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.title} className="h-full">
              <div className="flex h-full flex-col justify-center gap-2 rounded-md border border-border bg-card p-6">
                <span className="text-sm font-semibold text-foreground">{slide.title}</span>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{slide.body}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
