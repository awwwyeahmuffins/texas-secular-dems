// Cloudflare Pages Function — finishes the GitHub OAuth login for Decap CMS.
// GitHub redirects back here with a code; we trade it for an access token and
// hand the token to the CMS popup using Decap's postMessage handshake.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing ?code from GitHub.", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();
  const provider = "github";

  const content = data.access_token
    ? `authorization:${provider}:success:${JSON.stringify({
        token: data.access_token,
        provider,
      })}`
    : `authorization:${provider}:error:${JSON.stringify({
        error: data.error_description || data.error || "Authentication failed",
      })}`;

  const body = `<!doctype html><html><body><script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(content)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:${provider}", "*");
  })();
  </script></body></html>`;

  return new Response(body, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
