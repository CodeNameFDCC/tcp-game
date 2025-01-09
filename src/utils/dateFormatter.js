// src/utills/dateFormatter.js

/* 
이 코드는 주어진 날짜 객체를 지정된 형식(YYYY-MM-DD HH:mm:ss)으로 포맷하는 함수를 정의합니다.
연도, 월, 일, 시, 분, 초를 추출하고, 필요한 경우 두 자리 수로 포맷하여 문자열로 반환합니다.
이 함수는 날짜와 시간을 일관된 형식으로 표현할 때 유용합니다.
*/

export function formatDate(date) {
  const year = date.getFullYear();  // 연도 추출
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 월 추출 및 두 자리로 포맷
  const day = String(date.getDate()).padStart(2, '0');  // 일 추출 및 두 자리로 포맷
  const hours = String(date.getHours()).padStart(2, '0');  // 시 추출 및 두 자리로 포맷
  const minutes = String(date.getMinutes()).padStart(2, '0');  // 분 추출 및 두 자리로 포맷
  const seconds = String(date.getSeconds()).padStart(2, '0');  // 초 추출 및 두 자리로 포맷

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  // 최종 문자열 반환
}
