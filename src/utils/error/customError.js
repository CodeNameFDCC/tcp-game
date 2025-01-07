/* 
이 코드는 사용자 정의 오류 클래스를 정의합니다.
'CustomError' 클래스는 기본 Error 클래스를 확장하여 오류 코드와 메시지를 포함합니다.
이를 통해 오류를 보다 구체적으로 처리하고 식별할 수 있습니다.
*/

class CustomError extends Error {
  constructor(code, message) {
    super(message);  // 기본 Error 클래스의 생성자 호출
    this.code = code;  // 오류 코드 설정
    this.name = 'CustomError';  // 오류 이름 설정
  }
}

export default CustomError;  // CustomError 클래스 내보내기
