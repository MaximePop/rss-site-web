// Fetch the RSS feed and render it
fetch('rss.xml')
  .then(response => response.text())
  .then(xml => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    const rssItems = xmlDoc.querySelectorAll('item');
    const rssFeedElement = document.getElementById('rss-feed');

    rssItems.forEach(item => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;

      const itemElement = document.createElement('div');
      itemElement.classList.add('item');

      const titleElement = document.createElement('div');
      titleElement.classList.add('title');
      titleElement.innerHTML = title;

      const linkElement = document.createElement('a');
      linkElement.classList.add('link');
      linkElement.href = link;
      linkElement.innerHTML = 'Read more';

      const descriptionElement = document.createElement('div');
      descriptionElement.classList.add('description');
      descriptionElement.innerHTML = description;

      itemElement.appendChild(titleElement);
      itemElement.appendChild(linkElement);
      itemElement.appendChild(descriptionElement);

      rssFeedElement.appendChild(itemElement);
    });
  })
  .catch(error => {
    console.error('Error fetching RSS feed:', error);
  });

  function search() {
    var searchTerm = document.getElementById("searchInput").value;
    var searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.innerHTML = "";

    // Flux RSS à rechercher
    var rssFeeds = [
        "https://versunjardin.hypotheses.org",
        "https://rouealivres.hypotheses.org",
        "https://olio.hypotheses.org",
        "https://estrades.hypotheses.org"
    ];

    // Parcourir les flux RSS
    rssFeeds.forEach(function(feedUrl) {
        fetch(feedUrl)
            .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, "text/xml");
                var items = xmlDoc.getElementsByTagName("item");

                // Parcourir les éléments des flux RSS
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var title = item.getElementsByTagName("title")[0].textContent;
                    var description = item.getElementsByTagName("description")[0].textContent;

                    // Vérifier si le terme de recherche est présent dans le titre ou la description
                    if (title.toLowerCase().includes(searchTerm.toLowerCase()) || description.toLowerCase().includes(searchTerm.toLowerCase())) {
                        var resultItem = document.createElement("div");
                        resultItem.innerHTML = "<h3>" + title + "</h3><p>" + description + "</p>";
                        searchResultsContainer.appendChild(resultItem);
                    }
                }
            })
            .catch(error => console.log("Erreur : " + error));
    });
}

