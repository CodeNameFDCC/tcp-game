/* 
이 코드는 초기 사용자 핸들러 함수를 정의합니다.
장치 ID를 통해 사용자를 조회하고, 존재하지 않으면 새로 생성하며,
사용자 정보를 응답으로 클라이언트에 전송합니다. 오류 발생 시 적절히 처리합니다.
*/

import { addUser } from '../../session/user.session.js';  // 사용자 세션에 사용자 추가
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';  // 핸들러 ID 및 응답 코드 상수
import { createResponse } from '../../utils/response/createResponse.js';  // 응답 생성 유틸리티
import { handleError } from '../../utils/error/errorHandler.js';  // 오류 처리 유틸리티
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';  // 데이터베이스 사용자 관련 함수

// 초기 사용자 핸들러 함수
const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId } = payload;  // 요청으로부터 장치 ID 추출

    let user = await findUserByDeviceID(deviceId);  // 장치 ID로 사용자 조회

    if (!user) {
      user = await createUser(deviceId);  // 사용자 없으면 새로 생성
    } else {
      await updateUserLogin(user.id);  // 사용자 존재 시 로그인 업데이트
    }

    addUser(user.id, socket);  // 사용자 세션에 소켓 추가

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },  // 사용자 ID 포함
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);  // 오류 처리
  }
};

export default initialHandler;  // 핸들러 함수 내보내기
