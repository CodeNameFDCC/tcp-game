// src/db/migrations/createSchemas.js


/* 
이 코드는 SQL 파일을 읽어 데이터베이스에 쿼리를 실행하여 
스키마를 생성하는 기능을 제공합니다. 
마이그레이션 완료 후 프로세스를 종료하거나 오류 발생 시 적절한 메시지를 출력합니다.
*/

import fs from 'fs';  // 파일 시스템 모듈 가져오기
import path from 'path';  // 경로 관련 모듈 가져오기
import pools from '../database.js';  // 데이터베이스 연결 풀 가져오기
import { fileURLToPath } from 'url';  // URL 관련 모듈에서 fileURLToPath 함수 가져오기

// 현재 파일의 경로와 디렉토리 이름 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일을 실행하는 함수
const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');  // SQL 파일 읽기
  const queries = sql
    .split(';')  // 쿼리를 세미콜론으로 분리
    .map((query) => query.trim())  // 각 쿼리의 공백 제거
    .filter((query) => query.length > 0);  // 빈 쿼리 제거

  // 각 쿼리를 데이터베이스에 실행
  for (const query of queries) {
    await pool.query(query);
  }
};

// 데이터베이스 스키마를 생성하는 함수
const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');  // SQL 파일이 위치한 디렉토리 경로
  try {
    // USER_DB SQL 파일 실행
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));

    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 중 오류가 발생했습니다:', error);
  }
};

// 스키마 생성 함수 호출 및 마이그레이션 처리
createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0); // 마이그레이션 완료 후 프로세스 종료
  })
  .catch((error) => {
    console.error('마이그레이션 중 오류가 발생했습니다:', error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
