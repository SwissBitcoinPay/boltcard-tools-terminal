import { useCallback, useEffect } from "react";
import { Deeplink } from "@utils";
import { useInvoiceHandler } from "./useInvoiceHandler";

export const useDeepLink = () => {
  const { invoiceHandler } = useInvoiceHandler();

  const handleInitialDeepLinking = useCallback(async () => {
    const url = await Deeplink.getInitialURL();

    if (url) {
      invoiceHandler(url);
    }
  }, [invoiceHandler]);

  useEffect(() => {
    void handleInitialDeepLinking();

    const deepLinkListener = Deeplink.addEventListener("url", (e) => {
      invoiceHandler(e.url);
    });

    return () => deepLinkListener.remove();
  }, [invoiceHandler, handleInitialDeepLinking]);

  return { invoiceHandler };
};
