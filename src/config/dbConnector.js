// //const k8s = require('@kubernetes/client-node');
// require('dotenv').config(); // .env 로딩

// async function getDatabasePool() {
//   // 환경 변수를 로컬에서 이미 .env로 읽었다면 생략 가능
//   if (process.env.NODE_ENV === 'development') {
//     console.log("🌱 Running in local dev mode - skipping k8s secret loading");
//     return;
//   }

//   const kc = new k8s.KubeConfig();
//   kc.loadFromDefault();
//   const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

//   const secretName = 'db-secret';
//   const namespace = 'default';

//   try {
//     const response = await k8sApi.readNamespacedSecret(secretName, namespace);
//     const toUTF = (val) => Buffer.from(val, 'base64').toString('utf-8');

//     process.env.DB_HOST = toUTF(response.body.data.DB_HOST);
//     process.env.DB_PORT = toUTF(response.body.data.DB_PORT);
//     process.env.DB_USER = toUTF(response.body.data.DB_USER);
//     process.env.DB_PW   = toUTF(response.body.data.DB_PW);
//     process.env.DB_NAME = toUTF(response.body.data.DB_NAME);

//     console.log("Loaded secrets from K8s");
//   } catch (err) {
//     console.error('rror reading secret from K8s:', err);
//     throw err;
//   }
// }

// module.exports = { getDatabasePool };
