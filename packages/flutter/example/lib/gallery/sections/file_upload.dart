import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/file_upload.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

import '../section_scaffold.dart';

/// `file_upload` 갤러리 섹션입니다.
class HoronFileUploadGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFileUploadGallerySection({super.key});

  static Future<List<HoronFileUploadFile>> _picker() async =>
      const <HoronFileUploadFile>[
        HoronFileUploadFile(name: 'report.pdf', sizeBytes: 1536),
        HoronFileUploadFile(name: 'photo.png', sizeBytes: 1310720),
      ];

  Widget _row(Widget child) => Padding(
    padding: const EdgeInsets.only(bottom: HoronSpace.s5),
    child: child,
  );

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'File Upload',
      variants: <Widget>[
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            _row(
              SizedBox(
                width: 420,
                child: HoronFileUpload(
                  onPickFiles: _picker,
                  children: const <Widget>[
                    HoronFileUploadDropzone(),
                    HoronFileUploadTrigger(),
                    HoronFileUploadList(),
                  ],
                ),
              ),
            ),
            _row(
              SizedBox(
                width: 420,
                child: HoronFileUpload(
                  onPickFiles: _picker,
                  multiple: false,
                  children: const <Widget>[
                    HoronFileUploadTrigger(label: '파일 하나 고르기'),
                    HoronFileUploadList(),
                  ],
                ),
              ),
            ),
            // 선택 콜백이 없으면 드롭존과 버튼이 모두 비활성입니다.
            SizedBox(
              width: 420,
              child: HoronFileUpload(
                children: const <Widget>[
                  HoronFileUploadDropzone(),
                  HoronFileUploadTrigger(),
                  HoronFileUploadList(),
                ],
              ),
            ),
          ],
        ),
      ],
      states: <Widget>[
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            _row(
              SizedBox(
                width: 420,
                child: HoronFileUpload(
                  defaultFiles: const <HoronFileUploadFile>[
                    HoronFileUploadFile(
                      name: 'idle-document.txt',
                      sizeBytes: 512,
                    ),
                  ],
                  children: const <Widget>[HoronFileUploadList()],
                ),
              ),
            ),
            _row(
              SizedBox(
                width: 420,
                child: HoronFileUpload(
                  defaultFiles: const <HoronFileUploadFile>[
                    HoronFileUploadFile(
                      name: 'uploading-archive.zip',
                      sizeBytes: 1048576,
                      status: HoronFileUploadStatus.uploading,
                      progress: 0.42,
                    ),
                  ],
                  children: const <Widget>[HoronFileUploadList()],
                ),
              ),
            ),
            _row(
              SizedBox(
                width: 420,
                child: HoronFileUpload(
                  defaultFiles: const <HoronFileUploadFile>[
                    HoronFileUploadFile(
                      name: 'processing-video.mp4',
                      sizeBytes: 15728640,
                      status: HoronFileUploadStatus.processing,
                      progress: 1,
                    ),
                  ],
                  children: const <Widget>[HoronFileUploadList()],
                ),
              ),
            ),
            _row(
              SizedBox(
                width: 420,
                child: HoronFileUpload(
                  defaultFiles: const <HoronFileUploadFile>[
                    HoronFileUploadFile(
                      name: 'broken-slides.key',
                      sizeBytes: 4096,
                      status: HoronFileUploadStatus.error,
                    ),
                  ],
                  onRetryFile: (int index) {},
                  children: const <Widget>[HoronFileUploadList()],
                ),
              ),
            ),
            SizedBox(
              width: 420,
              child: HoronFileUpload(
                defaultFiles: const <HoronFileUploadFile>[
                  HoronFileUploadFile(
                    name: 'done-contract.pdf',
                    sizeBytes: 15728640,
                    status: HoronFileUploadStatus.done,
                  ),
                ],
                children: const <Widget>[HoronFileUploadList()],
              ),
            ),
          ],
        ),
      ],
      notes:
          'React `file-upload.tsx`의 드롭존·트리거·목록·항목입니다. 파일 선택은 주입식 '
          '`onPickFiles` 콜백으로만 열고, 패키지는 `image_picker`·`file_selector`·'
          '`desktop_drop`을 의존하지 않습니다. 업로드는 하지 않으며, 다섯 상태'
          '(idle·uploading·processing·error·done)를 그대로 그립니다. 크기는 '
          '`512 B`·`1.5 KB`·`15 MB`처럼 1024 단위로 줄입니다.',
    );
  }
}
