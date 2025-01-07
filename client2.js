/* 
이 코드는 TCP 클라이언트를 구현하여 서버와 연결하고 패킷을 전송 및 수신하는 기능을 제공합니다.
2번 클라이언트를 제공하기 위해 만들어졌습니다.
클라이언트는 초기화 및 게임 참가 패킷을 전송하고, 서버로부터 응답을 처리하여 위치 업데이트를 주기적으로 전송합니다.
Pong 응답을 전송하는 기능도 포함되어 있습니다.
게임 ID는 1번 클라이언트에서 저장한 `gameId.json` 파일에서 읽어옵니다.
*/

import net from 'net';  // net 모듈 임포트
import Long from 'long';  // Long 타입 임포트
import { getProtoMessages, loadProtos } from './src/init/loadProtos.js';  // 프로토 메시지 로드 함수 임포트
import fs from 'fs';  // 파일 시스템 모듈 임포트

const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
const PACKET_TYPE_LENGTH = 1; // 패킷 타입을 나타내는 1바이트

let userId;  // 사용자 ID
let gameId;  // 게임 ID
let sequence = 0;  // 시퀀스 초기화
const deviceId = 'xxxxx';  // 장치 ID
let x = 0.0;  // 위치 x 좌표
let y = 0.0;  // 위치 y 좌표

// 게임 ID를 읽는 함수
const readGameId = () => {
  try {
    const data = fs.readFileSync('gameId.json', 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.gameId;
  } catch (error) {
    console.error('게임 ID를 읽는 중 오류 발생:', error);
    return null;  // 오류 발생 시 null 반환
  }
};

// 패킷 생성 함수
const createPacket = (handlerId, payload, clientVersion = '1.0.0', type, name) => {
  const protoMessages = getProtoMessages();
  const PayloadType = protoMessages[type][name];

  if (!PayloadType) {
    throw new Error('PayloadType을 찾을 수 없습니다.');  // PayloadType이 없을 경우 오류 발생
  }

  const payloadMessage = PayloadType.create(payload);  // 페이로드 메시지 생성
  const payloadBuffer = PayloadType.encode(payloadMessage).finish();  // 페이로드 인코딩

  return {
    handlerId,
    userId,
    clientVersion,
    sequence,
    payload: payloadBuffer,
  };
};

// 패킷 전송 함수
const sendPacket = (socket, packet) => {
  const protoMessages = getProtoMessages();
  const Packet = protoMessages.common.Packet;

  if (!Packet) {
    console.error('Packet 메시지를 찾을 수 없습니다.');  // Packet이 없을 경우 오류 로그
    return;
  }

  const buffer = Packet.encode(packet).finish();  // 패킷 인코딩

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(buffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0); // 패킷 길이에 타입 바이트 포함

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(1, 0); // NORMAL TYPE

  // 길이 정보와 메시지를 함께 전송
  const packetWithLength = Buffer.concat([packetLength, packetType, buffer]);
  socket.write(packetWithLength);  // 소켓에 패킷 전송
};

// Pong 응답 전송 함수
const sendPong = (socket, timestamp) => {
  const protoMessages = getProtoMessages();
  const Ping = protoMessages.common.Ping;

  const pongMessage = Ping.create({ timestamp });
  const pongBuffer = Ping.encode(pongMessage).finish();

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(pongBuffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(0, 0);  // PING TYPE

  // 길이 정보와 메시지를 함께 전송
  const packetWithLength = Buffer.concat([packetLength, packetType, pongBuffer]);
  socket.write(packetWithLength);  // 소켓에 패킷 전송
};

// 위치 업데이트 전송 함수
const updateLocation = (socket) => {
  x += 1;  // x 좌표 증가
  const packet = createPacket(6, { gameId, x, y }, '1.0.0', 'game', 'LocationUpdatePayload');
  sendPacket(socket, packet);  // 패킷 전송
};

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();  // TCP 소켓 생성

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));  // 지연 함수

// 서버에 연결
client.connect(PORT, HOST, async () => {
  console.log('Connected to server');
  await loadProtos();  // 프로토 로드

  const gameIdFromFile = readGameId();  // 게임 ID 읽기
  if (gameIdFromFile) {
    gameId = gameIdFromFile;  // 파일에서 읽은 게임 ID 설정

    const successPacket = createPacket(0, { deviceId }, '1.0.0', 'initial', 'InitialPacket');
    await sendPacket(client, successPacket);  // 초기 패킷 전송
    await delay(500);  // 500ms 대기

    const joinGamePacket = createPacket(
      5,
      { timestamp: Date.now(), gameId },
      '1.0.0',
      'game',
      'JoinGamePayload',
    );

    await sendPacket(client, joinGamePacket);  // 게임 참가 패킷 전송
  } else {
    console.log('게임 ID를 찾을 수 없습니다.');
  }
});

// 데이터 수신 이벤트
client.on('data', async (data) => {
  // 1. 길이 정보 수신 (4바이트)
  const length = data.readUInt32BE(0);
  const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;

  // 2. 패킷 타입 정보 수신 (1바이트)
  const packetType = data.readUInt8(4);
  const packet = data.slice(totalHeaderLength, length); // 패킷 데이터
  const protoMessages = getProtoMessages();

  if (packetType === 1) {
    const Response = protoMessages.response.Response;

    try {
      const response = Response.decode(packet);
      const responseData = JSON.parse(Buffer.from(response.data).toString());
      if (response.handlerId === 0) {
        userId = responseData.userId;  // userId 업데이트
      }
      console.log('응답 데이터:', responseData);
      sequence = response.sequence;  // 시퀀스 업데이트
    } catch (e) {
      console.log(e);  // 오류 로그 출력
    }
  } else if (packetType === 0) {
    try {
      const Ping = protoMessages.common.Ping;
      const pingMessage = Ping.decode(packet);
      const timestampLong = new Long(
        pingMessage.timestamp.low,
        pingMessage.timestamp.high,
        pingMessage.timestamp.unsigned,
      );
      await delay(1000);  // 1초 대기
      await sendPong(client, timestampLong.toNumber());  // Pong 응답 전송
    } catch (pongError) {
      console.error('Ping 처리 중 오류 발생:', pongError);
    }
  } else if (packetType === 2) {
    try {
      const Start = protoMessages.gameNotification.Start;
      const startMessage = Start.decode(packet);

      console.log('응답 데이터:', startMessage);
      if (startMessage.gameId) {
        gameId = startMessage.gameId;  // gameId 업데이트
      }

      // 위치 업데이트 패킷 전송
      setInterval(() => {
        updateLocation(client);  // 주기적으로 위치 업데이트 전송
      }, 1000);
    } catch (error) {
      console.error(error);  // 오류 로그 출력
    }
  } else if (packetType === 3) {
    try {
      const locationUpdate = protoMessages.gameNotification.LocationUpdate;
      const locationUpdateMessage = locationUpdate.decode(packet);
      console.log('응답 데이터:', locationUpdateMessage);
    } catch (error) {
      console.error(error);  // 오류 로그 출력
    }
  }
});

// 연결 종료 이벤트
client.on('close', () => {
  console.log('Connection closed');
});

// 오류 이벤트
client.on('error', (err) => {
  console.error('Client error:', err);
});

// 프로세스 종료 시 클라이언트 종료
process.on('SIGINT', () => {
  client.end('클라이언트가 종료됩니다.', () => {
    process.exit(0);  // 프로세스 종료
  });
});
