/* 
이 코드는 소켓을 통해 오류를 처리하는 함수를 정의합니다.
전달받은 오류 객체의 코드와 메시지를 기반으로 적절한 응답을 생성하고, 이를 소켓에 전송합니다.
일반 오류의 경우 기본 오류 코드를 사용하여 로그를 남기고 응답합니다.
*/

import { createResponse } from '../response/createResponse.js';  // 응답 생성 함수 임포트

// 오류 처리 함수
export const handleError = (socket, error) => {
  let responseCode;
  let message;

  if (error.code) {
    responseCode = error.code;  // 오류 코드 설정
    message = error.message;      // 오류 메시지 설정
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);  // 에러 로그 출력
  } else {
    responseCode = 10000; // 일반 에러 코드
    message = error.message;  // 일반 에러 메시지 설정
    console.error(`일반 에러: ${error.message}`);  // 일반 에러 로그 출력
  }

  const errorResponse = createResponse(-1, responseCode, { message }, null);  // 오류 응답 생성
  socket.write(errorResponse);  // 소켓에 오류 응답 전송
};
