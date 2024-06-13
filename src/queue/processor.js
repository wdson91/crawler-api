const axios = require('axios');
const cheerio = require('cheerio');
const crawlerQueue = require('./queue');

async function processCrawlerJob(job) {
  const { url } = job.data;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Processar o HTML conforme necessário
    const title = $('title').text();
    console.log(`Title of ${url}:`, title);

    // Retornar o resultado do processamento
    return { url, title };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    throw error; // Indicar falha no job
  }
}

// Definir o processador da fila
crawlerQueue.process(processCrawlerJob);

crawlerQueue.on('completed', (job, result) => {
  console.log(`Job completed with result:`, result);
});

crawlerQueue.on('failed', (job, error) => {
  console.error(`Job failed with error:`, error);
});
