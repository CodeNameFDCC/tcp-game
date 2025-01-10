// src/handlers/user/initial.handler.js

/* 
이 코드는 초기 사용자 핸들러 함수를 정의합니다.
장치 ID를 통해 사용자를 조회하고, 존재하지 않으면 새로 생성하며,
사용자 정보를 응답으로 클라이언트에 전송합니다. 오류 발생 시 적절히 처리합니다.
*/

import { addUser, getUserById, removeUser } from '../../session/user.session.js';  // 사용자 세션에 사용자 추가, 조회 및 제거 함수 임포트
import { userSessions } from '../../session/sessions.js';  // 현재 사용자 세션 정보 임포트
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';  // 핸들러 ID 및 응답 코드 상수 임포트
import { createResponse } from '../../utils/response/createResponse.js';  // 응답 생성 유틸리티 임포트
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티 임포트
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';  // 데이터베이스 사용자 관련 함수 임포트
import { getAllGameSessions } from '../../session/game.session.js';  // 모든 게임 세션 정보를 가져오는 함수 임포트

// 초기 사용자 핸들러 함수 정의
const initialHandler = async ({ socket, userId, payload }) => {
  try {
    // 페이로드에서 deviceId, playerId, latency 추출
    const { deviceId, playerId, latency } = payload;
    console.log(`Initial connection request - DeviceId: ${deviceId}, PlayerId: ${playerId}`);

    // deviceId로 사용자 조회
    let user = await findUserByDeviceID(deviceId);
    console.log('Initial handler - Existing user:', user); // 기존 사용자 정보 로그 출력

    // 사용자가 존재하지 않는 경우 새 사용자 생성
    if (!user) {
      user = await createUser(deviceId);
      console.log('Initial handler - New user created:', user); // 새 사용자 생성 로그 출력
    } else {
      // 사용자가 존재하는 경우 로그인 정보 업데이트
      await updateUserLogin(user.id);
      console.log('Initial handler - User login updated'); // 로그인 업데이트 로그 출력
    }

    // deviceId를 userId로 사용하여 기존 사용자 세션 제거
    const existingUser = getUserById(deviceId);
    if (existingUser) {
      console.log('Initial handler - Removing existing user session'); // 기존 사용자 세션 제거 로그 출력
      removeUser(existingUser.socket); // 기존 사용자 세션 제거
    }

    // 모든 게임 세션 정보 가져오기
    const gameSessions = getAllGameSessions();
    if (gameSessions.length === 0) {
      throw new Error('No active game sessions available'); // 활성 게임 세션이 없으면 오류 발생
    }

    // 첫 번째 게임 세션 사용 (또는 다른 로직으로 게임 세션 선택)
    const gameSession = gameSessions[0];

    // 새로운 세션 추가할 때 deviceId를 userId로 사용
    const newUser = addUser(deviceId, socket); // 사용자 세션 추가
    console.log('Initial handler - User session added:', {
      id: newUser.id,
      sessionsCount: userSessions.length // 현재 사용자 세션 수 로그 출력
    });
    gameSession.addUser(newUser); // 게임 세션에 사용자 추가

    // 초기 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL, // 핸들러 ID
      RESPONSE_SUCCESS_CODE, // 성공 응답 코드
      {
        userId: deviceId,  // deviceId를 userId로 사용
        playerId: playerId, // 플레이어 ID
        latency: latency,   // 지연 시간
        gameId: gameSession.id  // 게임 세션 ID 포함
      },
      deviceId // 요청을 보낸 사용자 ID
    );

    // 초기 응답 전송
    socket.write(initialResponse);

  } catch (error) {
    // 오류 발생 시 로그 출력 및 오류 처리
    console.error('Error in initialHandler:', error);
    handleError(socket, error); // 오류 처리 유틸리티 호출
  }
};

// 핸들러 함수 내보내기
export default initialHandler;
