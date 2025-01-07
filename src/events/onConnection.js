/* 
이 코드는 클라이언트 소켓 연결을 처리하는 함수를 정의합니다.
'buffer' 속성을 추가하여 각 클라이언트에 대해 고유한 버퍼를 유지하고,
데이터 수신, 연결 종료, 오류 발생 시 각각의 핸들러를 설정합니다.
*/

import { onEnd } from './onEnd.js';  // 연결 종료 처리 함수
import { onError } from './onError.js';  // 오류 처리 함수
import { onData } from './onData.js';  // 데이터 수신 처리 함수

// 클라이언트 소켓이 연결될 때 호출되는 함수
export const onConnection = (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);  // 연결된 클라이언트 정보 로그

  // 소켓 객체에 buffer 속성을 추가하여 각 클라이언트에 고유한 버퍼를 유지
  socket.buffer = Buffer.alloc(0);

  // 데이터 수신, 연결 종료, 오류 발생 시 핸들러 설정
  socket.on('data', onData(socket));  // 데이터 수신 이벤트 핸들러
  socket.on('end', onEnd(socket));  // 연결 종료 이벤트 핸들러
  socket.on('error', onError(socket));  // 오류 이벤트 핸들러
};
