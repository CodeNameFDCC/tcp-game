/* 
이 코드는 다양한 유형의 패킷을 생성하는 기능을 제공합니다.
각 패킷은 프로토콜 메시지를 사용하여 특정 이벤트에 대한 알림을 생성하며,
패킷 길이와 타입 정보를 포함한 버퍼를 생성하여 전송할 준비를 합니다.
*/

import { getProtoMessages } from '../../init/loadProtos.js';  // 프로토 메시지 로드 함수 임포트
import { PACKET_TYPE } from '../../constants/header.js';       // 패킷 타입 상수 임포트
import { config } from '../../config/config.js';               // 설정 파일 임포트

// 알림 패킷 생성 함수
const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

// 위치 업데이트 패킷 생성 함수
export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users };
  const message = Location.create(payload);  // 프로토 메시지 생성
  const locationPacket = Location.encode(message).finish();  // 메시지 인코딩
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);  // 알림 패킷 생성
};

// 게임 시작 알림 패킷 생성 함수
export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  const message = Start.create(payload);  // 프로토 메시지 생성
  const startPacket = Start.encode(message).finish();  // 메시지 인코딩
  return makeNotification(startPacket, PACKET_TYPE.GAME_START);  // 알림 패킷 생성
};

// Ping 패킷 생성 함수
export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp };
  const message = ping.create(payload);  // 프로토 메시지 생성
  const pingPacket = ping.encode(message).finish();  // 메시지 인코딩
  return makeNotification(pingPacket, PACKET_TYPE.PING);  // 알림 패킷 생성
};
