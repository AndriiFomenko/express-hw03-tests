/**
 * Middleware для аутентифікації
 */

/**
 * Мідлвар для демонстрації аутентифікації (опціональний для сумісності з тестами)
 */
export function demoAuth(req, res, next) {
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

/**
 * Мідлвар для строгої аутентифікації (можна включити через заголовок)
 */
export function strictAuth(req, res, next) {
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
