# Eva1 Móvil - Sistema de Gestión de Tareas

## 📋 Información del Proyecto

**Nombre:** Eva 3 <br>
**Versión:** 1.0.0 <br>
**Tipo:** Aplicación Móvil Multiplataforma <br>
**Desarrollado con:** React Native + Expo + TypeScript <br>
**Fecha:** Diciembre 2025 <br>
**Institución:** IPSS - Instituto Profesional San Sebastián <br>
**Integrantes:** Sebastián Lagos - María Jose Reichel <br>
**Rol de integrantes:** Sebastian Lagos (Arquitectura de software y servicios) - María Jose Reichel(Frontend) <br>
**Utilizacion de IA:** Para generación de documentación y refactor de codigo en peticiones axios.

## 📖 Descripción General

Eva1 Móvil es una aplicación móvil multiplataforma desarrollada con React Native y Expo que implementa un sistema completo de gestión de tareas (TODO) con autenticación de usuarios mediante JWT. La aplicación se conecta a una API REST externa para proporcionar funcionalidades de registro, inicio de sesión, y administración de tareas con características avanzadas como captura de fotografías y geolocalización.

Este proyecto fue desarrollado como parte de la evaluación académica del Instituto Profesional de Sistemas de Software (IPSS) y demuestra competencias en:
- Desarrollo de aplicaciones móviles multiplataforma
- Integración con APIs REST
- Autenticación y autorización con JWT
- Gestión de estado en React
- Programación con TypeScript
- Uso de servicios nativos del dispositivo (cámara, ubicación)

## ✨ Características Principales

### 🔐 Sistema de Autenticación

#### Registro de Usuarios
- Formulario de registro con validación de datos
- Validación de formato de email
- Validación de longitud de contraseña (mínimo 6 caracteres)
- Confirmación de contraseña
- Almacenamiento automático del token JWT tras el registro
- Feedback visual de errores en tiempo real

#### Inicio de Sesión
- Autenticación mediante email y contraseña
- Integración con backend mediante JWT (JSON Web Token)
- Sesiones persistentes usando AsyncStorage
- Auto-login si existe sesión activa
- Protección de rutas mediante verificación de token
- Manejo de errores con mensajes descriptivos

#### Gestión de Sesión
- Token JWT almacenado de forma segura en AsyncStorage
- Interceptor de Axios para agregar token automáticamente a todas las peticiones
- Verificación de sesión al iniciar la aplicación
- Cierre de sesión con limpieza completa de datos

### 📝 Gestor de Tareas (TODO)

#### Características del Gestor
- **Crear Tareas**: Agregar nuevas tareas con título personalizado
- **Captura de Fotografías**:
  - Tomar foto directamente con la cámara del dispositivo
  - Seleccionar imagen desde la galería
  - Vista previa de la imagen seleccionada
- **Geolocalización Automática**:
  - Captura automática de coordenadas GPS (latitud/longitud)
  - Geocodificación inversa para obtener dirección legible
  - Visualización de ubicación en cada tarea
- **Marcar como Completada**: Toggle para cambiar el estado de las tareas
- **Eliminar Tareas**: Opción para eliminar tareas individuales
- **Limpiar Completadas**: Eliminar todas las tareas completadas de una vez
- **Estadísticas**: Contador de tareas completadas vs. tareas totales
- **Persistencia de Datos**: Sincronización con el backend mediante API REST
- **Separación por Usuario**: Cada usuario solo puede ver y gestionar sus propias tareas

#### Visualización
- Lista interactiva de tareas con scroll
- Diseño responsivo adaptado a diferentes tamaños de pantalla
- Indicadores visuales de estado (completada/pendiente)
- Vista detallada de cada tarea con toda la información
- Interfaz intuitiva con tema claro y oscuro

### 👤 Perfil de Usuario

- Visualización de datos del usuario actual
- Email y nombre del usuario
- Opción de cerrar sesión
- Interfaz limpia y profesional

## 🏗️ Arquitectura y Estructura del Proyecto

### Estructura de Directorios

```
eva1-movil/
├── app/                              # Directorio de rutas (Expo Router)
│   ├── (auth)/                       # Grupo de rutas de autenticación
│   │   ├── _layout.tsx              # Layout de autenticación
│   │   ├── login.tsx                # Pantalla de inicio de sesión
│   │   └── register.tsx             # Pantalla de registro
│   ├── (tabs)/                       # Grupo de rutas con navegación inferior
│   │   ├── _layout.tsx              # Layout con tabs
│   │   ├── index.tsx                # Pantalla principal (Home)
│   │   ├── explore.tsx              # Pantalla de tareas (TODO)
│   │   └── profile.tsx              # Pantalla de perfil
│   ├── _layout.tsx                  # Layout raíz con navegación condicional
│   └── index.tsx                    # Punto de entrada de la aplicación
├── components/                       # Componentes reutilizables
│   ├── to-do/                       # Componentes del gestor de tareas
│   │   ├── TodoApp.tsx              # Componente principal del TODO
│   │   ├── TodoInput.tsx            # Formulario para agregar tareas
│   │   ├── TodoList.tsx             # Lista de tareas
│   │   └── TodoItem.tsx             # Componente individual de tarea
│   └── ui/                          # Componentes de interfaz
├── context/                          # Contextos de React
│   └── AuthContext.tsx              # Contexto de autenticación global
├── services/                         # Servicios de API
│   ├── auth-service.ts              # Servicio de autenticación (login)
│   ├── auth-register.ts             # Servicio de registro
│   ├── user-service.ts              # Servicio de gestión de usuarios
│   ├── todo-service.ts              # Servicio de gestión de tareas
│   └── image-service.ts             # Servicio de manejo de imágenes
├── hooks/                            # Custom Hooks
│   ├── use-color-scheme.ts          # Hook para detección de tema
│   ├── use-theme-color.ts           # Hook para colores por tema
│   └── use-todos.ts                 # Hook para gestión de tareas
├── constants/                        # Constantes y configuración
│   └── theme.ts                     # Configuración de temas
├── assets/                           # Recursos estáticos
│   └── images/                      # Imágenes e iconos
├── package.json                      # Dependencias del proyecto
├── app.json                          # Configuración de Expo
├── tsconfig.json                     # Configuración de TypeScript
└── README.md                         # Documentación del proyecto
```

### Patrones de Arquitectura

#### Context API
La aplicación utiliza React Context API para manejar el estado global de autenticación:
- **AuthContext**: Proporciona el estado de autenticación a toda la aplicación
- Métodos: `login()`, `logout()`, `fetchUser()`, `register()`
- Estado compartido: `user`, `token`, `isAuthenticated`, `isLoading`

#### Service Layer
Capa de servicios que abstrae la lógica de comunicación con la API:
- **auth-service.ts**: Manejo de autenticación
- **user-service.ts**: Operaciones sobre usuarios
- **todo-service.ts**: CRUD de tareas
- Centralización de llamadas HTTP
- Manejo consistente de errores

#### Custom Hooks
Hooks personalizados para lógica reutilizable:
- **use-todos.ts**: Gestión del estado local de tareas
- **use-color-scheme.ts**: Detección de tema del sistema
- **use-theme-color.ts**: Aplicación de colores según tema

## 🌐 API REST - Endpoints Utilizados

**URL Base:** `https://todo-list.dobleb.cl`

### Endpoints de Autenticación

#### 1. Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "string",      // Email del usuario (único)
  "password": "string"    // Contraseña (mínimo 6 caracteres)
}

Response (Success - 201):
{
  "success": true,
  "data": {
    "token": "string",           // Token JWT para autenticación
    "user": {
      "id": "string",            // ID único del usuario
      "email": "string",         // Email del usuario
      "name": "string",          // Nombre (opcional)
      "createdAt": "string",     // Fecha de creación (ISO 8601)
      "updatedAt": "string"      // Fecha de actualización (ISO 8601)
    }
  }
}

Response (Error - 400):
{
  "success": false,
  "error": "string"              // Descripción del error
}
```

#### 2. Inicio de Sesión
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",      // Email del usuario
  "password": "string"    // Contraseña
}

Response (Success - 200):
{
  "success": true,
  "data": {
    "token": "string",           // Token JWT
    "user": {
      "id": "string",            // ID del usuario
      "email": "string",         // Email
      "name": "string",          // Nombre
      "createdAt": "string",     // Fecha de creación
      "updatedAt": "string"      // Fecha de actualización
    }
  }
}

Response (Error - 401):
{
  "success": false,
  "error": "Credenciales inválidas"
}
```

### Endpoints de Usuario

#### 3. Obtener Usuario Actual
```http
GET /users/me
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}

Response (Error - 401):
{
  "success": false,
  "error": "No autorizado"
}
```

### Endpoints de Tareas (TODO)

#### 4. Listar Todas las Tareas del Usuario
```http
GET /todos
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "data": [
    {
      "id": "string",              // ID único de la tarea
      "userId": "string",          // ID del usuario propietario
      "title": "string",           // Título de la tarea
      "completed": boolean,        // Estado (true/false)
      "location": {
        "latitude": number,        // Latitud GPS
        "longitude": number        // Longitud GPS
      },
      "photoUri": "string",        // URI de la foto (opcional)
      "createdAt": "string",       // Fecha de creación (ISO 8601)
      "updatedAt": "string"        // Fecha de actualización (ISO 8601)
    }
  ],
  "count": number                  // Total de tareas
}
```

#### 5. Obtener Una Tarea Específica
```http
GET /todos/{id}
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "completed": boolean,
    "location": { ... },
    "photoUri": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}

Response (Error - 404):
{
  "success": false,
  "error": "Tarea no encontrada"
}
```

#### 6. Crear Nueva Tarea
```http
POST /todos
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "string",           // Título de la tarea (requerido)
  "completed": boolean,        // Estado inicial (opcional, default: false)
  "location": {                // Ubicación (opcional)
    "latitude": number,
    "longitude": number
  },
  "photoUri": "string"         // URI de la foto (opcional)
}

Response (Success - 201):
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "completed": boolean,
    "location": { ... },
    "photoUri": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 7. Actualizar Tarea (Parcial)
```http
PATCH /todos/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body (todos los campos son opcionales):
{
  "title": "string",
  "completed": boolean,
  "location": {
    "latitude": number,
    "longitude": number
  },
  "photoUri": "string"
}

Response (Success - 200):
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "completed": boolean,
    "location": { ... },
    "photoUri": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 8. Eliminar Tarea
```http
DELETE /todos/{id}
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "completed": boolean,
    "location": { ... },
    "photoUri": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}

Response (Error - 404):
{
  "success": false,
  "error": "Tarea no encontrada"
}
```

### Autenticación y Seguridad

Todas las peticiones a endpoints protegidos deben incluir el token JWT en el header:
```
Authorization: Bearer {token}
```

El token se obtiene tras un login o registro exitoso y debe almacenarse de forma segura en el dispositivo.

## 🛠️ Tecnologías y Dependencias

### Core Technologies
- **React Native 0.81.5**: Framework para desarrollo móvil multiplataforma
- **React 19.1.0**: Biblioteca de JavaScript para construir interfaces de usuario
- **Expo SDK ~54.0**: Plataforma para desarrollo universal de React
- **TypeScript 5.9.2**: Superset de JavaScript con tipado estático

### Navegación y Routing
- **Expo Router 6.0**: Sistema de routing basado en archivos
- **React Navigation 7.x**: Librería de navegación nativa
- **@react-navigation/bottom-tabs**: Navegación inferior con tabs
- **react-native-screens 4.16**: Optimización de pantallas nativas

### Gestión de Estado
- **React Context API**: Manejo de estado global
- **AsyncStorage 2.2.0**: Almacenamiento persistente de datos

### Comunicación HTTP
- **Axios 1.13.2**: Cliente HTTP para peticiones a la API
  - Interceptores de request/response
  - Manejo automático de tokens
  - Configuración de timeouts
  - Transformación de datos

### Servicios Nativos
- **expo-image-picker 17.0.8**: Captura de fotos y selección de galería
- **expo-location 19.0.7**: Servicios de geolocalización
- **expo-file-system 19.0.19**: Acceso al sistema de archivos
- **expo-constants 18.0.10**: Constantes del sistema
- **expo-haptics 15.0.7**: Feedback háptico

### UI y Estilos
- **@expo/vector-icons 15.0.3**: Iconos vectoriales
- **expo-image 3.0.10**: Componente de imagen optimizado
- **react-native-safe-area-context 5.6.0**: Manejo de safe areas
- **react-native-gesture-handler 2.28.0**: Gestos nativos

### Desarrollo
- **ESLint 9.25.0**: Linter para calidad de código
- **eslint-config-expo 10.0.0**: Configuración de ESLint para Expo
- **@types/react 19.1.0**: Tipados de TypeScript para React

### Animaciones
- **react-native-reanimated 4.1.1**: Librería de animaciones de alto rendimiento
- **react-native-worklets 0.5.1**: Ejecución de código en threads nativos

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js**: versión 18 o superior
- **npm** o **yarn**: gestor de paquetes
- **Expo Go** (opcional): para testing en dispositivo físico
- **Android Studio** (para Android): emulador de Android
- **Xcode** (para iOS): simulador de iOS (solo en macOS)
- **Conexión a Internet**: para acceder a la API REST

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/sebahernandez/app-reactnative-expo.git
cd eva1-movil
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

o con yarn:

```bash
yarn install
```

### Paso 3: Configuración de Variables de Entorno (Opcional)

Si deseas cambiar la URL de la API, crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_BASE_URL=https://todo-list.dobleb.cl
```

### Paso 4: Iniciar el Proyecto

```bash
npm start
```

o

```bash
npx expo start
```

### Paso 5: Ejecutar en Plataforma

Una vez iniciado el servidor de desarrollo, verás un menú con las siguientes opciones:

- **Presiona `i`**: Abrir en simulador de iOS (requiere macOS y Xcode)
- **Presiona `a`**: Abrir en emulador de Android (requiere Android Studio)
- **Presiona `w`**: Abrir en navegador web
- **Escanea el código QR**: Usar Expo Go en tu dispositivo móvil (iOS/Android)

### Comandos Disponibles

```bash
npm start              # Inicia el servidor de desarrollo
npm run ios           # Inicia en simulador de iOS
npm run android       # Inicia en emulador de Android
npm run web           # Inicia en navegador web
npm run lint          # Ejecuta ESLint para verificar código
npm run reset-project # Reinicia el proyecto a estado limpio
```

## 📱 Permisos del Dispositivo

### Permisos para iOS

La aplicación requiere los siguientes permisos en iOS:
- **NSCameraUsageDescription**: Permiso para usar la cámara
- **NSPhotoLibraryUsageDescription**: Permiso para acceder a la galería
- **NSLocationWhenInUseUsageDescription**: Permiso para acceder a la ubicación

### Permisos para Android

Configurados en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

Los permisos se solicitan dinámicamente cuando el usuario intenta usar la funcionalidad correspondiente.

## 📖 Guía de Uso

### 1. Registro de Usuario

1. Abre la aplicación
2. En la pantalla de login, presiona "Registrar usuario"
3. Ingresa tu email y contraseña (mínimo 6 caracteres)
4. Confirma la contraseña
5. Presiona "Registrarse"
6. Serás redirigido automáticamente a la aplicación

### 2. Inicio de Sesión

1. Ingresa tu email y contraseña
2. Presiona "Entrar"
3. Si las credenciales son correctas, accederás a la aplicación

**Credenciales de prueba:**
- Email: `user@example.com`
- Contraseña: `password123`

### 3. Crear una Tarea

1. Ve a la pestaña "Explore" (segunda pestaña)
2. Escribe el título de la tarea en el campo de texto
3. (Opcional) Presiona el icono de cámara para tomar/seleccionar una foto
4. (Opcional) Presiona el icono de ubicación para agregar tu ubicación actual
5. Presiona "Add" o el botón "+"
6. La tarea aparecerá en la lista

### 4. Gestionar Tareas

- **Marcar como completada**: Presiona el checkbox a la izquierda de la tarea
- **Ver foto**: Presiona sobre la imagen miniatura
- **Eliminar tarea**: Presiona el icono de papelera
- **Limpiar completadas**: Presiona "Clear Completed" en la parte inferior

### 5. Ver Perfil

1. Ve a la pestaña "Profile" (tercera pestaña)
2. Verás tu información de usuario
3. Presiona "Cerrar Sesión" para salir

## 🔒 Seguridad

### Almacenamiento de Tokens
- Los tokens JWT se almacenan de forma segura en AsyncStorage
- Los tokens se eliminan completamente al cerrar sesión
- Los tokens se envían automáticamente en cada petición HTTP

### Protección de Rutas
- Las rutas protegidas verifican la presencia de token
- Redirección automática a login si no hay sesión activa
- Verificación de sesión al iniciar la aplicación

### Manejo de Errores
- Mensajes de error descriptivos sin exponer información sensible
- Logging de errores en consola para debugging
- Validación de datos en frontend antes de enviar al backend

## 🧪 Testing

### Credenciales de Prueba

La API proporciona un usuario de prueba:

- **Email**: `user@example.com`
- **Contraseña**: `password123`

Puedes usar estas credenciales para probar la aplicación sin necesidad de registrarte.

## 🐛 Solución de Problemas

### La aplicación no se conecta a la API

- Verifica tu conexión a internet
- Asegúrate de que la URL de la API sea correcta
- Revisa la consola para mensajes de error detallados

### Error de permisos en cámara/ubicación

- Ve a Configuración del dispositivo > Aplicaciones > Eva1 Móvil
- Verifica que los permisos estén habilitados
- Reinicia la aplicación

### El token expira constantemente

- Los tokens JWT tienen un tiempo de expiración
- Cierra sesión y vuelve a iniciar sesión
- Si el problema persiste, contacta al administrador del backend

## 📚 Recursos Adicionales

### Documentación Oficial

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/)

### API Backend

- **URL Base**: https://todo-list.dobleb.cl
- **Documentación**: Consultar con el administrador del sistema

## 👨‍💻 Información del Desarrollador

**Desarrollador**: Sebastián Hernández
**GitHub**: [@sebahernandez](https://github.com/sebahernandez)
**Email**: sebaprogramer@gmail.com
**Institución**: IPSS - Instituto Profesional de Sistemas de Software
**Proyecto**: Evaluación 1 - Desarrollo Móvil

## 📄 Licencia

Este proyecto es de carácter académico y está desarrollado con fines educativos para el Instituto Profesional de Sistemas de Software (IPSS).

**Proyecto Privado** - Evaluación Académica
Todos los derechos reservados © 2025

---

**Versión**: 1.0.0
**Última Actualización**: Diciembre 2025
**Estado**: Producción
