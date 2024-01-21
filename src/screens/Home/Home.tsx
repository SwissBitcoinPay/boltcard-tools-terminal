import { useTranslation } from "react-i18next";
import { useNavigate } from "@components/Router";
import { Button, ComponentStack, PageContainer, Pressable } from "@components";
import { faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import AnimatedLinearGradient from "react-native-animated-linear-gradient";
import { colors } from "./gradient-config";
import { PlaceholderPresets } from "@components/QRCamera/data";
import { useInitialClipboard, useVersionTag } from "@hooks";
import { platform } from "@config";
import * as S from "./styled";
import { useEffect, useState } from "react";

const { getIsNfcSupported } = platform;

export const Home = () => {
  useInitialClipboard();
  const { t } = useTranslation(undefined, { keyPrefix: "screens.home" });
  const navigate = useNavigate();
  const versionTag = useVersionTag();

  const [isNfcSupported, setIsNfcSupported] = useState(false);

  useEffect(() => {
    (async () => {
      setIsNfcSupported(await getIsNfcSupported());
    })();
  }, []);

  return (
    <>
      <AnimatedLinearGradient customColors={colors} speed={6000} />
      <PageContainer noVerticalPadding>
        <ComponentStack>
          <ComponentStack direction="horizontal" gapSize={8}>
            <S.TitleLogo source={require("@assets/images/app-logo.png")} />
            <S.TitleText h3 weight={700}>
              BoltCard Tools Terminal
            </S.TitleText>
          </ComponentStack>
          <S.IntroText h4 centered weight={600}>
            {t("intro")}
          </S.IntroText>
        </ComponentStack>
        <S.MainComponentStack>
          <Button
            isRound
            size="circle"
            type="bitcoin"
            icon={isNfcSupported ? faCamera : faXmark}
            title={t(isNfcSupported ? "scanInvoice" : "nfcNotSupported")}
            disabled={!isNfcSupported}
            onPress={() => {
              navigate("/qr-scanner", {
                state: {
                  title: t("scanInvoice"),
                  placeholderPreset: PlaceholderPresets.invoiceQrCode
                }
              });
            }}
          />
          <S.BoltCardComponentStack
            direction="horizontal"
            gapSize={4}
            componentAs={Pressable}
            // @ts-ignore
            onPress="https://boltcard.org"
          >
            <S.IntroText h5 weight={600}>
              {t("moreAboutBoltCard")}
            </S.IntroText>
            <S.BoltCardImage source={require("@assets/images/bolt-card.png")} />
          </S.BoltCardComponentStack>
        </S.MainComponentStack>
        <ComponentStack gapSize={12}>
          <S.BuiltByComponentStack
            gapSize={2}
            componentAs={Pressable}
            // @ts-ignore
            onPress="https://swiss-bitcoin-pay.ch"
          >
            <S.BuiltBySBPText h5 weight={700}>
              {t("builtBy")}
            </S.BuiltBySBPText>
            <S.BuiltBySBPImage
              source={require("@assets/images/logo-white.png")}
            />
          </S.BuiltByComponentStack>
          <S.PressableVersion onPress="https://github.com/SwissBitcoinPay/boltcard-tools-terminal">
            <S.VersionText h5 weight={600}>
              {versionTag}
            </S.VersionText>
          </S.PressableVersion>
        </ComponentStack>
      </PageContainer>
    </>
  );
};
