import { ComponentStack, Icon, Text, View } from "@components";
import styled from "styled-components";

export const ListItemContainer = styled(View)<{ width?: number }>`
  height: 60px;
  padding: 0px ${({ theme }) => theme.gridSize}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ width, theme }) =>
    width
      ? `width: ${width}px; margin-left: -${theme.gridSize}px; border: 0px solid ${theme.colors.primaryLight}; border-top-width: 2px; border-bottom-width: 2px;`
      : ""}
`;

export const TitleIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.white};
`;

export const SideContainer = styled(ComponentStack).attrs(() => ({
  direction: "horizontal"
}))`
  align-items: center;
`;

export const ListItemTitle = styled(Text)`
  color: ${({ theme, color }) => color || theme.colors.white};
`;

export const ListItemValue = styled(Text)`
  color: ${({ theme, color }) => color || theme.colors.white};
  text-align: right;
`;
