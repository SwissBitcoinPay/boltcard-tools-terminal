import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Camera,
  CodeScanner,
  useCameraDevices,
  useCodeScanner
} from "react-native-vision-camera";
import { QRScannerProps } from "./QRCamera";
import { StyleSheet } from "react-native";
import { Loader } from "@components/Loader";
import * as S from "./styled";

export const QRCamera = ({
  onScan,
  setConfig,
  isTorchOn,
  deviceIndex,
  videoHeight,
  isActive = true,
  resizeMode = "cover",
  style
}: QRScannerProps) => {
  const devices = useCameraDevices();

  const [isLoading, setIsLoading] = useState(true);

  const device = useMemo(() => {
    if (deviceIndex === undefined) {
      return null;
    }
    return devices[deviceIndex];
  }, [devices, deviceIndex]);

  useEffect(() => {
    setConfig({
      isActive: true,
      hasTorch: device?.hasTorch || false,
      defaultIndex: devices.findIndex((d) => d.position === "back"),
      devicesNumber: devices.length
    });
  }, [device]);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermission();
      setIsLoading(false);
    })();
  }, []);

  const onCodeScanned = useCallback<CodeScanner["onCodeScanned"]>(
    (codes) => {
      if (codes[0].value) {
        onScan(codes[0].value);
      }
    },
    [onScan]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned
  });

  return !!device && !isLoading ? (
    <S.Camera
      isActive={isActive}
      key={device.id}
      device={device}
      torch={isTorchOn ? "on" : "off"}
      codeScanner={codeScanner}
      style={StyleSheet.flatten([
        style,
        {
          height: videoHeight as number
        }
      ])}
      resizeMode={resizeMode}
    />
  ) : (
    <Loader />
  );
};
