// Cloudflare Pages Function — starts the GitHub OAuth login for Decap CMS.
// Decap opens /auth in a popup; we hand the editor off to GitHub to authorize.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      "Missing GITHUB_CLIENT_ID. Set it in Cloudflare Pages → Settings → Environment variables.",
      { status: 500 }
    );
  }

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
  authorize.searchParams.set("scope", "repo,user");
  authorize.searchParams.set("state", crypto.randomUUID());

  return Response.redirect(authorize.toString(), 302);
}
