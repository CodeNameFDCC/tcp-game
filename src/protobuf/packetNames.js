// src/protobuf/packetNames.js

/* 
이 코드는 다양한 패킷 이름을 정의하는 객체입니다.
각 패킷은 관련된 패키지와 메시지 이름을 포함하고 있어, Protobuf 메시지의 식별 및 사용을 용이하게 합니다.
패킷 이름은 공통, 초기화, 게임, 응답 및 게임 알림과 같은 여러 카테고리로 나뉘어 있습니다.
*/

export const packetNames = {
  common: {
    Packet: 'common.Packet',  // 공통 패킷
    Ping: 'common.Ping',      // Ping 메시지
  },
  initial: {
    InitialPacket: 'initial.InitialPacket',  // 최초 패킷
  },
  game: {
    CreateGamePayload: 'game.CreateGamePayload',  // 게임 생성 핸들러 payload
    JoinGamePayload: 'game.JoinGamePayload',      // 게임 참가 핸들러 payload
    LocationUpdatePayload: 'game.LocationUpdatePayload',  // 위치 정보 업데이트 payload
  },
  response: {
    Response: 'response.Response',  // 공통 응답 메시지
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',  // 위치 정보 알림
    Start: 'gameNotification.Start',                      // 게임 시작 알림
  },
};
