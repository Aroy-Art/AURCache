clean:
  cd backend && cargo clean
  cd frontend && rm -rf dist node_modules

codegen:
  cd frontend && bun install

format:
  cd backend && cargo fmt

lint:
  cd backend && cargo clippy
  cd frontend && bun run build
