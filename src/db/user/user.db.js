/* 
이 코드는 사용자 정보를 데이터베이스에서 관리하기 위한 함수들을 정의합니다.
'findUserByDeviceID'는 장치 ID로 사용자를 검색하고, 'createUser'는 새 사용자를 생성하며,
'updateUserLogin'은 사용자의 로그인 정보를 업데이트합니다.
*/

import { v4 as uuidv4 } from 'uuid';  // UUID 생성을 위한 라이브러리
import pools from '../database.js';  // 데이터베이스 연결 풀
import { SQL_QUERIES } from './user.queries.js';  // SQL 쿼리 상수
import { toCamelCase } from '../../utils/transformCase.js';  // 카멜 케이스 변환 유틸리티

// 주어진 장치 ID로 사용자를 찾는 함수
export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);  // 결과를 카멜 케이스로 변환하여 반환
};

// 새 사용자를 생성하는 함수
export const createUser = async (deviceId) => {
  const id = uuidv4();  // 새로운 UUID 생성
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);  // 데이터베이스에 사용자 추가
  return { id, deviceId };  // 생성된 사용자 정보 반환
};

// 사용자의 로그인 정보를 업데이트하는 함수
export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);  // 로그인 시간 업데이트
};
