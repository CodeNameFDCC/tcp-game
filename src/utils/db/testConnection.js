// src/utills/db/testConnection.js


/* 
이 코드는 데이터베이스 연결을 테스트하는 함수들을 정의합니다.
각 데이터베이스에 대해 간단한 쿼리를 실행하여 연결 상태를 확인하며, 오류 발생 시 로그를 출력합니다.
여러 데이터베이스 연결을 동시에 테스트할 수 있는 기능도 포함되어 있습니다.
*/

const testDbConnection = async (pool, dbName) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');  // 테스트 쿼리 실행
    console.log(`${dbName} 테스트 쿼리 결과:`, rows[0].solution);  // 결과 출력
  } catch (error) {
    console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생:`, error);  // 오류 로그 출력
  }
};

const testAllConnections = async (pools) => {
  await testDbConnection(pools.GAME_DB, 'GAME_DB');  // 게임 데이터베이스 테스트
  await testDbConnection(pools.USER_DB, 'USER_DB');  // 사용자 데이터베이스 테스트
};

export { testDbConnection, testAllConnections };  // 함수 내보내기
