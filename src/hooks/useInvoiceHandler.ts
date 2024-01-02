import { useCallback } from "react";
import { useNavigate } from "@components/Router";
import qs from "query-string";
import { useToast } from "react-native-toast-notifications";
import { validateBitcoinAddress } from "@utils";
import { useTranslation } from "react-i18next";

type InvoiceType = {
  bitcoin?: string;
  lightning?: string;
  amount?: string;
  label?: string;
  message?: string;
};

export const useInvoiceHandler = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();

  const invoiceHandler = useCallback(
    (value: string) => {
      let lightningInvoice: string | undefined;
      let bitcoinAddress: string | undefined;
      let amount: number | undefined;
      let label: string | undefined;
      let message: string | undefined;

      if (value.toLowerCase().startsWith("lnurl")) {
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
          ? parseInt((parseFloat(parsedValue.amount) * 1000000000).toString())
          : undefined;
        label = parsedValue.label;
        message = parsedValue.message;
      }

      if (
        lightningInvoice ||
        (validateBitcoinAddress(bitcoinAddress || "") && amount)
      ) {
        navigate(`/invoice`, {
          state: {
            ...(lightningInvoice
              ? { lightningInvoice }
              : { bitcoinAddress, amount, label, message })
          }
        });
      } else {
        toast.show(t("errors.invalidInvoice"), { type: "error" });
      }
    },
    [navigate, t, toast]
  );

  return { invoiceHandler };
};
