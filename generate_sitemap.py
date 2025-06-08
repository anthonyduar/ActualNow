import os
from datetime import datetime

# ====================================================================
# CAMBIO AQUI: output_file ahora apunta a 'static/sitemap.xml'
# ====================================================================
def generate_sitemap(base_url, output_file="static/sitemap.xml"):
    """Genera un sitemap XML básico para un sitio estático."""
    urls = []

    # Agrega las URLs de tus páginas principales aquí
    # Asegúrate de que las URLs sean absolutas y correctas para tu sitio en Vercel
    urls.append(base_url) # Tu página de inicio
    urls.append(f"{base_url}/about.html") # Ejemplo: si tienes una página "about.html"
    urls.append(f"{base_url}/contact.html") # Ejemplo: si tienes una página "contact.html"
    # Agrega más URLs de tus páginas estáticas aquí

    # Contenido del sitemap XML
    sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"""
    for url in urls:
        lastmod = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
        sitemap_content += f"""  <url>
    <loc>{url}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""
    sitemap_content += """</urlset>
"""

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    print(f"Sitemap generado en: {output_file}")

if __name__ == "__main__":
    # Reemplaza esta URL con la URL de tu sitio en Vercel
    your_vercel_url = "https://actualnow.vercel.app"
    generate_sitemap(your_vercel_url)