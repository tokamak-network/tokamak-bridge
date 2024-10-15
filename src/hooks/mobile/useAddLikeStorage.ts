import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@/hooks/storage/useLocalStorage";
import { TokenInfo } from "@/types/token/supportedToken";
import { useRecoilState } from "recoil";
import { mobileLocalStoredLikeList } from "@/recoil/mobile/atom";

export default function useAddLikeStorage() {
  const [storedLikes, setStoredLikes] = useLocalStorage("likes", []);
  const [likeList, setLikeList] = useRecoilState(mobileLocalStoredLikeList);

  useEffect(() => {
    setLikeList(storedLikes);
  }, [storedLikes, setLikeList]);

  const toggleLike = useCallback(
    (likeValue: TokenInfo) => {
      const isLiked = storedLikes.some(
        (like: TokenInfo) =>
          like.tokenName === likeValue.tokenName &&
          like.tokenSymbol === likeValue.tokenSymbol,
      );

      let updatedLikes;
      if (isLiked) {
        updatedLikes = storedLikes.filter(
          (like: TokenInfo) =>
            like.tokenName !== likeValue.tokenName ||
            like.tokenSymbol !== likeValue.tokenSymbol,
        );
      } else {
        updatedLikes = [...storedLikes, { ...likeValue, isNew: false }];
      }

      setStoredLikes(updatedLikes);
      setLikeList(updatedLikes);
    },
    [storedLikes, setStoredLikes, setLikeList],
  );

  return { likeList, toggleLike };
}
