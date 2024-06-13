fetch("https://github.com/orgs/nodejs/repositories?type=all")
  .then((response) => response.text())
  .then((data) => {
    //console.log(data); // Aqui está o conteúdo da página
    payload = JSON.parse(data);
    console.log(payload.payload.pageCount);
    // Agora você pode analisar o conteúdo da página para extrair o payload desejado
  })
  .catch((error) => {
    console.error("Ocorreu um erro ao fazer a solicitação:", error);
  });
