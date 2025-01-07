/* 
이 코드는 클라이언트 소켓 연결 종료 시 호출되는 함수를 정의합니다.
연결이 종료되면 로그를 출력하고, 해당 소켓에 대한 사용자 정보를 제거합니다.
사용자 세션 관리를 위한 'removeUser' 함수를 사용합니다.
*/

import { removeUser } from '../session/user.session.js';  // 사용자 세션에서 사용자 제거 함수

// 클라이언트 소켓 연결 종료 시 호출되는 함수
export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');  // 연결 종료 로그 출력
  removeUser(socket);  // 해당 소켓에 대한 사용자 정보 제거
};
