import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tu-dominio.com"; // <--- Pon tu URL real aquí
  const wpApi = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  try {
    const res = await fetch(`${wpApi}/posts?per_page=100`, {
      cache: "no-store",
    });
    const posts = await res.json();

    const postUrls = posts.map((post: any) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.modified),
    }));

    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/aviso-legal`, lastModified: new Date() },
      { url: `${baseUrl}/politica-de-privacidad`, lastModified: new Date() },
      { url: `${baseUrl}/politica-de-cookies`, lastModified: new Date() },
      ...postUrls,
    ];
  } catch (error) {
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
