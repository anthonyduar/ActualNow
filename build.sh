#!/bin/bash

# Instalar dependencias de Node.js (si las tienes)
echo "--- Ejecutando npm install ---"
npm install

# Instalar dependencias de Python
echo "--- Ejecutando pip install ---"
pip install -r requirements.txt

# Ejecutar el script para generar el sitemap
echo "--- Generando sitemap con generate_sitemap.py ---"
python generate_sitemap.py

echo "--- Proceso de construcción completado ---"