# EQUINET Ad Scenarios — one link, zero setup for MK / Faezeh / the manager

This version needs **one person (you)** to do a short one-time setup.
After that, everyone else just opens a link, clicks around, and it saves
automatically — no tokens, no config screens, nothing to enter.

How it works: the page talks to two small serverless functions
(`netlify/functions/data.js` and `save.js`) that hold the one GitHub
token as a secret — it's stored in Netlify's dashboard, never in the
code, never sent to anyone's browser.

## One-time setup (you only)

### 1. Push these files to a GitHub repo

Create a repo (public or private, doesn't matter for this version) and
upload everything in this folder, keeping the folder structure:
```
index.html
netlify.toml
equinet_database.csv
netlify/functions/data.js
netlify/functions/save.js
```

### 2. Create a GitHub personal access token

- Go to https://github.com/settings/tokens?type=beta
- **Generate new token**
- Repository access → **Only select repositories** → pick this repo
- Permissions → **Contents** → **Read and write**
- Generate, and copy the token somewhere safe (shown only once)

### 3. Create a Netlify account and connect the repo

- Go to https://app.netlify.com and sign up (free)
- **Add new site → Import an existing project**
- Connect your GitHub account, pick this repo
- Build settings: leave everything default (the `netlify.toml` in this
  repo already tells Netlify what to do) → click **Deploy**

### 4. Add the secret environment variables

- In your new Netlify site, go to **Site configuration → Environment variables**
- Add these:
  | Key | Value |
  |---|---|
  | `GITHUB_TOKEN` | the token from step 2 |
  | `GITHUB_OWNER` | your GitHub username or org |
  | `GITHUB_REPO` | the repo name from step 1 |
  | `GITHUB_BRANCH` | `main` |
  | `GITHUB_PATH` | `equinet_database.csv` |
- Go to **Deploys** → **Trigger deploy → Deploy site** (so it picks up the new variables)

### 5. Get your link

Netlify gives you a URL like `https://your-site-name.netlify.app`.
That's it — send **that one link** to MK, Faezeh, and the manager.

## What everyone else does

Opens the link. Clicks a card. Edits text or clicks an approve button.
It saves by itself. That's the entire experience — no accounts, no
tokens, no setup screens.

## Notes

- Every save is a GitHub commit behind the scenes, so you still get a
  full history/audit trail in the repo, even though nobody sees GitHub
  directly.
- If two people save at almost the same instant, the second save is
  rejected by GitHub; the app detects this, refreshes with the latest
  data, and asks that person to redo their edit. Rare in practice for a
  small review team, but worth knowing about.
- To change anything later (new ads, copy tweaks, styling), just push
  updated files to the GitHub repo — Netlify redeploys automatically.
