const { start } = require("repl");

const url = "https://github.com/orgs/nodejs/repositories?page=2";

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Agora parseamos a resposta como JSON
  })
  .then((data) => {
    const repositories = data.payload.repositories;
    repositories.forEach((repo) => {
      const formattedRepo = {
        repository: repo.name,
        status: repo.isFork ? "Forked" : "",
        url: `https://github.com/${repo.owner}/${repo.name}`,
        description: repo.description || "No description provided",
        tags: repo.tags,
        language: repo.language || "No language specified",
        forks: repo.forks,
        stars: repo.stars,
        issues: repo.issues,
        pullRequests: repo.pullRequests,
        lastUpdated: repo.lastUpdated,
      };
      console.log(formattedRepo);
    });
  })
  .catch((error) => {
    console.error("Houve um erro ao fazer a solicitação:", error);
  });
