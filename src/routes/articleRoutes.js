/**
 * Маршрути для статей
 */
import express from 'express'
import { demoAuth } from '../middleware/auth.js'
import { validateArticleData } from '../middleware/validation.js'
import { demoArticleAccess } from '../middleware/accessControl.js'

/**
 * Створює роутер для статей
 * @param {ArticleController} articleController - Контроллер статей
 * @param {Function} checkArticleExists - Middleware для перевірки існування статті
 * @returns {express.Router} Роутер Express
 */
export function createArticleRoutes(articleController, checkArticleExists) {
  const router = express.Router()

  // HTML/JSON маршрути (умовний рендеринг на основі Accept header)
  router.get('/', articleController.getAllArticles)
  router.get('/:articleId', checkArticleExists, articleController.getArticleById)

  // JSON-only CRUD маршрути (для сумісності з існуючими тестами)
  router.post('/', demoAuth, demoArticleAccess, validateArticleData, articleController.createArticle)
  router.put(
    '/:articleId',
    demoAuth,
    demoArticleAccess,
    checkArticleExists,
    validateArticleData,
    articleController.updateArticle
  )
  router.delete('/:articleId', demoAuth, demoArticleAccess, checkArticleExists, articleController.deleteArticle)

  // Тестовий маршрут для строгого контролю доступу
  router.post(
    '/strict',
    demoAuth,
    (req, res, next) => {
      req.headers['x-require-strict-access'] = 'true'
      next()
    },
    demoArticleAccess,
    validateArticleData,
    articleController.createArticle
  )

  return router
}

/**
 * Створює API роутер для статей
 * @param {ArticleController} articleController - Контроллер статей
 * @param {Function} checkArticleExists - Middleware для перевірки існування статті
 * @returns {express.Router} API роутер Express
 */
export function createArticleAPIRoutes(articleController, checkArticleExists) {
  const router = express.Router()

  // API маршрути (JSON only)
  router.get('/', articleController.getAllArticlesAPI)
  router.post('/', demoAuth, demoArticleAccess, validateArticleData, articleController.createArticle)
  router.get('/:articleId', checkArticleExists, articleController.getArticleByIdAPI)
  router.put(
    '/:articleId',
    demoAuth,
    demoArticleAccess,
    checkArticleExists,
    validateArticleData,
    articleController.updateArticle
  )
  router.delete('/:articleId', demoAuth, demoArticleAccess, checkArticleExists, articleController.deleteArticle)

  return router
}
