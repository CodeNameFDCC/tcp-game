// src/handlers/game/updateLocation.handler.js

/* 
이 코드는 사용자의 위치를 업데이트하는 핸들러 함수를 정의합니다.
주어진 게임 세션에 사용자가 존재하는지 확인하고, 위치를 업데이트한 후
모든 사용자의 위치 정보를 소켓으로 전송합니다. 오류 발생 시 적절히 처리합니다.
*/

import { userSessions } from '../../session/sessions.js';
import { getUserById } from '../../session/user.session.js';
import { createLocationPacket } from '../../utils/notification/game.notification.js'; // 패킷 생성 함수
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import CustomError from '../../utils/error/customError.js';  // 사용자 정의 오류 클래스
import { ErrorCodes } from '../../utils/error/errorCodes.js';  // 오류 코드 상수

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { user } = payload;
    console.log(`Processing location update for user ${userId}:`, {
      x: user.x,
      y: user.y,
      status: user.status,
      playerId: user.playerId
    });

    const sessionUser = getUserById(userId);
    if (!sessionUser) {
      console.log(`User ${userId} not found in active sessions`);
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    sessionUser.updatePosition(user.x, user.y);

    // LocationUpdate 구조에 맞게 수정
    const locationPacket = createLocationPacket({
      user: {
        id: userId,
        x: user.x,
        y: user.y,
        status: user.status || 'active',
        playerId: sessionUser.playerId
      }
    });

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
export default updateLocationHandler;  // 핸들러 함수 내보내기
