import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { TokenInfo } from "@/types/token/supportedToken";
import { useRecoilState } from "recoil";
import { mobileLocalStoredTokenList } from "@/recoil/mobile/atom";

export default function useAddTokenToStorage() {
  const [storedValue, setValue] = useLocalStorage("tokens", []);
  const [storedTokenList, setStoredTokenList] = useRecoilState(
    mobileLocalStoredTokenList
  );

  useEffect(() => {
    setStoredTokenList(storedValue);
  }, [storedValue, setStoredTokenList]);

  const addNewToken = useCallback(
    (newTokenValue: TokenInfo) => {
      if (
        storedValue.some(
          (token: TokenInfo) => token.address === newTokenValue.address
        )
      ) {
        return;
      }

      const newValue = [...storedValue, { ...newTokenValue, isNew: false }];
      setValue(newValue);
      setStoredTokenList(newValue);
    },
    [storedValue, setValue, setStoredTokenList]
  );

  return { storedTokenList, addNewToken };
}
