/* BaseManager 클래스는 플레이어 관리 기능을 위한 추상 클래스입니다. 
이 클래스는 직접 인스턴스를 생성할 수 없으며, 
addPlayer, removePlayer, clearAll 메서드를 반드시 구현해야 합니다. 
이를 통해 서브클래스에서 플레이어 관리 기능을 정의하도록 강제합니다. */

// BaseManager 클래스 정의
class BaseManager {
  constructor() {
    // BaseManager 인스턴스를 직접 생성할 수 없도록 예외 발생
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct BaseManager instances directly');
    }
  }

  // 플레이어 추가 메서드 (구현 필수)
  addPlayer(playerId, ...args) {
    throw new Error('Must implement addPlayer method');
  }

  // 플레이어 제거 메서드 (구현 필수)
  removePlayer(playerId) {
    throw new Error('Must implement removePlayer method');
  }

  // 모든 플레이어를 제거하는 메서드 (구현 필수)
  clearAll() {
    throw new Error('Must implement clearAll method');
  }
}

// BaseManager 클래스를 기본으로 내보내기
export default BaseManager;
