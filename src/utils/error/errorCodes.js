// src/utills/error/errorCodes.js


/* 
이 코드는 다양한 오류 코드를 정의하는 객체를 제공합니다.
각 오류 코드는 특정 오류 상황을 나타내며, 클라이언트와 서버 간의 통신에서 발생할 수 있는 문제를 식별하는 데 사용됩니다.
이러한 코드들은 오류 처리 및 디버깅에 유용합니다.
*/

export const ErrorCodes = {
  CLIENT_VERSION_MISMATCH: 10001,  // 클라이언트 버전 불일치
  UNKNOWN_HANDLER_ID: 10002,       // 알 수 없는 핸들러 ID
  PACKET_DECODE_ERROR: 10003,      // 패킷 디코딩 오류
  PACKET_STRUCTURE_MISMATCH: 10004, // 패킷 구조 불일치
  MISSING_FIELDS: 10005,           // 필드 누락
  USER_NOT_FOUND: 10006,           // 사용자 찾을 수 없음
  INVALID_PACKET: 10007,           // 유효하지 않은 패킷
  INVALID_SEQUENCE: 10008,         // 유효하지 않은 시퀀스
  GAME_NOT_FOUND: 10009,           // 게임 찾을 수 없음
  // 추가적인 에러 코드들
};
