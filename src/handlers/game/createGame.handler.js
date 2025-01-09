// src/handlers/game/createGame.handler.js



/* 
이 코드는 게임 세션을 생성하는 핸들러 함수를 정의합니다.
사용자가 게임을 생성할 때 호출되며, 게임 ID를 생성하고 세션에 사용자를 추가합니다.
오류 발생 시 적절한 오류 처리를 통해 응답합니다.
*/

import { v4 as uuidv4 } from 'uuid';  // UUID 생성을 위한 라이브러리
import { addGameSession } from '../../session/game.session.js';  // 게임 세션 추가 함수
import { createResponse } from '../../utils/response/createResponse.js';  // 응답 생성 유틸리티
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';  // 핸들러 ID 및 응답 코드 상수
import { getUserById } from '../../session/user.session.js';  // 사용자 세션에서 사용자 정보 가져오기
import CustomError from '../../utils/error/customError.js';  // 사용자 정의 오류 클래스
import { ErrorCodes } from '../../utils/error/errorCodes.js';  // 오류 코드 상수

// 게임 생성 핸들러 함수
const createGameHandler = ({ socket, userId, payload }) => {
  try {
    const gameId = uuidv4();  // 새로운 게임 ID 생성
    const gameSession = addGameSession(gameId);  // 게임 세션 추가

    const user = getUserById(userId);  // 사용자 정보 가져오기
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');  // 사용자 없음 오류 처리
    }
    gameSession.addUser(user);  // 게임 세션에 사용자 추가

    const createGameResponse = createResponse(  // 게임 생성 응답 생성
      HANDLER_IDS.CREATE_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임이 생성되었습니다.' },
      userId,
    );

    socket.write(createGameResponse);  // 소켓을 통해 응답 전송
  } catch (error) {
    handleError(socket, error);  // 오류 처리
  }
};

export default createGameHandler;  // 핸들러 함수 내보내기
