// src/events/onError.js


/* 
이 코드는 소켓에서 발생한 오류를 처리하는 함수를 정의합니다.
오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
소켓의 오류를 관리하여 디버깅에 도움을 줍니다.
*/

export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);  // 소켓 오류 로그 출력
};
