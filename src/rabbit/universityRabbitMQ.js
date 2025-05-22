const amqp = require('amqplib');
const University_user = require("../models/university/university");
const Partner_user = require("../models/university/partner");

let channel = null;

async function connectToRabbitMQ() {

  // rabbit mq 서버와 연결결
  const connection = await amqp.connect(process.env.RABBIT || 'amqp://localhost');
  // 메시지를 송수신한 channel 생성성
  channel = await connection.createChannel();

  // 요청이 들어올 큐를 생성, 대기
  const queues = [
    'SendAllUniversityName',
    'SendUniversityID',
    'SendUniversityName',
    'SendUniversityLocation',
    'SendUniversity',
    'SendUniversityIDByName'
  ];

  for (const q of queues) {
    await channel.assertQueue(q, { durable: true });
  }

  console.log('universityRabbitMQ 큐 연결 완료');
  consumeMessages();
}

function consumeMessages() {
  // 1. SendAllUniversityName: 전체 대학 이름, url, id
  channel.consume('SendAllUniversityName', async (msg) => {
    const university_user = new University_user();
    const result = await university_user.showUniversityNameList();

    console.log(msg, result);
    
    reply(msg, result);
  });

  // 2. SendUniversityID: university url로 대학 id반환
  channel.consume('SendUniversityID', async (msg) => {
    const { university_url } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityID(university_url);

    console.log(msg, result);

    reply(msg, result);
  });

  // 3. SendUniversityName: university url로 대학 이름 반환
  channel.consume('SendUniversityName', async (msg) => {
    const { university_url } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityName(university_url);

    console.log(msg, result);

    reply(msg, result);
  });

  // 4. SendUniversityLocation: 대학id로 위치 정보 반환
  channel.consume('SendUniversityLocation', async (msg) => {
    const { university_id } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityLocation(university_id);

    console.log(msg, result);

    reply(msg, result);
  });

  // 5. SendUniversity
  // channel.consume('SendUniversity', async (msg) => {
  //   const { university_url } = JSON.parse(msg.content.toString());
  //   const partner = new Partner_user();
  //   const result = await partner.showUniversity(university_url);
  //   reply(msg, result);
  // });

  // 6. SendUniversityIDByName: university 이름으로 id 반환
  channel.consume('SendUniversityIDByName', async (msg) => {
    const { university_name } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityID_name(university_name);

    console.log(msg, result);

    reply(msg, result);
  });
}

// 응답 전송 함수 (RPC 방식)
function reply(msg, data) {
  console.log(data);

  channel.sendToQueue(
    msg.properties.replyTo, // 요청자가 준 응답용 큐
    Buffer.from(JSON.stringify(data)), // 응답 데이터
    { correlationId: msg.properties.correlationId } // 요청-응답 매칭용 ID
  );
  channel.ack(msg);
}

module.exports = { connectToRabbitMQ };