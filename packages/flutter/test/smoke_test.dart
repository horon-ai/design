import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

void main() {
  test('패키지 버전 상수를 노출한다', () {
    expect(horonUiVersion, '0.1.0');
  });

  test('한국어와 영어 문자열은 noResults에서 다르다', () {
    expect(const HoronStringsKo().noResults, isNot(const HoronStringsEn().noResults));
  });
}
