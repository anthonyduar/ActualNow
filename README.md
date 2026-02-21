# 🚀 ActualNow | Portal de Noticias y Deportes con Arquitectura Headless

**[Ver sitio en vivo 🌐](https://actualnow.vercel.app/)**

**ActualNow** es una plataforma de noticias de alto rendimiento diseñada para la inmediatez informativa. Como **Licenciado en Comunicación Social**, desarrollé este portal para unir el periodismo profesional con una arquitectura **Jamstack** moderna, permitiendo una carga ultra rápida y una gestión editorial eficiente.

---

## 🎯 ¿Cómo funciona? (El Proceso)

He diseñado un ecosistema donde la redacción y el código trabajan de forma independiente para maximizar el rendimiento:

1. **Gestión Editorial (WordPress Headless):** Utilizo WordPress (alojado en Pantheon) exclusivamente como panel de redacción profesional. Esto me permite escribir noticias, gestionar categorías y subir multimedia sin tocar el código.
2. **Consumo de Datos (API REST):** El frontend, desarrollado en **Next.js**, se conecta a la API de WordPress para extraer las noticias en tiempo real. He programado filtros inteligentes para segmentar el contenido (noticias destacadas, sección de fútbol y noticias generales).
3. **Desarrollo y Estética (VS Code):** Todo el diseño visual, el carrusel dinámico de noticias y la interfaz de usuario (UI/UX) han sido desarrollados en **VS Code** con asistencia de **Gemini AI**, utilizando **Tailwind CSS** para un estilo moderno y fluido.
4. **Automatización y Despliegue:** Gracias a la integración con **Vercel** y **GitHub**, el sitio se reconstruye automáticamente. La arquitectura está optimizada para que el contenido sea estático pero se actualice con cada nueva publicación.

---

## 🚀 Tecnologías Utilizadas

* **Frontend:** Next.js 14 / React (Lógica desarrollada con asistencia de **Gemini AI**).
* **Estilos:** Tailwind CSS (Responsive Design).
* **Headless CMS:** WordPress REST API.
* **Infraestructura:** [Vercel](https://actualnow.vercel.app/) para el hosting y Pantheon para el backend.
* **Lenguajes:** TypeScript / JavaScript.

---

## 🔒 Seguridad y Propiedad Intelectual

* **Blindaje de Credenciales:** La URL de la API y las claves de entorno están estrictamente protegidas en **Vercel** y **GitHub Secrets**, evitando cualquier acceso no autorizado al backend de WordPress.
* **Optimización Editorial:** Implementación de técnicas de caché y Static Site Generation (SSG) para garantizar la integridad del contenido frente a picos de tráfico.
* **⚠️ Aviso Legal y Licencia:** Este repositorio es para **exhibición de portafolio técnico y periodístico**. El código está bajo la licencia **GPL v3**. Se prohíbe su venta, uso comercial o redistribución sin la autorización expresa del autor.

---
*Desarrollado por [anthonyduar] - Integrando periodismo y tecnología avanzada.*
