/**
 * Контроллер статей
 * Відповідає за обробку HTTP запитів пов'язаних зі статтями
 */
class ArticleController {
  constructor(articleModel) {
    this.articleModel = articleModel
  }

  /**
   * Отримати всі статті (HTML або JSON)
   */
  getAllArticles = (req, res) => {
    const acceptHeader = req.headers.accept || ''
    const articles = this.articleModel.getAllArticles()

    if (acceptHeader.includes('text/html')) {
      // HTML відповідь з EJS шаблоном
      res.render('ejs/articles.ejs', { articles })
    } else {
      // JSON відповідь для API
      res.status(200).json(articles)
    }
  }

  /**
   * Отримати статтю за ID (HTML або JSON)
   */
  getArticleById = (req, res) => {
    const acceptHeader = req.headers.accept || ''
    const article = this.articleModel.getArticleById(req.params.articleId)

    if (acceptHeader.includes('text/html')) {
      // HTML відповідь з EJS шаблоном
      res.render('ejs/article-detail.ejs', { article })
    } else {
      // JSON відповідь для API
      res.status(200).json(article)
    }
  }

  /**
   * Створити статтю (JSON only)
   */
  createArticle = (req, res) => {
    const article = this.articleModel.createArticle(req.body)
    res.status(201).json(article)
  }

  /**
   * Оновити статтю (JSON only)
   */
  updateArticle = (req, res) => {
    const article = this.articleModel.updateArticle(req.params.articleId, req.body)
    if (!article) {
      return res.status(404).send('Not Found')
    }
    res.status(200).json(article)
  }

  /**
   * Видалити статтю (JSON only)
   */
  deleteArticle = (req, res) => {
    const deleted = this.articleModel.deleteArticle(req.params.articleId)
    if (!deleted) {
      return res.status(404).send('Not Found')
    }
    res.status(204).send()
  }

  /**
   * Отримати всі статті для API (JSON only)
   */
  getAllArticlesAPI = (req, res) => {
    const articles = this.articleModel.getAllArticles()
    res.status(200).json(articles)
  }

  /**
   * Отримати статтю за ID для API (JSON only)
   */
  getArticleByIdAPI = (req, res) => {
    const article = this.articleModel.getArticleById(req.params.articleId)
    res.status(200).json(article)
  }
}

export default ArticleController
