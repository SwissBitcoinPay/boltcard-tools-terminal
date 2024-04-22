import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "@components/Router";
import { UTCDate } from "@date-fns/utc";
import {
  Button,
  CheckboxField,
  ComponentStack,
  Loader,
  Text,
  Icon
} from "@components";
import {
  faBolt,
  faClock,
  faCommentDots,
  faHome,
  faMoneyBill,
  faNetworkWired,
  faPen,
  faPercentage
} from "@fortawesome/free-solid-svg-icons";
import addDays from "date-fns/addDays";
import intlFormat from "date-fns/intlFormat";
import bolt11, { PaymentRequestObject } from "bolt11";
import { useNfc, usePin } from "@hooks";
import { XOR } from "ts-essentials";
import { ThemeContext } from "@config";
import { useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import { Vibration } from "react-native";
import { useTheme } from "styled-components";
import { ListItem } from "@components/ItemsList/components/ListItem";
import { faBitcoin } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import * as S from "./styled";

import { ImageBackground, SafeAreaView, StatusBar } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import { faDeleteLeft, faUnlock } from "@fortawesome/free-solid-svg-icons";

const numberWithSpaces = (nb: number) =>
  nb.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type InvoiceState = XOR<
  {
    lightningInvoice: string;
  },
  {
    bitcoinAddress: string;
    amount: number;
    label?: string;
    message?: string;
  }
>;

export const Invoice = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "screens.invoice" });
  const navigate = useNavigate();
  const { setBackgroundColor } = useContext(ThemeContext);
  const location = useLocation<InvoiceState>();
  const { colors } = useTheme();
  const {
    setupNfc,
    readingNfcLoop,
    stopNfc,
    isNfcAvailable,
    isNfcScanning,
    isNfcLoading,
    isNfcNeedsTap,
    isNfcActionSuccess,
    isPinRequired,
    isPinConfirmed
  } = useNfc();

  const {
    lightningInvoice: stateLightningInvoice,
    bitcoinAddress,
    amount,
    label,
    message
  } = location.state || {};

  const [swapLightningInvoice, setSwapLightningInvoice] = useState<string>();

  const lightningInvoice = useMemo(
    () => stateLightningInvoice || swapLightningInvoice,
    [stateLightningInvoice, swapLightningInvoice]
  );

  const [isScheduledSwap, setIsScheduledSwap] = useState(false);
  const [isSwapLoading, setIsSwapLoading] = useState<boolean>();
  const [swapFees, setSwapFees] = useState<number>();
  const [decodedInvoice, setDecodedInvoice] = useState<PaymentRequestObject>();

  const { satoshis } = decodedInvoice || {};

  const [getPin, onConfirm] = usePin()

  const pinView = useRef(null)
  const [showRemoveButton, setShowRemoveButton] = useState(false)
  const [enteredPin, setEnteredPin] = useState("")
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

  useEffect(() => {
    void setupNfc();
  }, []);

  useEffect(() => {
    if (lightningInvoice) {
      setDecodedInvoice(bolt11.decode(lightningInvoice));
    }
  }, [lightningInvoice]);

  useEffect(() => {
    if (isNfcAvailable && !isNfcNeedsTap && lightningInvoice) {
      void readingNfcLoop(lightningInvoice, satoshis, getPin);
    }
  }, [readingNfcLoop, isNfcAvailable, isNfcNeedsTap, lightningInvoice, satoshis]);

  useEffect(() => {
    if (isNfcActionSuccess) {
      Vibration.vibrate(50);
      setBackgroundColor(colors.success, 500);
    }
  }, [isNfcActionSuccess]);

  const onGetSwapQuote = useCallback(async () => {
    if (amount) {
      setIsSwapLoading(true);
      try {
        const { data } = await axios.get<{
          callback: string;
          minSendable: number;
        }>(
          `https://swiss-bitcoin-pay.ch/.well-known/lnurlp/${bitcoinAddress},amount=${amount},scheduled=${
            isScheduledSwap ? "true" : "false"
          }`
        );
        const { data: callbackData } = await axios.get<{
          pr: string;
        }>(data.callback, { params: { amount: data.minSendable } });
        setSwapLightningInvoice(callbackData.pr);
        setSwapFees(data.minSendable / 1000 - amount);
      } catch (e) {}
      setIsSwapLoading(false);
    }
  }, [amount, bitcoinAddress, isScheduledSwap]);

  const onReturnToHome = useCallback(() => {
    navigate("/");
    setBackgroundColor(colors.primary, 0);
  }, [colors.primary, navigate, setBackgroundColor]);

  const finalLabel = useMemo(
    () =>
      (stateLightningInvoice &&
        decodedInvoice?.tags
          .find((tag) => tag.tagName === "description")
          ?.data.toString()) ||
      label,
    [decodedInvoice?.tags, label, stateLightningInvoice]
  );

  return (
    <S.InvoicePageContainer
      {...(!isNfcActionSuccess
        ? !decodedInvoice
          ? {
              footerButton: {
                type: "bitcoin",
                title: t("requestSwap"),
                onPress: onGetSwapQuote,
                isLoading: isSwapLoading
              }
            }
          : isNfcNeedsTap && lightningInvoice
          ? {
              footerButton: {
                type: "bitcoin",
                title: t("startScanning"),
                onPress: () => {
                  void readingNfcLoop(lightningInvoice);
                }
              }
            }
          : {}
        : {})}
      isContentVerticallyCentered={isNfcActionSuccess}
    >
      <ComponentStack>
        {!isNfcActionSuccess && (
          <ComponentStack gapSize={2} gapColor={colors.primaryLight}>
            <ListItem
              title={t("network")}
              icon={faNetworkWired}
              valuePrefixIcon={
                stateLightningInvoice
                  ? { icon: faBolt, color: colors.lightning }
                  : { icon: faBitcoin, color: colors.bitcoin }
              }
              value={stateLightningInvoice ? "Lightning" : "Onchain"}
              valueColor={
                stateLightningInvoice ? colors.lightning : colors.bitcoin
              }
            />
            {finalLabel && (
              <ListItem title={t("label")} icon={faPen} value={finalLabel} />
            )}
            {message && (
              <ListItem
                title={t("message")}
                icon={faCommentDots}
                value={message}
              />
            )}

            {!stateLightningInvoice && (
              <S.ListItemWrapper>
                <Text h4 weight={600} color={colors.greyLight}>
                  {t("scheduledSwapIntro")}
                </Text>
              </S.ListItemWrapper>
            )}
            {!stateLightningInvoice && (
              <ListItem
                title={t("nextBatch")}
                icon={faClock}
                value={intlFormat(
                  addDays(new UTCDate().setUTCHours(0, 0, 0, 0), 1),
                  {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )}
              />
            )}
            {!stateLightningInvoice && (
              <S.ListItemWrapper>
                <CheckboxField
                  label={t("scheduleForNextBatch")}
                  value={isScheduledSwap}
                  onChange={() => {
                    stopNfc();
                    setSwapFees(undefined);
                    setDecodedInvoice(undefined);
                    setIsScheduledSwap(!isScheduledSwap);
                  }}
                />
              </S.ListItemWrapper>
            )}
            {amount && (
              <ListItem
                title={t("amountReceived")}
                icon={faMoneyBill}
                value={`${numberWithSpaces(amount)} sats`}
              />
            )}
            {swapFees && (
              <ListItem
                title={t("fees")}
                icon={faPercentage}
                value={`${numberWithSpaces(swapFees)} sats`}
              />
            )}
            {satoshis && (
              <ListItem
                title={t("invoiceAmount")}
                titleColor={colors.lightning}
                icon={faBolt}
                value={`${numberWithSpaces(satoshis)} sats`}
                valueColor={colors.lightning}
              />
            )}
          </ComponentStack>
        )}
      </ComponentStack>
      {isNfcActionSuccess ? (
        <S.SuccessComponentStack gapSize={32}>
          <S.SuccessLottie
            autoPlay
            loop={false}
            source={require("@assets/animations/success.json")}
            size={180}
          />
          <Text h3 color={colors.white} weight={700}>
            {t("paid")}
          </Text>
          <Button
            icon={faHome}
            size="large"
            title={t("returnToHome")}
            onPress={onReturnToHome}
          />
        </S.SuccessComponentStack>
      ) : isPinRequired && !isPinConfirmed ? (
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
                      onConfirm(enteredPin)
                    }
                  }}
                  customLeftButton={showRemoveButton ? <Icon icon={faDeleteLeft} size={36} color={"#FFF"} /> : null}
                  customRightButton={showCompletedButton ? <Icon icon={faUnlock} size={36} color={"#FFF"} /> : null}
                />
              </SafeAreaView>
          </>
      ) : isNfcLoading || isNfcScanning ? (
        <Loader
          reason={t(isNfcLoading ? "payingInvoice" : "tapYourBoltCard")}
        />
      ) : null}
    </S.InvoicePageContainer>
  );
};
