import * as Keychain from "react-native-keychain";
import * as keys from "@config/settingsKeys";

const getItem = async (key: string) => {
  try {
    const encryptedValue = await Keychain.getGenericPassword({ service: key });
    if (encryptedValue) return encryptedValue.password;
  } catch (e) {}

  return null;
};

const setItem = async (
  key: string,
  value: string,
  accessControl?: Keychain.ACCESS_CONTROL
) => {
  return await Keychain.setGenericPassword(key, value, {
    service: key,
    accessControl
  });
};

const removeItem = async (key: string) => {
  return await Keychain.resetGenericPassword({ service: key });
};

// eslint-disable-next-line @typescript-eslint/require-await
const clear = async () => {
  Object.values(keys).forEach(async (key) => {
    await Keychain.resetGenericPassword({ service: key });
  });
};

const AsyncStorage = { getItem, setItem, removeItem, clear };

export { AsyncStorage };
