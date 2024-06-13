const { get } = require("request");

function repos() {
  const url = "https://github.com/orgs/nodejs/repositories?page=2,";
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      payload = JSON.parse(data);
      console.log(payload.payload.repositories);
      repoNames = payload.payload.repositories.map((repo) => repo.name);

      // Aqui você pode processar os dados recebidos
    })
    .catch((error) => {
      console.error("Houve um erro ao fazer a solicitação:", error);
    });
}

function getPageCount() {
  fetch("https://github.com/orgs/nodejs/repositories?type=all")
    .then((response) => response.text())
    .then((data) => {
      //console.log(data); // Aqui está o conteúdo da página
      payload = JSON.parse(data);
      numOfPages = payload.payload.pageCount;
      console.log(payload.payload.pageCount);
      return numOfPages;
      // Agora você pode analisar o conteúdo da página para extrair o payload desejado
    })
    .catch((error) => {
      console.error("Ocorreu um erro ao fazer a solicitação:", error);
    });
}

repos(getPageCount());
