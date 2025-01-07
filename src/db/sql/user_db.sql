/* 
이 코드는 사용자와 게임 종료 정보를 저장하기 위한 데이터베이스 테이블을 생성합니다.
'user' 테이블은 사용자 정보를, 'game_end' 테이블은 게임 종료 시각 및 점수를 저장합니다.
각 테이블은 기본 키 및 외래 키 제약 조건을 포함하고 있습니다.
*/

CREATE TABLE IF NOT EXISTS user
(
    id         VARCHAR(36) PRIMARY KEY,  -- 사용자 ID, 기본 키
    device_id  VARCHAR(255) UNIQUE NOT NULL,  -- 장치 ID, 유일해야 함
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 마지막 로그인 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 생성 시간
);

CREATE TABLE IF NOT EXISTS game_end
(
    id         VARCHAR(36) PRIMARY KEY,  -- 게임 종료 ID, 기본 키
    user_id    VARCHAR(36) NOT NULL,  -- 사용자 ID, 외래 키
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 게임 시작 시간
    end_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 게임 종료 시간
    score      INT       DEFAULT 0,  -- 게임 점수
    FOREIGN KEY (user_id) REFERENCES user (id)  -- 외래 키 제약 조건
);
