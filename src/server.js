/* 
이 코드는 TCP 서버를 초기화하고 실행하는 기능을 제공합니다.
서버는 클라이언트의 연결을 처리하기 위해 `onConnection` 이벤트 핸들러를 사용하며,
서버가 성공적으로 시작되면 실행 중인 주소를 로그로 출력합니다.
초기화 과정에서 오류가 발생할 경우, 오류 메시지를 출력하고 프로세스를 종료합니다.
*/

import net from 'net';  // net 모듈 임포트
import initServer from './init/index.js';  // 서버 초기화 함수 임포트
import { config } from './config/config.js';  // 설정 파일 임포트
import { onConnection } from './events/onConnection.js';  // 연결 이벤트 핸들러 임포트

const server = net.createServer(onConnection);  // 서버 생성

// 서버 초기화 및 실행
const startServer = async () => {
  try {
    await initServer(); // 서버 초기화
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address()); // 서버 주소 출력
    });
  } catch (err) {
    console.error(err); // 오류 로그 출력
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

// 서버 초기화 및 실행
startServer();
