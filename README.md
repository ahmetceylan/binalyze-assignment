# Todo Application

A full-stack todo application with user authentication, todo groups, and todo items management.

## Technologies

### Backend

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger API Documentation

### Frontend

- Vue.js
- Vite
- Axios
- Vuetify

## Environment Setup

Create a `.env` file in the /backend directory with the following variables:

PORT=3000
NODE_ENV=development
JWT_SECRET=jwt_secret

POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=todo_list
DATABASE_PORT=5432
DATABASE_HOST=localhost

## Running the Application

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

### Running Services Individually

#### Backend

```bash:README.md
# Navigate to backend directory
cd backend

# Install dependencies
yarn install

# Run in development mode
yarn start

```

#### Frontend

```bash:README.md
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn

# Run in development mode
yarn dev

```

## Testing

### Backend Tests

```bash
# Navigate to backend directory
cd backend

# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run unit tests
yarn test:unit
```

## API Documentation

The API documentation is available via Swagger UI at http://localhost:3000/api when the backend is running.

## Development Workflow

1. Start the database and backend services:

   ```bash
   cd backend
   docker-compose up -d db
   yarn start:dev
   ```

2. In a separate terminal, start the frontend:

   ```bash
   cd frontend
   yarn dev
   ```

### bcrypt Issues in Docker

If you encounter bcrypt-related errors in Docker, rebuild the backend image with:

```bash
docker-compose build --no-cache backend
```
