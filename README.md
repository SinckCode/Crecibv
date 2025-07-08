# 🌐 CRECIBV - Sitio Web Institucional

**Centro de Recursos Educativos para Ciegos y Débiles Visuales A.C.**  
Autor: Ángel David Onesto Frías  
Fecha de finalización: Julio 2025  
Enlace en producción: [https://crecibv.web.app](https://crecibv.web.app)

---

## 🧭 Introducción

Este proyecto fue desarrollado como una iniciativa personal y benéfica para apoyar a CRECIBV, una organización que trabaja en favor de personas con discapacidad visual. Se diseñó un sitio web institucional moderno, accesible, visualmente atractivo y completamente editable mediante un panel administrativo protegido por autenticación.

---

## 🎯 Objetivo General

Diseñar e implementar un sitio web institucional funcional y accesible que permita:

- Difundir las actividades de la organización.
- Facilitar la captación de donaciones.
- Ofrecer una plataforma de administración de contenido amigable.

---

## 🎯 Objetivos Específicos

- Implementar un frontend moderno y responsive.
- Desarrollar un dashboard administrativo con login seguro.
- Utilizar Firebase para hosting, autenticación, almacenamiento y base de datos.
- Integrar formularios funcionales y administración dinámica de contenido.

---

## 🎨 Identidad Visual

- **Colores principales**:  
  Rosa (`#ef0381`), blanco, negro, matices de púrpura.
- **Tipografía**: Poppins
- **Estilo general**: Profesional, accesible, moderno y cálido.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología        | Uso principal                         |
|------------------|----------------------------------------|
| React.js         | Desarrollo del frontend                |
| SCSS             | Estilos visuales responsivos           |
| Firebase Hosting | Despliegue del sitio web               |
| Firebase Auth    | Login seguro para panel administrativo |
| Firebase Storage | Gestión de imágenes                    |
| Firebase Firestore | Almacenamiento de usuarios y mensajes |

---

## 🗂️ Estructura del Proyecto

```
crecibv/
├── assets/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Slider.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── Donaciones.jsx
├── admin/
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── Messages.jsx
│   ├── UploadImages.jsx
├── firebase.js
├── App.js
├── index.js
├── styles/
│   └── global.scss
```

---

## 🌍 Sitio Web Público

### Secciones implementadas:

- **Inicio**: Carrusel de imágenes con transición cada 3 segundos.
- **Acerca de Nosotros**: Efecto tipo libro al hacer scroll + botón flotante para volver arriba.
- **Servicios**: Carrusel visual con las tarjetas de servicios del centro.
- **Contacto**: Formulario funcional que envía los datos al panel admin.
- **Ubicación**: Mapa interactivo y datos de contacto.
- **Pie de Página**: Datos de contacto y derechos reservados.

---

## 🔐 Panel Administrativo

El panel permite modificar todo el contenido del sitio de forma intuitiva. Incluye:

| Sección               | Funcionalidad                                                 |
|-----------------------|---------------------------------------------------------------|
| Dashboard             | Bienvenida personalizada con nombre y foto                    |
| Registrar Usuarios    | Alta de nuevos administradores                                |
| Administrar Usuarios  | Lista editable con opción de eliminar                         |
| Ver Mensajes          | Visualización de mensajes recibidos del formulario            |
| Administrar Imágenes  | Subida y eliminación de imágenes del slider                   |
| Administrar Tarjetas  | Edición de tarjetas de la sección de servicios                |
| Editar Nosotros       | Modificación del contenido institucional                      |

---

## 📤 Despliegue y Pruebas

- Sitio activo y funcional en Firebase Hosting.
- Pruebas en dispositivos móviles, tablets y escritorio.
- Validación de formularios, seguridad en autenticación y panel 100% funcional.
- Navegación accesible, rápida y sin barreras.

---

## ✅ Resultados

- El sitio funciona correctamente y está en uso por CRECIBV.
- Todo el contenido es **editable sin conocimientos técnicos**.
- Se logró una solución visualmente atractiva, moderna y completamente accesible.

---

## 📌 Conclusiones

Este proyecto demuestra cómo la tecnología puede ser una herramienta de transformación social. Gracias al uso de React y Firebase, fue posible entregar un producto moderno, administrable y escalable que mejora la visibilidad y el funcionamiento digital de CRECIBV. Esta solución fortalece la comunicación de la institución con la comunidad y facilita la recepción de apoyos.

---

## 📎 Anexos

- 🔗 Sitio Web: [https://crecibv.web.app](https://crecibv.web.app)
- 🖼️ Capturas del sitio y del panel (ver documentación PDF)
- 📝 Manual de uso del panel (opcional)
- 📦 Repositorio (si aplica)

---

**💖 Proyecto desarrollado con propósito benéfico por Ángel David Onesto Frías**
