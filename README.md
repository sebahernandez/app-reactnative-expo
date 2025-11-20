# Eva1 Móvil 📱

Aplicación móvil multiplataforma desarrollada con React Native y Expo. Esta es una evaluación 1 (Eva1) que demuestra conceptos de navegación, autenticación y gestión de estado en aplicaciones móviles.

## 📋 Descripción General

**Eva1 Móvil** es una aplicación de demostración que implementa un sistema de autenticación básico con navegación entre pantallas. La aplicación permite a los usuarios iniciar sesión y acceder a diferentes secciones de contenido.

## ✨ Funcionalidades

### Autenticación
- **Sistema de Login**: Pantalla de inicio de sesión con validación de credenciales
- **Credenciales Demo**: Usuario `admin` con contraseña `1234`
- **Persistencia de Sesión**: La sesión se guarda en almacenamiento local (AsyncStorage)
- **Cierre de Sesión**: Los usuarios pueden cerrar sesión desde la aplicación

### Gestor de Tareas (TODO)
- **Crear Tareas con Formulario**: Crear nuevas tareas con:
  - 📝 Título descriptivo
  - 📷 Foto desde cámara o galería
  - 📍 Ubicación geolocalizada con dirección
- **Marcar Completadas**: Alternar el estado de completado de cada tarea
- **Eliminar Tareas**: Remover tareas individuales
- **Limpiar Completados**: Eliminar todas las tareas completadas de una vez
- **Contadores**: Visualizar cuántas tareas están completadas vs. totales
- **Asociación de Usuario**: Las tareas están vinculadas al usuario autenticado y solo son visibles para él
- **Persistencia Local**: Las tareas se guardan en AsyncStorage
- **Almacenamiento de Fotos**: Las imágenes se guardan en el sistema de archivos local del dispositivo
- **Interfaz Reactiva**: Interfaz clara y responsiva con tema claro/oscuro

### Navegación
- **Navegación Condicional**: La app redirige automáticamente según el estado de autenticación
- **Pestañas (Tabs)**: Una vez autenticado, acceso a múltiples secciones mediante tabs
- **Rutas Basadas en Archivos**: Utiliza Expo Router para navegación declarativa

### Secciones de la Aplicación
- **Home**: Pantalla principal con contenido de bienvenida
- **TO-DO**: Gestor de tareas con lista de pendientes interactiva
- **Profile**: Perfil del usuario con opción de cerrar sesión

## 🏗️ Arquitectura

### Estructura del Proyecto

```
eva1-movil/
├── app/                          # Carpeta de rutas (Expo Router)
│   ├── (auth)/                   # Rutas protegidas de autenticación
│   │   ├── _layout.tsx          # Layout del grupo de autenticación
│   │   └── login.tsx            # Pantalla de inicio de sesión
│   ├── (tabs)/                  # Rutas protegidas con tabs
│   │   ├── _layout.tsx          # Layout con navegación de tabs
│   │   ├── index.tsx            # Pantalla home
│   │   ├── explore.tsx          # Pantalla TODO-DO
│   │   └── profile.tsx          # Pantalla de perfil
│   ├── _layout.tsx              # Layout raíz
│   ├── index.tsx                # Índice
│   └── modal.tsx                # Pantalla modal de ejemplo
├── context/                      # Contexto de React
│   └── AuthContext.tsx          # Contexto de autenticación
├── components/                   # Componentes reutilizables
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── to-do/                   # Componentes del gestor TODO
│   │   ├── TodoApp.tsx          # Contenedor principal del TODO
│   │   ├── TodoInput.tsx        # Input para agregar nuevas tareas
│   │   ├── TodoList.tsx         # Lista de tareas
│   │   └── TodoItem.tsx         # Componente individual de tarea
│   └── ui/                      # Componentes UI específicos
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
├── constants/                    # Constantes de la aplicación
│   └── theme.ts                 # Configuración de temas
├── hooks/                        # Custom hooks
│   ├── use-color-scheme.ts      # Hook para esquema de colores
│   ├── use-color-scheme.web.ts  # Versión web del hook
│   ├── use-theme-color.ts       # Hook para colores del tema
│   └── use-todos.ts             # Hook para gestión de tareas TODO
├── assets/                       # Imágenes y recursos
│   └── images/                  # Imágenes estáticas
├── package.json                 # Dependencias y scripts
├── app.json                     # Configuración de Expo
└── tsconfig.json                # Configuración de TypeScript
```

### Componentes Clave

#### AuthContext.tsx
Proporciona el contexto de autenticación en toda la aplicación:
- **Estado**: Maneja el usuario actual y estado de carga
- **Métodos**: `login()`, `logout()`, validación de autenticación
- **Persistencia**: Usa AsyncStorage para guardar la sesión del usuario
- **Hook**: `useAuth()` para acceder al contexto en cualquier componente

#### Flujo de Autenticación
1. La app verifica si hay un usuario guardado en AsyncStorage
2. Si existe, redirige a la pantalla de tabs
3. Si no existe, muestra la pantalla de login
4. Al iniciar sesión, guarda el usuario en AsyncStorage
5. Al cerrar sesión, elimina el usuario del almacenamiento

#### Componentes del TODO (Todo-Do)
- **TodoApp.tsx**: Componente contenedor principal que integra todo el sistema y gestiona el usuario autenticado
- **TodoInput.tsx**: Componente de entrada con formulario completo para:
  - Título de la tarea
  - Captura de foto (cámara o galería)
  - Obtención de ubicación geolocalizada
- **TodoList.tsx**: Componente de lista que renderiza todas las tareas del usuario actual
- **TodoItem.tsx**: Componente individual que representa una tarea con:
  - Foto de la tarea
  - Checkbox para marcar como completada
  - Título y ubicación
  - Fecha y hora de creación
  - Botón para eliminar

#### Utilidades
- **imageHandler.ts**: Funciones para manejar:
  - `pickImageFromCamera()`: Capturar foto con la cámara
  - `pickImageFromGallery()`: Seleccionar foto de la galería
- **locationHandler.ts**: Funciones para manejar:
  - `getCurrentLocation()`: Obtener ubicación actual con coordenadas y dirección inversa

#### Hook use-todos.ts
Custom hook que gestiona toda la lógica del TODO con persistencia en AsyncStorage:
- `addTodo(title, imageUri?, location?)`: Agregar una nueva tarea con foto y ubicación opcionales
- `removeTodo(id)`: Eliminar una tarea por ID
- `toggleTodo(id)`: Marcar/desmarcar una tarea como completada
- `clearCompleted()`: Eliminar todas las tareas completadas
- `getTotalCount()`: Obtener el número total de tareas
- `getCompletedCount()`: Obtener el número de tareas completadas
- `loadTodos()`: Cargar tareas del almacenamiento

**Persistencia**: Las tareas se guardan en AsyncStorage con la clave `@eva1_todos` y se filtra automáticamente por usuario.

## 🛠️ Tecnologías

- **React Native**: Framework para desarrollo multiplataforma
- **Expo**: Herramienta para construir y distribuir apps React Native
- **Expo Router**: Sistema de rutas basado en archivos
- **TypeScript**: Lenguaje con tipado estático
- **React 19.1.0**: Última versión de React
- **AsyncStorage**: Almacenamiento local persistente
- **Expo Icons**: Iconos vectoriales (Ionicons, etc.)
- **Expo Image Picker**: Captura de fotos desde cámara y galería
- **Expo Location**: Geolocalización y obtención de dirección
- **Expo File System**: Gestión del sistema de archivos local

## 🚀 Cómo Levantarse

### Requisitos Previos

- **Node.js** (v18 o superior recomendado)
- **npm** o **yarn**
- **Expo CLI** (opcional, se instala con `npx expo`)

### Instalación

1. **Clonar el repositorio** (si no lo has hecho):
   ```bash
   git clone <url-repositorio>
   cd eva1-movil
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Instalar Expo CLI globalmente** (opcional pero recomendado):
   ```bash
   npm install -g expo-cli
   ```

### Ejecutar la Aplicación

#### Opción 1: Modo Desarrollo con Expo Go (Más rápido)

```bash
npm start
```

Escanea el código QR con:
- **iPhone**: Abre la cámara y escanea, luego abre en Expo Go
- **Android**: Abre Expo Go y escanea el código QR

#### Opción 2: Simulador de iOS

```bash
npm run ios
```

Requisitos: Xcode instalado (solo en macOS)

#### Opción 3: Emulador de Android

```bash
npm run android
```

Requisitos: Android Studio y emulador configurado

#### Opción 4: Web

```bash
npm run web
```

Abre la app en el navegador por defecto

### Scripts Disponibles

```bash
npm start              # Inicia el servidor de desarrollo
npm run ios           # Abre en simulador de iOS
npm run android       # Abre en emulador de Android
npm run web           # Abre en navegador
npm run lint          # Ejecuta ESLint para verificar código
npm run reset-project # Reinicia el proyecto a estado limpio
```

## 📱 Permisos Requeridos

Para que todas las funcionalidades del TODO funcionen correctamente, la app solicita los siguientes permisos:

### iOS
- **Cámara**: Para capturar fotos directas
- **Galería/Fotos**: Para seleccionar fotos existentes
- **Ubicación**: Para obtener la geolocalización actual

### Android
- `android.permission.CAMERA`: Acceso a la cámara
- `android.permission.READ_EXTERNAL_STORAGE`: Acceso a la galería
- `android.permission.ACCESS_FINE_LOCATION`: Ubicación precisa
- `android.permission.ACCESS_COARSE_LOCATION`: Ubicación aproximada

Los permisos se solicitan dinámicamente la primera vez que el usuario intenta usar cada función.

## 🔐 Credenciales de Prueba

Para acceder a la aplicación en modo de demostración:

- **Usuario**: `admin`
- **Contraseña**: `1234`

> ⚠️ Nota: Estas credenciales son solo para propósitos de demostración y desarrollo. No usar en producción.

## 📁 Variables de Entorno

La aplicación no requiere variables de entorno específicas en la versión actual, pero el archivo `expo-env.d.ts` permite tipado de TypeScript para variables de entorno si se necesitan en el futuro.

## 🎨 Temas y Estilos

La aplicación incluye soporte para temas claros y oscuros:
- Hook `useColorScheme()`: Detecta la preferencia del sistema
- Hook `useThemeColor()`: Aplica colores según el tema
- Tema configurable en `constants/theme.ts`

## 🧪 Linting y Calidad de Código

```bash
npm run lint
```

La aplicación usa ESLint con la configuración de Expo para mantener la calidad del código.

## 📚 Recursos Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuciones

Este es un proyecto educativo. Para cambios o mejoras, contacta con el equipo de desarrollo.

## 📄 Licencia

Proyecto privado - Evaluación académica

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025
