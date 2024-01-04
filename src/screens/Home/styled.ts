import styled from "styled-components";
import { Text, Pressable, Image, ComponentStack } from "@components";

export const TitleLogo = styled(Image)`
  width: 42px;
  border-radius: 10px;
  aspect-ratio: 1/1;
`;

export const TitleText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
`;

export const IntroText = styled(Text)`
  color: ${({ theme }) => theme.colors.greyLight};
`;

export const BoltCardImage = styled(Image)`
  width: 60px;
  height: 60px;
`;

export const BoltCardComponentStack = styled(ComponentStack)`
  border: 3px solid ${({ theme }) => theme.colors.grey};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  flex-direction: row;
`;

export const MainComponentStack = styled(ComponentStack)`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const BuiltByComponentStack = styled(ComponentStack)`
  align-items: center;
  justify-content: center;
`;

export const BuiltBySBPText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
`;

export const BuiltBySBPImage = styled(Image)`
  height: 18px;
  aspect-ratio: 119 / 15;
`;

export const PressableVersion = styled(Pressable)`
  align-self: center;
  margin-bottom: 6px;
`;

export const VersionText = styled(Text)`
  color: ${({ theme }) => theme.colors.greyLight};
`;
