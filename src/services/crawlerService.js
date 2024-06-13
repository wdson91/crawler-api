const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

async function repos(pageCount, organization) {
  const urls = Array.from(
    { length: pageCount },
    (_, i) =>
      `https://github.com/orgs/${organization}/repositories?page=${i + 1}`
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

  return Promise.all(fetchPromises)
    .then((allRepositories) => {
      const repositories = allRepositories.flat().map((repo) => {
        return {
          repository: repo.name,
          status: repo.type === "Public" ? "" : "Forked", // Verificando se é público ou não
          url: `https://github.com/${repo.owner}/${repo.name}`,
          description: repo.description || "",
          tags: repo.allTopics.join(", ") || "",
          language: repo.primaryLanguage ? repo.primaryLanguage.name : "",
          forks: repo.forksCount ? repo.forksCount.toString() : "",
          stars: repo.starsCount ? repo.starsCount.toString() : "",
          issues: repo.issueCount ? repo.issueCount.toString() : "",
          pullRequests: repo.pullRequestCount
            ? repo.pullRequestCount.toString()
            : "",
          lastUpdate: repo.lastUpdated.timestamp || "",
        };
      });

      return repositories;
    })
    .catch((error) => {
      console.error("Houve um erro ao fazer a solicitação:", error);
      return []; // Retorna um array vazio se houver erro
    });
}

async function startCrawler(organization) {
  const url = `https://github.com/${organization}`;
  const html = await rp(url);
  const $ = cheerio.load(html);

  const title = $("h1.h2.lh-condensed").text().trim();
  const avatar = $(".avatar.flex-shrink-0.mb-3.mr-3.mb-md-0.mr-md-4").attr(
    "src"
  );

  const urls = [];
  $("ul.d-md-flex.list-style-none.f6.has-blog li").each((index, element) => {
    const urlElement = $(element).find("a");
    const url = urlElement.attr("href");
    const description = urlElement.text().trim();

    if (url && description) {
      urls.push({ url, description });
    }
  });

  const topLanguages = [];
  $(
    "a.no-wrap.color-fg-muted.d-inline-block.Link--muted.mt-2 span[itemprop='programmingLanguage']"
  ).each((index, element) => {
    topLanguages.push($(element).text().trim());
  });

  const topTags = [];
  $("a.topic-tag.topic-tag-link").each((index, element) => {
    topTags.push($(element).text().trim());
  });

  const topUsers = [];
  $("a.member-avatar").each((index, element) => {
    const userHandle = $(element).attr("href").split("/").pop();
    topUsers.push(userHandle);
  });

  const repositories = await getPageCount(organization).then((pageCount) => {
    if (!pageCount) return "erro";
    return repos(pageCount, organization);
  });

  const pinnedRepositories = [];
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

  const result = {
    header: {
      title,
      avatar,
      urls: urls.slice(1, -1).map((urlObj) => urlObj.url),
    },
    topLanguages,
    topTags,
    topUsers,
    pinned: pinnedRepositories,
    repositories,
  };

  const jsonData = JSON.stringify(result, null, 2);
  return result;
}

async function getPageCount(organization) {
  return fetch(`https://github.com/orgs/${organization}/repositories?type=all`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      try {
        const payload = JSON.parse(data);
        return payload.payload.pageCount;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return;
      }
    })
    .catch((error) => {
      console.error("Ocorreu um erro ao fazer a solicitação:", error);
      return;
    });
}

module.exports = { startCrawler };
