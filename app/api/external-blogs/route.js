import { fetchMediumBlogs, fetchDevToBlogs, fetchRSSBlogs } from '@/lib/externalBlogs';
import { logger } from '@/lib/logger';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source'); // 'medium', 'devto', 'rss'
    const username = searchParams.get('username');
    const rssUrl = searchParams.get('rssUrl');
    const apiKey = searchParams.get('apiKey');

    logger.log('API_BLOGS', `Fetching blogs from ${source}`, { source, username });

    let blogs = [];

    if (source === 'medium' && username) {
      blogs = await fetchMediumBlogs(username);
    } else if (source === 'devto' && username && apiKey) {
      blogs = await fetchDevToBlogs(username, apiKey);
    } else if (source === 'rss' && rssUrl) {
      blogs = await fetchRSSBlogs(rssUrl);
    } else {
      return Response.json(
        { error: 'Invalid parameters. Provide source and required credentials.' },
        { status: 400 }
      );
    }

    logger.log('API_BLOGS', `Successfully fetched ${blogs.length} blogs`, { source });

    return Response.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    logger.error('API_BLOGS', 'Failed to fetch external blogs', error);
    return Response.json(
      { error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}
