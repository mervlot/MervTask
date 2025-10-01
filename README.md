# MervTask

A modern, cross-platform task manager built with **Golang Gin** for the backend and **React** for the frontend.

## Features

- Fast RESTful API using Go (Gin)
- Web client built with React & TypeScript
- Mobile client built with React Native
- Modular folder structure for easy development
- Task CRUD operations
- User authentication (planned/implemented)
- Responsive UI, optimized for desktop and mobile

## Folder Structure

- `/server` — Go backend (API, handlers, services, database)
- `/web` — React web client (TypeScript)
- `/web/public` — Static assets for web app
- `/server/public` — Static assets for backend (if needed)

## Getting Started

### Backend (server)

1. **Install Go**
2. Navigate to `server` and run:
   ```bash
   go mod tidy
   go run main.go
   ```
3. The API will be available on `localhost:5300` (default).

### Web (React)

1. **Install Node.js & npm**
2. Navigate to `web`, then:
   ```bash
   pnpm install
   pnpm run dev
   ```
3. Visit `localhost:5173` to view the web UI.


## Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes
4. Open a pull request

## License

See [LICENCE.md](LICENCE.md)

## Maintainers

See [AUTHORS.md](AUTHORS.md)

---

**Explore the `server/` and `web/` folders for backend and frontend details.**
