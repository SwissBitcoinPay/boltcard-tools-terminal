import { useRef, useState, useEffect } from 'react';
import ReactNativePinView from "react-native-pin-view";
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import { Icon } from "@components";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import * as S from "./styled";

type PinViewFunctions = {
  clearAll: () => void;
};

type PinPadProps = {
  onPinEntered: (pin: string) => void;
}

const LeftButton = () => <Icon icon={faDeleteLeft} size={36} color={"#FFF"} />;

export const PinPad = (props: PinPadProps) => {
  const pinView = useRef<PinViewFunctions>(null);
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [buttonPressed, setButtonPressed] = useState("");

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true)
    } else {
      setShowRemoveButton(false)
    }
    if (enteredPin.length === 4) {
        props.onPinEntered(enteredPin)
    }
  }, [enteredPin]);

  useEffect(() => {
      if (buttonPressed === "custom_left" && pinView.current) {
        pinView.current.clearAll()
      }
  }, [buttonPressed]);

  return (
    <>
        <BottomDrawer
            ref={bottomDrawerRef}
            openOnMount gestureMode={"none"}
            closeOnBackdropPress={false}
            initialHeight={535}
            backdropOpacity={0}
            customStyles={S.BottomDrawerStyles}
        >
            <S.PinPadContainer>
              <S.PinPadTitle>
                Boltcard PIN
              </S.PinPadTitle>
              <ReactNativePinView
                inputSize={32}
                // @ts-ignore
                ref={pinView}
                pinLength={4}
                buttonSize={60}
                onValueChange={value => setEnteredPin(value)}
                buttonAreaStyle={{ marginTop: 24 }}
                inputAreaStyle={{ marginBottom: 24 }}
                inputViewEmptyStyle={S.PinViewStyles.whiteBorderTransparent}
                inputViewFilledStyle={{ backgroundColor: "#FFF" }}
                buttonViewStyle={S.PinViewStyles.whiteBorder}
                buttonTextStyle={{ color: "#FFF" }}
                onButtonPress={key => setButtonPressed(key)}
                // @ts-ignore
                customLeftButton={showRemoveButton ? <LeftButton /> : undefined}
              />
            </S.PinPadContainer>
        </BottomDrawer >
    </>
  );
}