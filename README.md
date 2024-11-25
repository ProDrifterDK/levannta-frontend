
# Levannta Frontend

## Instrucciones de Configuración

Sigue estos pasos para ejecutar la aplicación localmente:

1. Clona el repositorio o descarga el código fuente.
2. Instala las dependencias necesarias ejecutando:
   ```
   npm install
   ```
3. Inicia el servidor de desarrollo con el siguiente comando:
   ```
   npm run dev
   ```
4. Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la aplicación.

---

## Descripción Técnica

La aplicación utiliza las siguientes decisiones técnicas:

- **Framework:** Next.js para el desarrollo de aplicaciones React con funcionalidades avanzadas como renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG).
- **Estilos:** Uso de CSS y módulos de estilo para una mejor modularidad y mantenimiento del código.
- **Temas:** Integración de un proveedor de temas centralizado en `ThemeProviderClient.tsx` para gestionar estilos globales y personalizables.
- **API:** Conexión a servicios externos mediante el archivo `apiService.ts`, que contiene las configuraciones necesarias para las solicitudes HTTP.

---

