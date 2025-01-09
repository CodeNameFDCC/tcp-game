// src/session/game.session.js

/* 
이 코드는 게임 세션을 관리하는 기능을 제공합니다.
세션 추가, 제거, 특정 세션 조회 및 모든 세션 조회 기능을 포함합니다.
각 세션은 'Game' 클래스의 인스턴스로 생성되며, 세션 ID를 사용하여 관리합니다.
*/

import { gameSessions } from './sessions.js';  // 게임 세션 목록
import Game from '../classes/models/game.class.js';  // Game 클래스 임포트
import { v4 as uuidv4 } from 'uuid';

export const createGameSession = () => {
  const gameId = uuidv4();  // 게임 ID 생성
  const session = new Game(gameId);
  gameSessions.push(session);
  console.log(`Game session created with ID: ${gameId}`);
  return session;
};

// 게임 세션 추가 함수
export const addGameSession = (id) => {
  const session = new Game(id);  // 새 게임 세션 생성
  gameSessions.push(session);      // 세션 목록에 추가
  return session;                  // 생성된 세션 반환
};

// 게임 세션 제거 함수
export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);  // 세션 인덱스 찾기
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];  // 세션 제거 및 반환
  }
};

// 특정 게임 세션 조회 함수
export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);  // 세션 조회
};

// 모든 게임 세션 조회 함수
export const getAllGameSessions = () => {
  return gameSessions;  // 모든 세션 반환
};
