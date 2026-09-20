/**
 * Helper utilities for WordPress REST API integration.
 * Supports both standard 'posts' and custom 'noticias' post type,
 * as well as 'pages' and 'categories'.
 */

export function getWordPressBaseUrl(): string {
  let rawUrl =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.WORDPRESS_API_URL ||
    "https://dev-actual-now-site.pantheonsite.io/wp-json/wp/v2";
  if (!rawUrl) return "";

  // If the env var accidentally contains the variable name prefix (e.g. "NEXT_PUBLIC_...=https://...")
  if (rawUrl.includes("http")) {
    const httpIdx = rawUrl.indexOf("http");
    rawUrl = rawUrl.slice(httpIdx);
  }

  // Strip trailing slashes and any trailing /noticias or /posts if accidentally appended in config
  return rawUrl
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/(noticias|posts)$/, "");
}

/**
 * Fetch articles/entries. First tries custom post type '/noticias',
 * and falls back to standard '/posts' if '/noticias' returns 404 or is empty.
 */
export async function fetchWpNoticias(
  query: string = "",
  init: RequestInit = { cache: "no-store" }
): Promise<Response> {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const queryString = query
    ? query.startsWith("?")
      ? query
      : `?${query}`
    : "";

  try {
    const res = await fetch(`${baseUrl}/noticias${queryString}`, init);
    if (res.ok) {
      const clone = res.clone();
      const data = await clone.json();
      if (Array.isArray(data) && data.length > 0) {
        return res;
      }
      // If /noticias returned empty array, check if /posts has data
      if (Array.isArray(data) && data.length === 0) {
        try {
          const fallbackRes = await fetch(`${baseUrl}/posts${queryString}`, init);
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.clone().json();
            if (Array.isArray(fallbackData) && fallbackData.length > 0) {
              return fallbackRes;
            }
          }
        } catch {
          // ignore fallback error
        }
      }
      return res;
    }
  } catch (error) {
    // If /noticias network fails or 404s, try /posts
  }

  try {
    return await fetch(`${baseUrl}/posts${queryString}`, init);
  } catch {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Fetch a single post, noticia, or page by slug.
 */
export async function getPostOrNoticiaBySlug(slug: string) {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) return null;

  // 1. Try /noticias
  try {
    const res = await fetch(`${baseUrl}/noticias?_embed&slug=${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts) && posts.length > 0) {
        return posts[0];
      }
    }
  } catch {
    // continue
  }

  // 2. Try /posts
  try {
    const res = await fetch(`${baseUrl}/posts?_embed&slug=${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts) && posts.length > 0) {
        return posts[0];
      }
    }
  } catch {
    // continue
  }

  // 3. Try /pages as a fallback if the slug corresponds to a WordPress page
  try {
    const res = await fetch(`${baseUrl}/pages?_embed&slug=${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const pages = await res.json();
      if (Array.isArray(pages) && pages.length > 0) {
        return pages[0];
      }
    }
  } catch {
    // continue
  }

  return null;
}
