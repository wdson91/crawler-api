const cheerio = require("cheerio");

const pinnedRepositories = [];

const url = "https://github.com/nodejs"; // URL da página com repositórios fixados

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load page");
    }
    return response.text();
  })
  .then((html) => {
    const $ = cheerio.load(html);

    $("li.pinned-item-list-item").each((index, element) => {
      const repoElement = $(element);
      const repository = repoElement.find("span.repo").text().trim();
      const url =
        "https://github.com" + repoElement.find("a.text-bold").attr("href");
      const description = repoElement.find("p.pinned-item-desc").text().trim();
      const language = repoElement
        .find("span[itemprop='programmingLanguage']")
        .text()
        .trim();
      const stars = repoElement.find("a[href$='/stargazers']").text().trim(); // Ajustado para pegar o texto correto      const forks = repoElement.find("a[aria-label='forks'] svg").text().trim();
      const forks = repoElement.find("a[href$='/forks']").text().trim(); // Ajustado para pegar o texto correto
      pinnedRepositories.push({
        repository,
        url,
        description,
        language,
        stars,
        forks,
      });
    });

    console.log(pinnedRepositories);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
