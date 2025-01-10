# Phonebook Server

A RESTful API server for managing contacts with support for pagination, sorting, searching, and avatar management.

## Features

- CRUD operations for contacts (name, phone, avatar)
- Pagination with customizable limit
- Sorting by fields (ASC/DESC)
- Search by name or phone number
- Avatar image upload with validation
- PostgreSQL database with Sequelize ORM
- Full test coverage using Mocha and Chai

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Express FileUpload
- Mocha & Chai for testing

## Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phonebook-server.git
   cd phonebook-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database:
   - Create PostgreSQL database
   - Update `config/config.json` with your database credentials

4. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

## API Endpoints

### Contacts
- `GET /api/phonebooks` - Get all contacts (with pagination)
  - Query params:
    - page (default: 1)
    - limit (default: 5)
    - search
    - sortBy
    - sortMode (ASC/DESC)
- `GET /api/phonebooks/:id` - Get contact by ID
- `POST /api/phonebooks` - Create new contact
- `PUT /api/phonebooks/:id` - Update contact
- `PUT /api/phonebooks/:id/avatar` - Update contact's avatar
- `DELETE /api/phonebooks/:id` - Delete contact

## Development

Start development server with auto-reload:
```bash
npm run dev
```

## Testing

Run test suite:
```bash
npm test
```

## Project Structure

```
├── app.js                 # Express app configuration
├── bin/
│   └── www               # Server startup script
├── config/
│   └── config.json       # Database configuration
├── controllers/
│   └── phonebook.js      # Contact business logic
├── models/
│   ├── index.js          # Database models loader
│   └── contact.js        # Contact model definition
├── public/              
│   └── images/           # Avatar storage
├── routes/
│   └── api.js           # API routes
└── test/
    └── phonebook.test.js # API tests
```


