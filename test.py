from flask import Flask, Response
import feedgenerator
import requests

app = Flask(__name__)

# Parameters for the Zotero API
api_key = 'yQraJQogHA89BHu3VJBKXLha'
user_id = '9668586'
collection_id = '8PHW6BAG'


@app.route('/rss')
def generate_rss():
    # Zotero API URL
    api_url = f'https://api.zotero.org/users/{user_id}/collections/{collection_id}/items/top?key={api_key}'

    # Retrieve collection data from the Zotero API
    response = requests.get(api_url)
    data = response.json()

    # Create an RSS feed generator object
    feed = feedgenerator.Rss201rev2Feed(
        title='My Zotero Collection',
        link='https://www.example.com',
        description='RSS feed of my Zotero collection'
    )

    # Iterate over the collection items and add entries to the RSS feed
    for item in data:
        title = item['data'].get('title', 'Unknown Title')
        url = item['data'].get('url', '')
        description = item['data'].get('abstractNote', '')

        feed.add_item(
            title=title,
            link=url,
            description=description
        )

    # Generate the RSS feed in XML format
    rss_feed = feed.writeString('utf-8')

    # Return the response with the RSS content
    return Response(rss_feed, mimetype='application/rss+xml')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
