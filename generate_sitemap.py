# -*- coding: utf-8 -*-
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import os

# --- Configuración ---
# URL base de tu instalación de WordPress local (donde está la API REST)
WORDPRESS_LOCAL_URL = "http://actualnow.local"
# URL de tu sitio desplegado en Vercel
VERCEL_SITE_URL = "https://actualnow.vercel.app"
# Ruta donde se guardará el sitemap dentro de tu proyecto
SITEMAP_OUTPUT_PATH = "static/sitemap.xml"
# Ruta donde se guardará el XSL para la visualización del sitemap
SITEMAP_XSL_PATH = "static/wp-sitemap-index.xsl"

# URL de la API REST de WordPress para posts y páginas
POSTS_API_URL = f"{WORDPRESS_LOCAL_URL}/wp-json/wp/v2/posts"
PAGES_API_URL = f"{WORDPRESS_LOCAL_URL}/wp-json/wp/v2/pages"

# Contenido del archivo XSL para la visualización del sitemap (copia del nativo de WP)
# Esto es para que el sitemap se vea bien en el navegador
WP_SITEMAP_XSL_CONTENT = """<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title>Mapa del sitio XML</title>
                <style type="text/css">
                    body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #525252; }
                    a { color: #0073aa; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    table { width: 100%; border: none; border-collapse: collapse; }
                    th { text-align: left; padding: 5px; background-color: #eee; }
                    td { padding: 5px; border-bottom: 1px solid #ddd; }
                    .container { margin: 0 auto; max-width: 900px; }
                    .header { background-color: #f7f7f7; padding: 20px; border-bottom: 1px solid #eee; }
                    .footer { background-color: #f7f7f7; padding: 20px; border-top: 1px solid #eee; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Mapa del sitio XML</h1>
                        <p>Este mapa de sitio XML es generado por WordPress para hacer que tu contenido sea más visible para los motores de búsqueda.</p>
                        <p><a href="https://developer.wordpress.org/wp-sitemaps/">Aprende más sobre los mapas del sitio XML</a></p>
                    </div>
                    <div class="content">
                        <xsl:choose>
                            <xsl:when test="sitemapindex">
                                <p>Número de URLs en este mapa del sitio XML: <xsl:value-of select="count(sitemapindex/sitemap)"/></p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>URL</th>
                                            <th>Última modificación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <xsl:for-each select="sitemapindex/sitemap">
                                            <tr>
                                                <td><a href="{loc}"><xsl:value-of select="loc"/></a></td>
                                                <td><xsl:value-of select="lastmod"/></td>
                                            </tr>
                                        </xsl:for-each>
                                    </tbody>
                                </table>
                            </xsl:when>
                            <xsl:when test="urlset">
                                <p>Número de URLs en este mapa del sitio XML: <xsl:value-of select="count(urlset/url)"/></p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>URL</th>
                                            <th>Prioridad</th>
                                            <th>Última modificación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <xsl:for-each select="urlset/url">
                                            <tr>
                                                <td><a href="{loc}"><xsl:value-of select="loc"/></a></td>
                                                <td><xsl:value-of select="priority"/></td>
                                                <td><xsl:value-of select="lastmod"/></td>
                                            </tr>
                                        </xsl:for-each>
                                    </tbody>
                                </table>
                            </xsl:when>
                        </xsl:choose>
                    </div>
                    <div class="footer">
                        <p>Generado por WordPress</p>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
"""

def fetch_all_items(api_url):
    """
    Fetches all items (posts or pages) from the WordPress REST API, handling pagination.
    """
    all_items = []
    page = 1
    while True:
        try:
            # Eliminar '&status=publish' que causaba el 400 Bad Request
            response = requests.get(f"{api_url}?page={page}&per_page=100", verify=False)
            response.raise_for_status() # Lanza una excepción para errores HTTP (4xx o 5xx)

            items = response.json()
            if not items:
                # Si la página está vacía, no hay más elementos
                break

            all_items.extend(items)
            page += 1
        except requests.exceptions.RequestException as e:
            # Aquí manejamos el error específico "rest_post_invalid_page_number"
            if isinstance(e, requests.exceptions.HTTPError) and e.response.status_code == 400:
                try:
                    error_response = e.response.json()
                    if error_response and error_response.get('code') == 'rest_post_invalid_page_number':
                        print(f"DEBUG: No hay más páginas para {api_url}. Deteniendo la paginación de forma limpia.")
                        break # Salir del bucle, ya no hay más páginas válidas
                except ValueError: # En caso de que la respuesta no sea un JSON válido
                    pass # Continuar con el manejo general del error

            print(f"Error al conectar con la API REST de WordPress en {api_url}: {e}")
            print("Asegúrate de que tu WordPress local esté funcionando y la API REST sea accesible.")
            return [] # Retorna lista vacía en caso de otros errores

    return all_items

def generate_sitemap():
    """
    Generates the sitemap.xml by fetching posts and pages from WordPress REST API.
    """
    print("Iniciando la generación del sitemap...")

    # Crear el elemento raíz del sitemap
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Añadir referencia al XSL para visualización en navegador
    urlset.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    urlset.set("xsi:schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd")
    # Añadir la instrucción de procesamiento para el XSL
    urlset.insert(0, ET.ProcessingInstruction("xml-stylesheet", f'type="text/xsl" href="{VERCEL_SITE_URL}/wp-sitemap-index.xsl"'))


    # --- Añadir la página principal ---
    now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")
    url_home = ET.SubElement(urlset, "url")
    ET.SubElement(url_home, "loc").text = VERCEL_SITE_URL
    ET.SubElement(url_home, "lastmod").text = now
    ET.SubElement(url_home, "priority").text = "1.0"

    # --- Obtener y añadir posts ---
    print(f"Obteniendo posts desde {POSTS_API_URL}...")
    posts = fetch_all_items(POSTS_API_URL)
    for post in posts:
        link = post['link'].replace(WORDPRESS_LOCAL_URL, VERCEL_SITE_URL)
        modified_date = post['modified_gmt'].replace("Z", "+00:00") # Formato GMT
        url_elem = ET.SubElement(urlset, "url")
        ET.SubElement(url_elem, "loc").text = link
        ET.SubElement(url_elem, "lastmod").text = modified_date
        ET.SubElement(url_elem, "priority").text = "0.8" # Prioridad para posts

    print(f"Se encontraron {len(posts)} posts.")

    # --- Obtener y añadir páginas ---
    print(f"Obteniendo páginas desde {PAGES_API_URL}...")
    pages = fetch_all_items(PAGES_API_URL)
    for page in pages:
        link = page['link'].replace(WORDPRESS_LOCAL_URL, VERCEL_SITE_URL)
        modified_date = page['modified_gmt'].replace("Z", "+00:00") # Formato GMT
        url_elem = ET.SubElement(urlset, "url")
        ET.SubElement(url_elem, "loc").text = link
        ET.SubElement(url_elem, "lastmod").text = modified_date
        ET.SubElement(url_elem, "priority").text = "0.7" # Prioridad para páginas

    print(f"Se encontraron {len(pages)} páginas.")

    # Crear el árbol XML
    tree = ET.ElementTree(urlset)
    # Formatear el XML con indentación
    ET.indent(tree, space="  ", level=0)

    # Asegurarse de que la carpeta 'static' exista
    os.makedirs(os.path.dirname(SITEMAP_OUTPUT_PATH), exist_ok=True)

    # Guardar el sitemap
    try:
        tree.write(SITEMAP_OUTPUT_PATH, encoding="UTF-8", xml_declaration=True)
        print(f"Sitemap generado y guardado correctamente en: {SITEMAP_OUTPUT_PATH}")
    except Exception as e:
        print(f"Error al escribir el sitemap: {e}")

    # Guardar el archivo XSL para la visualización
    try:
        with open(SITEMAP_XSL_PATH, "w", encoding="UTF-8") as f:
            f.write(WP_SITEMAP_XSL_CONTENT)
        print(f"Archivo XSL para sitemap guardado en: {SITEMAP_XSL_PATH}")
    except Exception as e:
        print(f"Error al escribir el archivo XSL: {e}")

if __name__ == "__main__":
    generate_sitemap()