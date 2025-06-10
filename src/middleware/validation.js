/**
 * Middleware для валідації даних
 */

/**
 * Мідлвар для валідації даних користувачів
 */
export function validateUserData(req, res, next) {
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

/**
 * Мідлвар для валідації даних статей
 */
export function validateArticleData(req, res, next) {
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
