import { useState, useEffect } from "react";

export default function useCTRecommend(recommendCheck: boolean): string {
  const [recommendValue, setRecommendValue] = useState<string>("0.99");

  useEffect(() => {
    if (recommendCheck) {
      const fetchRecommend = async () => {
        const response = await new Promise<string>((resolve) => {
          setTimeout(() => resolve(recommendValue + "9"), 1000);
        });
        setRecommendValue(response);
      };

      fetchRecommend();
    }
  }, [recommendCheck]);

  return recommendValue;
}
