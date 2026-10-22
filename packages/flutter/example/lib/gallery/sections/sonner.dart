import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/sonner.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

import '../section_scaffold.dart';

/// `sonner` 갤러리 섹션입니다.
///
/// sonner 카드는 모서리에 붙는 표면이라, 조각마다 자기 토스터를 가진 작은 무대를
/// 하나씩 그립니다. 무대 안의 카드는 [HoronSonnerToastData.duration]이 null이라
/// 갤러리를 둘러보는 동안 사라지지 않습니다. 로딩 카드의 스피너만 계속 돕니다.
class HoronSonnerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSonnerGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Sonner',
      variants: <Widget>[
        const _SonnerStage(
          label: '보통',
          toasts: <HoronSonnerToastData>[
            HoronSonnerToastData(
              title: '동기화했습니다',
              description: '마지막 변경 3건을 올렸습니다.',
              duration: null,
            ),
          ],
        ),
        const _SonnerStage(
          label: 'loading',
          toasts: <HoronSonnerToastData>[
            HoronSonnerToastData(
              title: '올리는 중',
              description: '파일 3개를 올리고 있습니다.',
              state: HoronSonnerToastState.loading,
              duration: null,
            ),
          ],
        ),
        const _SonnerStage(
          label: 'success',
          toasts: <HoronSonnerToastData>[
            HoronSonnerToastData(
              title: '업로드했습니다',
              description: '파일 3개가 도착했습니다.',
              state: HoronSonnerToastState.success,
              duration: null,
            ),
          ],
        ),
        const _SonnerStage(
          label: 'error',
          toasts: <HoronSonnerToastData>[
            HoronSonnerToastData(
              title: '업로드하지 못했습니다',
              description: '연결을 확인한 뒤 다시 시도해 주세요.',
              state: HoronSonnerToastState.error,
              duration: null,
            ),
          ],
        ),
      ],
      states: <Widget>[
        const _SonnerStage(
          label: '겹친 스택',
          toasts: <HoronSonnerToastData>[
            HoronSonnerToastData(title: '첫 번째', duration: null),
            HoronSonnerToastData(
              title: '두 번째',
              description: '뒤 카드는 14px 비켜나고 5% 작아집니다.',
              state: HoronSonnerToastState.success,
              duration: null,
            ),
            HoronSonnerToastData(
              title: '세 번째',
              description: '맨 앞 카드만 읽히고 나머지는 겹쳐 보입니다.',
              state: HoronSonnerToastState.error,
              duration: null,
            ),
          ],
        ),
        const _SonnerStage(
          label: '왼쪽 위 모서리',
          position: HoronSonnerPosition.topLeft,
          toasts: <HoronSonnerToastData>[
            HoronSonnerToastData(
              title: '왼쪽 위에 쌓입니다',
              description: '여섯 모서리 중 하나를 고를 수 있습니다.',
              duration: null,
            ),
          ],
        ),
        const _SonnerStage(label: '빈 토스터', toasts: <HoronSonnerToastData>[]),
      ],
      notes:
          'React `sonner.tsx`의 `SonnerToaster`를 옮겼습니다. 표면은 유리가 아니라 '
          '`--normal-bg: var(--popover)`이고 반경은 `--border-radius: var(--radius-md)`(12)입니다. '
          '폭 356, 가장자리 여백 32, 겹친 카드는 14만큼 비켜나며 5%씩 작아집니다. '
          '가로로 45px 넘게 밀거나 400px/s보다 빠르게 밀면 닫힙니다. promise는 '
          'loading → success/error로 넘어가고, 로딩 카드는 끝날 때까지 닫히지 않습니다. '
          '자동 닫힘 기본값은 4000ms입니다.',
    );
  }
}

/// sonner 카드 하나(또는 스택)를 담는 고정 크기 무대입니다.
class _SonnerStage extends StatefulWidget {
  const _SonnerStage({
    required this.label,
    required this.toasts,
    this.position = HoronSonnerPosition.bottomRight,
  });

  final String label;
  final List<HoronSonnerToastData> toasts;
  final HoronSonnerPosition position;

  @override
  State<_SonnerStage> createState() => _SonnerStageState();
}

class _SonnerStageState extends State<_SonnerStage> {
  late final HoronSonnerController _controller = HoronSonnerController();

  @override
  void initState() {
    super.initState();
    for (final HoronSonnerToastData toast in widget.toasts) {
      _controller.show(toast);
    }
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
      width: 400,
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
                height: 200,
                child: Stack(
                  children: <Widget>[
                    const Positioned.fill(child: _SonnerBackdrop()),
                    Positioned.fill(
                      child: HoronSonnerToaster(
                        controller: _controller,
                        position: widget.position,
                        offset: HoronSpace.s4,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// 카드 뒤에 옅은 무늬를 깔아 겹친 카드의 경계가 보이게 합니다.
class _SonnerBackdrop extends StatelessWidget {
  const _SonnerBackdrop();

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(HoronSpace.s3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          for (int index = 0; index < 6; index++) ...<Widget>[
            Container(
              height: HoronSpace.s2,
              width: 130.0 + index * 24,
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
