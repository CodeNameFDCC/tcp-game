/* 
이 코드는 MySQL 데이터베이스와 연결하기 위한 커넥션 풀을 생성합니다.
'createPool' 함수는 데이터베이스 설정을 기반으로 풀을 생성하고, 쿼리 실행 시 로그를 출력합니다.
여러 데이터베이스에 대한 커넥션 풀을 생성하여 내보냅니다.
*/

import mysql from 'mysql2/promise';  // MySQL 연결을 위한 promise 기반 라이브러리
import { config } from '../config/config.js';  // 설정 파일에서 데이터베이스 정보 가져오기
import { formatDate } from '../utils/dateFormatter.js';  // 날짜 형식을 포맷팅하기 위한 유틸리티

const { databases } = config;  // 설정에서 데이터베이스 정보 추출

// 데이터베이스 커넥션 풀 생성 함수
const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,  // 데이터베이스 호스트
    port: dbConfig.port,  // 포트 번호
    user: dbConfig.user,  // 사용자 이름
    password: dbConfig.password,  // 비밀번호
    database: dbConfig.name,  // 데이터베이스 이름
    waitForConnections: true,  // 연결 대기
    connectionLimit: 10,  // 커넥션 풀에서 최대 연결 수
    queueLimit: 0,  // 대기열 제한, 0일 경우 무제한
  });

  const originalQuery = pool.query;  // 원래 쿼리 메서드 저장

  // 쿼리 메서드 오버라이드 (로그 출력 추가)
  pool.query = (sql, params) => {
    const date = new Date();
    // 쿼리 실행 시 로그 출력
    console.log(
      `[${formatDate(date)}] Executing query: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``
      }`,
    );
    return originalQuery.call(pool, sql, params);  // 원래 쿼리 메서드 호출
  };

  return pool;  // 생성된 커넥션 풀 반환
};

// 여러 데이터베이스 커넥션 풀 생성
const pools = {
  GAME_DB: createPool(databases.GAME_DB),  // 게임 데이터베이스 풀
  USER_DB: createPool(databases.USER_DB),  // 사용자 데이터베이스 풀
};

export default pools;  // 생성된 풀을 기본으로 내보냄
