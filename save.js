// netlify/functions/save.js
// Writes the updated CSV back to GitHub, using the same hidden token.
// The browser sends the full CSV text; this function fetches the current
// sha, then commits the new content.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

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
      body: JSON.stringify({ ok: false, error: "Server is missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars." }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Invalid JSON body" }) };
  }
  if (!payload.csv) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Missing csv field" }) };
  }

  const contentsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  try {
    // Get current sha (required by GitHub to update an existing file)
    const getRes = await fetch(`${contentsUrl}?ref=${GITHUB_BRANCH}`, { headers });
    if (!getRes.ok) {
      const text = await getRes.text();
      return { statusCode: getRes.status, body: JSON.stringify({ ok: false, error: "Could not read current file", detail: text }) };
    }
    const getData = await getRes.json();
    const sha = getData.sha;

    const encoded = Buffer.from(payload.csv, "utf-8").toString("base64");
    const putRes = await fetch(contentsUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: payload.message || "Update review data",
        content: encoded,
        branch: GITHUB_BRANCH,
        sha,
      }),
    });

    if (putRes.status === 409) {
      return { statusCode: 409, body: JSON.stringify({ ok: false, conflict: true }) };
    }
    if (!putRes.ok) {
      const text = await putRes.text();
      return { statusCode: putRes.status, body: JSON.stringify({ ok: false, error: "GitHub write failed", detail: text }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
