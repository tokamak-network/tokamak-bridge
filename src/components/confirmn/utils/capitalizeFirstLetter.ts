// 첫 글자를 대문자로, 나머지 글자를 소문자로 변환하는 함수
export default function capitalizeFirstLetter(str: string) {
  if (!str) return str; // str이 비어있을 경우를 처리
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
