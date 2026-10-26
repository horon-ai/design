# @horon-ai/tokens

Horon 디자인 토큰입니다. 모든 값은 Figma `Horon` 파일(fileKey `JinNQfldIXR0eYcjZuL3ey`)에서
읽었고, `theme.css`는 이 값에서 생성됩니다.

| 파일 | 내용 | Figma 출처 |
| --- | --- | --- |
| `src/color.ts` | 시맨틱 색 라이트·다크, 직접 쓰는 sky·red 단계 | Components `54:81`, Components / Dark `166:1107` |
| `src/typography.ts` | 글꼴, 네 가지 굵기, 13개 글자 스타일의 Web / Desktop / Mobile 크기 | Typography `26:2` |
| `src/scale.ts` | 반경, 간격, 그림자 | Scale 컬렉션, Menus `88:495`, Command palette `110:676` |
| `src/glass.ts` | 유리 레이어 값과 높이 비례 규칙 | Button `55:339` 외 유리 컴포넌트 |
| `src/css.ts` | `theme.css` 생성기 | |

CSS 변수 이름은 Figma 변수의 WEB 코드 문법과 같습니다. Figma Dev Mode에서
`var(--color-text-primary)`로 보이는 값이 여기서도 `--color-text-primary`이고, Tailwind에서는
`text-text-primary`, `bg-bg-default`처럼 씁니다. Tailwind 기본 팔레트와 반경, 글자 크기는 비웠습니다.

## theme.css 재생성

`theme.css`는 손으로 고치지 않습니다.

```bash
bun run build                   # packages/tokens 안에서
bun test packages/tokens        # 저장소 루트에서, 생성기 출력과 커밋된 파일이 같은지 확인
```
