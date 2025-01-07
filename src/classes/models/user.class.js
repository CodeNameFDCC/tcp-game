/* 
User 클래스는 각 사용자에 대한 정보를 관리하며, 
위치 업데이트, 핑/퐁 응답 처리 및 위치 추정 기능을 제공합니다.
사용자의 ID, 소켓, 위치 및 지연 시간을 추적합니다.
*/

import { createPingPacket } from '../../utils/notification/game.notification.js';  // 핑 패킷 생성 함수 가져오기


class User {
  constructor(id, socket) {
    this.id = id;  // 사용자 ID
    this.socket = socket;  // 사용자 소켓
    this.x = 0;  // x 좌표 초기화
    this.y = 0;  // y 좌표 초기화
    this.sequence = 0;  // 패킷 순서 초기화
    this.lastUpdateTime = Date.now();  // 마지막 업데이트 시간 초기화
  }

  // 사용자 위치 업데이트 메서드
  updatePosition(x, y) {
    this.x = x;  // x 좌표 업데이트
    this.y = y;  // y 좌표 업데이트
    this.lastUpdateTime = Date.now();  // 마지막 업데이트 시간 갱신
  }

  // 다음 패킷 순서 가져오기
  getNextSequence() {
    return ++this.sequence;  // 순서 증가 후 반환
  }

  // 핑 메서드
  ping() {
    const now = Date.now();  // 현재 시간 가져오기

    // console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));  // 핑 패킷 전송
  }

  // 퐁 응답 처리 메서드
  handlePong(data) {
    const now = Date.now();  // 현재 시간 가져오기
    this.latency = (now - data.timestamp) / 2;  // 지연 시간 계산
    // console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const speed = 1; // 속도 고정
    const distance = speed * timeDiff;  // 이동 거리 계산

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + distance,  // x 좌표 업데이트
      y: this.y,  // y 좌표 유지
    };
  }
}

export default User;  // User 클래스를 기본으로 내보내기
