const Queue = require("bull");

// Conectar à instância do Redis
const crawlerQueue = new Queue("crawlerQueue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

module.exports = crawlerQueue;
