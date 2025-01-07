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

// 패킷 파서 함수
export const packetParser = (data) => {
  const protoMessages = getProtoMessages();  // 프로토 메시지 가져오기

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data);  // 패킷 디코딩
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');  // 디코딩 오류 처리
  }

  const handlerId = packet.handlerId;  // 핸들러 ID
  const userId = packet.userId;        // 사용자 ID
  const clientVersion = packet.clientVersion;  // 클라이언트 버전
  const sequence = packet.sequence;    // 시퀀스 번호

  // clientVersion 검증
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',  // 버전 불일치 처리
    );
  }

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);  // 알 수 없는 핸들러 ID 처리
  }

  const [namespace, typeName] = protoTypeName.split('.');  // 네임스페이스와 타입 이름 분리
  const PayloadType = protoMessages[namespace][typeName];  // Payload 타입 가져오기
  let payload;
  try {
    payload = PayloadType.decode(packet.payload);  // payload 디코딩
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');  // 구조 불일치 처리
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields);  // 예상 필드 목록
  const actualFields = Object.keys(payload);  // 실제 필드 목록
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));  // 누락된 필드 확인
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,  // 누락된 필드 처리
    );
  }

  return { handlerId, userId, payload, sequence };  // 결과 반환
};
