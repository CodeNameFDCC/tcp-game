/* 
이 코드는 사용자가 게임에 참가하는 핸들러 함수를 정의합니다.
게임 세션을 찾고, 사용자가 존재하지 않는 경우 세션에 추가하며, 
성공적으로 참가했음을 알리는 응답을 생성합니다. 오류 발생 시 적절히 처리합니다.
*/

import { getAllGameSessions, getGameSession } from '../../session/game.session.js';  // 게임 세션 관리 함수
import { createResponse } from '../../utils/response/createResponse.js';  // 응답 생성 유틸리티
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';  // 핸들러 ID 및 응답 코드 상수
import { getUserById } from '../../session/user.session.js';  // 사용자 세션에서 사용자 정보 가져오기
import CustomError from '../../utils/error/customError.js';  // 사용자 정의 오류 클래스
import { ErrorCodes } from '../../utils/error/errorCodes.js';  // 오류 코드 상수

// 게임 참가 핸들러 함수
const joinGameHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload;  // 요청으로부터 게임 ID 추출
    const gameSession = getGameSession(gameId);  // 게임 세션 가져오기

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');  // 게임 세션 없음 오류 처리
    }

    const user = getUserById(userId);  // 사용자 정보 가져오기
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');  // 사용자 없음 오류 처리
    }
    const existUser = gameSession.getUser(user.id);  // 게임 세션에 사용자 존재 여부 확인
    if (!existUser) {
      gameSession.addUser(user);  // 사용자 추가
    }

    console.log(getAllGameSessions());  // 현재 모든 게임 세션 로그 출력

    const joinGameResponse = createResponse(  // 게임 참가 응답 생성
      HANDLER_IDS.JOIN_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임에 참가했습니다.' },
      user.id,
    );
    socket.write(joinGameResponse);  // 소켓을 통해 응답 전송
  } catch (error) {
    handleError(socket, error);  // 오류 처리
  }
};

export default joinGameHandler;  // 핸들러 함수 내보내기
