export function GET() {
  const baseUrl = "https://tu-dominio.com"; // <--- Pon tu URL real aquí
  const content = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
