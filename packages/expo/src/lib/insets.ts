import { useContext } from "react";
import { SafeAreaInsetsContext, type EdgeInsets } from "react-native-safe-area-context";

const NO_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * The safe-area insets from `react-native-safe-area-context`, the way Expo
 * recommends reading them, or zero on every edge when the app mounted no
 * `SafeAreaProvider` (a component preview, a test, an embedded view).
 *
 * `useSafeAreaInsets()` throws without a provider; the edge components read
 * the context directly so they still render inside a host that handles the
 * insets itself.
 */
export function useInsets(): EdgeInsets {
  return useContext(SafeAreaInsetsContext) ?? NO_INSETS;
}
