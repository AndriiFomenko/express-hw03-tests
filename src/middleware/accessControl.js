/**
 * Middleware для контролю доступу
 */

/**
 * Мідлвар для демонстрації перевірки прав доступу до статей
 */
export function demoArticleAccess(req, res, next) {
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
