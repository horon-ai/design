import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 미리보기 상자의 최대 폭입니다. 좁은 화면에서는 남는 폭에 맞춰 줄입니다.
const double _previewMaxWidth = 360;

/// Bottom sheet 갤러리 섹션입니다.
///
/// 두 표면(유리·불투명)과 Paper의 상세 배치를 나란히 놓고, 실제로 열리는 시트
/// 하나를 함께 둡니다. 미리보기는 시트가 화면 아래에 붙는 모습 그대로입니다.
class HoronBottomSheetGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBottomSheetGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double width = constraints.maxWidth < _previewMaxWidth
              ? constraints.maxWidth
              : _previewMaxWidth;
          return Wrap(
            spacing: theme.space.s4,
            runSpacing: theme.space.s4,
            crossAxisAlignment: WrapCrossAlignment.start,
            children: <Widget>[
              _Preview(
                label: 'panel · glass',
                width: width,
                height: 320,
                child: HoronBottomSheet(
                  title: const Text('알림 설정'),
                  onClose: () {},
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: theme.space.s2,
                    children: <Widget>[
                      HoronBottomSheetRow(
                        label: 'Wi-Fi',
                        icon: const Icon(Icons.wifi),
                        value: const Text('On'),
                        onTap: () {},
                      ),
                      HoronBottomSheetRow(
                        label: '요일',
                        icon: const Icon(Icons.calendar_today),
                        value: const Text('Weekdays'),
                        onTap: () {},
                      ),
                      HoronBottomSheetActions(
                        children: <Widget>[
                          HoronBottomSheetAction(label: '취소', onPressed: () {}),
                          HoronBottomSheetAction(
                            label: '저장',
                            primary: true,
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              _Preview(
                label: 'panel · solid',
                width: width,
                height: 320,
                child: HoronBottomSheet(
                  title: const Text('워크스페이스'),
                  solid: true,
                  onClose: () {},
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: theme.space.s2,
                    children: <Widget>[
                      HoronBottomSheetRow(
                        label: '이름',
                        value: const Text('Horon'),
                        onTap: () {},
                      ),
                      HoronBottomSheetRow(
                        label: '멤버',
                        value: const Text('4'),
                        onTap: () {},
                      ),
                      HoronBottomSheetActions(
                        children: <Widget>[
                          HoronBottomSheetAction(
                            label: '나가기',
                            onPressed: () {},
                          ),
                          HoronBottomSheetAction(
                            label: '완료',
                            primary: true,
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              _Preview(
                label: 'detail · solid',
                width: width,
                height: 340,
                child: HoronBottomSheet(
                  title: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text('러너 상세', style: theme.text.titleSm),
                      Text(
                        'Paper 워크스페이스',
                        style: theme.text.bodySm.copyWith(
                          color: theme.colors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  detail: true,
                  solid: true,
                  onClose: () {},
                  child: HoronBottomSheetActions(
                    children: <Widget>[
                      HoronBottomSheetAction(label: '닫기', onPressed: () {}),
                      HoronBottomSheetAction(
                        label: '저장',
                        primary: true,
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
              ),
              _Sample(
                label: 'live · 화면 아래에서 올라옵니다',
                child: HoronBottomSheetAction(
                  label: '시트 열기',
                  primary: true,
                  onPressed: () => showHoronBottomSheet(
                    context,
                    title: const Text('알림 설정'),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      spacing: theme.space.s2,
                      children: <Widget>[
                        HoronBottomSheetRow(
                          label: 'Wi-Fi',
                          icon: const Icon(Icons.wifi),
                          value: const Text('On'),
                          onTap: () {},
                        ),
                        HoronBottomSheetRow(
                          label: '요일',
                          icon: const Icon(Icons.calendar_today),
                          value: const Text('Weekdays'),
                          onTap: () {},
                        ),
                        HoronBottomSheetActions(
                          children: <Widget>[
                            HoronBottomSheetAction(
                              label: '취소',
                              onPressed: () {},
                            ),
                            HoronBottomSheetAction(
                              label: '저장',
                              primary: true,
                              onPressed: () {},
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// 캡션과 시트 미리보기 한 벌입니다.
class _Preview extends StatelessWidget {
  const _Preview({
    required this.label,
    required this.width,
    required this.height,
    required this.child,
  });

  final String label;
  final double width;
  final double height;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return _Sample(
      label: label,
      child: SizedBox(
        width: width,
        height: height,
        child: Align(
          alignment: Alignment.bottomCenter,
          child: SizedBox(width: width, child: child),
        ),
      ),
    );
  }
}

/// 캡션과 위젯 하나입니다.
class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s1,
      children: <Widget>[
        Text(
          label,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        child,
      ],
    );
  }
}
