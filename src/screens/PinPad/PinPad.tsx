import { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StatusBar } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import { Text, Icon } from "@components";
import { faDeleteLeft, faUnlock } from "@fortawesome/free-solid-svg-icons";

export const PinPad = (props) => {
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  const [showCompletedButton, setShowCompletedButton] = useState(false)

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true)
    } else {
      setShowRemoveButton(false)
    }
    if (enteredPin.length === 4) {
      setShowCompletedButton(true)
    } else {
      setShowCompletedButton(false)
    }
  }, [enteredPin])

  return (
    <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              paddingTop: 24,
              paddingBottom: 48,
              color: "rgba(255,255,255,0.7)",
              fontSize: 48,
            }}>
            Boltcard PIN
          </Text>
          <ReactNativePinView
            inputSize={32}
            ref={pinView}
            pinLength={4}
            buttonSize={60}
            onValueChange={value => setEnteredPin(value)}
            buttonAreaStyle={{
              marginTop: 24,
            }}
            inputAreaStyle={{
              marginBottom: 24,
            }}
            inputViewEmptyStyle={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#FFF",
            }}
            inputViewFilledStyle={{
              backgroundColor: "#FFF",
            }}
            buttonViewStyle={{
              borderWidth: 1,
              borderColor: "#FFF",
            }}
            buttonTextStyle={{
              color: "#FFF",
            }}
            onButtonPress={key => {
              if (key === "custom_left") {
                pinView.current.clear()
              }
              if (key === "custom_right") {
                props.newPin(enteredPin)
              }
            }}
            customLeftButton={showRemoveButton ? <Icon icon={faDeleteLeft} size={36} color={"#FFF"} /> : null}
            customRightButton={showCompletedButton ? <Icon icon={faUnlock} size={36} color={"#FFF"} /> : null}
          />
        </SafeAreaView>
    </>
  );
}