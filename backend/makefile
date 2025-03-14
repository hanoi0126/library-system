.PHONY: lint
lint:
	@echo "Running linter..."
	uv run ruff format .
	uv run ruff check --fix .
	uv run mypy .


.PHONY: run
run:
	@echo "Running server..."
	uv run fastapi dev