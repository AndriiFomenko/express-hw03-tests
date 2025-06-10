/**
 * Middleware для логування
 */

/**
 * Мідлвар для логування запитів
 */
export function logRequests(req, res, next) {
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
