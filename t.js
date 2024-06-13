// Importar a biblioteca 'cheerio' para análise de HTML
const cheerio = require("cheerio");

// Função para extrair o pageCount do HTML
function getPageCount(data) {
  try {
    const $ = cheerio.load(data);
    const pageCount = $(".paginate-container").find("a").length;
    return pageCount;
  } catch (error) {
    console.error("Erro ao analisar o pageCount:", error);
    return 0;
  }
}

// Função para construir a URL da próxima página
function buildNextPageUrl(baseUrl, nextPage) {
  return `https://github.com/orgs/nodejs/repositories?#${nextPage}`;
}

// Função para buscar todas as páginas
async function fetchAllPages(baseUrl) {
  let currentPage = 1;
  const pageCount = getPageCount(await (await fetch(baseUrl)).text());

  const allPagesData = [];

  while (currentPage <= pageCount) {
    const url = buildNextPageUrl(baseUrl, currentPage);
    try {
      const response = await fetch(url);
      const data = await response.text();
      allPagesData.push(data);
    } catch (error) {
      console.error(`Erro ao buscar a página ${currentPage}:`, error);
    }

    currentPage++;
  }

  return allPagesData;
}

// URL base
const baseUrl = "https://github.com/orgs/nodejs/repositories?type=all";

// Buscar todas as páginas e lidar com os dados
fetchAllPages(baseUrl)
  .then((allPagesData) => {
    // Aqui você tem todos os dados de todas as páginas
    console.log(allPagesData);
  })
  .catch((error) => {
    console.error("Ocorreu um erro ao buscar todas as páginas:", error);
  });
