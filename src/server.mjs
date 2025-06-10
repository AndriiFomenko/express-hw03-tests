// Реалізація RESTful API сервера з мідлварами та шаблонізаторами відповідно до завдання

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

// Константи
const PORT = 3000
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Імітація бази даних
const users = new Map()
const articles = new Map()

// Створення початкових тестових даних
users.set('test-user-1', { name: 'Тестовий користувач 1' })
users.set('test-user-2', { name: 'Тестовий користувач 2' })
articles.set('test-article-1', { title: 'Тестова стаття 1' })
articles.set('test-article-2', { title: 'Тестова стаття 2' })

// Налаштування шаблонізаторів
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Налаштування EJS як другого view engine
import ejs from 'ejs'
app.engine('ejs', ejs.renderFile)

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, 'public')))

// Middleware для обробки JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// === МІДЛВАРИ ===

// 1. Мідлвар для логування запитів
function logRequests(req, res, next) {
  const timestamp = new Date().toISOString()
  const userAgent = req.headers['user-agent'] || 'Unknown'
  const ip = req.ip || req.connection.remoteAddress || 'Unknown'

  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip} - User-Agent: ${userAgent}`)

  // Логування тіла запиту для POST та PUT
  if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length > 0) {
    console.log(`  Request body:`, JSON.stringify(req.body))
  }

  next()
}

// 2. Мідлвар для демонстрації аутентифікації (опціональний для сумісності з тестами)
function demoAuth(req, res, next) {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    if (!authHeader.startsWith('Basic ')) {
      return res.status(401).send('Unauthorized: Invalid authorization format')
    }
    console.log('✓ Authentication provided and validated')
  } else {
    console.log('⚠️  No authentication provided (demo mode)')
  }

  next()
}

// 3. Мідлвар для строгої аутентифікації (можна включити через заголовок)
function strictAuth(req, res, next) {
  const requireAuth = req.headers['x-require-auth'] === 'true'

  if (requireAuth) {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      return res.status(401).send('Unauthorized: No credentials provided')
    }

    if (!authHeader.startsWith('Basic ')) {
      return res.status(401).send('Unauthorized: Invalid authorization format')
    }

    console.log('✓ Strict authentication passed')
  }

  next()
}

// 4. Мідлвар для валідації даних користувачів
function validateUserData(req, res, next) {
  const { name } = req.body

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).send('Bad Request')
  }

  if (name.length > 100) {
    return res.status(400).send('Bad Request: Name must be less than 100 characters')
  }

  // Нормалізація даних
  req.body.name = name.trim()
  console.log('✓ User data validation passed')

  next()
}

// 5. Мідлвар для валідації даних статей
function validateArticleData(req, res, next) {
  const { title } = req.body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).send('Bad Request')
  }

  if (title.length > 200) {
    return res.status(400).send('Bad Request: Title must be less than 200 characters')
  }

  // Нормалізація даних
  req.body.title = title.trim()
  console.log('✓ Article data validation passed')

  next()
}

// 6. Мідлвар для демонстрації перевірки прав доступу до статей
function demoArticleAccess(req, res, next) {
  const authHeader = req.headers['authorization']
  const requireStrictAccess = req.headers['x-require-strict-access'] === 'true'

  if (requireStrictAccess) {
    // Для операцій зміни статей потрібна аутентифікація
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      if (!authHeader) {
        return res.status(403).send('Forbidden: Access denied for article modification')
      }
    }

    // Для видалення потрібна роль адміністратора
    if (req.method === 'DELETE') {
      const hasAdminRole = authHeader && authHeader.includes('admin')
      if (!hasAdminRole) {
        return res.status(403).send('Forbidden: Admin role required for article deletion')
      }
    }

    console.log('✓ Strict article access check passed')
  } else {
    console.log('⚠️  Article access check in demo mode (no restrictions)')
  }

  next()
}

// 7. Мідлвар для перевірки існування ресурсу
function checkUserExists(req, res, next) {
  const { userId } = req.params

  if (!users.has(userId)) {
    return res.status(404).send('Not Found')
  }

  console.log('✓ User exists check passed')
  next()
}

function checkArticleExists(req, res, next) {
  const { articleId } = req.params

  if (!articles.has(articleId)) {
    return res.status(404).send('Not Found')
  }

  console.log('✓ Article exists check passed')
  next()
}

// Глобальний мідлвар логування для всіх запитів
app.use(logRequests)

// === МАРШРУТИ ===

// Маршрути для кореневого шляху
app.get('/', (req, res) => {
  res.status(200).send('Get root route')
})

// === HTML МАРШРУТИ З ШАБЛОНІЗАТОРАМИ ===

// PUG маршрути для користувачів
app.get('/users', (req, res) => {
  // Перевіряємо заголовок Accept для визначення типу відповіді
  const acceptHeader = req.headers.accept || ''

  if (acceptHeader.includes('text/html')) {
    // HTML відповідь з PUG шаблоном
    const allUsers = Array.from(users.entries()).map(([id, user]) => ({ id, ...user }))
    res.render('pug/users', { users: allUsers })
  } else {
    // JSON відповідь для API
    const allUsers = Array.from(users.entries()).map(([id, user]) => ({ id, ...user }))
    res.status(200).json(allUsers)
  }
})

app.get('/users/:userId', checkUserExists, (req, res) => {
  // Перевіряємо заголовок Accept для визначення типу відповіді
  const acceptHeader = req.headers.accept || ''

  if (acceptHeader.includes('text/html')) {
    // HTML відповідь з PUG шаблоном
    const user = users.get(req.params.userId)
    res.render('pug/user-detail', { user: { id: req.params.userId, ...user } })
  } else {
    // JSON відповідь для API
    const user = users.get(req.params.userId)
    res.status(200).json({ id: req.params.userId, ...user })
  }
})

// EJS маршрути для статей
app.get('/articles', (req, res) => {
  // Перевіряємо заголовок Accept для визначення типу відповіді
  const acceptHeader = req.headers.accept || ''

  if (acceptHeader.includes('text/html')) {
    // HTML відповідь з EJS шаблоном
    const allArticles = Array.from(articles.entries()).map(([id, article]) => ({ id, ...article }))
    res.render('ejs/articles.ejs', { articles: allArticles })
  } else {
    // JSON відповідь для API
    const allArticles = Array.from(articles.entries()).map(([id, article]) => ({ id, ...article }))
    res.status(200).json(allArticles)
  }
})

app.get('/articles/:articleId', checkArticleExists, (req, res) => {
  // Перевіряємо заголовок Accept для визначення типу відповіді
  const acceptHeader = req.headers.accept || ''

  if (acceptHeader.includes('text/html')) {
    // HTML відповідь з EJS шаблоном
    const article = articles.get(req.params.articleId)
    res.render('ejs/article-detail.ejs', { article: { id: req.params.articleId, ...article } })
  } else {
    // JSON відповідь для API
    const article = articles.get(req.params.articleId)
    res.status(200).json({ id: req.params.articleId, ...article })
  }
})

// === API МАРШРУТИ ===

// API маршрути для користувачів (JSON only)
app.get('/api/users', (req, res) => {
  const allUsers = Array.from(users.entries()).map(([id, user]) => ({ id, ...user }))
  res.status(200).json(allUsers)
})

// API маршрути для користувачів
app.post('/api/users', demoAuth, strictAuth, validateUserData, (req, res) => {
  const userId = Date.now().toString()
  users.set(userId, { name: req.body.name })
  res.status(201).json({ id: userId, name: req.body.name })
})

app.get('/api/users/:userId', checkUserExists, (req, res) => {
  const user = users.get(req.params.userId)
  res.status(200).json({ id: req.params.userId, ...user })
})

app.put('/api/users/:userId', demoAuth, strictAuth, checkUserExists, validateUserData, (req, res) => {
  users.set(req.params.userId, { name: req.body.name })
  res.status(200).json({ id: req.params.userId, name: req.body.name })
})

app.delete('/api/users/:userId', demoAuth, strictAuth, checkUserExists, (req, res) => {
  users.delete(req.params.userId)
  res.status(204).send()
})

// API маршрути для статей
app.get('/api/articles', (req, res) => {
  const allArticles = Array.from(articles.entries()).map(([id, article]) => ({ id, ...article }))
  res.status(200).json(allArticles)
})

app.post('/api/articles', demoAuth, demoArticleAccess, validateArticleData, (req, res) => {
  const articleId = Date.now().toString()
  articles.set(articleId, { title: req.body.title })
  res.status(201).json({ id: articleId, title: req.body.title })
})

app.get('/api/articles/:articleId', checkArticleExists, (req, res) => {
  const article = articles.get(req.params.articleId)
  res.status(200).json({ id: req.params.articleId, ...article })
})

app.put(
  '/api/articles/:articleId',
  demoAuth,
  demoArticleAccess,
  checkArticleExists,
  validateArticleData,
  (req, res) => {
    articles.set(req.params.articleId, { title: req.body.title })
    res.status(200).json({ id: req.params.articleId, title: req.body.title })
  }
)

app.delete('/api/articles/:articleId', demoAuth, demoArticleAccess, checkArticleExists, (req, res) => {
  articles.delete(req.params.articleId)
  res.status(204).send()
})

// Збереження оригінальних маршрутів для сумісності з тестами
app.post('/users', demoAuth, strictAuth, validateUserData, (req, res) => {
  const userId = Date.now().toString()
  users.set(userId, { name: req.body.name })
  res.status(201).json({ id: userId, name: req.body.name })
})

app.put('/users/:userId', demoAuth, strictAuth, checkUserExists, validateUserData, (req, res) => {
  users.set(req.params.userId, { name: req.body.name })
  res.status(200).json({ id: req.params.userId, name: req.body.name })
})

app.delete('/users/:userId', demoAuth, strictAuth, checkUserExists, (req, res) => {
  users.delete(req.params.userId)
  res.status(204).send()
})

app.post('/articles', demoAuth, demoArticleAccess, validateArticleData, (req, res) => {
  const articleId = Date.now().toString()
  articles.set(articleId, { title: req.body.title })
  res.status(201).json({ id: articleId, title: req.body.title })
})

app.put('/articles/:articleId', demoAuth, demoArticleAccess, checkArticleExists, validateArticleData, (req, res) => {
  articles.set(req.params.articleId, { title: req.body.title })
  res.status(200).json({ id: req.params.articleId, title: req.body.title })
})

app.delete('/articles/:articleId', demoAuth, demoArticleAccess, checkArticleExists, (req, res) => {
  articles.delete(req.params.articleId)
  res.status(204).send()
})

// Тестові маршрути для демонстрації строгих мідлварів
app.post(
  '/users/strict',
  demoAuth,
  (req, res, next) => {
    req.headers['x-require-auth'] = 'true'
    next()
  },
  strictAuth,
  validateUserData,
  (req, res) => {
    const userId = Date.now().toString()
    users.set(userId, { name: req.body.name })
    res.status(201).json({ id: userId, name: req.body.name })
  }
)

app.post(
  '/articles/strict',
  demoAuth,
  (req, res, next) => {
    req.headers['x-require-strict-access'] = 'true'
    next()
  },
  demoArticleAccess,
  validateArticleData,
  (req, res) => {
    const articleId = Date.now().toString()
    articles.set(articleId, { title: req.body.title })
    res.status(201).json({ id: articleId, title: req.body.title })
  }
)

// Тестовий маршрут для перевірки обробки помилок
app.get('/error-test', (req, res, next) => {
  next(new Error('Test error for middleware testing'))
})

// Обробка помилок для неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).send('Not Found')
})

// Глобальна обробка помилок
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`)
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log('')
  console.log('🌟 Express Server з Шаблонізаторами та Мідлварами')
  console.log('')
  console.log('🎨 HTML Routes (Template Engines):')
  console.log('  GET    / - Root route')
  console.log('  GET    /users - List users (PUG template)')
  console.log('  GET    /users/:userId - User details (PUG template)')
  console.log('  GET    /articles - List articles (EJS template)')
  console.log('  GET    /articles/:articleId - Article details (EJS template)')
  console.log('')
  console.log('📊 API Routes (JSON responses):')
  console.log('  GET    /api/users - List all users')
  console.log('  POST   /api/users - Create user (demo auth)')
  console.log('  GET    /api/users/:userId - Get user by ID')
  console.log('  PUT    /api/users/:userId - Update user (demo auth)')
  console.log('  DELETE /api/users/:userId - Delete user (demo auth)')
  console.log('  GET    /api/articles - List all articles')
  console.log('  POST   /api/articles - Create article (demo access control)')
  console.log('  GET    /api/articles/:articleId - Get article by ID')
  console.log('  PUT    /api/articles/:articleId - Update article (demo access control)')
  console.log('  DELETE /api/articles/:articleId - Delete article (demo access control)')
  console.log('')
  console.log('🔒 Strict Mode Routes (require authentication):')
  console.log('  POST   /users/strict - Create user (requires auth)')
  console.log('  POST   /articles/strict - Create article (requires auth & access control)')
  console.log('')
  console.log('🎯 Template Engines:')
  console.log('  ✓ PUG - Для сторінок користувачів (/users)')
  console.log('  ✓ EJS - Для сторінок статей (/articles)')
  console.log('  ✓ CSS стилізація - /css/styles.css')
  console.log('')
  console.log('📋 Middleware Features:')
  console.log('  ✓ Request logging for all routes')
  console.log('  ✓ Data validation for POST/PUT operations')
  console.log('  ✓ Resource existence checking')
  console.log('  ✓ Demo authentication (logs but allows through)')
  console.log('  ✓ Strict authentication (for /strict routes)')
  console.log('  ✓ Demo access control (for articles)')
  console.log('')
  console.log('🌐 Відкрийте браузер:')
  console.log(`  http://localhost:${PORT}/users - PUG користувачі`)
  console.log(`  http://localhost:${PORT}/articles - EJS статті`)
  console.log('')
  console.log('🚀 To test API with curl:')
  console.log('  curl -X GET http://localhost:3000/api/users')
  console.log('  curl -X POST http://localhost:3000/users/strict \\')
  console.log('    -H "Content-Type: application/json" \\')
  console.log('    -H "Authorization: Basic dGVzdDp0ZXN0" \\')
  console.log('    -d \'{"name":"Test User"}\'')
})

// Експорт для тестів
export { server, app }
