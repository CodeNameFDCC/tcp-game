// src/events/onEnd.js


/* 
이 코드는 클라이언트 소켓 연결 종료 시 호출되는 함수를 정의합니다.
연결이 종료되면 로그를 출력하고, 해당 소켓에 대한 사용자 정보를 제거합니다.
사용자 세션 관리를 위한 'removeUser' 함수를 사용합니다.
*/

import { removeUser, getUserBySocket } from '../session/user.session.js';  // 사용자 세션에서 사용자 제거 함수
import { gameSessions } from '../session/sessions.js';
// 클라이언트 소켓 연결 종료 시 호출되는 함수
export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  // 1. 먼저 해당 소켓의 유저 정보를 찾습니다
  const user = getUserBySocket(socket);
  if (user) {
    // 2. 유저가 속한 게임을 찾습니다
    const game = gameSessions.find(g => g.users.some(u => u.id === user.id));
    if (game) {
      // 3. 게임에서 유저를 제거합니다
      game.removeUser(user.id);
      console.log(`User ${user.id} removed from game ${game.id}`);
    }
  }

  // 4. 마지막으로 세션에서 유저를 제거합니다
  removeUser(socket);
};
