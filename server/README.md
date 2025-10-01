# MervTask Server

This directory contains the **Golang Gin** backend API for MervTask.

## Features

- RESTful API for task management
- Modular architecture:
  - `handlers/` — API endpoint logic
  - `middlewares/` — Gin middlewares
  - `routes/` — Route definitions
  - `db/` — Database models and logic
  - `services/` — Business logic
  - `types/` — Custom type definitions
  - `store/` — Data storage layer

## Getting Started

1. Install Go (v1.18+ recommended)
2. Initialize dependencies:
   ```bash
   go mod tidy
   ```
3. Run the server:
   ```bash
   go run main.go
   ```
4. The API defaults to `localhost:8080`

## API Endpoints

*See code in `handlers/` and `routes/` for endpoint documentation.*

## Contributing

- Add new endpoints in `handlers/` and update `routes/`
- Document types in `types/`

---

See the main [README.md](../README.md) for overall project and usage.
