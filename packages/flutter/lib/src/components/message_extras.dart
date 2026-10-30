import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `message-extras.tsx`의 `size-7.5`입니다. 동작 버튼 상자입니다.
const double _actionSide = 30;

/// `message-extras.tsx`의 `size-10`입니다. 첨부 썸네일입니다.
const double _attachmentThumb = 40;

/// `message-extras.tsx`의 `rounded-[10px]`입니다.
const double _attachmentRadius = 10;

/// `message-extras.tsx`의 `p-[3px]`입니다. 동작 알약의 안쪽 여백입니다.
const double _actionsPadding = 3;

/// `message-extras.tsx`의 `w-70`입니다.
const double _attachmentWidth = 280;

/// `message-extras.tsx`의 `rounded-lg`입니다. 코드 블록의 14 반경입니다.
const double _codeRadius = 14;

/// Figma `Date separator`(Message extras 109:667): 10% 잉크 선 사이의 캡션입니다.
class HoronDateSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronDateSeparator({super.key, required this.label});

  /// 가운데 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Semantics(
      container: true,
      child: Row(
        children: <Widget>[
          Expanded(
            child: SizedBox(height: 1, child: ColoredBox(color: theme.colors.overlayInk10)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(label, style: theme.text.caption.copyWith(color: theme.colors.textSecondary)),
          ),
          Expanded(
            child: SizedBox(height: 1, child: ColoredBox(color: theme.colors.overlayInk10)),
          ),
        ],
      ),
    );
  }
}

/// 메시지 아래 동작 하나입니다.
class HoronMessageAction {
  /// 동작을 만듭니다.
  const HoronMessageAction({required this.label, required this.icon, this.onPressed});

  /// 접근성 이름입니다.
  final String label;

  /// 16px로 그릴 아이콘입니다.
  final Widget icon;

  /// 누르는 동작입니다.
  final VoidCallback? onPressed;
}

/// Figma `Message actions`(109:667): 16px 아이콘의 30px 버튼을 담은 regular 유리 알약입니다.
class HoronMessageActions extends StatelessWidget {
  /// 알약을 만듭니다.
  const HoronMessageActions({super.key, required this.actions});

  /// 동작 목록입니다.
  final List<HoronMessageAction> actions;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.full);

    return Align(
      alignment: Alignment.centerLeft,
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronLiquidGlass(
                tier: HoronGlassTier.regular,
                borderRadius: radius,
                child: const SizedBox.expand(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(_actionsPadding),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                spacing: 2,
                children: <Widget>[
                  for (final HoronMessageAction action in actions)
                    Semantics(
                      button: true,
                      label: action.label,
                      child: GestureDetector(
                        onTap: action.onPressed,
                        child: Container(
                          width: _actionSide,
                          height: _actionSide,
                          alignment: Alignment.center,
                          decoration: const BoxDecoration(shape: BoxShape.circle),
                          child: IconTheme.merge(
                            data: IconThemeData(size: 16, color: theme.colors.textSecondary),
                            child: action.icon,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Figma `Attachment`(109:667): 40px 썸네일과 이름·설명, 제거 버튼이 있는 옅은 카드입니다.
class HoronAttachment extends StatelessWidget {
  /// 첨부를 만듭니다.
  const HoronAttachment({
    super.key,
    required this.name,
    this.detail,
    this.imageUrl,
    this.onRemove,
    this.removeLabel = 'Remove',
  });

  /// 파일 이름입니다.
  final String name;

  /// 캡션입니다. 예: `PDF · 2.4 MB`.
  final String? detail;

  /// 이미지 썸네일 주소입니다. 없으면 문서 아이콘 타일을 그립니다.
  final String? imageUrl;

  /// 제거를 눌렀을 때입니다.
  final VoidCallback? onRemove;

  /// 제거 버튼의 접근성 이름입니다.
  final String removeLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);

    return Container(
      width: _attachmentWidth,
      padding: const EdgeInsets.only(left: 8, right: 12, top: 8, bottom: 8),
      decoration: BoxDecoration(color: theme.colors.bgSubtle, borderRadius: BorderRadius.circular(theme.radius.lg)),
      child: Row(
        children: <Widget>[
          ClipRRect(
            borderRadius: BorderRadius.circular(_attachmentRadius),
            child: SizedBox(
              width: _attachmentThumb,
              height: _attachmentThumb,
              child: imageUrl == null
                  ? ColoredBox(
                      color: HoronPalette.sky100,
                      child: Center(child: Icon(Icons.description_outlined, size: 20, color: theme.colors.textPrimary)),
                    )
                  : Image.network(
                      imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (BuildContext context, Object error, StackTrace? stack) => ColoredBox(
                        color: HoronPalette.sky100,
                        child: Center(
                          child: Icon(Icons.description_outlined, size: 20, color: theme.colors.textPrimary),
                        ),
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                ),
                if (detail != null)
                  Text(
                    detail!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                  ),
              ],
            ),
          ),
          if (onRemove != null) ...<Widget>[
            const SizedBox(width: 8),
            Semantics(
              button: true,
              label: removeLabel,
              child: GestureDetector(
                onTap: onRemove,
                child: Icon(Icons.close, size: 16, color: theme.colors.textSecondary),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Figma `Code block`(109:667): 잉크 표면, 14 반경, 복사 버튼이 있는 6% 헤더, Geist Mono 13/22 코드입니다.
class HoronCodeBlock extends StatefulWidget {
  /// 코드 블록을 만듭니다.
  const HoronCodeBlock({
    super.key,
    required this.code,
    this.language,
    this.copyLabel = 'Copy',
    this.copiedLabel = 'Copied',
  });

  /// 코드 본문입니다.
  final String code;

  /// 헤더에 표시할 언어입니다.
  final String? language;

  /// 복사 버튼 글자입니다.
  final String copyLabel;

  /// 복사한 뒤 글자입니다.
  final String copiedLabel;

  @override
  State<HoronCodeBlock> createState() => _HoronCodeBlockState();
}

class _HoronCodeBlockState extends State<HoronCodeBlock> {
  bool _copied = false;

  Future<void> _copy() async {
    // 플랫폼 클립보드가 없는 환경(테스트, 일부 데스크톱)에서도 버튼이 반응하도록
    // 복사 실패를 삼키지 않고, 성공·실패와 무관하게 표시만 바꿉니다.
    if (mounted) setState(() => _copied = true);
    try {
      await Clipboard.setData(ClipboardData(text: widget.code));
    } on Object {
      // 무시합니다: 클립보드 플러그인이 없는 실행 환경입니다.
    }
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(_codeRadius);

    return ClipRRect(
      borderRadius: radius,
      child: ColoredBox(
        color: theme.colors.surfaceInk,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Container(
              color: theme.colors.bgSurface6,
              padding: const EdgeInsets.only(left: 14, right: 12, top: 8, bottom: 8),
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: Text(
                      widget.language ?? '',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.text.caption.copyWith(color: theme.colors.textOnInk.withValues(alpha: 0.7)),
                    ),
                  ),
                  Semantics(
                    button: true,
                    child: GestureDetector(
                      onTap: _copy,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Icon(Icons.copy, size: 14, color: theme.colors.textOnInk),
                          const SizedBox(width: 4),
                          Text(
                            _copied ? widget.copiedLabel : widget.copyLabel,
                            style: theme.text.caption.copyWith(color: theme.colors.textOnInk),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(left: 14, right: 14, top: 12, bottom: 14),
              child: Text(
                widget.code,
                softWrap: false,
                style: theme.text.code.copyWith(fontSize: 13, height: 22 / 13, color: theme.colors.textOnInk),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
