const rp = require("request-promise");
const cheerio = require("cheerio");

async function startCrawler(id, organization) {
  const url = `https://github.com/${organization}`;
  const html = await rp(url);
  const $ = cheerio.load(html);

  // Extrair título
  const title = $("h1.h2.lh-condensed").text().trim();

  // Extrair URL do avatar
  const avatar = $(".avatar.flex-shrink-0.mb-3.mr-3.mb-md-0.mr-md-4").attr(
    "src"
  );

  // Extrair URLs associados e descrições
  const urls = [];
  $("ul.d-md-flex.list-style-none.f6.has-blog li").each((index, element) => {
    const urlElement = $(element).find("a");
    const url = urlElement.attr("href");
    const description = urlElement.text().trim();

    if (url && description) {
      urls.push({ url, description });
    }
  });

  // Extrair topLanguages
  const topLanguages = [];
  $(
    "a.no-wrap.color-fg-muted.d-inline-block.Link--muted.mt-2 span[itemprop='programmingLanguage']"
  ).each((index, element) => {
    topLanguages.push($(element).text().trim());
  });

  // Extrair topTags
  const topTags = [];
  $("a.topic-tag.topic-tag-link").each((index, element) => {
    topTags.push($(element).text().trim());
  });

  // Extrair topUsers
  const topUsers = [];
  $("a.member-avatar").each((index, element) => {
    const userHandle = $(element).attr("href").split("/").pop();
    topUsers.push(userHandle);
  });

  // Montar objeto de resultado
  const result = {
    header: {
      title: title,
      avatar: avatar,
      urls: urls.slice(1, -1),
    },
    topLanguages: topLanguages,
    topTags: topTags,
    topUsers: topUsers,
  };

  // Extrair repositórios fixados
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

    console.log($(repoElement));
    const forks = repoElement.find("a[aria-label='forks']").text().trim();

    pinnedRepositories.push({
      repository,
      url,
      description,
      language,
      stars,
      forks,
    });
  });

  // const newResult = new Result({ requestId: id, data: result });
  // await newResult.save();
}

startCrawler("2", "nodejs");
