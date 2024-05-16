import { useRef, useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import { Text, Icon } from "@components";
import { faDeleteLeft, faUnlock } from "@fortawesome/free-solid-svg-icons";

export const PinPad = (props) => {
  const pinView = useRef(null);
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [buttonPressed, setButtonPressed] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const styles = StyleSheet.create({
    container: {
        backgroundColor:  "rgba(0,0,0,0.5)",
    },
    handleContainer: {
      backgroundColor:  "transparent",
    },
    pinPad: {
      backgroundColor: "transparent",
      alignItems: "center",
      flex: 1,
    },
    pinPadTitle: {
      paddingTop: 48,
      paddingBottom: 24,
      color: "rgba(255,255,255,1)",
      fontSize: 48,
    },
    whiteBorder: {
      borderWidth: 1,
      borderColor: "#FFF",
    },
  });

  useEffect(() => {
    if(isVisible) {
        bottomDrawerRef.current.open();
    } else {
        bottomDrawerRef.current.close()
    }
  }, [isVisible]);

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
  }, [enteredPin]);

  useEffect(() => {
      if (buttonPressed === "custom_left") {
        pinView.current.clearAll()
      }
      if (buttonPressed === "custom_right") {
        props.newPin(enteredPin)
      }
  }, [buttonPressed])

  const onClose = useCallback(() => {
      setIsVisible(false);
    }, []);

  return (
    <>
        <BottomDrawer
            ref={bottomDrawerRef}
            openOnMount gestureMode={"none"}
            closeOnBackdropPress={false}
            initialHeight={535}
            backdropOpacity={0}
            customStyles={styles}
        >
            <View
              style={styles.pinPad}>
              <Text
                style={styles.pinPadTitle}>
                Boltcard PIN
              </Text>
              <ReactNativePinView
                inputSize={32}
                ref={pinView}
                pinLength={4}
                buttonSize={60}
                onValueChange={value => setEnteredPin(value)}
                buttonAreaStyle={{ marginTop: 24 }}
                inputAreaStyle={{ marginBottom: 24 }}
                inputViewEmptyStyle={[{ backgroundColor: "transparent" }, styles.whiteBorder]}
                inputViewFilledStyle={{ backgroundColor: "#FFF" }}
                buttonViewStyle={styles.whiteBorder}
                buttonTextStyle={{ color: "#FFF" }}
                onButtonPress={key => setButtonPressed(key)}
                customLeftButton={showRemoveButton ? <Icon icon={faDeleteLeft} size={36} color={"#FFF"} /> : null}
                customRightButton={showCompletedButton ? <Icon icon={faUnlock} size={36} color={"#FFF"} /> : null}
              />
            </View>
        </BottomDrawer >
    </>
  );
}