/* 
이 코드는 Protobuf 파일을 로드하고, 패킷 메시지를 초기화하는 기능을 제공합니다.
주어진 디렉토리 내 모든 .proto 파일을 재귀적으로 찾아 로드하며,
로드된 메시지를 반환하는 함수도 포함되어 있습니다.
*/

import fs from 'fs';  // 파일 시스템 모듈
import path from 'path';  // 경로 모듈
import { fileURLToPath } from 'url';  // URL 모듈
import protobuf from 'protobufjs';  // Protobuf 라이브러리
import { packetNames } from '../protobuf/packetNames.js';  // 패킷 이름 정의

// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로토파일이 있는 디렉토리 경로 설정
const protoDir = path.join(__dirname, '../protobuf');

// 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수
const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);  // 디렉토리 내 파일 목록 가져오기
  files.forEach((file) => {
    const filePath = path.join(dir, file);  // 파일 경로 생성
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);  // 하위 디렉토리 재귀 호출
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);  // .proto 파일 경로 추가
    }
  });
  return fileList;  // 모든 proto 파일 경로 반환
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

// 모든 .proto 파일을 로드하여 프로토 메시지를 초기화합니다.
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();  // Protobuf 루트 생성

    // 비동기 병렬 처리로 프로토 파일 로드
    await Promise.all(protoFiles.map((file) => root.load(file)));

    // packetNames 에 정의된 패킷들을 등록
    for (const [namespace, types] of Object.entries(packetNames)) {
      protoMessages[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[namespace][type] = root.lookupType(typeName);  // 메시지 타입 등록
      }
    }

    console.log('Protobuf 파일이 로드되었습니다.');  // 성공 메시지 출력
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', error);  // 오류 메시지 출력
  }
};

// 깊은 복사 (완전한 복사)
// 얕은 복사
export const getProtoMessages = () => {
  return { ...protoMessages };  // 프로토 메시지 반환
};
