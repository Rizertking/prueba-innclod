# Angular Proyectos & Tareas

Aplicación Angular que permite gestionar **Proyectos** y sus **Tareas** con autenticación, CRUD y componentes en Angular Material.

## 🚀 Tecnologías
- Angular 17
- Angular Material
- Reactive Forms
- TypeScript

## 📂 Estructura principal
- `projects/` → CRUD de proyectos
- `tasks/` → CRUD de tareas
- `auth/` → Módulo de autenticación
- `shared/` → Componentes compartidos (ej: confirm dialog)

## ⚡ Instalación
Clona el repositorio y ejecuta:

```bash
npm install
ng serve
```

**Accede en**: http://localhost:4200

## 🔑 Autenticación

- Al iniciar sesión se redirige a proyectos.

- Logout disponible en la toolbar.

## 🔐 Acceso a la lista de proyectos/tareas

Para ingresar al sistema y acceder a la lista de proyectos o tareas:

1. Introduzca un correo electrónico válido en el campo de Email.

2. Ingrese una contraseña con al menos 6 caracteres.

3. Presione el botón Ingresar.

Una vez autenticado, será redirigido al formulario de proyectos, desde donde podrá gestionar la lista de proyectos y tareas.

