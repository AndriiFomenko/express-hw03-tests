/**
 * Middleware для перевірки існування ресурсів
 */

/**
 * Створює middleware для перевірки існування користувача
 * @param {UserModel} userModel - Інстанс моделі користувача
 * @returns {Function} Middleware функція
 */
export function createCheckUserExists(userModel) {
  return (req, res, next) => {
    const { userId } = req.params

    if (!userModel.userExists(userId)) {
      return res.status(404).send('Not Found')
    }

    console.log('✓ User exists check passed')
    next()
  }
}

/**
 * Створює middleware для перевірки існування статті
 * @param {ArticleModel} articleModel - Інстанс моделі статті
 * @returns {Function} Middleware функція
 */
export function createCheckArticleExists(articleModel) {
  return (req, res, next) => {
    const { articleId } = req.params

    if (!articleModel.articleExists(articleId)) {
      return res.status(404).send('Not Found')
    }

    console.log('✓ Article exists check passed')
    next()
  }
}
