const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const express = require('express');

const app = express();
const port = 3000;

const feedData = [
  {
    category: 'Jardin de la poésie',
    url: 'https://versunjardin.hypotheses.org/1606'
  },
  {
    category: 'Mais ou va le web?',
    url: 'https://maisouvaleweb.fr/sabotage-petite-histoire-de-la-destruction-des-moyens-de-production/'
  },
  {
    category: 'La roue à livres',
    url: 'https://rouealivres.hypotheses.org/3176'
  },
  {
    category: 'Olio',
    url: 'https://olio.hypotheses.org/1051'
  },
  {
    category: 'Estrades',
    url: 'https://estrades.hypotheses.org/460'
  },
  {
    category: 'Chaîne vidéo officielle',
    url: 'https://e-diffusion.uha.fr/video/5514-valoriser-lheritage-culturel-hors-des-murs-des-institutions-experimenter-le-patrimoine-vitre-aubois-mars-2023/'
  }
];

const fetchAndProcess = async (url, category) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const { document } = dom.window;

    const itemTitleElement = document.querySelector('meta[property="og:title"]');
    const itemDescriptionElement = document.querySelector('meta[property="og:description"]');
    const itemLinkElement = document.querySelector('meta[property="og:url"]');

    if (!itemTitleElement || !itemDescriptionElement || !itemLinkElement) {
      console.error(`Error parsing URL: ${url}`);
      console.error('Required HTML elements not found.');
      return null;
    }

    const itemTitle = itemTitleElement.getAttribute('content');
    const itemDescription = itemDescriptionElement.getAttribute('content');
    const itemLink = itemLinkElement.getAttribute('content');
    const itemPubDate = new Date().toUTCString();

    const rssItem = `
      <item>
        <title>${itemTitle}</title>
        <link>${itemLink}</link>
        <description>${itemDescription}</description>
        <pubDate>${itemPubDate}</pubDate>
        <category>${category}</category>
      </item>
    `;

    return rssItem;
  } catch (error) {
    console.error(`Error fetching URL: ${url}`);
    console.error(error);
    return null;
  }
};

const generateRSS = async () => {
  const rssItems = await Promise.all(feedData.map((item) => fetchAndProcess(item.url, item.category)));
  const filteredItems = rssItems.filter(item => item !== null);

  const rssTemplate = `
    <rss version="2.0">
      <channel>
        <title>Automatic RSS Feeds</title>
        <link>https://example.com/rss</link>
        <description>Automatically generated RSS feeds</description>
        ${filteredItems.join('\n')}
      </channel>
    </rss>
  `;

  return rssTemplate;
};

app.get('/rss', async (req, res) => {
  const rss = await generateRSS();

  // Save the generated RSS to a file
  fs.writeFileSync('rss.xml', rss);

  res.set('Content-Type', 'text/xml');
  res.send(rss);
});

// Default route
app.get('/', (req, res) => {
  res.send('RSS Generator is running. Access the generated RSS feed at /rss.');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
