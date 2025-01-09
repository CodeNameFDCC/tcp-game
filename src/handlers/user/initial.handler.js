// src/handlers/user/initial.handler.js



/* 
이 코드는 초기 사용자 핸들러 함수를 정의합니다.
장치 ID를 통해 사용자를 조회하고, 존재하지 않으면 새로 생성하며,
사용자 정보를 응답으로 클라이언트에 전송합니다. 오류 발생 시 적절히 처리합니다.
*/

import { addUser, getUserById, removeUser } from '../../session/user.session.js';  // 사용자 세션에 사용자 추가
import { userSessions } from '../../session/sessions.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';  // 핸들러 ID 및 응답 코드 상수
import { createResponse } from '../../utils/response/createResponse.js';  // 응답 생성 유틸리티
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';  // 데이터베이스 사용자 관련 함수
import { getAllGameSessions } from '../../session/game.session.js';

// 초기 사용자 핸들러 함수
// const initialHandler = async ({ socket, userId, payload }) => {
//   try {
//     const { deviceId, latency, playerId } = payload;  // 요청으로부터 장치 ID 추출

//     let user = await findUserByDeviceID(deviceId);  // 장치 ID로 사용자 조회

//     if (!user) {
//       user = await createUser(deviceId);  // 사용자 없으면 새로 생성
//     } else {
//       await updateUserLogin(user.id);  // 사용자 존재 시 로그인 업데이트
//     }

//     addUser(user.id, socket);  // 사용자 세션에 소켓 추가

//     // 유저 정보 응답 생성
//     const initialResponse = createResponse(
//       HANDLER_IDS.INITIAL,
//       RESPONSE_SUCCESS_CODE,
//       { userId: user.id },  // 사용자 ID 포함
//       deviceId,
//     );

//     // 소켓을 통해 클라이언트에게 응답 메시지 전송
//     socket.write(initialResponse);
//   } catch (error) {
//     handleError(socket, error);  // 오류 처리
//   }
// };


// const initialHandler = async ({ socket, userId, payload }) => {
//   try {
//     const { deviceId, playerId, latency } = payload;

//     let user = await findUserByDeviceID(deviceId);
//     if (!user) {
//       user = await createUser(deviceId);
//     } else {
//       await updateUserLogin(user.id);
//     }

//     addUser(user.id, socket);

//     // 응답에 playerId 포함
//     const initialResponse = createResponse(
//       HANDLER_IDS.INITIAL,
//       RESPONSE_SUCCESS_CODE,
//       {
//         userId: user.id,
//         playerId: playerId,  // playerId 추가
//         latency: latency     // latency 추가
//       },
//       deviceId
//     );

//     socket.write(initialResponse);
//   } catch (error) {
//     handleError(socket, error);
//   }
// };


// const initialHandler = async ({ socket, userId, payload }) => {
//   try {
//     const { deviceId, playerId, latency } = payload;
//     console.log(`Initial connection request - DeviceId: ${deviceId}, PlayerId: ${playerId}`);

//     let user = await findUserByDeviceID(deviceId);

//     console.log('Initial handler - Existing user:', user);

//     if (!user) {
//       user = await createUser(deviceId);
//       console.log('Initial handler - New user created:', user);
//     } else {
//       await updateUserLogin(user.id);
//       console.log('Initial handler - User login updated');
//     }

//     // 이미 세션에 있는 사용자인지 확인
//     const existingUser = getUserById(user.id);
//     if (existingUser) {
//       console.log('Initial handler - Removing existing user session');
//       removeUser(existingUser.socket);
//     }

//     // 새로운 세션 추가
//     const newUser = addUser(user.id, socket);
//     console.log('Initial handler - New user session added:', {
//       id: newUser.id,
//       sessionCount: userSessions.length
//     });

//     const initialResponse = createResponse(
//       HANDLER_IDS.INITIAL,
//       RESPONSE_SUCCESS_CODE,
//       {
//         userId: user.id,
//         playerId: playerId,
//         latency: latency
//       },
//       deviceId
//     );

//     socket.write(initialResponse);

//     // 디버깅을 위한 현재 세션 상태 출력
//     console.log('Current user sessions after initialization:',
//       userSessions.map(u => ({ id: u.id, socketConnected: !!u.socket }))
//     );
//   } catch (error) {
//     console.error('Error in initialHandler:', error);
//     handleError(socket, error);
//   }
// };


// const initialHandler = async ({ socket, userId, payload }) => {
//   try {
//     const { deviceId, playerId, latency } = payload;
//     console.log(`Initial connection request - DeviceId: ${deviceId}, PlayerId: ${playerId}`);

//     let user = await findUserByDeviceID(deviceId);

//     console.log('Initial handler - Existing user:', user);

//     if (!user) {
//       user = await createUser(deviceId);
//       console.log('Initial handler - New user created:', user);
//     } else {
//       await updateUserLogin(user.id);
//       console.log('Initial handler - User login updated');
//     }

//     // deviceId를 userId로 사용
//     const existingUser = getUserById(deviceId);
//     if (existingUser) {
//       console.log('Initial handler - Removing existing user session');
//       removeUser(existingUser.socket);
//     }

//     // 새로운 세션 추가할 때도 deviceId를 userId로 사용
//     const newUser = addUser(deviceId, socket);
//     console.log('Initial handler - User session added:', {
//       id: newUser.id,
//       sessionsCount: userSessions.length
//     });

//     const initialResponse = createResponse(
//       HANDLER_IDS.INITIAL,
//       RESPONSE_SUCCESS_CODE,
//       {
//         userId: deviceId,  // deviceId를 userId로 사용
//         playerId: playerId,
//         latency: latency
//       },
//       deviceId
//     );

//     socket.write(initialResponse);

//   } catch (error) {
//     console.error('Error in initialHandler:', error);
//     handleError(socket, error);
//   }
// };



const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;
    console.log(`Initial connection request - DeviceId: ${deviceId}, PlayerId: ${playerId}`);

    let user = await findUserByDeviceID(deviceId);

    console.log('Initial handler - Existing user:', user);

    if (!user) {
      user = await createUser(deviceId);
      console.log('Initial handler - New user created:', user);
    } else {
      await updateUserLogin(user.id);
      console.log('Initial handler - User login updated');
    }

    // deviceId를 userId로 사용
    const existingUser = getUserById(deviceId);
    if (existingUser) {
      console.log('Initial handler - Removing existing user session');
      removeUser(existingUser.socket);
    }

    const gameSessions = getAllGameSessions();
    if (gameSessions.length === 0) {
      throw new Error('No active game sessions available');
    }

    // 첫 번째 게임 세션 사용 (또는 다른 로직으로 게임 세션 선택)
    const gameSession = gameSessions[0];

    // 새로운 세션 추가할 때도 deviceId를 userId로 사용
    const newUser = addUser(deviceId, socket);
    console.log('Initial handler - User session added:', {
      id: newUser.id,
      sessionsCount: userSessions.length
    });
    gameSession.addUser(newUser);

    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      {
        userId: deviceId,  // deviceId를 userId로 사용
        playerId: playerId,
        latency: latency,
        gameId: gameSession.id  // 게임 세션 ID 포함
      },
      deviceId
    );

    socket.write(initialResponse);

  } catch (error) {
    console.error('Error in initialHandler:', error);
    handleError(socket, error);
  }
};



export default initialHandler;  // 핸들러 함수 내보내기
