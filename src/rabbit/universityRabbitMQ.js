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

    console.log("SendAllUniversityName: 전체 대학 이름, url, id 반환 => ", result);

    reply(msg, result);
  });

  // 2. SendUniversityID: university url로 대학 id반환
  channel.consume('SendUniversityID', async (msg) => {
    try {
      const { university_url } = JSON.parse(msg.content.toString());
      const partner = new Partner_user();
      const result = await partner.getUniversityID(university_url);

      console.log("SendUniversityID: university url로 대학 id반환 => ", result);

      reply(msg, result); 
    } catch (err) {
      console.error('메시지 처리 중 오류 발생:', err.message);
      
      // 실패해도 ack을 호출해서 redelivery 방지
      // 만약 실패 메시지를 다른 큐에 넣고 싶다면 여기서 nack + DLQ 설정 가능
      reply(msg, { error: err.message || '서버 오류' });
    }
    
  });

  // 3. SendUniversityName: university url로 대학 이름 반환
  channel.consume('SendUniversityName', async (msg) => {
    
    try {
      const { university_url } = JSON.parse(msg.content.toString());
      const partner = new Partner_user();
      const result = await partner.getUniversityName(university_url);

      console.log("SendUniversityName: university url로 대학 이름 반환 => ", result);

      reply(msg, result);
    } catch (err) { 
      console.error('메시지 처리 중 오류 발생:', err.message);
      
      // 실패해도 ack을 호출해서 redelivery 방지
      // 만약 실패 메시지를 다른 큐에 넣고 싶다면 여기서 nack + DLQ 설정 가능
      reply(msg, { error: err.message || '서버 오류' });
    }
  });

  // 4. SendUniversityLocation: 대학 url로 위치 정보 반환
  channel.consume('SendUniversityLocation', async (msg) => {
    try {
      const { university_url } = JSON.parse(msg.content.toString());
      const partner = new Partner_user();
      const result = await partner.getUniversityLocation(university_url);

      console.log("SendUniversityLocation: 대학 url로 위치 정보 반환 => ", result);

      reply(msg, result);
    } catch (err) {
      console.error('메시지 처리 중 오류 발생:', err.message);
      
      // 실패해도 ack을 호출해서 redelivery 방지
      // 만약 실패 메시지를 다른 큐에 넣고 싶다면 여기서 nack + DLQ 설정 가능
      reply(msg, { error: err.message || '서버 오류' });
    }
    

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
    try {
      const { university_name } = JSON.parse(msg.content.toString());
      const partner = new Partner_user();
      const result = await partner.getUniversityID_name(university_name);

      console.log("SendUniversityIDByName: university 이름으로 id 반환 => ", result);

      reply(msg, result);
    } catch (err) {
      console.error('메시지 처리 중 오류 발생:', err.message);
      
      // 실패해도 ack을 호출해서 redelivery 방지
      // 만약 실패 메시지를 다른 큐에 넣고 싶다면 여기서 nack + DLQ 설정 가능
      reply(msg, { error: err.message || '서버 오류' });
    }
    

  });
}

// 응답 전송 함수 (RPC 방식)
function reply(msg, data) {
  const fullResponse = {
    ...(typeof data === 'object' ? data : { university_id: data }), // data가 객체가 아니라면 객체로 감싸기
    correlationId: msg.properties.correlationId, // correlationId 추가
  };
  //console.log('fullResponse: ', fullResponse);

  channel.sendToQueue(
    msg.properties.replyTo, // 요청자가 준 응답용 큐
    Buffer.from(JSON.stringify(fullResponse)), // 응답 데이터
    //{ correlationId: msg.properties.correlationId } // 요청-응답 매칭용 ID
  );
  channel.ack(msg);
}

module.exports = { connectToRabbitMQ };