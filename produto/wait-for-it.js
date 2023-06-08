const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'clientes',
  brokers: ['kafka1:9092', 'kafka2:9092', 'kafka3:9092']
});

const interval_id = setInterval(async () => {
  try {
    await kafka.admin().connect();
    await kafka.admin().disconnect();
    clearInterval(interval_id)
    process.exit(0)
  } catch(err) {
    //
  }
}, 5000);