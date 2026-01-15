'use client';

import { useState } from 'react';

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M12 2v4m0 12v4M4.22 4.22l2.83 2.83m8.9 8.9l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m8.9-8.9l2.83-2.83" />
    </svg>
  );
}

export default function ImportExternalBlogs() {
  const [source, setSource] = useState('medium');
  const [username, setUsername] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [blogs, setBlogs] = useState([]);

  async function handleFetchBlogs(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let url = `/api/external-blogs?source=${source}`;

      if (source === 'medium' && username) {
        url += `&username=${username}`;
      } else if (source === 'devto' && username && apiKey) {
        url += `&username=${username}&apiKey=${apiKey}`;
      } else if (source === 'rss' && rssUrl) {
        url += `&rssUrl=${encodeURIComponent(rssUrl)}`;
      } else {
        setError('Please fill in required fields for the selected source');
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch blogs');
        setLoading(false);
        return;
      }

      setBlogs(data.blogs);
      setSuccess(`Successfully fetched ${data.count} blogs!`);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">
          Import External Blogs
        </h1>
        <p className="text-inksoft">Fetch blogs from Medium, DEV.to, or any RSS feed</p>
      </div>

      {/* Form */}
      <form onSubmit={handleFetchBlogs} className="space-y-6 bg-accentsoft p-6 rounded-sm">
        {/* Source Selection */}
        <div>
          <label className="block text-xs font-mono text-inksoft mb-2 uppercase">
            Select Source
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'medium', label: 'Medium' },
              { value: 'devto', label: 'DEV.to' },
              { value: 'rss', label: 'RSS Feed' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSource(option.value)}
                className={`px-4 py-2 rounded-sm border text-sm font-semibold transition ${
                  source === option.value
                    ? 'bg-accent text-paper border-accent'
                    : 'border-hairline text-ink hover:border-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medium */}
        {source === 'medium' && (
          <div>
            <label className="block text-xs font-mono text-inksoft mb-2 uppercase">
              Medium Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., john_doe (without @)"
              className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {/* DEV.to */}
        {source === 'devto' && (
          <>
            <div>
              <label className="block text-xs font-mono text-inksoft mb-2 uppercase">
                DEV.to Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., johndoe"
                className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-inksoft mb-2 uppercase">
                DEV.to API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Get your API key from dev.to/settings/account"
                className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent focus:outline-none focus:border-accent"
              />
            </div>
          </>
        )}

        {/* RSS Feed */}
        {source === 'rss' && (
          <div>
            <label className="block text-xs font-mono text-inksoft mb-2 uppercase">
              RSS Feed URL
            </label>
            <input
              type="url"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex gap-3 p-3 bg-red-50 border border-danger rounded-sm">
            <AlertIcon />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-paper py-2.5 rounded-sm font-semibold hover:bg-ink transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <SpinIcon />
              Fetching...
            </>
          ) : (
            'Fetch Blogs'
          )}
        </button>
      </form>

      {/* Success */}
      {success && (
        <div className="flex gap-3 p-4 bg-green-50 border border-accent rounded-sm">
          <CheckIcon />
          <p className="text-sm text-accent">{success}</p>
        </div>
      )}

      {/* Blogs List */}
      {blogs.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Fetched Blogs ({blogs.length})
          </h2>
          <div className="space-y-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="border border-hairline rounded-sm p-4 space-y-2">
                <h3 className="font-semibold text-ink">{blog.title}</h3>
                <p className="text-sm text-inksoft line-clamp-2">{blog.excerpt}</p>
                <div className="flex gap-2 text-xs text-inksoft">
                  <span>By {blog.author}</span>
                  <span>•</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                {blog.url && (
                  <a
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    Read on source →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
