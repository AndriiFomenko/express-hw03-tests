import { app, server } from '../app.js'
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

// Змінні для зберігання тестових ID
let testUserId
let testArticleId
let testUserName
let testArticleTitle

describe('Template Engines Tests', () => {
  beforeAll(async () => {
    // Створюємо спай для запобігання виводу логів під час тестів
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Отримуємо існуючі дані через API
    const usersResp = await request(app).get('/api/users')
    if (usersResp.body.length > 0) {
      testUserId = usersResp.body[0].id
      testUserName = usersResp.body[0].name
    } else {
      const newUserResp = await request(app).post('/api/users').send({ name: 'Test User For Templates' })
      testUserId = newUserResp.body.id
      testUserName = newUserResp.body.name
    }

    // Аналогічно для статей
    const articlesResp = await request(app).get('/api/articles')
    if (articlesResp.body.length > 0) {
      testArticleId = articlesResp.body[0].id
      testArticleTitle = articlesResp.body[0].title
    } else {
      const newArticleResp = await request(app).post('/api/articles').send({ title: 'Test Article For Templates' })
      testArticleId = newArticleResp.body.id
      testArticleTitle = newArticleResp.body.title
    }
  })

  afterAll(() => {
    // Відновлюємо моки
    vi.restoreAllMocks()
  })

  // Тестування PUG шаблонів для користувачів
  describe('PUG Templates - Users', () => {
    test('GET /users з Accept: text/html повинен повертати HTML з PUG шаблоном', async () => {
      const response = await request(app).get('/users').set('Accept', 'text/html')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/text\/html/)
      expect(response.text).toContain('<!DOCTYPE html>')
      expect(response.text).toContain('Користувачі')
      expect(response.text).toContain('PUG Template')
      expect(response.text).toContain('/css/styles.css')
    })

    test('GET /users/:userId з Accept: text/html повинен повертати HTML з PUG шаблоном', async () => {
      const response = await request(app).get(`/users/${testUserId}`).set('Accept', 'text/html')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/text\/html/)
      expect(response.text).toContain('<!DOCTYPE html>')
      expect(response.text).toContain('Деталі користувача')
      expect(response.text).toContain(testUserName)
      expect(response.text).toContain(testUserId)
      expect(response.text).toContain('PUG Template')
    })

    test('GET /users без Accept заголовка повинен повертати JSON (зворотна сумісність)', async () => {
      const response = await request(app).get('/users')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
    })

    test('GET /users з Accept: application/json повинен повертати JSON', async () => {
      const response = await request(app).get('/users').set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  // Тестування EJS шаблонів для статей
  describe('EJS Templates - Articles', () => {
    test('GET /articles з Accept: text/html повинен повертати HTML з EJS шаблоном', async () => {
      const response = await request(app).get('/articles').set('Accept', 'text/html')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/text\/html/)
      expect(response.text).toContain('<!DOCTYPE html>')
      expect(response.text).toContain('Статті')
      expect(response.text).toContain('EJS Template')
      expect(response.text).toContain('/css/styles.css')
    })

    test('GET /articles/:articleId з Accept: text/html повинен повертати HTML з EJS шаблоном', async () => {
      const response = await request(app).get(`/articles/${testArticleId}`).set('Accept', 'text/html')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/text\/html/)
      expect(response.text).toContain('<!DOCTYPE html>')
      expect(response.text).toContain('Деталі статті')
      expect(response.text).toContain(testArticleTitle)
      expect(response.text).toContain(testArticleId)
      expect(response.text).toContain('EJS Template')
    })

    test('GET /articles без Accept заголовка повинен повертати JSON (зворотна сумісність)', async () => {
      const response = await request(app).get('/articles')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
    })

    test('GET /articles з Accept: application/json повинен повертати JSON', async () => {
      const response = await request(app).get('/articles').set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  // Тестування статичних файлів
  describe('Static Files', () => {
    test('GET /css/styles.css повинен повертати CSS файл', async () => {
      const response = await request(app).get('/css/styles.css')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/text\/css/)
      expect(response.text).toContain('font-family')
      expect(response.text).toContain('.container')
    })
  })

  // Тестування API маршрутів (збереження функціональності)
  describe('API Routes Compatibility', () => {
    test('GET /api/users повинен повертати JSON список користувачів', async () => {
      const response = await request(app).get('/api/users')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
    })

    test('GET /api/articles повинен повертати JSON список статей', async () => {
      const response = await request(app).get('/api/articles')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBeGreaterThan(0)
    })

    test('POST /api/users повинен створювати нового користувача', async () => {
      const testName = 'API Test User ' + Date.now()
      const response = await request(app).post('/api/users').send({ name: testName })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', testName)
    })

    test('POST /api/articles повинен створювати нову статтю', async () => {
      const testTitle = 'API Test Article ' + Date.now()
      const response = await request(app).post('/api/articles').send({ title: testTitle })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('title', testTitle)
    })
  })

  // Тестування 404 для неіснуючих ресурсів
  describe('404 Handling for Templates', () => {
    test('GET /users/non-existent з Accept: text/html повинен повертати 404', async () => {
      const response = await request(app).get('/users/non-existent-user').set('Accept', 'text/html')

      expect(response.status).toBe(404)
      expect(response.text).toBe('Not Found')
    })

    test('GET /articles/non-existent з Accept: text/html повинен повертати 404', async () => {
      const response = await request(app).get('/articles/non-existent-article').set('Accept', 'text/html')

      expect(response.status).toBe(404)
      expect(response.text).toBe('Not Found')
    })
  })
})
