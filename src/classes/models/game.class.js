// src/classes/models/game.class.js




/* 
이 클래스는 게임 세션을 관리하며, 최대 플레이어 수를 설정하고 
사용자를 추가하거나 제거하며 게임 상태를 추적합니다.
게임이 시작되면 사용자 위치를 계산하고 알림을 전송합니다.
*/

import IntervalManager from '../managers/interval.manager.js';  // IntervalManager 클래스 가져오기
import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';  // 게임 관련 알림 패킷 가져오기


const MAX_PLAYERS = 2;  // 최대 플레이어 수 설정

class Game {
  constructor(id) {
    this.id = id;  // 게임 ID
    this.users = [];  // 사용자 목록 초기화
    this.intervalManager = new IntervalManager();  // 인터벌 관리 객체 생성
    this.state = 'waiting'; // 게임 상태 ('waiting', 'inProgress')
  }

  // 사용자 추가 메서드
  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');  // 최대 플레이어 수 초과 시 오류 발생
    }
    this.users.push(user);  // 사용자 목록에 추가

    // 사용자 핑을 1초마다 체크
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    // 최대 플레이어 수에 도달하면 게임 시작 타이머 설정
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  // 사용자 ID로 사용자 정보 가져오기
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  // 사용자 제거 메서드
  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);  // 사용자 목록에서 제거
    this.intervalManager.removePlayer(userId);  // 인터벌 관리에서 제거

    // 플레이어 수가 줄어들면 상태를 'waiting'으로 변경
    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  // 최대 지연 시간 계산 메서드
  getMaxLatency() {
    let maxLatency = 0;  // 최대 지연 시간 초기화
    this.users.forEach((user) => {
      console.log(`${user.id}: ${user.latency}`);  // 각 사용자의 지연 시간 출력
      maxLatency = Math.max(maxLatency, user.latency);  // 최대 지연 시간 업데이트
    });
    return maxLatency;  // 최대 지연 시간 반환
  }

  // 게임 시작 메서드
  startGame() {
    this.state = 'inProgress';  // 상태를 'inProgress'로 변경
    const startPacket = gameStartNotification(this.id, Date.now());  // 게임 시작 알림 패킷 생성
    console.log(`max latency: ${this.getMaxLatency()}`);  // 최대 지연 시간 출력

    // 모든 사용자에게 게임 시작 패킷 전송
    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  // 모든 사용자 위치 계산 메서드
  getAllLocation(excludeUserId) {
    const maxLatency = this.getMaxLatency();  // 최대 지연 시간 가져오기

    // 각 사용자의 위치 계산
    const locationData = this.users
      .filter((user) => user.id !== excludeUserId) // 자신을 제외한 모든 유저를 받아야함
      .map((user) => {

        const { x, y } = user.calculatePosition(maxLatency);  // 위치 계산
        return { id: user.id, x, y };  // 사용자 ID와 위치 반환
      });
    return createLocationPacket(locationData);  // 위치 데이터 패킷 생성
  }
}

export default Game;  // Game 클래스를 기본으로 내보내기
