/**
 * Конфігурація Express додатку
 */
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs'
import { logRequests } from '../middleware/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Налаштування Express додатку
 * @param {express.Application} app - Express додаток
 */
export function configureExpress(app) {
  // Налаштування шаблонізаторів
  app.set('views', path.join(__dirname, '..', 'views'))
  app.set('view engine', 'pug')

  // Налаштування EJS як другого view engine
  app.engine('ejs', ejs.renderFile)

  // Налаштування статичних файлів
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // Middleware для обробки JSON
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Глобальний мідлвар логування для всіх запитів
  app.use(logRequests)
}
