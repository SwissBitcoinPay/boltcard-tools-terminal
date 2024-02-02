import qs from "query-string";
import { validateBitcoinAddress } from "./validateBitcoinAddress";

type InvoiceType = {
  bitcoin?: string;
  lightning?: string;
  amount?: string;
  label?: string;
  message?: string;
};

export const getBitcoinInvoiceData = (value: string) => {
  let lightningInvoice: string | undefined;
  let bitcoinAddress: string | undefined;
  let amount: number | undefined;
  let label: string | undefined;
  let message: string | undefined;

  if (value.toLowerCase().startsWith("lnbc")) {
    lightningInvoice = value.toLowerCase();
  } else {
    const parsedValue = qs.parse(
      value
        .replace(/lightning:/i, "lightning=")
        .replace(/bitcoin:/i, "bitcoin=")
        .replace("?", "&"),
      { parseNumbers: true }
    ) as InvoiceType;
    lightningInvoice = parsedValue.lightning;
    bitcoinAddress = parsedValue.bitcoin;
    amount = parsedValue.amount
      ? Math.round(parseFloat(parsedValue.amount) * 100000000)
      : undefined;
    label = parsedValue.label;
    message = parsedValue.message;
  }

  const isValid =
    !!lightningInvoice ||
    (validateBitcoinAddress(bitcoinAddress || "") && amount);

  return {
    lightningInvoice,
    bitcoinAddress,
    amount,
    label,
    message,
    isValid
  };
};
