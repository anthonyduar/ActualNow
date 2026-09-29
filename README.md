# 🚀 ActualNow | Portal de Noticias Deportivas con Arquitectura Headless

[Ver sitio en vivo 🌐](https://actualnow.vercel.app)

**ActualNow** es una plataforma de noticias deportivas de alto rendimiento diseñada para la inmediatez informativa y la cobertura en tiempo real. Como Licenciado en Comunicación Social, desarrollé este portal para fusionar el periodismo profesional con una arquitectura moderna Jamstack.

---

## 🎯 **¿Cómo funciona el flujo de trabajo?**
El proyecto combina un diseño visual optimizado con una separación total entre la gestión de contenidos y el código:

* **Diseño de Identidad Visual e Interfaz (Figma):** Ideé y diseñé originalmente la interfaz visual (UI/UX) en Figma, definiendo la identidad del sitio (paleta de colores y tipografía) para garantizar una experiencia de usuario limpia y moderna.
* **Traducción a Código (Google AI Studio - Build Mode):** Utilicé este entorno en la nube para transformar el diseño de Figma en el código base del portal con asistencia de IA integrada.
* **Desarrollo y Control de Versiones (VS Code + GitHub):** Refiné toda la lógica, los componentes (`components/`), las páginas dinámicas (`[slug]/`) y los estilos directamente en VS Code, gestionando los cambios con GitHub.
* **Gestión Editorial (WordPress + Pantheon):** Administro, redacto y publico las noticias directamente en WordPress alojado en Pantheon. Gracias a su integración entre su API REST y Next.js, cada artículo publicado actualiza el portal al instante.
* **Conexión y Despliegue Automatizado (Vercel):** Configuré la plataforma para conectarse a Vercel, lo que permite que tanto las actualizaciones de código desde GitHub como las nuevas publicaciones editoriales desde WordPress se desplieguen de forma totalmente automatizada.

---

## 🚀 Tecnologías Utilizadas

* **Frontend:** Next.js / React (App Router).
* **Estilos:** Tailwind CSS para un diseño responsivo y fluido.
* **IA:** Google AI Studio (Build Mode) para la estructuración y traducción de diseño a código.
* **Headless CMS / Backend:** WordPress (Pantheon) con REST API.
* **APIs e Integraciones:** Resultados de partidos de fútbol en tiempo real (`football-data.org`).
* **Control de Versiones y Hosting:** GitHub y Vercel para despliegue continuo.

---

## 🔒 Seguridad, Privacidad y Propiedad Intelectual

* **Protección de Credenciales:** Las claves de la API y variables sensibles están estrictamente protegidas mediante variables de entorno en Vercel y GitHub Secrets.
* **Derechos de Autor (Todos los derechos reservados):** © 2026 Anthony Duarte. Este repositorio y su código forman parte de un portafolio profesional y técnico. Queda estrictamente prohibida su reproducción, distribución, modificación o uso comercial sin la autorización previa y por escrito del autor.
