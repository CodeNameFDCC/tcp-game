/* 
이 코드는 게임 자산을 로드하고 관리하는 기능을 구현합니다.
JSON 파일에서 게임 자산을 비동기적으로 읽어와 전역 객체에 저장하며,
자산을 반환하는 함수도 포함되어 있습니다.
*/

import fs from 'fs';  // 파일 시스템 모듈
import path from 'path';  // 경로 모듈
import { fileURLToPath } from 'url';  // URL 모듈

// import.meta.url은 현재 모듈의 URL을 나타내는 문자열
// fileURLToPath는 URL 문자열을 파일 시스템의 경로로 변환

// 현재 파일의 절대 경로. 이 경로는 파일의 이름을 포함한 전체 경로
const __filename = fileURLToPath(import.meta.url);

// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');  // 자산 파일이 저장된 기본 경로
let gameAssets = {};  // 전역 변수로 게임 자산을 저장

// 파일을 비동기적으로 읽는 함수
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);  // 오류 발생 시 거부
        return;
      }
      resolve(JSON.parse(data));  // JSON 데이터를 객체로 변환하여 해결
    });
  });
};

// 게임 자산을 로드하는 비동기 함수
export const loadGameAssets = async () => {
  try {
    // 여러 파일을 비동기적으로 읽기
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };  // 읽어온 데이터 저장
    return gameAssets;  // 게임 자산 반환
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message);  // 오류 발생 시 예외 처리
  }
};

// 게임 자산을 반환하는 함수
export const getGameAssets = () => {
  return gameAssets;  // 전역 변수에서 게임 자산 반환
};
