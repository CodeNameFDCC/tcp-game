/* 
이 모듈은 패킷 관련 상수들을 정의합니다.
전체 패킷 길이와 패킷 타입 길이를 설정하고,
다양한 패킷 타입을 식별할 수 있는 객체를 제공합니다.
*/

// 전체 길이를 나타내는 4바이트
export const TOTAL_LENGTH = 4;

// 패킷 타입을 나타내는 1바이트 (0 = 핑, 1 = 일반 패킷)
export const PACKET_TYPE_LENGTH = 1;

// 패킷 타입을 정의하는 객체
export const PACKET_TYPE = {
  PING: 0,         // 핑 패킷 타입
  NORMAL: 1,       // 일반 패킷 타입
  GAME_START: 2,   // 게임 시작 패킷 타입
  LOCATION: 3,     // 위치 패킷 타입
};
