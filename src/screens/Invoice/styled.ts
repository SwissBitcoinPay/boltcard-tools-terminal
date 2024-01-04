import styled from "styled-components";
import {
  View,
  Text,
  Pressable,
  PageContainer,
  Image,
  Lottie,
  ComponentStack
} from "@components";

export const InvoicePageContainer = styled(PageContainer).attrs(() => ({}))``;

export const TitleText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
`;

export const ListItemWrapper = styled(View)`
  padding: ${({ theme }) => `${theme.gridSize / 2}px ${theme.gridSize}px`};
`;

export const NfcScanButton = styled(Pressable)`
  ${({ theme }) => `
    background: ${theme.colors.primaryLight};
    border-radius: 1000px;
  `}

  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1/1;
`;

export const NfcImage = styled(Image)`
  height: 200px;
  aspect-ratio: 1/1;
`;

export const SuccessComponentStack = styled(ComponentStack)`
  align-items: center;
`;

export const SuccessLottie = styled(Lottie)<{ size: number }>`
  ${({ size }) => `
    height: ${size}px;
    width: ${size}px;
  `}
  transform: scale(1.35);
`;
