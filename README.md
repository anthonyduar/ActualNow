# 🚀 ActualNow | Portal de Noticias Deportivas con Arquitectura Headless

[Ver sitio en vivo 🌐](https://tu-enlace-de-vercel.com)

**ActualNow** es una plataforma de noticias deportivas de alto rendimiento diseñada para la inmediatez informativa y la cobertura en tiempo real. Como Licenciado en Comunicación Social, desarrollé este portal para fusionar el periodismo profesional con una arquitectura moderna Jamstack.

---

## 🎯 ¿Cómo funciona el flujo de trabajo?

El proyecto combina un diseño visual optimizado con una separación total entre la gestión de contenidos y el código:

1. **Diseño UI/UX (Figma):** La interfaz visual y la estructura de componentes fueron ideadas y diseñadas originalmente en Figma para garantizar una experiencia de usuario limpia y moderna.
2. **Estructuración y Desarrollo Inicial (Google IDX):** Utilicé este entorno en la nube para transformar el diseño de Figma en código base mediante la asistencia de IA integrada.
3. **Desarrollo y Control de Versiones (VS Code + GitHub):** Refino toda la lógica, los componentes (`components/`), las páginas dinámicas (`[slug]/`) y los estilos directamente en VS Code, gestionando los cambios mediante GitHub.
4. **Gestión Editorial (WordPress + Pantheon):** Administro, redacto y publico las noticias directamente en WordPress alojado en Pantheon. Gracias a su integración mediante API REST y Next.js, cada artículo publicado actualiza el portal al instante.
5. **Despliegue Continuo (Vercel):** Toda la plataforma está conectada a Vercel, lo que permite que tanto las actualizaciones de código desde GitHub como las nuevas publicaciones editoriales desde WordPress se desplieguen y actualicen de forma totalmente automatizada.

---

## 🚀 Tecnologías Utilizadas

* **Frontend:** Next.js / React (App Router).
* **Estilos:** Tailwind CSS para un diseño responsivo y fluido.
* **Headless CMS / Backend:** WordPress (Pantheon) con REST API.
* **APIs e Integraciones:** Resultados de partidos de fútbol en tiempo real (`football-data.org`).
* **Control de Versiones y Hosting:** GitHub y Vercel.

---

## 🔒 Seguridad, Privacidad y Propiedad Intelectual

* **Protección de Credenciales:** Las claves de la API y variables sensibles están estrictamente protegidas mediante variables de entorno en Vercel y GitHub Secrets.
* **Derechos de Autor (Todos los derechos reservados):** © 2026 Anthony Duarte. Este repositorio y su código forman parte de un portafolio profesional y técnico. Queda estrictamente prohibida su reproducción, distribución, modificación o uso comercial sin la autorización previa y por escrito del autor.
