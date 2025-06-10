/**
 * Контроллер користувачів
 * Відповідає за обробку HTTP запитів пов'язаних з користувачами
 */
class UserController {
  constructor(userModel) {
    this.userModel = userModel
  }

  /**
   * Отримати всіх користувачів (HTML або JSON)
   */
  getAllUsers = (req, res) => {
    const acceptHeader = req.headers.accept || ''
    const users = this.userModel.getAllUsers()

    if (acceptHeader.includes('text/html')) {
      // HTML відповідь з PUG шаблоном
      res.render('pug/users', { users })
    } else {
      // JSON відповідь для API
      res.status(200).json(users)
    }
  }

  /**
   * Отримати користувача за ID (HTML або JSON)
   */
  getUserById = (req, res) => {
    const acceptHeader = req.headers.accept || ''
    const user = this.userModel.getUserById(req.params.userId)

    if (acceptHeader.includes('text/html')) {
      // HTML відповідь з PUG шаблоном
      res.render('pug/user-detail', { user })
    } else {
      // JSON відповідь для API
      res.status(200).json(user)
    }
  }

  /**
   * Створити користувача (JSON only)
   */
  createUser = (req, res) => {
    const user = this.userModel.createUser(req.body)
    res.status(201).json(user)
  }

  /**
   * Оновити користувача (JSON only)
   */
  updateUser = (req, res) => {
    const user = this.userModel.updateUser(req.params.userId, req.body)
    if (!user) {
      return res.status(404).send('Not Found')
    }
    res.status(200).json(user)
  }

  /**
   * Видалити користувача (JSON only)
   */
  deleteUser = (req, res) => {
    const deleted = this.userModel.deleteUser(req.params.userId)
    if (!deleted) {
      return res.status(404).send('Not Found')
    }
    res.status(204).send()
  }

  /**
   * Отримати всіх користувачів для API (JSON only)
   */
  getAllUsersAPI = (req, res) => {
    const users = this.userModel.getAllUsers()
    res.status(200).json(users)
  }

  /**
   * Отримати користувача за ID для API (JSON only)
   */
  getUserByIdAPI = (req, res) => {
    const user = this.userModel.getUserById(req.params.userId)
    res.status(200).json(user)
  }
}

export default UserController
