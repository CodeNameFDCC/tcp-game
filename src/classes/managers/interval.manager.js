/* IntervalManager 클래스는 BaseManager를 상속받아 
플레이어와 관련된 인터벌을 관리하는 기능을 제공합니다. 
addPlayer, removePlayer, clearAll 등의 메서드를 통해 
플레이어의 인터벌을 추가, 제거 및 정리할 수 있습니다. 
이를 통해 게임 로직에서 주기적인 작업을 효과적으로 처리할 수 있도록 돕습니다. */


import BaseManager from './base.manager.js';  // BaseManager 클래스 가져오기

// IntervalManager 클래스 정의 (BaseManager를 상속)
class IntervalManager extends BaseManager {
  constructor() {
    super();  // 부모 클래스의 생성자 호출
    this.intervals = new Map();  // 플레이어와 관련된 인터벌 저장을 위한 Map 초기화
  }

  // 플레이어를 추가하고 해당 콜백과 인터벌 설정
  addPlayer(playerId, callback, interval, type = 'user') {
    // 플레이어 ID가 없으면 새로운 Map 생성
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map());
    }
    // 지정된 타입에 대해 setInterval 설정
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  // 게임 추가 메서드
  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game');
  }

  // 플레이어 위치 업데이트 메서드
  addUpdatePosition(playerId, callback, interval) {
    this.addPlayer(playerId, callback, interval, 'updatePosition');
  }

  // 플레이어를 제거하는 메서드
  removePlayer(playerId) {
    // 플레이어 ID가 존재하면 해당 인터벌 제거
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));  // 모든 인터벌 정리
      this.intervals.delete(playerId);  // 플레이어 ID 삭제
    }
  }

  // 특정 타입의 인터벌 제거 메서드
  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      // 특정 타입이 존재하면 해당 인터벌 정리
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  // 모든 인터벌을 제거하는 메서드
  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));  // 모든 인터벌 정리
    });
    this.intervals.clear();  // 모든 플레이어의 인터벌 삭제
  }
}

// IntervalManager 클래스를 기본으로 내보내기
export default IntervalManager;
