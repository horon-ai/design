import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadList, FileUploadTrigger } from "@horon-ai/react";
import { UploadIcon } from "lucide-react";

export default function FileUploadDemo() {
  return (
    <>
      <FileUpload className="w-96" accept=".pdf,.png,.svg">
        <FileUploadDropzone>
          <UploadIcon />
          <p className="text-sm text-foreground">
            <span className="font-medium">파일을 끌어다 놓거나</span> 클릭해 선택하세요
          </p>
          <p className="text-xs text-muted-foreground">PDF, PNG, SVG · 각 10MB까지</p>
        </FileUploadDropzone>
        <FileUploadTrigger>파일 찾기</FileUploadTrigger>
        <FileUploadList>
          <FileUploadItem name="브랜드-가이드.pdf" size={2400000} status="done" />
        </FileUploadList>
      </FileUpload>
      <FileUpload className="w-96" multiple={false} accept="image/*">
        <FileUploadDropzone className="py-6">
          <UploadIcon />
          <p className="text-sm text-foreground">이미지 한 장</p>
        </FileUploadDropzone>
        <FileUploadList>
          <FileUploadItem name="프로필.png" size={820000} status="uploading" />
        </FileUploadList>
      </FileUpload>
    </>
  );
}
