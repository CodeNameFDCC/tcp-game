// src/utills/parser/packetParser.js

/* 
이 코드는 수신한 데이터 패킷을 파싱하여 유효성을 검사하는 기능을 제공합니다.
패킷을 디코딩하고, 클라이언트 버전 및 핸들러 ID를 검증하며, 필요한 필드의 존재를 확인합니다.
오류가 발생할 경우 사용자 정의 오류를 생성하여 적절한 오류 코드를 반환합니다.
*/

import { getProtoMessages } from '../../init/loadProtos.js';  // 프로토 메시지 로드 함수 임포트
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';  // 핸들러 ID에 대한 프로토 타입 이름 가져오기
import { config } from '../../config/config.js';  // 설정 파일 임포트
import CustomError from '../error/customError.js';  // 사용자 정의 오류 클래스 임포트
import { ErrorCodes } from '../error/errorCodes.js';  // 오류 코드 상수 임포트


// 버퍼를 16진수 문자열로 변환하는 함수
function bufferToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(' ');
}

// 패킷을 파싱하는 함수
export const packetParser = (data) => {
  try {
    // 수신한 원시 패킷 데이터 로그 출력
    console.log("Received raw packet data:", bufferToHex(data));

    // Proto 메시지 가져오기
    const protoMessages = getProtoMessages();
    const Packet = protoMessages.common.Packet;

    // 패킷 디코딩
    let packet;
    try {
      packet = Packet.decode(data);
      // 디코딩된 패킷 정보 로그 출력
      console.log("Decoded packet:", {
        handlerId: packet.handlerId,
        userId: packet.userId,
        version: packet.version,
        sequence: packet.sequence,
        payloadLength: packet.payload ? packet.payload.length : 0
      });
    } catch (error) {
      // 패킷 디코딩 오류 처리
      console.error("Packet decode error:", error);
      throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
    }

    // 핸들러 ID, 사용자 ID, 클라이언트 버전, 시퀀스 정보 추출
    const handlerId = packet.handlerId;
    const userId = packet.userId;
    const clientVersion = packet.clientVersion;
    const sequence = packet.sequence;

    // 클라이언트 버전 검증
    if (clientVersion !== config.client.version) {
      console.error(`Version mismatch - Client: ${clientVersion}, Server: ${config.client.version}`);
      throw new CustomError(
        ErrorCodes.CLIENT_VERSION_MISMATCH,
        '클라이언트 버전이 일치하지 않습니다.'
      );
    }

    // 핸들러 ID에 따른 Payload 구조 확인
    const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
    if (!protoTypeName) {
      console.error(`Unknown handler ID: ${handlerId}`);
      throw new CustomError(
        ErrorCodes.UNKNOWN_HANDLER_ID,
        `알 수 없는 핸들러 ID: ${handlerId}`
      );
    }

    // Payload 타입 가져오기
    const [namespace, typeName] = protoTypeName.split('.');
    const PayloadType = protoMessages[namespace][typeName];

    // Payload 디코딩
    let payload;
    try {
      payload = PayloadType.decode(packet.payload);
      // 디코딩된 Payload 정보 로그 출력
      console.log("Decoded payload:", payload);
    } catch (error) {
      // Payload 디코딩 오류 처리
      console.error("Payload decode error:", error);
      throw new CustomError(
        ErrorCodes.PACKET_STRUCTURE_MISMATCH,
        '패킷 구조가 일치하지 않습니다.'
      );
    }

    // 필수 필드 검증
    const expectedFields = Object.keys(PayloadType.fields);
    const actualFields = Object.keys(payload);
    const missingFields = expectedFields.filter(
      (field) => !actualFields.includes(field)
    );

    // 누락된 필드가 있는지 확인
    if (missingFields.length > 0) {
      console.error("Missing fields:", missingFields);
      throw new CustomError(
        ErrorCodes.MISSING_FIELDS,
        `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`
      );
    }

    // 성공적으로 패킷 파싱 로그 출력
    console.log("Successfully parsed packet:", {
      handlerId,
      userId,
      payload,
      sequence
    });

    // 파싱된 결과 반환
    return { handlerId, userId, payload, sequence };

  } catch (error) {
    // 이미 CustomError인 경우 그대로 전파
    if (error instanceof CustomError) {
      throw error;
    }
    // 그 외의 경우 새로운 CustomError로 래핑
    console.error("Unexpected error in packet parser:", error);
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      '패킷 처리 중 예상치 못한 오류가 발생했습니다.'
    );
  }

};