import os
import requests
from datetime import datetime

# ====================================================================
# output_file ahora apunta a 'static/sitemap.xml'
# ====================================================================
def generate_sitemap(wordpress_sitemap_url, output_file, local_domain, vercel_domain):
    """
    Descarga el sitemap XML desde la URL de tu WordPress local,
    reemplaza las URLs locales por las de Vercel,
    y lo guarda en la ruta de salida especificada.
    """
    print(f"Intentando descargar sitemap desde: {wordpress_sitemap_url}")
    try:
        response = requests.get(wordpress_sitemap_url, verify=False) 
        response.raise_for_status()

        sitemap_content = response.text

        # --- CAMBIO CLAVE AQUI: Reemplazar URLs locales por las de Vercel ---
        # Reemplazamos ambas versiones (http y https) de la URL local por la de Vercel.
        sitemap_content = sitemap_content.replace(f"http://{local_domain}", f"https://{vercel_domain}")
        sitemap_content = sitemap_content.replace(f"https://{local_domain}", f"https://{vercel_domain}")

        # Asegúrate de que el directorio de salida exista
        output_dir = os.path.dirname(output_file)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Guarda el contenido modificado en el archivo de salida
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(sitemap_content)
        print(f"Sitemap descargado, URLs actualizadas y guardado en: {output_file}")

    except requests.exceptions.RequestException as e:
        print(f"Error al descargar el sitemap desde {wordpress_sitemap_url}: {e}")
        print("Asegúrate de que tu WordPress local esté funcionando y el sitemap sea accesible en esa URL.")
        print("Si usas HTTPS en local, este error puede ocurrir por un certificado autofirmado.")
    except Exception as e:
        print(f"Error general al procesar el sitemap: {e}")

if __name__ == "__main__":
    # --- CONFIGURACION DE URLS ---
    # URL completa del sitemap de tu WordPress LOCAL
    local_wordpress_sitemap_source_url = "http://actualnow.local/wp-sitemap.xml" 
    
    # Tu dominio local (sin http/https)
    your_local_domain = "actualnow.local" 
    
    # Tu dominio en Vercel (sin http/https)
    your_vercel_domain = "actualnow.vercel.app" 

    # Ruta donde el sitemap final se guardará en tu proyecto estático
    output_sitemap_destination_path = "static/sitemap.xml" 

    generate_sitemap(local_wordpress_sitemap_source_url, 
                     output_sitemap_destination_path,
                     your_local_domain, 
                     your_vercel_domain)