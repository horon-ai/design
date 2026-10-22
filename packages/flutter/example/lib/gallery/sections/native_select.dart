import 'package:flutter/material.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/native_select.dart';

import '../section_scaffold.dart';

/// `native_select` 갤러리 섹션입니다.
///
/// 두 크기와 라벨·오류·비활성 상태를 그립니다. 플랫폼 선택기는 화면을 덮으므로
/// 갤러리에서는 열지 않고, 겉모양과 라벨·오류 배치만 보여 줍니다. 선택기를 여는
/// 동작은 이 섹션이 아니라 호스트 앱(또는 위젯 테스트)이 확인합니다.
class HoronNativeSelectGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronNativeSelectGallerySection({super.key});

  @override
  State<HoronNativeSelectGallerySection> createState() =>
      _HoronNativeSelectGallerySectionState();
}

class _HoronNativeSelectGallerySectionState
    extends State<HoronNativeSelectGallerySection> {
  static const List<HoronNativeSelectOption<String>> _languages =
      <HoronNativeSelectOption<String>>[
        HoronNativeSelectOption<String>(value: 'ko', label: '한국어'),
        HoronNativeSelectOption<String>(value: 'en', label: 'English'),
        HoronNativeSelectOption<String>(
          value: 'off',
          label: '사용 안 함',
          enabled: false,
        ),
      ];

  String? _language = 'ko';
  String? _empty;

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Native Select',
      variants: <Widget>[
        SizedBox(
          width: 220,
          child: HoronNativeSelect<String>(
            label: '언어',
            value: _language,
            options: _languages,
            onChanged: (String? value) => setState(() => _language = value),
          ),
        ),
        SizedBox(
          width: 220,
          child: HoronNativeSelect<String>.sm(
            label: 'small',
            value: _language,
            options: _languages,
            onChanged: (String? value) => setState(() => _language = value),
          ),
        ),
        const SizedBox(
          width: 220,
          child: HoronNativeSelect<String>(
            placeholder: '고르지 않음',
            options: _languages,
          ),
        ),
      ],
      states: <Widget>[
        SizedBox(
          width: 220,
          child: HoronNativeSelect<String>(
            label: '오류',
            value: _empty,
            options: _languages,
            error: '언어를 골라 주세요',
            onChanged: (String? value) => setState(() => _empty = value),
          ),
        ),
        SizedBox(
          width: 220,
          child: HoronNativeSelect<String>(
            label: '비활성',
            value: 'ko',
            options: _languages,
            enabled: false,
          ),
        ),
      ],
      notes:
          'React `native-select.tsx`의 겉모양(높이 37·28, 반경 8, 오른쪽 셰브론)입니다. '
          '안쪽 선택기는 플랫폼 것을 씁니다. iOS·macOS는 CupertinoPicker 바퀴, 그 밖은 '
          '체크 표시가 붙은 목록 시트이고 Material DropdownButton은 쓰지 않습니다. '
          'onRequestPicker를 넘기면 호스트가 자기 선택기를 열 수 있습니다.',
    );
  }
}
