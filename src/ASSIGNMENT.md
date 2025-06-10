# Інтеграція шаблонізаторів PUG та EJS у існуючий Express сервер

**Складність**: Важке  
**Базис**: Повністю функціональний Express.js сервер з мідлварами (всі тести пройдені)

## Мета завдання

**Взяти існуючий функціональний Express.js сервер** (з мідлварами логування, аутентифікації, валідації та REST API) **та розширити його шаблонізаторами PUG і EJS** для створення сучасних HTML сторінок, зберігаючи повну сумісність з існуючими тестами.

## Що вже реалізовано у базовій версії

✅ **Express сервер з мідлварами**:

- Логування запитів (`logRequests`)
- Демонстраційна та строга аутентифікація (`demoAuth`, `strictAuth`)
- Валідація даних (`validateUserData`, `validateArticleData`)
- Контроль доступу (`demoArticleAccess`)
- Перевірка існування ресурсів (`checkUserExists`, `checkArticleExists`)

✅ **REST API**:

- Повний CRUD для користувачів та статей
- Обробка помилок та статус коди
- 23 API тести - всі проходять успішно

✅ **Демонстраційні маршрути**:

- `/users/strict` та `/articles/strict` з обов'язковою аутентифікацією

## Нові вимоги для реалізації

### 1. Інтеграція шаблонізаторів

#### 1.1 Налаштування PUG для користувачів

- **Маршрути**: `/users` та `/users/:userId`
- **Функціональність**:
  - Відображення списку користувачів у вигляді сучасних карток
  - Деталізована сторінка конкретного користувача
  - Навігація між сторінками з красивими кнопками

#### 1.2 Налаштування EJS для статей

- **Маршрути**: `/articles` та `/articles/:articleId`
- **Функціональність**:
  - Відображення списку статей у вигляді карток
  - Деталізована сторінка конкретної статті
  - Інтуїтивна навігація з посиланнями

#### 1.3 Умовне рендерування

- **Ключова особливість**: Зберегти API функціональність
- **Логіка**:
  - `Accept: text/html` → HTML шаблон (PUG або EJS)
  - `Accept: application/json` → JSON відповідь
  - Без заголовка → JSON (зворотна сумісність з тестами)

### 2. Технічна реалізація шаблонізаторів

#### 2.1 Конфігурація Express

```javascript
// Налаштування PUG як основний view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Додавання EJS як другого engine
import ejs from 'ejs'
app.engine('ejs', ejs.renderFile)

// Статичні файли для CSS
app.use(express.static(path.join(__dirname, 'public')))
```

#### 2.2 Модифікація існуючих маршрутів

```javascript
// Приклад для користувачів
app.get('/users', (req, res) => {
  const acceptHeader = req.headers.accept || ''
  const allUsers = Array.from(users.entries()).map(([id, user]) => ({ id, ...user }))

  if (acceptHeader.includes('text/html')) {
    res.render('pug/users.pug', { users: allUsers }) // PUG шаблон
  } else {
    res.status(200).json(allUsers) // Оригінальний JSON
  }
})

// Приклад для статей
app.get('/articles', (req, res) => {
  const acceptHeader = req.headers.accept || ''
  const allArticles = Array.from(articles.entries()).map(([id, article]) => ({ id, ...article }))

  if (acceptHeader.includes('text/html')) {
    res.render('ejs/articles.ejs', { articles: allArticles }) // EJS шаблон
  } else {
    res.status(200).json(allArticles) // Оригінальний JSON
  }
})
```

### 3. Створення шаблонів

#### 3.1 PUG шаблони (views/pug/)

**users.pug** - список користувачів:

```pug
doctype html
html(lang="uk")
  head
    title Список користувачів
    link(rel="stylesheet", href="/css/styles.css")
  body
    .container
      h1 👥 Користувачі
      .users-list
        each user in users
          a.user-item(href=`/users/${user.id}`)
            .user-name= user.name
            .user-id ID: #{user.id}
```

**user-detail.pug** - деталі користувача:

```pug
doctype html
html(lang="uk")
  head
    title= `Користувач: ${user.name}`
    link(rel="stylesheet", href="/css/styles.css")
  body
    .container
      h1 👤 Деталі користувача
      .detail-info
        p Ім'я: #{user.name}
        p ID: #{user.id}
      a(href="/users") ← Назад до списку
```

#### 3.2 EJS шаблони (views/ejs/)

**articles.ejs** - список статей:

```html
<!DOCTYPE html>
<html lang="uk">
  <head>
    <title>Список статей</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <div class="container">
      <h1>📚 Статті</h1>
      <div class="articles-list">
        <% articles.forEach(article => { %>
        <a href="/articles/<%= article.id %>" class="article-item">
          <div class="article-title"><%= article.title %></div>
          <div class="article-id">ID: <%= article.id %></div>
        </a>
        <% }) %>
      </div>
    </div>
  </body>
</html>
```

### 4. CSS стилізація

#### 4.1 Мінімальні вимоги

- **Створити CSS файл**: `public/css/styles.css`
- **Підключити до шаблонів**: `<link rel="stylesheet" href="/css/styles.css">`
- **Тести перевіряють**: наявність CSS файлу та його завантаження
- **Дизайн**: будь-який сучасний стиль (детальні CSS класи не критичні для тестування)

### 5. Додаткові API маршрути

#### 5.1 Явні API ендпоінти

Додати маршрути з префіксом `/api/` для явного JSON доступу:

```javascript
// API маршрути (завжди JSON)
app.get('/api/users', (req, res) => {
  /* JSON only */
})
app.get('/api/articles', (req, res) => {
  /* JSON only */
})
// ... інші CRUD операції
```

### 6. Тестування нового функціоналу

#### 6.1 Збереження існуючих тестів

- **Важливо**: Всі 23 існуючі API тести повинні проходити без змін
- **Зворотна сумісність**: JSON відповіді за замовчуванням

#### 6.2 Нові тести шаблонізаторів

Додати тестовий файл `templates.test.js`:

```javascript
// Тестування PUG
test('GET /users з Accept: text/html повертає HTML з PUG')
test('GET /users/:userId з Accept: text/html повертає PUG деталі')

// Тестування EJS
test('GET /articles з Accept: text/html повертає HTML з EJS')
test('GET /articles/:articleId з Accept: text/html повертає EJS деталі')

// Тестування зворотної сумісності
test('GET /users без Accept заголовка повертає JSON')
test('GET /articles з Accept: application/json повертає JSON')

// Тестування статичних файлів
test('GET /css/styles.css повертає CSS файл')
```

### 7. Структура файлів

```
src/
├── views/                    # 🆕 Шаблони
│   ├── pug/                 # 🆕 PUG шаблони
│   │   ├── users.pug        # 🆕 Список користувачів
│   │   └── user-detail.pug  # 🆕 Деталі користувача
│   └── ejs/                 # 🆕 EJS шаблони
│       ├── articles.ejs     # 🆕 Список статей
│       └── article-detail.ejs # 🆕 Деталі статті
├── public/                   # 🆕 Статичні файли
│   └── css/
│       └── styles.css       # 🆕 CSS стилі
├── __test__/
│   ├── task1.test.js        # ✅ Існуючі API тести
│   └── templates.test.js    # 🆕 Тести шаблонізаторів
├── server.mjs               # 🔄 Модифікований сервер
└── ASSIGNMENT.md            # 🔄 Це завдання
```

### 8. Демонстрація результату

#### 8.1 Браузерне тестування

```bash
# Відкрити у браузері для перегляду HTML сторінок
http://localhost:3000/users           # PUG список користувачів
http://localhost:3000/users/test-user-1  # PUG деталі користувача
http://localhost:3000/articles       # EJS список статей
http://localhost:3000/articles/test-article-1  # EJS деталі статті
```

#### 8.2 API тестування (збережена функціональність)

```bash
# JSON API (як раніше)
curl -X GET http://localhost:3000/users
curl -X GET http://localhost:3000/articles

# Явний JSON запит
curl -H "Accept: application/json" http://localhost:3000/users

# HTML шаблони
curl -H "Accept: text/html" http://localhost:3000/users
curl -H "Accept: text/html" http://localhost:3000/articles
```

## Очікувані результати

1. **🔄 Модифікований сервер** - існуючий сервер розширений шаблонізаторами
2. **✅ Збереження API** - всі 23 існуючі тести проходять
3. **🆕 HTML сторінки** - красиві шаблони з PUG та EJS
4. **🎨 Сучасний дизайн** - CSS3 з градієнтами та анімаціями
5. **🧪 Розширене тестування** - +15 тестів для шаблонізаторів
6. **📚 Оновлена документація** - README з прикладами використання

## Ключові принципи

### ✅ Зворотна сумісність

- **Всі існуючі тести проходять**
- **API працює як раніше**
- **JSON за замовчуванням**

### 🆕 Нова функціональність

- **HTML сторінки через шаблонізатори**
- **Умовне рендерування за Accept заголовком**
- **Сучасний responsive дизайн**

### 🏗️ Розширюваність

- **Легке додавання нових шаблонізаторів**
- **Модульна структура views**
- **Гнучка конфігурація рендерингу**

---

**Результат**: Існуючий Express сервер з мідлварами тепер підтримує як API, так і красиві HTML сторінки з різними шаблонізаторами, демонструючи повне розуміння full-stack веб-розробки.
