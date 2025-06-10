/**
 * Модель статті
 * Відповідає за логіку роботи з даними статей
 */
class ArticleModel {
  constructor() {
    // Імітація бази даних
    this.articles = new Map()
    this.initializeData()
  }

  /**
   * Ініціалізація початкових даних
   */
  initializeData() {
    this.articles.set('test-article-1', { title: 'Тестова стаття 1' })
    this.articles.set('test-article-2', { title: 'Тестова стаття 2' })
  }

  /**
   * Отримати всі статті
   * @returns {Array} Масив статей з id
   */
  getAllArticles() {
    return Array.from(this.articles.entries()).map(([id, article]) => ({ id, ...article }))
  }

  /**
   * Отримати статтю за ID
   * @param {string} articleId - ID статті
   * @returns {Object|null} Стаття або null якщо не знайдено
   */
  getArticleById(articleId) {
    const article = this.articles.get(articleId)
    return article ? { id: articleId, ...article } : null
  }

  /**
   * Створити нову статтю
   * @param {Object} articleData - Дані статті
   * @returns {Object} Створена стаття з ID
   */
  createArticle(articleData) {
    const articleId = Date.now().toString()
    this.articles.set(articleId, { title: articleData.title })
    return { id: articleId, title: articleData.title }
  }

  /**
   * Оновити статтю
   * @param {string} articleId - ID статті
   * @param {Object} articleData - Нові дані статті
   * @returns {Object|null} Оновлена стаття або null якщо не знайдено
   */
  updateArticle(articleId, articleData) {
    if (!this.articles.has(articleId)) {
      return null
    }
    this.articles.set(articleId, { title: articleData.title })
    return { id: articleId, title: articleData.title }
  }

  /**
   * Видалити статтю
   * @param {string} articleId - ID статті
   * @returns {boolean} true якщо видалено, false якщо не знайдено
   */
  deleteArticle(articleId) {
    return this.articles.delete(articleId)
  }

  /**
   * Перевірити чи існує стаття
   * @param {string} articleId - ID статті
   * @returns {boolean} true якщо існує
   */
  articleExists(articleId) {
    return this.articles.has(articleId)
  }
}

export default ArticleModel
