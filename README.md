# metric — a blog

A full multi-author blog platform, built for **metric**: real accounts, real
sessions, drafts, published posts, tags, search, claps, and comments — the
Medium feature set, self-hosted on your own database.

## Stack

- **Next.js 14** (App Router)
- **PostgreSQL** via **Prisma**
- **NextAuth (Auth.js)** — email + password auth, hashed with bcrypt, JWT sessions
- **Tailwind CSS** for styling
- **react-markdown** for the post editor and rendering

## Features

- Sign up / log in / log out with hashed passwords (never stored in plain text)
- Write, edit, delete your own entries — anyone else's are read-only to you
- Draft vs. published state — drafts only show in your own dashboard
- Tags, tag pages, and full-text search across titles and content
- Claps (likes) and comments, both requiring login
- Public author profile pages
- Live word count / reading time on every entry, and a markdown preview toggle in the editor

## 1. Local setup

```bash
npm install
cp .env.example .env
```

You need a Postgres database. The fastest free option is
[Neon](https://neon.tech) or [Supabase](https://supabase.com) — both give you
a connection string in under a minute. Paste it into `.env` as `DATABASE_URL`.

Generate a session secret and put it in `.env` as `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Then create the database tables:

```bash
npx prisma migrate dev --name init
```

Run it:

```bash
npm run dev
```

Visit `http://localhost:3000`, click **Sign up**, create an account, then go
to **Dashboard → Write new entry**. Check "Published" to make it appear on
the homepage.

## 2. Deploying it for real

**Database:** if you used Neon/Supabase locally, you already have a
production-ready database — no change needed. Just make sure you're using
their pooled/production connection string.

**Hosting (Vercel is the path of least resistance):**

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. In the project's Environment Variables, add:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — the one you generated above
   - `NEXTAUTH_URL` — your production URL, e.g. `https://your-app.vercel.app`
     (you can add this after the first deploy once you know the URL, then redeploy)
4. Deploy. Vercel runs `npm install`, which triggers `prisma generate`
   automatically via the `postinstall` script.
5. **Run the migration against your production database once**, from your
   local machine, pointed at the same `DATABASE_URL` you gave Vercel:
   ```bash
   npx prisma migrate deploy
   ```

That's it — you'll have a live URL with real accounts and a real database.

## Project structure

```
app/
  page.js                    home feed
  post/[slug]/page.js         single entry (reading view)
  tag/[tag]/page.js           entries by tag
  author/[id]/page.js         public author profile
  search/page.js              search results
  login/, signup/             auth pages
  dashboard/                  your entries, protected
  dashboard/new/               write a new entry
  dashboard/edit/[id]/         edit one of yours
  api/                        route handlers (auth, signup, posts, likes, comments)
components/                   shared UI (Navbar, PostCard, PostEditor, etc.)
lib/                          prisma client, NextAuth config, slug helper
prisma/schema.prisma          database schema
```

## Notes on security

Passwords are hashed with bcrypt before they ever touch the database — the
database never sees or stores a plain-text password. Sessions are signed
JWTs. That said, this is a from-scratch auth implementation, not a managed
identity provider — for a project with sensitive data at stake, consider
layering on things like email verification, rate limiting on login/signup,
and 2FA before going further.

## Extending it

Natural next steps if you want to keep building:
- Image uploads for cover photos (e.g. via UploadThing or Cloudinary)
- Email verification and password reset (Resend + a token table)
- A richer WYSIWYG editor (Tiptap) instead of markdown
- Follow/following between authors
- RSS feed at `/feed.xml`
