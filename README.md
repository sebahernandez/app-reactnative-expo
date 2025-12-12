# Eva 2 Móvil 📱

Aplicación móvil multiplataforma desarrollada con React Native y Expo. Esta es una evaluación 1 (Eva1) que demuestra conceptos de navegación, autenticación basada en endpoints REST, y gestión de estado en aplicaciones móviles.

## 📋 Descripción General

**Eva1 Móvil** es una aplicación de demostración que implementa un sistema de autenticación integrado con un backend real mediante endpoints REST con JWT. Usa Axios para manejar las solicitudes HTTP y los headers CORS automáticamente, sin necesidad de un proxy intermedio.

## ✨ Funcionalidades

### 🔐 Autenticación Basada en Endpoints REST

La autenticación se integra directamente con un backend real mediante endpoints REST con JWT:

#### Características Principales
- **Integración con Backend Real**: Se conecta al endpoint `https://todo-list.dobleb.cl/auth/login`
- **Token JWT**: Almacena tokens de autenticación de forma segura en AsyncStorage
- **Cliente Axios**: Usa Axios con headers CORS configurados automáticamente
- **Sesiones Persistentes**: La sesión se mantiene incluso después de cerrar y reabre la app
- **Validación en Tiempo Real**: Verifica credenciales contra el backend
- **Manejo de Errores**: Mensajes claros cuando falla la autenticación
- **Sin Proxy Necesario**: Axios maneja CORS automáticamente

#### Endpoints de Autenticación

```
POST /auth/login
  ├─ Request: { email: string, password: string }
  └─ Response: { success: boolean, data: { user: { id, email, ... }, token: string } }
```

#### Credenciales de Prueba

Para acceder a la aplicación, usa estas credenciales del backend:

- **Email**: `user@example.com`
- **Contraseña**: `password123`

#### Flujo de Autenticación

1. **Inicio**: La app carga y verifica si existe un token guardado en AsyncStorage
2. **Decisión**: 
   - Si hay token válido → redirige a pantalla de tabs
   - Si no hay token → muestra pantalla de login
3. **Login**: 
   - Usuario ingresa email y contraseña
   - La app envía POST a `https://todo-list.dobleb.cl/auth/login` usando Axios
   - Backend valida credenciales y devuelve token JWT + datos del usuario
4. **Almacenamiento**: Token se guarda en AsyncStorage con clave `authToken`, usuario en clave `user`
5. **Redirección**: Usuario redirigido automáticamente a pantalla de tabs
6. **Protección**: Todas las rutas protegidas verifican presencia del token
7. **Logout**: Token y usuario se eliminan de AsyncStorage, redirige a login

### 📸 Gestor de Tareas Mejorado (TO-DO)

Características completas del gestor de tareas:

- **Capturar Fotos**: Toma una foto directamente con la cámara o selecciona una de tu galería
- **Ubicación Automática**: Registra la dirección y coordenadas (latitud/longitud) de la ubicación
- **Visualización de Fotos**: Haz clic en una foto para verla a pantalla completa
- **Detalles Completos**: Cada tarea muestra foto, título, ubicación, coordenadas, fecha/hora
- **Marcar Completadas**: Alternar el estado de completado de cada tarea
- **Eliminar Tareas**: Remover tareas individuales
- **Limpiar Completados**: Eliminar todas las tareas completadas de una vez
- **Contadores**: Visualizar cuántas tareas están completadas vs. totales
- **Persistencia Local**: Las tareas se guardan en AsyncStorage
- **Separación por Usuario**: Cada usuario ve solo sus propias tareas

## 🏗️ Arquitectura Técnica

### Estructura del Proyecto

```
eva1-movil/
├── app/                          # Rutas (Expo Router)
│   ├── (auth)/
│   │   ├── _layout.tsx          # Layout de autenticación
│   │   └── login.tsx            # Pantalla de login
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Layout con tabs
│   │   ├── index.tsx            # Home
│   │   ├── explore.tsx          # TODO
│   │   └── profile.tsx          # Perfil
│   ├── _layout.tsx              # Layout raíz (navegación condicional)
│   ├── index.tsx                # Índice
│   └── modal.tsx                # Modal de ejemplo
├── context/
│   └── AuthContext.tsx          # Contexto de autenticación con endpoints
├── config/
│   └── apiConfig.ts             # Endpoints de API por entorno
├── components/
│   ├── to-do/                   # Componentes del TODO
│   │   ├── TodoApp.tsx
│   │   ├── TodoInput.tsx
│   │   ├── TodoList.tsx
│   │   └── TodoItem.tsx
│   └── ui/                      # Componentes UI
├── constants/
│   └── theme.ts                 # Temas
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── use-todos.ts
├── utils/
│   ├── httpClient.ts            # Cliente HTTP con Axios + CORS headers
│   ├── imageHandler.ts
│   └── locationHandler.ts
├── assets/
│   └── images/
├── package.json
├── app.json
└── tsconfig.json
```

### Componentes Clave

#### AuthContext.tsx
Gestiona toda la lógica de autenticación:
- **Estado**: Usuario actual, token JWT, estado de carga, bandera de autenticación
- **Métodos**: 
  - `login(email, password)` → Valida contra backend, retorna `{success, error?}`
  - `logout()` → Limpia token y usuario de AsyncStorage
  - `loadUser()` → Recupera usuario del AsyncStorage al iniciar
- **Interceptación**: Verifica token al abrir la app
- **Hook**: `useAuth()` para usar en cualquier componente

#### apiConfig.ts
Configuración centralizada de endpoints:
- Almacena URLs de desarrollo, staging y producción
- Define endpoints relativos para login, register, y otros
- Apunta directamente al backend sin proxy

#### httpClient.ts
Cliente HTTP basado en Axios con interceptores automáticos:
- **GET, POST, PUT, DELETE, PATCH**: Métodos para todas las operaciones
- **Headers CORS**: Configurados automáticamente en cada solicitud
- **Token Automático**: Añade header `Authorization: Bearer <token>` a cada solicitud
- **Logging**: Imprime solicitudes/respuestas en consola (desarrollo)
- **Manejo de Errores**: Captura y formatea errores del servidor

**Headers CORS configurados**:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## 🛠️ Tecnologías

- **React Native**: Framework multiplataforma
- **Expo**: Herramienta de desarrollo y distribución
- **Expo Router**: Sistema de rutas basado en archivos
- **TypeScript**: Lenguaje con tipado estático
- **React 19.1.0**: Última versión de React
- **AsyncStorage**: Almacenamiento local persistente
- **Axios**: Cliente HTTP con soporte CORS automático
- **Expo Image Picker**: Captura de fotos
- **Expo Location**: Geolocalización
- **Expo File System**: Gestión de sistema de archivos

## 🚀 Cómo Levantar la Aplicación

### Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Expo CLI** (opcional, se instala con `npx expo`)
- **Conexión a Internet** (para acceder al backend)

### Paso 1: Clonar Repositorio

```bash
git clone <url-repositorio>
cd eva1-movil
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Iniciar la App

```bash
npm start
```

Verás un menú de Expo. Elige:
- **i** → Simulador de iOS
- **a** → Emulador de Android
- **w** → Navegador web
- Escanea el código QR con tu teléfono (debe estar en la misma red WiFi)

### Paso 4: Probar Login

En la pantalla de login, ingresa:
- **Email**: `user@example.com`
- **Contraseña**: `password123`

La app debería:
1. Conectarse directamente a `https://todo-list.dobleb.cl/auth/login` usando Axios
2. Recibir el token JWT
3. Guardar el token en AsyncStorage
4. Redirigir a la pantalla de tabs

## 📱 Permisos Requeridos

### iOS
- **Cámara**: Para capturar fotos
- **Galería/Fotos**: Para seleccionar fotos existentes
- **Ubicación**: Para obtener geolocalización

### Android
- `android.permission.CAMERA`
- `android.permission.READ_EXTERNAL_STORAGE`
- `android.permission.ACCESS_FINE_LOCATION`
- `android.permission.ACCESS_COARSE_LOCATION`

Los permisos se solicitan dinámicamente cuando se usan.

## 🔧 Scripts Disponibles

```bash
npm start              # Inicia servidor de desarrollo
npm run ios           # Abre en simulador de iOS
npm run android       # Abre en emulador de Android
npm run web           # Abre en navegador
npm run lint          # Ejecuta ESLint
npm run reset-project # Reinicia a estado limpio
```

## 🎨 Temas

La aplicación soporta temas claros y oscuros:
- Hook `useColorScheme()`: Detecta preferencia del sistema
- Hook `useThemeColor()`: Aplica colores según tema
- Configurable en `constants/theme.ts`

## 🧪 Linting

```bash
npm run lint
```

Usa ESLint para mantener calidad de código.

## 📚 Recursos Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/)
- [Backend API](https://todo-list.dobleb.cl/)

## 🤝 Contribuciones

Este es un proyecto educativo. Para cambios o mejoras, contacta con el equipo de desarrollo.

## 📄 Licencia

Proyecto privado - Evaluación académica

---

**Versión**: 2.1.0 (Con Axios + CORS headers automáticos, sin proxy)  
**Última actualización**: Diciembre 2025
