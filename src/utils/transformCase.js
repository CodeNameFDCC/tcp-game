// src/utills/transformCase.js

/* 
이 코드는 주어진 객체 또는 배열의 키를 카멜 케이스 형식으로 변환하는 함수를 정의합니다.
배열의 경우 각 요소에 대해 재귀적으로 변환을 수행하며, 객체의 경우 키를 카멜 케이스로 변환하고 값에 대해서도 재귀적으로 호출합니다.
객체나 배열이 아닌 경우 원본 값을 그대로 반환합니다.
*/

import camelCase from 'lodash/camelCase.js';  // lodash의 camelCase 함수 임포트

// 주어진 객체 또는 배열의 키를 카멜 케이스로 변환하는 함수
export const toCamelCase = (obj) => {
  // 배열인 경우, 각 요소에 대해 재귀적으로 toCamelCase 호출
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }

  // 객체인 경우, 키를 카멜 케이스로 변환하고 값에 대해서도 재귀적으로 toCamelCase 호출
  if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCasedKey = camelCase(key);  // 카멜 케이스 변환
      result[camelCasedKey] = toCamelCase(obj[key]);  // 값에 대해 재귀 호출
      return result;
    }, {});
  }

  // 배열도 객체도 아닌 경우, 원본 값을 반환
  return obj;
};
