// netlify/functions/data.js
// Reads equinet_database.csv from GitHub using a secret token that only
// lives in Netlify's environment variables — never sent to the browser.

exports.handler = async function () {
  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "main",
    GITHUB_PATH = "equinet_database.csv",
  } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server is missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars." }),
    };
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}?ref=${GITHUB_BRANCH}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: "GitHub read failed", detail: text }) };
    }
    const data = await res.json();
    const csv = Buffer.from(data.content, "base64").toString("utf-8");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
