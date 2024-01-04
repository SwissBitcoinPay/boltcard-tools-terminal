import { ImageSourcePropType } from "react-native";

export const PlaceholderPresets: { [key in string]: ImageSourcePropType } = {
  invoiceQrCode: require("@assets/images/invoice-qr-placeholder.png")
};

export type PlaceholderPresetsTypes = (typeof PlaceholderPresets)[number];
