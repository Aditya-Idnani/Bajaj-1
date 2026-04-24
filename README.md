# Full Stack Tree Viz Project

A modern full-stack web application for evaluating graph and tree relationships from data entries.

## Project Structure

- `backend/`: Node.js, Express REST API (`POST /bfhl`)
- `frontend/`: React, Vite, Tailwind CSS SPA

## Custom Features

1. **Live Graph visualizer**: Renders SVG components of each tree and cyclic dependencies natively without external visual dependencies.
2. **Export to JSON**: Added functionality to seamlessly download parsed hierarchy.

## How to Run

You will need two terminal windows.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be exposed at `http://localhost:5173` and communicate with the backend at `http://localhost:3000`.

## Clean Architecture
There are strictly zero comments in the codebase, adhering to coding rules while retaining descriptive structured organization.
# Baja-1
