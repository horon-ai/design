import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireOption,
  QuestionnaireOptions,
  QuestionnaireProgress,
} from "@horon/web";

export default function QuestionnaireDemo() {
  return (
    <div className="w-full max-w-lg">
      <Questionnaire>
        <QuestionnaireProgress value={2} max={4}>
          2 / 4
        </QuestionnaireProgress>
        <QuestionnaireItem>
          <p className="text-sm font-medium">새 프로젝트에서 가장 먼저 하는 일은 무엇인가요?</p>
          <QuestionnaireOptions>
            <QuestionnaireOption defaultChecked>토큰을 정의한다</QuestionnaireOption>
            <QuestionnaireOption>컴포넌트를 고른다</QuestionnaireOption>
            <QuestionnaireOption>화면 흐름을 그린다</QuestionnaireOption>
          </QuestionnaireOptions>
        </QuestionnaireItem>
      </Questionnaire>
    </div>
  );
}
