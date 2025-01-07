/* 
이 코드는 응답 패킷을 생성하는 함수를 정의합니다.
주어진 핸들러 ID, 응답 코드 및 데이터를 기반으로 응답 구조를 만들고, 패킷 길이 및 타입 정보를 포함한 버퍼를 생성합니다.
이 함수는 사용자 ID에 따라 시퀀스를 관리하며, 최종적으로 모든 정보를 결합하여 반환합니다.
*/

import { getProtoMessages } from '../../init/loadProtos.js';  // 프로토 메시지 로드 함수 임포트
import { getNextSequence } from '../../session/user.session.js';  // 다음 시퀀스 가져오기
import { config } from '../../config/config.js';  // 설정 파일 임포트
import { PACKET_TYPE } from '../../constants/header.js';  // 패킷 타입 상수 임포트

// 응답 패킷 생성 함수
export const createResponse = (handlerId, responseCode, data = null, userId) => {
  const protoMessages = getProtoMessages();  // 프로토 메시지 로드
  const Response = protoMessages.response.Response;  // 응답 프로토 메시지

  const responsePayload = {
    handlerId,
    responseCode,
    timestamp: Date.now(),  // 현재 타임스탬프
    data: data ? Buffer.from(JSON.stringify(data)) : null,  // 데이터가 있을 경우 JSON으로 변환
    sequence: userId ? getNextSequence(userId) : 0,  // 사용자 ID에 따른 시퀀스
  };

  const buffer = Response.encode(responsePayload).finish();  // 응답 인코딩

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,  // 패킷 길이 계산
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);  // 패킷 타입 설정

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, buffer]);  // 최종 패킷 반환
};
