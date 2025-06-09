<?xml version="1.0" encoding="UTF-8"?>
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
