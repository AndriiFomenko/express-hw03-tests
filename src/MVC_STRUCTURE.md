# MVC Architecture Documentation

## 🏗️ Структура проекту

Проект було реорганізовано згідно з патерном MVC (Model-View-Controller) та кращими практиками Express.js.

### 📁 Структура папок

```
src/
├── models/               # Моделі (логіка роботи з даними)
│   ├── UserModel.js     # Модель користувача
│   └── ArticleModel.js  # Модель статті
├── views/               # Шаблони (View layer)
│   ├── pug/            # PUG шаблони для користувачів
│   └── ejs/            # EJS шаблони для статей
├── controllers/         # Контроллери (обробка HTTP запитів)
│   ├── UserController.js     # Контроллер користувачів
│   └── ArticleController.js  # Контроллер статей
├── routes/              # Маршрути (роутери Express)
│   ├── userRoutes.js    # Маршрути користувачів
│   └── articleRoutes.js # Маршрути статей
├── middleware/          # Проміжне програмне забезпечення
│   ├── auth.js         # Автентифікація
│   ├── validation.js   # Валідація даних
│   ├── logger.js       # Логування
│   ├── accessControl.js # Контроль доступу
│   └── existence.js    # Перевірка існування ресурсів
├── config/              # Конфігурація
│   └── express.js      # Налаштування Express
├── public/              # Статичні файли
├── __test__/           # Тести
└── app.js              # Головний файл додатку (точка входу)
```

## 📋 Компоненти MVC

### 🗃️ Models (Моделі)

**Відповідальність**: Логіка роботи з даними, бізнес-логіка

#### UserModel.js

- `getAllUsers()` - отримати всіх користувачів
- `getUserById(userId)` - отримати користувача за ID
- `createUser(userData)` - створити користувача
- `updateUser(userId, userData)` - оновити користувача
- `deleteUser(userId)` - видалити користувача
- `userExists(userId)` - перевірити існування користувача

#### ArticleModel.js

- `getAllArticles()` - отримати всі статті
- `getArticleById(articleId)` - отримати статтю за ID
- `createArticle(articleData)` - створити статтю
- `updateArticle(articleId, articleData)` - оновити статтю
- `deleteArticle(articleId)` - видалити статтю
- `articleExists(articleId)` - перевірити існування статті

### 🎮 Controllers (Контроллери)

**Відповідальність**: Обробка HTTP запитів, взаємодія з моделями, повернення відповідей

#### UserController.js

- `getAllUsers()` - HTML/JSON списoк користувачів
- `getUserById()` - HTML/JSON деталі користувача
- `createUser()` - створення користувача (JSON)
- `updateUser()` - оновлення користувача (JSON)
- `deleteUser()` - видалення користувача (JSON)

#### ArticleController.js

- `getAllArticles()` - HTML/JSON список статей
- `getArticleById()` - HTML/JSON деталі статті
- `createArticle()` - створення статті (JSON)
- `updateArticle()` - оновлення статті (JSON)
- `deleteArticle()` - видалення статті (JSON)

### 🛤️ Routes (Маршрути)

**Відповідальність**: Визначення URL ендпоїнтів та підключення middleware

#### userRoutes.js

- `createUserRoutes()` - створює роутер для користувачів
- `createUserAPIRoutes()` - створює API роутер для користувачів

#### articleRoutes.js

- `createArticleRoutes()` - створює роутер для статей
- `createArticleAPIRoutes()` - створює API роутер для статей

### 🔧 Middleware

**Відповідальність**: Проміжна обробка запитів

#### auth.js

- `demoAuth()` - демо автентифікація
- `strictAuth()` - сувора автентифікація

#### validation.js

- `validateUserData()` - валідація даних користувача
- `validateArticleData()` - валідація даних статті

#### logger.js

- `logRequests()` - логування всіх запитів

#### accessControl.js

- `demoArticleAccess()` - контроль доступу до статей

#### existence.js

- `createCheckUserExists()` - фабрика для перевірки існування користувача
- `createCheckArticleExists()` - фабрика для перевірки існування статті

## 🚀 Переваги MVC структури

### ✅ Розділення відповідальностей

- **Models**: Тільки логіка даних
- **Views**: Тільки презентація (шаблони)
- **Controllers**: Тільки обробка запитів

### ✅ Масштабованість

- Легко додавати нові моделі, контроллери, маршрути
- Модульна структура дозволяє розробляти компоненти незалежно

### ✅ Тестованість

- Кожен компонент можна тестувати окремо
- Легка підміна залежностей для unit тестів

### ✅ Підтримуваність

- Зрозуміла структура для нових розробників
- Легко знайти потрібний код
- Зміни в одному компоненті не впливають на інші

### ✅ Повторне використання

- Middleware можна використовувати в різних маршрутах
- Моделі можна використовувати в різних контроллерах
- Контроллери можна використовувати з різними маршрутами

## 🔄 Потік обробки запиту

```
HTTP Request → Route → Middleware → Controller → Model → Controller → View/JSON Response
```

1. **Route** визначає який контроллер викликати
2. **Middleware** обробляє запит (логування, валідація, автентифікація)
3. **Controller** отримує дані з моделі
4. **Model** виконує логіку роботи з даними
5. **Controller** повертає HTML (через шаблон) або JSON

## 🧪 Сумісність з тестами

Всі існуючі тести (38/38) проходять успішно:

- ✅ 23 тести middleware та API функціональності
- ✅ 15 тестів шаблонізаторів (PUG/EJS)

## 🛠️ Майбутні покращення

1. **Dependency Injection**: Використання DI контейнера
2. **Repository Pattern**: Абстракція роботи з даними
3. **Service Layer**: Винесення бізнес-логіки з контроллерів
4. **Error Handling**: Централізована обробка помилок
5. **Validation Schemas**: Використання Joi/Yup для валідації
6. **Database Integration**: Заміна Map на реальну БД (MongoDB, PostgreSQL)

## 📚 Використані патерни

- **MVC (Model-View-Controller)**: Основна архітектура
- **Factory Pattern**: Створення middleware функцій
- **Dependency Injection**: Передача залежностей в конструктори
- **Middleware Pattern**: Ланцюжок обробки запитів
- **Router Pattern**: Модульні маршрути Express.js
