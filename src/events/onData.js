// src/events/onData.js


//3번째 실행

/* 
이 코드는 소켓에서 수신된 데이터를 처리하는 함수를 정의합니다.
버퍼에 데이터를 추가하고, 패킷 헤더를 파싱하여 다양한 패킷 타입에 따라 적절한 핸들러를 호출합니다.
오류 발생 시 오류를 처리하는 로직도 포함되어 있습니다.
*/

import { config } from '../config/config.js';  // 설정 파일 가져오기
import { PACKET_TYPE } from '../constants/header.js';  // 패킷 타입 상수 가져오기
import { packetParser } from '../utils/parser/packetParser.js';  // 패킷 파서 유틸리티 가져오기
import { getHandlerById } from '../handlers/index.js';  // 핸들러 가져오기
import { getUserById, getUserBySocket } from '../session/user.session.js';  // 사용자 세션 관리 관련 함수 가져오기
import { handleError } from '../utils/error/errorHandler.js';  // 오류 처리 유틸리티 가져오기
import CustomError from '../utils/error/customError.js';  // 사용자 정의 오류 클래스 가져오기
import { ErrorCodes } from '../utils/error/errorCodes.js';  // 오류 코드 상수 가져오기
import { getProtoMessages } from '../init/loadProtos.js';  // 프로토 메시지 로드 함수 가져오기

// 핑 패킷 처리 함수
const handlePing = (socket, packet) => {
  const protoMessages = getProtoMessages();  // 프로토 메시지 로드
  const Ping = protoMessages.common.Ping;  // 핑 프로토 메시지 가져오기
  const pingMessage = Ping.decode(packet);  // 패킷 디코딩
  const user = getUserBySocket(socket);  // 소켓에 연결된 사용자 가져오기
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');  // 사용자 미발견 오류 처리
  }
  user.handlePong(pingMessage);  // 핑 응답 처리
};

// 일반 패킷 처리 함수
const handleNormalPacket = async (socket, packet) => {
  const { handlerId, sequence, payload, userId } = packetParser(packet);  // 패킷 파싱
  const user = getUserById(userId);  // 사용자 ID로 사용자 가져오기

  // 유저가 접속해 있는 상황에서 시퀀스 검증
  if (handlerId !== 0 && user) {
    // 시퀀스 업데이트
    user.sequence = sequence;  // 사용자 시퀀스 업데이트
  }

  if (user && user.sequence !== sequence) {
    throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');  // 잘못된 시퀀스 오류 처리
  }

  const handler = getHandlerById(handlerId);  // 핸들러 가져오기
  await handler({  // 핸들러 호출
    socket,  // 소켓 정보
    userId,  // 사용자 ID
    payload,  // 패킷 페이로드 데이터
  });
};

// 소켓에서 수신된 데이터를 처리하는 함수
export const onData = (socket) => async (data) => {
  // 기존 버퍼에 새로 수신된 데이터를 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이 (패킷 길이 정보 + 타입 정보)
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  // 버퍼에 최소한 전체 헤더가 있을 때만 패킷을 처리
  while (socket.buffer.length >= totalHeaderLength) {
    // 1. 패킷 길이 정보 수신 (4바이트)
    const length = socket.buffer.readUInt32BE(0);

    // 2. 패킷 타입 정보 수신 (1바이트)
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    // 3. 패킷 전체 길이 확인 후 데이터 수신
    if (socket.buffer.length >= length) {
      // 패킷 데이터를 자르고 버퍼에서 제거
      const packet = socket.buffer.slice(totalHeaderLength, length);
      socket.buffer = socket.buffer.slice(length);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING:  // 핑 패킷 처리
            await handlePing(socket, packet);  // 핑 패킷 처리 함수 호출
            break;
          case PACKET_TYPE.NORMAL:  // 일반 패킷 처리
            await handleNormalPacket(socket, packet);  // 일반 패킷 처리 함수 호출
            break;
        }
      } catch (error) {
        handleError(socket, error);  // 오류 발생 시 처리
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;  // 루프 종료
    }
  }
};
