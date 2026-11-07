import "../src/styles/globals.css";

import { root } from "@lynx-js/react";

import { Gallery } from "./gallery";

root.render(<Gallery />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
