import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  Button,
} from "@horon-ai/react";
import { FileTextIcon, ImageIcon } from "lucide-react";

export default function AttachmentDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Attachment>
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>디자인-가이드.pdf</AttachmentTitle>
          <AttachmentDescription>2.4 MB · 업로드 완료</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Button size="sm" variant="ghost">
            열기
          </Button>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <ImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>토큰-스크린샷.png</AttachmentTitle>
          <AttachmentDescription>업로드 중</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>용량-초과.zip</AttachmentTitle>
          <AttachmentDescription>10 MB를 넘을 수 없습니다</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  );
}
