/**
 * Verificación de estructura: Validar que el código está correctamente implementado
 * Uso: node validate-structure.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, searchString) {
  if (!fileExists(filePath)) {
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

function validateFile(filePath, checks) {
  const results = [];

  checks.forEach((check) => {
    if (fileContains(filePath, check.text)) {
      results.push({ passed: true, check: check.name });
    } else {
      results.push({ passed: false, check: check.name });
    }
  });

  return results;
}

async function runValidation() {
  console.clear();
  log(colors.blue, '==========================================');
  log(colors.blue, '✅ VALIDACIÓN DE ESTRUCTURA: Login');
  log(colors.blue, '==========================================');
  console.log('');

  let passedChecks = 0;
  let failedChecks = 0;

  const baseDir = '/Users/sebacure/Desktop/proyectos/ipss/eva1-movil';

  // ===== Verificación 1: Archivos Existen =====
  log(colors.yellow, 'Verificación 1: Archivos Existen');

  const requiredFiles = [
    { path: 'context/AuthContext.tsx', name: 'AuthContext' },
    { path: 'config/apiConfig.ts', name: 'API Config' },
    { path: 'utils/httpClient.ts', name: 'HTTP Client' },
    { path: 'app/(auth)/login.tsx', name: 'Login Screen' },
    { path: 'server/server.js', name: 'Proxy Server' },
    { path: 'server/.env', name: 'Proxy .env' },
    { path: 'server/package.json', name: 'Proxy package.json' },
  ];

  requiredFiles.forEach((file) => {
    const fullPath = path.join(baseDir, file.path);
    if (fileExists(fullPath)) {
      log(colors.green, `  ✅ ${file.name}: ${file.path}`);
      passedChecks++;
    } else {
      log(colors.red, `  ❌ ${file.name}: ${file.path} (NO ENCONTRADO)`);
      failedChecks++;
    }
  });

  console.log('');

  // ===== Verificación 2: AuthContext =====
  log(colors.yellow, 'Verificación 2: AuthContext.tsx - Estructura Correcta');

  const authContextChecks = [
    { name: 'Interface User con userId y token', text: 'userId: string;' },
    { name: 'Interface User con userId y token', text: 'token: string;' },
    { name: 'Método login con email y password', text: 'login: (email: string, password: string)' },
    {
      name: 'Login retorna Promise con success',
      text: "Promise<{success: boolean; error?: string}>",
    },
    { name: 'Fetch a API_ENDPOINTS.LOGIN', text: 'fetch(API_ENDPOINTS.LOGIN' },
    { name: 'Guardado en AsyncStorage', text: "AsyncStorage.setItem('user'" },
    { name: 'Guardado de token auth', text: "AsyncStorage.setItem('authToken'" },
    { name: 'Logout elimina token', text: "AsyncStorage.removeItem('authToken'" },
  ];

  const authContextPath = path.join(baseDir, 'context/AuthContext.tsx');
  const authResults = validateFile(authContextPath, authContextChecks);

  authResults.forEach((result) => {
    if (result.passed) {
      log(colors.green, `  ✅ ${result.check}`);
      passedChecks++;
    } else {
      log(colors.red, `  ❌ ${result.check}`);
      failedChecks++;
    }
  });

  console.log('');

  // ===== Verificación 3: API Config =====
  log(colors.yellow, 'Verificación 3: config/apiConfig.ts - Configuración Correcta');

  const apiConfigChecks = [
    { name: 'Define ENVIRONMENTS', text: 'ENVIRONMENTS = {' },
    { name: 'Define desarrollo', text: "ENVIRONMENTS.DEVELOPMENT: 'development'" },
    { name: 'API_BASE_URL apunta a proxy', text: "'http://localhost:3000/api'" },
    { name: 'Endpoint LOGIN', text: "LOGIN: `${API_BASE_URL}/auth/login`" },
    { name: 'Endpoint REGISTER', text: "REGISTER: `${API_BASE_URL}/auth/register`" },
    { name: 'Exporta API_ENDPOINTS', text: 'export const API_ENDPOINTS' },
  ];

  const apiConfigPath = path.join(baseDir, 'config/apiConfig.ts');
  const apiResults = validateFile(apiConfigPath, apiConfigChecks);

  apiResults.forEach((result) => {
    if (result.passed) {
      log(colors.green, `  ✅ ${result.check}`);
      passedChecks++;
    } else {
      log(colors.red, `  ❌ ${result.check}`);
      failedChecks++;
    }
  });

  console.log('');

  // ===== Verificación 4: HTTP Client =====
  log(colors.yellow, 'Verificación 4: utils/httpClient.ts - Cliente HTTP');

  const httpClientChecks = [
    { name: 'Class HttpClient', text: 'class HttpClient' },
    { name: 'Método getAuthToken', text: 'private async getAuthToken' },
    { name: 'Método prepareHeaders', text: 'private async prepareHeaders' },
    { name: 'Header Authorization Bearer', text: "'Authorization': `Bearer ${token}`" },
    { name: 'Método request genérico', text: 'async request<T = any>' },
    { name: 'Método get', text: 'async get<T = any>' },
    { name: 'Método post', text: 'async post<T = any>' },
    { name: 'Método put', text: 'async put<T = any>' },
    { name: 'Método delete', text: 'async delete<T = any>' },
    { name: 'Exporta instancia httpClient', text: 'export const httpClient = new HttpClient' },
  ];

  const httpClientPath = path.join(baseDir, 'utils/httpClient.ts');
  const httpResults = validateFile(httpClientPath, httpClientChecks);

  httpResults.forEach((result) => {
    if (result.passed) {
      log(colors.green, `  ✅ ${result.check}`);
      passedChecks++;
    } else {
      log(colors.red, `  ❌ ${result.check}`);
      failedChecks++;
    }
  });

  console.log('');

  // ===== Verificación 5: Login Screen =====
  log(colors.yellow, 'Verificación 5: app/(auth)/login.tsx - Pantalla Login');

  const loginScreenChecks = [
    { name: 'useState para email', text: "const [email, setEmail] = useState('')" },
    { name: 'useState para password', text: "const [password, setPassword] = useState('')" },
    { name: 'useState para isLoading', text: "const [isLoading, setIsLoading] = useState(false)" },
    { name: 'Llama a login con email y password', text: 'await login(email, password)' },
    { name: 'TextInput con keyboardType email', text: "keyboardType='email-address'" },
    { name: 'TextInput password con secureTextEntry', text: 'secureTextEntry' },
    { name: 'Button disabled durante loading', text: 'disabled={isLoading}' },
    { name: 'Muestra mensaje de carga', text: "isLoading ? 'Cargando...' : 'Entrar'" },
    { name: 'Maneja errores con Alert', text: "Alert.alert('Error'" },
    { name: 'Redirecciona a tabs en login exitoso', text: "router.replace('/(tabs)'" },
  ];

  const loginScreenPath = path.join(baseDir, 'app/(auth)/login.tsx');
  const loginResults = validateFile(loginScreenPath, loginScreenChecks);

  loginResults.forEach((result) => {
    if (result.passed) {
      log(colors.green, `  ✅ ${result.check}`);
      passedChecks++;
    } else {
      log(colors.red, `  ❌ ${result.check}`);
      failedChecks++;
    }
  });

  console.log('');

  // ===== Verificación 6: Proxy Server =====
  log(colors.yellow, 'Verificación 6: server/server.js - Servidor Proxy');

  const proxyChecks = [
    { name: 'Import express', text: "require('express')" },
    { name: 'Import cors', text: "require('cors')" },
    { name: 'Import http-proxy', text: "require('http-proxy')" },
    { name: 'Puerto configurado', text: 'process.env.PORT' },
    { name: 'API_TARGET configurado', text: 'process.env.API_TARGET' },
    { name: 'CORS habilitado', text: 'app.use(cors())' },
    { name: 'Endpoint /health', text: "app.get('/health'" },
    { name: 'Proxy /api', text: "app.use('/api'" },
    { name: 'Servidor escucha en puerto', text: 'app.listen(PORT' },
  ];

  const proxyPath = path.join(baseDir, 'server/server.js');
  const proxyResults = validateFile(proxyPath, proxyChecks);

  proxyResults.forEach((result) => {
    if (result.passed) {
      log(colors.green, `  ✅ ${result.check}`);
      passedChecks++;
    } else {
      log(colors.red, `  ❌ ${result.check}`);
      failedChecks++;
    }
  });

  console.log('');

  // ===== Verificación 7: Package.json =====
  log(colors.yellow, 'Verificación 7: package.json - Scripts y Dependencias');

  const packageJsonPath = path.join(baseDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const scriptCheck = 'test:login' in packageJson.scripts;
  if (scriptCheck) {
    log(colors.green, '  ✅ Script test:login existe');
    passedChecks++;
  } else {
    log(colors.red, '  ❌ Script test:login no existe');
    failedChecks++;
  }

  const asyncStorageCheck = '@react-native-async-storage/async-storage' in packageJson.dependencies;
  if (asyncStorageCheck) {
    log(colors.green, '  ✅ AsyncStorage dependencia instalada');
    passedChecks++;
  } else {
    log(colors.red, '  ❌ AsyncStorage dependencia NO instalada');
    failedChecks++;
  }

  console.log('');

  // ===== Resumen =====
  log(colors.blue, '==========================================');
  log(colors.blue, '📊 RESUMEN DE VALIDACIÓN');
  log(colors.blue, '==========================================');
  console.log('');
  log(colors.green, `✅ Verificaciones pasadas: ${passedChecks}`);
  if (failedChecks > 0) {
    log(colors.red, `❌ Verificaciones fallidas: ${failedChecks}`);
  }
  console.log('');

  if (failedChecks === 0) {
    log(colors.green, '🎉 TODA LA ESTRUCTURA ESTÁ CORRECTA');
    console.log('');
    log(colors.blue, 'El sistema está listo para:');
    log(colors.blue, '  1. Ejecutar el proxy: cd server && npm run dev');
    log(colors.blue, '  2. Ejecutar los tests: npm run test:login');
    log(colors.blue, '  3. Ejecutar la app: npm start');
    console.log('');
  } else {
    log(colors.red, '⚠️  EXISTEN PROBLEMAS DE ESTRUCTURA');
    console.log('');
    log(colors.yellow, 'Revisa los errores marcados con ❌');
    console.log('');
    process.exit(1);
  }
}

runValidation().catch((error) => {
  log(colors.red, `Error fatal: ${error.message}`);
  process.exit(1);
});
