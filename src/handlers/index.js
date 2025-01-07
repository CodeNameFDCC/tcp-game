/* 
이 코드는 다양한 핸들러를 관리하는 객체를 정의합니다.
핸들러 ID에 따라 적절한 핸들러와 프로토타입 이름을 반환하는 함수도 포함되어 있습니다.
핸들러 ID가 유효하지 않은 경우 사용자 정의 오류를 발생시킵니다.
*/

import { HANDLER_IDS } from '../constants/handlerIds.js';  // 핸들러 ID 상수
import initialHandler from './user/initial.handler.js';  // 초기 핸들러
import CustomError from '../utils/error/customError.js';  // 사용자 정의 오류 클래스
import { ErrorCodes } from '../utils/error/errorCodes.js';  // 오류 코드 상수
import createGameHandler from './game/createGame.handler.js';  // 게임 생성 핸들러
import joinGameHandler from './game/joinGame.handler.js';  // 게임 참가 핸들러
import updateLocationHandler from './game/updateLocation.handler.js';  // 위치 업데이트 핸들러

// 핸들러 객체 정의
const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,  // 초기 핸들러
    protoType: 'initial.InitialPacket',  // 프로토타입 이름
  },
  [HANDLER_IDS.CREATE_GAME]: {
    handler: createGameHandler,  // 게임 생성 핸들러
    protoType: 'game.CreateGamePayload',  // 프로토타입 이름
  },
  [HANDLER_IDS.JOIN_GAME]: {
    handler: joinGameHandler,  // 게임 참가 핸들러
    protoType: 'game.JoinGamePayload',  // 프로토타입 이름
  },
  [HANDLER_IDS.UPDATE_LOCATION]: {
    handler: updateLocationHandler,  // 위치 업데이트 핸들러
    protoType: 'game.LocationUpdatePayload',  // 프로토타입 이름
  },
  // 다른 핸들러들을 추가
};

// 핸들러 ID로 핸들러를 가져오는 함수
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,  // 핸들러 ID 오류 메시지
    );
  }
  return handlers[handlerId].handler;  // 해당 핸들러 반환
};

// 핸들러 ID로 프로토타입 이름을 가져오는 함수
export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,  // 핸들러 ID 오류 메시지
    );
  }
  return handlers[handlerId].protoType;  // 해당 프로토타입 이름 반환
};
