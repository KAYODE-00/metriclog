'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
function readMins(words) {
  return Math.max(1, Math.round(words / 200));
}

export default function PostEditor({ initial, onSave, error }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [tags, setTags] = useState(initial?.tags?.map((t) => t.name).join(', ') || '');
  const [published, setPublished] = useState(initial?.published ?? false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const words = wordCount(content);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({ title, excerpt, content, tags, published });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs font-mono text-inksoft mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full font-display text-2xl font-medium border-b border-hairline pb-2 bg-transparent focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-inksoft mb-1">Excerpt (optional)</label>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Shown in the feed instead of an auto-generated preview"
          className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-inksoft mb-1">Tags (comma separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="attention, habits, notebooks"
          className="w-full border border-hairline rounded-sm px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-mono text-inksoft">Entry (Markdown supported)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs font-mono text-accent hover:underline"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div className="border border-hairline rounded-sm p-4 min-h-[300px] prose prose-neutral">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*Nothing to preview yet.*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write here. Blank lines separate paragraphs. Markdown works: **bold**, *italic*, ## headings, - lists."
            className="w-full min-h-[300px] border border-hairline rounded-sm p-4 text-[15px] leading-relaxed bg-transparent focus:outline-none focus:border-accent"
          />
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-mono text-inksoft">{words} words · {readMins(words)} min read</span>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-ink text-paper rounded-sm px-5 py-2.5 hover:bg-accent disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save entry'}
      </button>
    </form>
  );
}
