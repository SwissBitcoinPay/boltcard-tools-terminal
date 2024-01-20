import React, {
  Children,
  Fragment,
  PropsWithChildren,
  forwardRef
} from "react";
import { StyledComponentComponentProps } from "@types";
import { MarkOptional } from "ts-essentials";
import * as S from "./styled";
import { useWindowDimensions } from "react-native";
import { useIsScreenSizeMin } from "@hooks";
import { View } from "@components";

type ComponentStackProps = {
  componentAs?: React.ElementType;
} & MarkOptional<StyledComponentComponentProps<typeof S.GapView>, "direction">;

export const ComponentStack = forwardRef<
  typeof View,
  PropsWithChildren<ComponentStackProps>
>(
  (
    {
      children,
      componentAs,
      direction = "vertical",
      gapColor,
      gapSize,
      ...props
    },
    ref
  ) => {
    const { width: windowWidth } = useWindowDimensions();
    const isLarge = useIsScreenSizeMin("large");
    const filteredChildren = Children.toArray(children).filter(
      (child) => !!child
    );
    const childrenCount = filteredChildren.length;

    return (
      <S.ComponentStack
        {...props}
        ref={ref}
        as={componentAs}
        direction={direction}
        fullWidth={!isLarge && gapColor ? windowWidth : undefined}
      >
        {filteredChildren.map((child, index) => (
          <Fragment key={index}>
            {child}
            {child && index < childrenCount - 1 && (
              <S.GapView
                direction={direction}
                gapColor={gapColor}
                gapSize={gapSize}
              />
            )}
          </Fragment>
        ))}
      </S.ComponentStack>
    );
  }
);
