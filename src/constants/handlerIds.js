/* 
이 모듈은 성공 응답 코드를 정의하고 
게임 관련 핸들러 ID를 포함하는 객체를 제공합니다.
핸들러 ID는 다양한 게임 작업을 식별하는 데 사용됩니다.
*/

export const RESPONSE_SUCCESS_CODE = 0;  // 성공 응답 코드 정의

// 핸들러 ID를 정의하는 객체
export const HANDLER_IDS = {
  INITIAL: 0,          // 초기화 핸들러 ID
  CREATE_GAME: 4,     // 게임 생성 핸들러 ID
  JOIN_GAME: 5,       // 게임 참여 핸들러 ID
  UPDATE_LOCATION: 6,  // 위치 업데이트 핸들러 ID
};
