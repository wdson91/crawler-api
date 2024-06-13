function repos(pageCount) {
  const urls = Array.from(
    { length: pageCount },
    (_, i) => `https://github.com/orgs/nodejs/repositories?page=${i + 1}`
  );

  const fetchPromises = urls.map((url) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => data.payload.repositories)
      .catch((error) => {
        console.error("Houve um erro ao fazer a solicitação:", error);
        return []; // Retorna um array vazio se houver erro
      });
  });

  Promise.all(fetchPromises)
    .then((allRepositories) => {
      const repositories = allRepositories.flat(); // Aplanha a matriz de matrizes
      console.log(repositories);
      // Aqui você pode processar os dados recebidos
    })
    .catch((error) => {
      console.error("Houve um erro ao fazer a solicitação:", error);
    });
}

// Exemplo de uso:

function getPageCount() {
  return fetch("https://github.com/orgs/nodejs/repositories?type=all")
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

getPageCount().then((pageCount) => {
  repos(pageCount);
});
