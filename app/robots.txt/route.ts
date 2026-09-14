export function GET() {
  const baseUrl = "https://actualnow.vercel.app";
  const content = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}