// src/session/user.session.js

/* 
이 코드는 사용자 세션을 관리하는 기능을 제공합니다.
사용자 추가, 제거, ID 또는 소켓을 통한 사용자 조회 및 다음 시퀀스 값을 가져오는 기능을 포함합니다.
각 사용자는 'User' 클래스의 인스턴스로 생성되며, 세션 관리를 위해 사용자 배열에 저장됩니다.
*/

import { userSessions } from './sessions.js';  // 사용자 세션 목록을 임포트
import User from '../classes/models/user.class.js';  // User 클래스 임포트

// 사용자 추가 함수
export const addUser = (id, socket) => {
  console.log(`Adding user to sessions - ID: ${id}`);  // 사용자 추가 로그 출력

  // 이미 존재하는 세션인지 확인
  const existingSession = userSessions.find(user => user.id === id); // ID로 기존 사용자 세션 조회
  if (existingSession) {
    console.log(`Removing existing session for user ${id}`); // 기존 세션 제거 로그 출력
    removeUser(existingSession.socket); // 기존 세션 제거
  }

  // 새로운 사용자 인스턴스 생성
  const user = new User(id, socket);
  userSessions.push(user); // 사용자 배열에 추가

  console.log(`User added successfully. Total sessions: ${userSessions.length}`); // 추가 성공 로그 출력
  console.log('Current sessions:', userSessions.map(u => u.id)); // 현재 세션 로그 출력

  return user; // 추가된 사용자 반환
};

// 사용자 제거 함수
export const removeUser = (socket) => {
  // 소켓을 통해 사용자 세션 조회
  const index = userSessions.findIndex(user => user.socket === socket);
  if (index !== -1) {
    const removedUser = userSessions.splice(index, 1)[0]; // 사용자 배열에서 제거
    console.log(`Removed user ${removedUser.id} from sessions`); // 제거 성공 로그 출력
    return removedUser; // 제거된 사용자 반환
  }
  console.log('No user found to remove'); // 제거할 사용자 미발견 로그 출력
  return null; // 제거할 사용자가 없을 경우 null 반환
};

// ID로 사용자 조회 함수
export const getUserById = (id) => {
  console.log(`Looking for user with ID: ${id}`); // 사용자 조회 로그 출력
  console.log('Current sessions:', userSessions.map(u => u.id)); // 현재 세션 로그 출력

  // ID로 사용자 조회
  const user = userSessions.find(user => user.id === id);

  console.log("저장된 유저 보기", userSessions); // 현재 저장된 사용자 목록 로그 출력

  if (user) {
    console.log('User found'); // 사용자 발견 로그 출력
    return user; // 발견된 사용자 반환
  } else {
    console.log('User not found'); // 사용자 미발견 로그 출력
    return null; // 사용자가 없을 경우 null 반환
  }
};

// 소켓으로 사용자 조회 함수
export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);  // 소켓을 통해 사용자 조회
};

// 다음 시퀀스 값 가져오기 함수
export const getNextSequence = (id) => {
  const user = getUserById(id);  // ID로 사용자 조회
  if (user) {
    return user.getNextSequence();  // 사용자가 존재할 경우 다음 시퀀스 값 반환
  }
  return null;  // 사용자가 없을 경우 null 반환
};
