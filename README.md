# Gmail Scam Analyzer Chatbot

This project provides a basic skeleton for an AI-powered Gmail scam-mail analyzer. It combines a Next.js frontend, a NestJS backend API, and a Python FastAPI service for machine learning inference.

## Repository Structure

- `frontend/` – Next.js + TypeScript web application.
- `backend/` – NestJS API server and authentication logic.
- `ai_service/` – FastAPI service hosting the AI model.
- `infrastructure/` – Infrastructure-as-code scripts (e.g., Docker, Kubernetes, Terraform).

Each directory contains a minimal setup so you can start developing individual services independently.

## Getting Started

1. Install dependencies for each service:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ../ai_service && pip install -r requirements.txt
   ```
2. Start the development servers (from project root):
   ```bash
   npm --prefix frontend run dev
   npm --prefix backend run start:dev
   uvicorn ai_service.app.main:app --reload
   ```

This setup is only a starting point. Review the detailed architecture in the project planning documents to expand functionality.
