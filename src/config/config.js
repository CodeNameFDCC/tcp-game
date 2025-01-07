/* 
config 객체는 서버, 클라이언트, 패킷 및 데이터베이스 설정을 포함합니다.
각 설정은 필요한 값들을 모아서 관리할 수 있도록 구조화되어 있습니다.
이 구성을 통해 애플리케이션의 다양한 설정을 쉽게 접근하고 수정할 수 있습니다.
*/

import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';  // 서버 환경 변수 가져오기
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';  // 패킷 헤더 상수 가져오기
import {
  DB1_NAME,
  DB1_USER,
  DB1_PASSWORD,
  DB1_HOST,
  DB1_PORT,
  DB2_NAME,
  DB2_USER,
  DB2_PASSWORD,
  DB2_HOST,
  DB2_PORT,
} from '../constants/env.js';  // 데이터베이스 관련 환경 변수 가져오기


export const config = {
  server: {
    port: PORT,  // 서버 포트
    host: HOST,  // 서버 호스트
  },
  client: {
    version: CLIENT_VERSION,  // 클라이언트 버전
  },
  packet: {
    totalLength: TOTAL_LENGTH,  // 패킷 총 길이
    typeLength: PACKET_TYPE_LENGTH,  // 패킷 타입 길이
  },
  databases: {
    GAME_DB: {  // 게임 데이터베이스 설정
      name: DB1_NAME,  // 데이터베이스 이름
      user: DB1_USER,  // 사용자 이름
      password: DB1_PASSWORD,  // 비밀번호
      host: DB1_HOST,  // 호스트
      port: DB1_PORT,  // 포트
    },
    USER_DB: {  // 사용자 데이터베이스 설정
      name: DB2_NAME,  // 데이터베이스 이름
      user: DB2_USER,  // 사용자 이름
      password: DB2_PASSWORD,  // 비밀번호
      host: DB2_HOST,  // 호스트
      port: DB2_PORT,  // 포트
    },
    // 필요한 만큼 추가
  },
};
