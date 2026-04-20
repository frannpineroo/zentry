# Zentry — Marketplace Inmobiliario

Zentry es una plataforma donde cualquiera puede publicar su propiedad o encontrar una, explorando directamente desde el mapa de Córdoba, Argentina.

🔗 [Ver en vivo](https://zentry-marketplace.vercel.app/)

---

## ¿Por qué lo hice?

Mientras me movía por los barrios de Córdoba notaba carteles de "Se vende" y "Se alquila" por todos lados. Me preguntaba cuánto alcance real tiene ese cartel. Eso me llevó a construir Zentry: un marketplace donde el punto de partida es el mapa, no una lista.

---

## Features

- 🗺️ Mapa interactivo con pines por propiedad
- 🔍 Filtros por operación, tipo de propiedad y ambientes
- 📸 Publicación de propiedades con fotos
- 📄 Página de detalle por propiedad
- 💬 Contacto directo con el dueño por WhatsApp
- 👤 Perfil de usuario editable
- 🔐 Autenticación con Supabase

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 15 | Framework frontend y backend |
| Supabase | Base de datos, autenticación y storage |
| Leaflet | Mapa interactivo |
| Vercel | Deploy |

---

## Instalación local

```bash
git clone https://github.com/tu-usuario/zentry.git
cd zentry
npm install
```

Creá un archivo `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

```bash
npm run dev
```

---

## Próximas mejoras

- Favoritos
- Actualizaciones en tiempo real con websockets
- Mejoras de interfaz

---

## Autor

Francisco Piñero — [LinkedIn](https://linkedin.com/in/frannpinero)
