export function GET() {
  const baseUrl = "https://actualnow.vercel.app"; // <-- AQUÍ ya puse tu link real
  const content = `User-agent: Twitterbot
Allow: /

User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
