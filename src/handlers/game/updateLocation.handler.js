/* 
이 코드는 사용자의 위치를 업데이트하는 핸들러 함수를 정의합니다.
주어진 게임 세션에 사용자가 존재하는지 확인하고, 위치를 업데이트한 후
모든 사용자의 위치 정보를 소켓으로 전송합니다. 오류 발생 시 적절히 처리합니다.
*/

import { getGameSession } from '../../session/game.session.js';  // 게임 세션 관리 함수
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import CustomError from '../../utils/error/customError.js';  // 사용자 정의 오류 클래스
import { ErrorCodes } from '../../utils/error/errorCodes.js';  // 오류 코드 상수

// 위치 업데이트 핸들러 함수
const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId, x, y } = payload;  // 요청으로부터 게임 ID와 좌표 추출
    const gameSession = getGameSession(gameId);  // 게임 세션 가져오기

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');  // 게임 세션 없음 오류 처리
    }

    const user = gameSession.getUser(userId);  // 게임 세션에서 사용자 정보 가져오기
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');  // 사용자 없음 오류 처리
    }
    user.updatePosition(x, y);  // 사용자 위치 업데이트
    const packet = gameSession.getAllLocation();  // 모든 사용자 위치 정보 가져오기

    socket.write(packet);  // 소켓을 통해 위치 정보 전송
  } catch (error) {
    handleError(socket, error);  // 오류 처리
  }
};

export default updateLocationHandler;  // 핸들러 함수 내보내기
