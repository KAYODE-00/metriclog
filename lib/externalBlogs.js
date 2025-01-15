// Fetch articles from Medium RSS feed
export async function fetchMediumBlogs(username) {
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`
    );

    if (!response.ok) {
      throw new Error(`Medium API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map((item) => ({
      id: item.guid,
      title: item.title,
      excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 200),
      content: item.content || item.description,
      coverImage: item.thumbnail || null,
      url: item.link,
      author: item.author,
      published: true,
      createdAt: new Date(item.pubDate),
      tags: item.categories || [],
    }));
  } catch (error) {
    console.error('Error fetching Medium blogs:', error);
    return [];
  }
}

// Fetch from DEV.to API
export async function fetchDevToBlogs(username, apiKey) {
  try {
    const response = await fetch(
      `https://dev.to/api/articles?username=${username}`,
      {
        headers: {
          'api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`DEV.to API error: ${response.status}`);
    }

    const articles = await response.json();

    return articles.map((article) => ({
      id: article.id.toString(),
      title: article.title,
      excerpt: article.description,
      content: article.body_markdown,
      coverImage: article.cover_image,
      url: article.url,
      author: article.user.name,
      published: article.published,
      createdAt: new Date(article.published_at),
      tags: article.tag_list,
    }));
  } catch (error) {
    console.error('Error fetching DEV.to blogs:', error);
    return [];
  }
}

// Fetch from RSS feed (generic)
export async function fetchRSSBlogs(rssUrl) {
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    );

    if (!response.ok) {
      throw new Error(`RSS API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map((item) => ({
      id: item.guid,
      title: item.title,
      excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 200),
      content: item.content || item.description,
      coverImage: item.thumbnail || null,
      url: item.link,
      author: item.author,
      published: true,
      createdAt: new Date(item.pubDate),
      tags: item.categories || [],
    }));
  } catch (error) {
    console.error('Error fetching RSS blogs:', error);
    return [];
  }
}
