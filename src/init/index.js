// src/init/index.js


/* 
이 코드는 서버 초기화 작업을 수행하는 함수를 정의합니다.
게임 자산과 프로토타입을 로드하고, 데이터베이스 연결을 테스트합니다.
오류가 발생하면 로그를 출력하고 프로세스를 종료합니다.
*/

import { loadGameAssets } from './assets.js';  // 게임 자산 로드 함수
import { loadProtos } from './loadProtos.js';  // 프로토타입 로드 함수
import { testAllConnections } from '../utils/db/testConnection.js';  // 데이터베이스 연결 테스트 함수
import pools from '../db/database.js';  // 데이터베이스 풀

// 서버 초기화 함수
const initServer = async () => {
  try {
    await loadGameAssets();  // 게임 자산 로드
    await loadProtos();  // 프로토타입 로드
    await testAllConnections(pools);  // 데이터베이스 연결 테스트
    // 다음 작업
  } catch (e) {
    console.error(e);  // 오류 로그 출력
    process.exit(1);  // 오류 발생 시 프로세스 종료
  }
};

export default initServer;  // 초기화 함수 내보내기
