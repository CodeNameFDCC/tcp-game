/* 
이 코드는 사용자 세션을 관리하는 기능을 제공합니다.
사용자 추가, 제거, ID 또는 소켓을 통한 사용자 조회 및 다음 시퀀스 값을 가져오는 기능을 포함합니다.
각 사용자는 'User' 클래스의 인스턴스로 생성되며, 세션 관리를 위해 사용자 배열에 저장됩니다.
*/

import { userSessions } from './sessions.js';  // 사용자 세션 목록
import User from '../classes/models/user.class.js';  // User 클래스 임포트

// 사용자 추가 함수
export const addUser = (id, socket) => {
  const user = new User(id, socket);  // 새 사용자 생성
  userSessions.push(user);              // 사용자 목록에 추가
  return user;                          // 생성된 사용자 반환
};

// 사용자 제거 함수
export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);  // 사용자 인덱스 찾기
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];  // 사용자 제거 및 반환
  }
};

// ID로 사용자 조회 함수
export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);  // 사용자 조회
};

// 소켓으로 사용자 조회 함수
export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);  // 사용자 조회
};

// 다음 시퀀스 값 가져오기 함수
export const getNextSequence = (id) => {
  const user = getUserById(id);  // 사용자 조회
  if (user) {
    return user.getNextSequence();  // 다음 시퀀스 값 반환
  }
  return null;  // 사용자가 없을 경우 null 반환
};
