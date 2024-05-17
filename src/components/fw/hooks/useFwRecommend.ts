export function useFwRecommend(): Promise<string> {
  // 값을 받아오는 로직을 짠다
  // 현재는 비동기 함수 라고 가정
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("0.078");
    }, 1000);
  });
}
