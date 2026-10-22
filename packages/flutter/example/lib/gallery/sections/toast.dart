import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `toast` 갤러리 섹션입니다.
///
/// 토스트는 화면 가장자리에 붙는 표면이라, 조각마다 자기 뷰포트를 가진 작은
/// 무대를 하나씩 그립니다. 무대 안의 카드는 [HoronToastData.duration]이 null이라
/// 갤러리를 둘러보는 동안 사라지지 않습니다.
class HoronToastGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronToastGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Toast',
      variants: <Widget>[
        const _ToastStage(
          label: '제목만',
          data: HoronToastData(title: '복사했습니다', duration: null),
        ),
        const _ToastStage(
          label: '제목 + 설명',
          data: HoronToastData(
            title: '일정을 저장했습니다',
            description: '오후 3시에 알려 드립니다.',
            duration: null,
          ),
        ),
        const _ToastStage(
          label: '액션 버튼',
          data: HoronToastData(
            title: '메시지를 삭제했습니다',
            description: '휴지통에서 30일 뒤 사라집니다.',
            actionLabel: '되돌리기',
            duration: null,
          ),
        ),
        const _ToastStage(
          label: '아이콘',
          data: HoronToastData(
            title: '동기화했습니다',
            description: '마지막 변경 3건을 올렸습니다.',
            icon: Icon(Icons.cloud_done_outlined),
            duration: null,
          ),
        ),
      ],
      states: <Widget>[
        const _ToastStage(
          label: '스택 (아래)',
          data: HoronToastData(title: '세 번째', duration: null),
          behind: <HoronToastData>[
            HoronToastData(title: '첫 번째', duration: null),
            HoronToastData(title: '두 번째', duration: null),
          ],
        ),
        const _ToastStage(
          label: '위쪽 배치',
          top: true,
          data: HoronToastData(title: '위에서 쌓입니다', duration: null),
        ),
        const _ToastStage(label: '빈 뷰포트', data: null),
      ],
      notes:
          'React `toast.tsx`의 Provider/Viewport/Root/Content/Title/Description/Action/Close를 '
          '옮겼습니다. 표면은 `.glass-strong`이고 반경은 `rounded-md`(12)입니다. '
          '카드는 `--peek`(12)만큼 비켜나며 뒤로 갈수록 10% 작아집니다. 자동 닫힘 기본값은 '
          '5000ms이며 0을 기본값으로 두지 않습니다. 액션 버튼을 누르면 자동 닫힘이 취소됩니다. '
          '닫기 아이콘은 아이콘 폰트를 번들하지 않으므로 선 두 개로 직접 그립니다.',
    );
  }
}

/// 토스트 하나(또는 스택)를 담는 고정 크기 무대입니다.
class _ToastStage extends StatefulWidget {
  const _ToastStage({
    required this.label,
    required this.data,
    this.behind = const <HoronToastData>[],
    this.top = false,
  });

  final String label;
  final HoronToastData? data;
  final List<HoronToastData> behind;
  final bool top;

  @override
  State<_ToastStage> createState() => _ToastStageState();
}

class _ToastStageState extends State<_ToastStage> {
  late final HoronToastController _controller = HoronToastController();

  @override
  void initState() {
    super.initState();
    for (final HoronToastData data in widget.behind) {
      _controller.show(data);
    }
    final HoronToastData? front = widget.data;
    if (front != null) _controller.show(front);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 340,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            widget.label,
            style: Theme.of(context).textTheme.labelSmall
                ?.copyWith(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: HoronSpace.s2),
          DecoratedBox(
            decoration: BoxDecoration(
              color: scheme.surfaceDim,
              borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              border: Border.all(color: scheme.outline),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              child: SizedBox(
                height: 150,
                child: HoronToastProvider(
                  controller: _controller,
                  child: Stack(
                    children: <Widget>[
                      const Positioned.fill(child: _StageBackdrop()),
                      Positioned.fill(
                        child: widget.top
                            ? const HoronToastViewport.top()
                            : const HoronToastViewport(),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// 유리 표면이 무엇을 흐리게 하는지 보이도록 무대 뒤에 옅은 무늬를 깝니다.
class _StageBackdrop extends StatelessWidget {
  const _StageBackdrop();

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(HoronSpace.s3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          for (int index = 0; index < 5; index++) ...<Widget>[
            Container(
              height: HoronSpace.s2,
              width: 110.0 + index * 28,
              decoration: BoxDecoration(
                color: scheme.onSurface.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(HoronRadius.xs),
              ),
            ),
            const SizedBox(height: HoronSpace.s2),
          ],
        ],
      ),
    );
  }
}
