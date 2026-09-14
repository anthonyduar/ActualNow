import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://actualnow.vercel.app";
  const wpApi = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  // 1. Definimos las páginas fijas e inmutables de tu web de noticias
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/aviso-legal`, lastModified: new Date() },
    { url: `${baseUrl}/politica-de-privacidad`, lastModified: new Date() },
    { url: `${baseUrl}/politica-de-cookies`, lastModified: new Date() },
  ];

  try {
    const res = await fetch(`${wpApi}/posts?per_page=100`, {
      cache: "no-store",
    });
    const posts = await res.json();

    // Validamos que la respuesta sea efectivamente un array válido antes de mapear
    const postUrls = Array.isArray(posts) 
      ? posts.map((post: any) => ({
          url: `${baseUrl}/${post.slug}`,
          lastModified: new Date(post.modified),
        }))
      : [];

    return [...staticPages, ...postUrls];
  } catch (error) {
    // CORRECCIÓN: Si falla la API, Google seguirá viendo tus URLs legales intactas
    return staticPages;
  }
}
