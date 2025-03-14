.PHONY: lint
lint:
	@echo "Running linter..."
	uv run ruff format .
	uv run ruff check --fix .
	# uv run mypy .