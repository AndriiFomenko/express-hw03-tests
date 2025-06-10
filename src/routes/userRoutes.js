/**
 * Маршрути для користувачів
 */
import express from 'express'
import { demoAuth, strictAuth } from '../middleware/auth.js'
import { validateUserData } from '../middleware/validation.js'

/**
 * Створює роутер для користувачів
 * @param {UserController} userController - Контроллер користувачів
 * @param {Function} checkUserExists - Middleware для перевірки існування користувача
 * @returns {express.Router} Роутер Express
 */
export function createUserRoutes(userController, checkUserExists) {
  const router = express.Router()

  // HTML/JSON маршрути (умовний рендеринг на основі Accept header)
  router.get('/', userController.getAllUsers)
  router.get('/:userId', checkUserExists, userController.getUserById)

  // JSON-only CRUD маршрути (для сумісності з існуючими тестами)
  router.post('/', demoAuth, strictAuth, validateUserData, userController.createUser)
  router.put('/:userId', demoAuth, strictAuth, checkUserExists, validateUserData, userController.updateUser)
  router.delete('/:userId', demoAuth, strictAuth, checkUserExists, userController.deleteUser)

  // Тестовий маршрут для строгої аутентифікації
  router.post(
    '/strict',
    demoAuth,
    (req, res, next) => {
      req.headers['x-require-auth'] = 'true'
      next()
    },
    strictAuth,
    validateUserData,
    userController.createUser
  )

  return router
}

/**
 * Створює API роутер для користувачів
 * @param {UserController} userController - Контроллер користувачів
 * @param {Function} checkUserExists - Middleware для перевірки існування користувача
 * @returns {express.Router} API роутер Express
 */
export function createUserAPIRoutes(userController, checkUserExists) {
  const router = express.Router()

  // API маршрути (JSON only)
  router.get('/', userController.getAllUsersAPI)
  router.post('/', demoAuth, strictAuth, validateUserData, userController.createUser)
  router.get('/:userId', checkUserExists, userController.getUserByIdAPI)
  router.put('/:userId', demoAuth, strictAuth, checkUserExists, validateUserData, userController.updateUser)
  router.delete('/:userId', demoAuth, strictAuth, checkUserExists, userController.deleteUser)

  return router
}
