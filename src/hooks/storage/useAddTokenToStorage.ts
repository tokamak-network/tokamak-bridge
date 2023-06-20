import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { TokenInfo } from "@/types/token/supportedToken";

export default function useAddTokenToStorage() {
  const [storedValue, setValue] = useLocalStorage("tokens", []);

  const addNewToken = useCallback((newTokenValue: TokenInfo) => {
    if (storedValue.includes(newTokenValue)) {
      return;
    }
    setValue([...storedValue, { ...newTokenValue, isNew: false }]);
  }, []);

  return { storedTokenList: storedValue, addNewToken };
}
