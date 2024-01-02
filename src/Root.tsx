import { Suspense } from "react";
import { Router } from "@components/Router";
import { KeyboardAvoidingView, Loader } from "@components";
import { ThemeContextProvider } from "@config";
import App from "./App";
import { SafeAreaProvider, initialWindowMetrics } from "@components/SafeArea";
import "./config/i18n";

export const Root = () => (
  <Suspense fallback={<Loader />}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardAvoidingView>
        <Router>
          <ThemeContextProvider>
            <App />
          </ThemeContextProvider>
        </Router>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  </Suspense>
);
