import { theme } from "@config/themes/theme";

type Theme = typeof theme;

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}
