// src/handlers/game/updateLocation.handler.js


/* 
이 코드는 사용자의 위치를 업데이트하는 핸들러 함수를 정의합니다.
주어진 게임 세션에 사용자가 존재하는지 확인하고, 위치를 업데이트한 후
모든 사용자의 위치 정보를 소켓으로 전송합니다. 오류 발생 시 적절히 처리합니다.
*/

//import { getGameSession } from '../../session/game.session.js';  // 게임 세션 관리 함수
import { userSessions } from '../../session/sessions.js';
import { getUserById } from '../../session/user.session.js';
import { createLocationPacket } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import CustomError from '../../utils/error/customError.js';  // 사용자 정의 오류 클래스
import { ErrorCodes } from '../../utils/error/errorCodes.js';  // 오류 코드 상수

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y, direction } = payload;
    console.log(`Processing location update for user ${userId}:`, { x, y, direction });

    const user = getUserById(userId);
    if (!user) {
      console.log(`User ${userId} not found in active sessions`);
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 사용자 위치와 방향 업데이트
    user.updatePosition(x, y, direction);

    const allUsersLocations = userSessions.map(sessionUser => ({
      id: sessionUser.id,
      x: sessionUser.x,
      y: sessionUser.y,
      direction: sessionUser.direction // 방향 정보 추가
    }));

    const locationPacket = createLocationPacket(allUsersLocations);

    userSessions.forEach(sessionUser => {
      if (sessionUser.socket && sessionUser.socket.writable) {
        try {
          sessionUser.socket.write(locationPacket);
          console.log(`Sent location update to user ${sessionUser.id}`);
        } catch (err) {
          console.error(`Failed to send location update to user ${sessionUser.id}:`, err);
        }
      }
    });

  } catch (error) {
    console.error('Error in updateLocationHandler:', error);
    handleError(socket, error);
  }
};



const broadcastLocationUpdate = (socket, user) => {
  const locationPacket = createLocationPacket([{
    id: user.id,
    playerId: user.playerId,
    x: user.x,
    y: user.y
  }]);
  socket.write(locationPacket);
};

export default updateLocationHandler;  // 핸들러 함수 내보내기
