// src/constants/env.js




/* 
이 모듈은 서버 및 데이터베이스 설정을 환경 변수에서 가져오거나 
기본값을 사용하여 초기화하는 설정 정보를 제공합니다.
유연한 구성 관리를 통해 애플리케이션의 배포 및 설정 변경을 용이하게 합니다.
*/
import dotenv from 'dotenv';  // 환경 변수를 관리하기 위한 dotenv 모듈 가져오기

dotenv.config();  // .env 파일의 환경 변수를 로드하여 process.env에 추가


// 서버 설정
export const PORT = process.env.PORT || 5555;  // 서버 포트, 환경 변수에서 가져오거나 기본값 5555 사용
export const HOST = process.env.HOST || 'localhost';  // 서버 호스트, 환경 변수에서 가져오거나 기본값 'localhost' 사용
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';  // 클라이언트 버전, 환경 변수에서 가져오거나 기본값 '1.0.0' 사용

// 첫 번째 데이터베이스 설정
export const DB1_NAME = process.env.DB1_NAME || 'database1';  // 데이터베이스 이름, 환경 변수에서 가져오거나 기본값 'database1' 사용
export const DB1_USER = process.env.DB1_USER || 'user1';  // 사용자 이름, 환경 변수에서 가져오거나 기본값 'user1' 사용
export const DB1_PASSWORD = process.env.DB1_PASSWORD || 'password1';  // 비밀번호, 환경 변수에서 가져오거나 기본값 'password1' 사용
export const DB1_HOST = process.env.DB1_HOST || 'localhost';  // 데이터베이스 호스트, 환경 변수에서 가져오거나 기본값 'localhost' 사용
export const DB1_PORT = process.env.DB1_PORT || 3306;  // 데이터베이스 포트, 환경 변수에서 가져오거나 기본값 3306 사용

// 두 번째 데이터베이스 설정
export const DB2_NAME = process.env.DB2_NAME || 'database2';  // 데이터베이스 이름, 환경 변수에서 가져오거나 기본값 'database2' 사용
export const DB2_USER = process.env.DB2_USER || 'user2';  // 사용자 이름, 환경 변수에서 가져오거나 기본값 'user2' 사용
export const DB2_PASSWORD = process.env.DB2_PASSWORD || 'password2';  // 비밀번호, 환경 변수에서 가져오거나 기본값 'password2' 사용
export const DB2_HOST = process.env.DB2_HOST || 'localhost';  // 데이터베이스 호스트, 환경 변수에서 가져오거나 기본값 'localhost' 사용
export const DB2_PORT = process.env.DB2_PORT || 3306;  // 데이터베이스 포트, 환경 변수에서 가져오거나 기본값 3306 사용
