// src/session/user.session.js

/* 
이 코드는 사용자 세션을 관리하는 기능을 제공합니다.
사용자 추가, 제거, ID 또는 소켓을 통한 사용자 조회 및 다음 시퀀스 값을 가져오는 기능을 포함합니다.
각 사용자는 'User' 클래스의 인스턴스로 생성되며, 세션 관리를 위해 사용자 배열에 저장됩니다.
*/

import { userSessions } from './sessions.js';  // 사용자 세션 목록
import User from '../classes/models/user.class.js';  // User 클래스 임포트

// // 사용자 추가 함수
// export const addUser = (id, socket) => {
//   const user = new User(id, socket);  // 새 사용자 생성
//   userSessions.push(user);              // 사용자 목록에 추가
//   return user;                          // 생성된 사용자 반환
// };

export const addUser = (id, socket) => {
  console.log(`Adding user to sessions - ID: ${id}`);

  // 이미 존재하는 세션인지 확인
  const existingSession = userSessions.find(user => user.id === id);
  if (existingSession) {
    console.log(`Removing existing session for user ${id}`);
    removeUser(existingSession.socket);
  }

  const user = new User(id, socket);
  userSessions.push(user);

  console.log(`User added successfully. Total sessions: ${userSessions.length}`);
  console.log('Current sessions:', userSessions.map(u => u.id));

  return user;
};

// // 사용자 제거 함수
// export const removeUser = (socket) => {
//   const index = userSessions.findIndex((user) => user.socket === socket);  // 사용자 인덱스 찾기
//   if (index !== -1) {
//     return userSessions.splice(index, 1)[0];  // 사용자 제거 및 반환
//   }
// };

export const removeUser = (socket) => {
  const index = userSessions.findIndex(user => user.socket === socket);
  if (index !== -1) {
    const removedUser = userSessions.splice(index, 1)[0];
    console.log(`Removed user ${removedUser.id} from sessions`);
    return removedUser;
  }
  console.log('No user found to remove');
  return null;
};

// // ID로 사용자 조회 함수
// export const getUserById = (id) => {
//   return userSessions.find((user) => user.id === id);  // 사용자 조회
// };

export const getUserById = (id) => {
  console.log(`Looking for user with ID: ${id}`);
  console.log('Current sessions:', userSessions.map(u => u.id));

  const user = userSessions.find(user => user.id === id);

  console.log("저장된 유저 보기", userSessions);


  if (user) {
    console.log('User found');
    return user;
  } else {
    console.log('User not found');
    return null;
  }
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
