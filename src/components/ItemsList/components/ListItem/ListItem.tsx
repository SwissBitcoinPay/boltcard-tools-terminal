import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { StyledComponentComponentProps } from "@types";
import { Icon } from "@components";
import * as S from "./styled";
import { useWindowDimensions } from "react-native";

type ListItemProps = {
  icon: IconDefinition;
  title: string;
  titleColor?: string;
  value: string;
  valueColor?: string;
  isFullWidth?: boolean;
  valuePrefixIcon?: { icon: IconDefinition; color?: string };
} & StyledComponentComponentProps<typeof S.ListItemContainer>;

export const ListItem = ({
  icon,
  title,
  titleColor,
  value,
  valueColor,
  valuePrefixIcon,
  isFullWidth,
  ...props
}: ListItemProps) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <S.ListItemContainer
      {...props}
      width={isFullWidth ? windowWidth : undefined}
    >
      <S.SideContainer gapSize={8}>
        <S.TitleIcon icon={icon} size={24} color={titleColor} />
        <S.ListItemTitle h4 weight={600} color={titleColor}>
          {title}
        </S.ListItemTitle>
      </S.SideContainer>
      <S.SideContainer gapSize={4}>
        {valuePrefixIcon && (
          <Icon
            icon={valuePrefixIcon.icon}
            size={20}
            color={valuePrefixIcon.color}
          />
        )}
        <S.ListItemValue h4 weight={600} color={valueColor}>
          {value}
        </S.ListItemValue>
      </S.SideContainer>
    </S.ListItemContainer>
  );
};
