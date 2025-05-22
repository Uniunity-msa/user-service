const amqp = require('amqplib');
const University_user = require("../models/university/university");
const Partner_user = require("../models/university/partner");

let channel = null;

async function connectToRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBIT || 'amqp://localhost');
  channel = await connection.createChannel();

  const queues = [
    'FindAllUniversityName',
    'GetUniversityID',
    'GetUniversityName',
    'GetUniversityLocation',
    'ShowUniversity',
    'GetUniversityIDByName'
  ];

  for (const q of queues) {
    await channel.assertQueue(q, { durable: true });
  }

  console.log('✅ universityRabbitMQ 큐 연결 완료');
  consumeMessages();
}

function consumeMessages() {
  // 1. FindAllUniversityName
  channel.consume('FindAllUniversityName', async (msg) => {
    const university_user = new University_user();
    const result = await university_user.showUniversityNameList();
    reply(msg, result);
  });

  // 2. GetUniversityID
  channel.consume('GetUniversityID', async (msg) => {
    const { university_url } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityID(university_url);
    reply(msg, result);
  });

  // 3. GetUniversityName
  channel.consume('GetUniversityName', async (msg) => {
    const { university_url } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityName(university_url);
    reply(msg, result);
  });

  // 4. GetUniversityLocation
  channel.consume('GetUniversityLocation', async (msg) => {
    const { university_id } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityLocation(university_id);
    reply(msg, result);
  });

  // 5. ShowUniversity
  channel.consume('ShowUniversity', async (msg) => {
    const { university_url } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.showUniversity(university_url);
    reply(msg, result);
  });

  // 6. GetUniversityIDByName
  channel.consume('GetUniversityIDByName', async (msg) => {
    const { university_name } = JSON.parse(msg.content.toString());
    const partner = new Partner_user();
    const result = await partner.getUniversityID_name(university_name);
    reply(msg, result);
  });
}

// 응답 전송 함수 (RPC 방식)
function reply(msg, data) {
  channel.sendToQueue(
    msg.properties.replyTo,
    Buffer.from(JSON.stringify(data)),
    { correlationId: msg.properties.correlationId }
  );
  channel.ack(msg);
}

module.exports = { connectToRabbitMQ };