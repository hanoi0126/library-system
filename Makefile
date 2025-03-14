.PHONY: up down backend frontend

# Start both backend and frontend
up:
	@echo "Starting backend and frontend..."
	@make -j 2 backend frontend

# Stop all services
down:
	@echo "Stopping services..."
	@pkill -f "uvicorn app.app:app" || true
	@pkill -f "npm run dev" || true
	@echo "Services stopped"

# Start backend
backend:
	@echo "Starting backend..."
	@cd backend && make run

# Start frontend
frontend:
	@echo "Starting frontend..."
	@cd frontend && npm run dev
