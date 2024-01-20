import { ToastProps as RootToastProps } from "react-native-toast-notifications/lib/typescript/toast";
import {
  IconDefinition,
  faCheckCircle,
  faTimesCircle,
  faWarning
} from "@fortawesome/free-solid-svg-icons";
import { Pressable } from "@components";
import { useEffect, useState } from "react";
import * as S from "./styled";

const INTERVAL_DURATION = 100;

type ToastProps = Omit<RootToastProps, "icon"> & {
  icon?: IconDefinition;
};

export const Toast = ({
  message,
  type,
  icon,
  duration,
  onPress
}: ToastProps) => {
  const [toastWidth, setToastWidth] = useState<number>();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (duration) {
      setInterval(() => {
        setProgress(
          (currenctProgress) =>
            currenctProgress - duration / 10000 / INTERVAL_DURATION
        );
      }, INTERVAL_DURATION);
    }
  }, []);

  return (
    <S.ToastContainer
      type={type}
      onLayout={(e) => {
        if (duration) {
          setToastWidth(e.nativeEvent.layout.width);
        }
      }}
      direction="horizontal"
      gapSize={8}
      {...(onPress ? { componentAs: Pressable, onPress } : {})}
    >
      <S.ToastIcon
        size={24}
        icon={
          icon ||
          (type === "success"
            ? faCheckCircle
            : type === "info"
            ? faWarning
            : faTimesCircle)
        }
      />
      <S.ToastText>{message}</S.ToastText>
      {duration && toastWidth && (
        <S.DurationBar
          progress={progress}
          color="rgba(255, 255, 255, 0.4)"
          useNativeDriver
          borderWidth={0}
          width={toastWidth}
        />
      )}
    </S.ToastContainer>
  );
};
