/**
 * Модель користувача
 * Відповідає за логіку роботи з даними користувачів
 */
class UserModel {
  constructor() {
    // Імітація бази даних
    this.users = new Map()
    this.initializeData()
  }

  /**
   * Ініціалізація початкових даних
   */
  initializeData() {
    this.users.set('test-user-1', { name: 'Тестовий користувач 1' })
    this.users.set('test-user-2', { name: 'Тестовий користувач 2' })
  }

  /**
   * Отримати всіх користувачів
   * @returns {Array} Масив користувачів з id
   */
  getAllUsers() {
    return Array.from(this.users.entries()).map(([id, user]) => ({ id, ...user }))
  }

  /**
   * Отримати користувача за ID
   * @param {string} userId - ID користувача
   * @returns {Object|null} Користувач або null якщо не знайдено
   */
  getUserById(userId) {
    const user = this.users.get(userId)
    return user ? { id: userId, ...user } : null
  }

  /**
   * Створити нового користувача
   * @param {Object} userData - Дані користувача
   * @returns {Object} Створений користувач з ID
   */
  createUser(userData) {
    const userId = Date.now().toString()
    this.users.set(userId, { name: userData.name })
    return { id: userId, name: userData.name }
  }

  /**
   * Оновити користувача
   * @param {string} userId - ID користувача
   * @param {Object} userData - Нові дані користувача
   * @returns {Object|null} Оновлений користувач або null якщо не знайдено
   */
  updateUser(userId, userData) {
    if (!this.users.has(userId)) {
      return null
    }
    this.users.set(userId, { name: userData.name })
    return { id: userId, name: userData.name }
  }

  /**
   * Видалити користувача
   * @param {string} userId - ID користувача
   * @returns {boolean} true якщо видалено, false якщо не знайдено
   */
  deleteUser(userId) {
    return this.users.delete(userId)
  }

  /**
   * Перевірити чи існує користувач
   * @param {string} userId - ID користувача
   * @returns {boolean} true якщо існує
   */
  userExists(userId) {
    return this.users.has(userId)
  }
}

export default UserModel
