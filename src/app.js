/**
 * Головний файл Express додатку з MVC архітектурою
 * Реалізація RESTful API сервера з мідлварами та шаблонізаторами
 */
import express from 'express'
import { configureExpress } from './config/express.js'

// Імпорт моделей
import UserModel from './models/UserModel.js'
import ArticleModel from './models/ArticleModel.js'

// Імпорт контроллерів
import UserController from './controllers/UserController.js'
import ArticleController from './controllers/ArticleController.js'

// Імпорт middleware
import { createCheckUserExists, createCheckArticleExists } from './middleware/existence.js'

// Імпорт маршрутів
import { createUserRoutes, createUserAPIRoutes } from './routes/userRoutes.js'
import { createArticleRoutes, createArticleAPIRoutes } from './routes/articleRoutes.js'

// Константи
const PORT = 3000
const app = express()

// Конфігурація Express
configureExpress(app)

// Ініціалізація моделей
const userModel = new UserModel()
const articleModel = new ArticleModel()

// Ініціалізація контроллерів
const userController = new UserController(userModel)
const articleController = new ArticleController(articleModel)

// Ініціалізація middleware для перевірки існування ресурсів
const checkUserExists = createCheckUserExists(userModel)
const checkArticleExists = createCheckArticleExists(articleModel)

// Створення роутерів
const userRoutes = createUserRoutes(userController, checkUserExists)
const userAPIRoutes = createUserAPIRoutes(userController, checkUserExists)
const articleRoutes = createArticleRoutes(articleController, checkArticleExists)
const articleAPIRoutes = createArticleAPIRoutes(articleController, checkArticleExists)

// === МАРШРУТИ ===

// Кореневий маршрут
app.get('/', (req, res) => {
  res.status(200).send('Get root route')
})

// Підключення роутерів
app.use('/users', userRoutes)
app.use('/api/users', userAPIRoutes)
app.use('/articles', articleRoutes)
app.use('/api/articles', articleAPIRoutes)

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
  console.log('🌟 Express Server з MVC Архітектурою, Шаблонізаторами та Мідлварами')
  console.log('')
  console.log('🏗️  MVC Architecture:')
  console.log('  📁 Models: UserModel, ArticleModel')
  console.log('  🎮 Controllers: UserController, ArticleController')
  console.log('  🛤️  Routes: userRoutes, articleRoutes')
  console.log('  🔧 Middleware: auth, validation, logger, accessControl, existence')
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
