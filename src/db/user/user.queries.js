/* 
이 코드는 사용자 관련 SQL 쿼리문들을 상수로 정의합니다.
'FIND_USER_BY_DEVICE_ID'는 장치 ID로 사용자를 조회하고,
'CREATE_USER'는 사용자 생성, 'UPDATE_USER_LOGIN'은 로그인 시간을 업데이트하는 쿼리입니다.
*/

export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',  // 장치 ID로 사용자 조회 쿼리
  CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',  // 사용자 생성 쿼리
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',  // 로그인 시간 업데이트 쿼리
};
