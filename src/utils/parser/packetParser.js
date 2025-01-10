// src/utills/parser/packetParser.js

// 4번째로 onEvent 실행될 때 같이 실행됨. 여기엔 기능만 제공할 뿐 직접 실행되는 것은 없음.

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

// 로그 출력 여부 설정
const LOG_DECODED_PACKET = true;  // 디코딩된 패킷 로그 출력 여부
const LOG_ERROR = true;  // 오류 로그 출력 여부

// 버퍼를 16진수 문자열로 변환하는 함수
function bufferToHex(buffer) {
  // Uint8Array를 사용하여 각 바이트를 16진수로 변환 후 공백으로 구분하여 문자열 반환
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(' ');
}

// 디코딩된 패킷 정보를 로그 출력하는 함수
const logDecodedPacket = (packet) => {
  if (!LOG_DECODED_PACKET) return;  // 로그 출력 비활성화 시 함수 종료
  console.log("Decoded packet:", {
    handlerId: packet.handlerId,  // 핸들러 ID
    userId: packet.userId,  // 사용자 ID
    version: packet.version,  // 패킷 버전
    sequence: packet.sequence,  // 시퀀스 번호
    payloadLength: packet.payload ? packet.payload.length : 0  // 페이로드 길이 (존재하지 않을 경우 0)
  });
};

// 오류 로그 출력을 위한 함수
const logError = (message, error) => {
  if (!LOG_ERROR) return;  // 로그 출력 비활성화 시 함수 종료
  console.error(message, error);  // 오류 메시지와 오류 객체 로그 출력
};

// 패킷 디코딩 함수
const decodePacket = (Packet, data) => {
  try {
    // 패킷을 디코딩
    const packet = Packet.decode(data);

    // 디코딩된 패킷 정보 로그 출력
    logDecodedPacket(packet); // 별도의 함수로 로그 출력
    return packet;  // 디코딩된 패킷 반환
  } catch (error) {
    // 패킷 디코딩 오류 처리
    logError("Packet decode error:", error); // 별도의 함수로 로그 출력
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');  // 사용자 정의 오류 발생
  }
};

// 클라이언트 버전 검증 함수
const validateClientVersion = (clientVersion) => {
  // 클라이언트 버전이 서버 설정과 일치하는지 검증
  if (clientVersion !== config.client.version) {
    console.error(`Version mismatch - Client: ${clientVersion}, Server: ${config.client.version}`);  // 버전 불일치 로그 출력
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,  // 오류 코드
      '클라이언트 버전이 일치하지 않습니다.'  // 오류 메시지
    );
  }
};

// 핸들러 ID 검증 함수
const validateHandlerId = (handlerId) => {
  // 핸들러 ID에 따른 프로토타입 이름 가져오기
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    console.error(`Unknown handler ID: ${handlerId}`);  // 알 수 없는 핸들러 ID 로그 출력
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,  // 오류 코드
      `알 수 없는 핸들러 ID: ${handlerId}`  // 오류 메시지
    );
  }
  return protoTypeName;  // 유효한 프로토타입 이름 반환
};

// 페이로드 디코딩 함수
const decodePayload = (PayloadType, payload) => {
  try {
    // 페이로드를 디코딩
    const decodedPayload = PayloadType.decode(payload);
    console.log("Decoded payload:", decodedPayload);  // 디코딩된 페이로드 로그 출력
    return decodedPayload;  // 디코딩된 페이로드 반환
  } catch (error) {
    // 페이로드 디코딩 오류 처리
    console.error("Payload decode error:", error);  // 오류 로그 출력
    throw new CustomError(
      ErrorCodes.PACKET_STRUCTURE_MISMATCH,  // 오류 코드
      '패킷 구조가 일치하지 않습니다.'  // 오류 메시지
    );
  }
};

// 필수 필드 검증 함수
const validateRequiredFields = (PayloadType, payload) => {
  // 기대되는 필드와 실제 필드 목록을 비교
  const expectedFields = Object.keys(PayloadType.fields);  // 기대되는 필드 목록
  const actualFields = Object.keys(payload);  // 실제 필드 목록
  const missingFields = expectedFields.filter(
    (field) => !actualFields.includes(field)  // 누락된 필드 찾기
  );

  // 누락된 필드가 있는지 확인
  if (missingFields.length > 0) {
    console.error("Missing fields:", missingFields);  // 누락된 필드 로그 출력
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,  // 오류 코드
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`  // 오류 메시지
    );
  }
};

// 패킷을 파싱하는 함수
export const packetParser = (data) => {
  try {
    // 수신한 원시 패킷 데이터 로그 출력
    console.log("Received raw packet data:", bufferToHex(data));  // 원시 데이터 로그 출력

    // Proto 메시지 가져오기
    const protoMessages = getProtoMessages();  // 프로토 메시지 로드
    const Packet = protoMessages.common.Packet;  // 공통 패킷 메시지 가져오기

    // 패킷 디코딩
    const packet = decodePacket(Packet, data);  // 패킷 디코딩

    // 핸들러 ID, 사용자 ID, 클라이언트 버전, 시퀀스 정보 추출
    const handlerId = packet.handlerId;  // 핸들러 ID 추출
    const userId = packet.userId;  // 사용자 ID 추출
    const clientVersion = packet.clientVersion;  // 클라이언트 버전 추출
    const sequence = packet.sequence;  // 시퀀스 번호 추출

    // 클라이언트 버전 검증
    validateClientVersion(clientVersion);  // 클라이언트 버전 검증

    // 핸들러 ID에 따른 Payload 구조 확인
    const protoTypeName = validateHandlerId(handlerId);  // 핸들러 ID 검증
    const [namespace, typeName] = protoTypeName.split('.');  // namespace와 typeName 분리
    const PayloadType = protoMessages[namespace][typeName];  // 페이로드 타입 가져오기

    // Payload 디코딩
    const payload = decodePayload(PayloadType, packet.payload);  // 페이로드 디코딩

    // 필수 필드 검증
    validateRequiredFields(PayloadType, payload);  // 필수 필드 검증

    // 성공적으로 패킷 파싱 로그 출력
    console.log("Successfully parsed packet:", {
      handlerId,  // 핸들러 ID
      userId,  // 사용자 ID
      payload,  // 디코딩된 페이로드
      sequence  // 시퀀스 번호
    });

    // 파싱된 결과 반환
    return { handlerId, userId, payload, sequence };  // 결과 반환

  } catch (error) {
    // 이미 CustomError인 경우 그대로 전파
    if (error instanceof CustomError) {
      throw error;  // 사용자 정의 오류를 그대로 전파
    }
    // 그 외의 경우 새로운 CustomError로 래핑
    console.error("Unexpected error in packet parser:", error);  // 예상치 못한 오류 로그 출력
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,  // 오류 코드
      '패킷 처리 중 예상치 못한 오류가 발생했습니다.'  // 오류 메시지
    );
  }
};
