import * as React from "react";
import { DirectionProvider as DirectionProviderPrimitive } from "@base-ui/react/direction-provider";

function DirectionProvider({ direction = "ltr", ...props }: React.ComponentProps<typeof DirectionProviderPrimitive>) {
  return <DirectionProviderPrimitive direction={direction} {...props} />;
}

export { DirectionProvider };
