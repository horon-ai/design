import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/attachment.dart';
import 'package:horon_ui/src/components/button.dart';

import '../section_scaffold.dart';

/// `attachment` 갤러리 섹션입니다.
class HoronAttachmentGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronAttachmentGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Attachment',
      variants: <Widget>[
        for (final HoronAttachmentSize size in HoronAttachmentSize.values)
          HoronAttachmentFile(
            name: '분기-보고서-${size.name}.pdf',
            sizeBytes: 1536,
            size: size,
            icon: const Icon(Icons.description),
            onRemove: () {},
          ),
        for (final HoronAttachmentOrientation orientation
            in HoronAttachmentOrientation.values)
          HoronAttachmentFile(
            name: '사진-${orientation.name}.png',
            sizeBytes: 1310720,
            orientation: orientation,
            icon: const Icon(Icons.image),
            onRemove: () {},
          ),
        const HoronAttachmentFile(
          name: '크기 없는 파일.md',
          icon: Icon(Icons.article),
        ),
      ],
      states: <Widget>[
        const HoronAttachment.idle(
          children: <Widget>[
            HoronAttachmentMedia(child: Icon(Icons.description)),
            HoronAttachmentContent(
              children: <Widget>[
                HoronAttachmentTitle(text: '기다리는 파일.pdf'),
                HoronAttachmentDescription(text: '1.5 KB'),
              ],
            ),
          ],
        ),
        const HoronAttachment.uploading(
          children: <Widget>[
            HoronAttachmentMedia(child: Icon(Icons.description)),
            HoronAttachmentContent(
              children: <Widget>[
                HoronAttachmentTitle(text: '올리는 파일.pdf'),
                HoronAttachmentDescription(text: '업로드 중'),
              ],
            ),
          ],
        ),
        const HoronAttachment.processing(
          children: <Widget>[
            HoronAttachmentMedia(child: Icon(Icons.description)),
            HoronAttachmentContent(
              children: <Widget>[
                HoronAttachmentTitle(text: '처리 중인 파일.pdf'),
                HoronAttachmentDescription(text: '서버가 처리하는 중'),
              ],
            ),
          ],
        ),
        const HoronAttachment.error(
          children: <Widget>[
            HoronAttachmentMedia(child: Icon(Icons.description)),
            HoronAttachmentContent(
              children: <Widget>[
                HoronAttachmentTitle(text: '실패한 파일.pdf'),
                HoronAttachmentDescription(text: '업로드에 실패했습니다'),
              ],
            ),
          ],
        ),
        HoronAttachment(
          size: HoronAttachmentSize.sm,
          children: <Widget>[
            const HoronAttachmentMedia(child: Icon(Icons.description)),
            const HoronAttachmentContent(
              children: <Widget>[
                HoronAttachmentTitle(text: '끝난 파일.pdf'),
                HoronAttachmentDescription(text: '1.5 KB'),
              ],
            ),
            HoronAttachmentActions(
              children: <Widget>[
                HoronButton(
                  variant: HoronButtonVariant.ghost,
                  size: HoronButtonSize.iconXs,
                  leading: const Icon(Icons.close),
                  semanticLabel: '제거',
                  onPressed: () {},
                ),
              ],
            ),
          ],
        ),
        HoronAttachmentFile(
          name: '긴 이름의 첨부 파일 이름이 넘칠 때.pdf',
          sizeBytes: 15728640,
          size: HoronAttachmentSize.xs,
          icon: const Icon(Icons.description),
          onRemove: () {},
        ),
      ],
      notes:
          'React `attachment.tsx`의 여섯 조각입니다. 크기는 `default`·`sm`·`xs` 세 단계이고 '
          '방향은 수평·수직 두 가지입니다. 수평은 최소 폭 160, 수직은 본문이 있으면 120 '
          '(미디어만 있으면 96)에 미디어가 위로 갑니다. 상태는 cva 변형이 아니라 prop이라 '
          '이름 붙은 생성자로 엽니다. `idle`은 점선 테두리, `error`는 파괴 색 테두리와 '
          '설명을 씁니다.',
    );
  }
}
