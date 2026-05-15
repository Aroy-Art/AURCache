ARG TARGET_ARCH=linux/amd64
ARG LATEST_COMMIT_SHA=dev
ARG APP_VERSION=dev

FROM --platform=linux/amd64 oven/bun:1 AS frontend_builder
ARG APP_VERSION
WORKDIR /app

COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./
COPY backend/aurcache/Cargo.toml /tmp/Cargo.toml
RUN VITE_APP_VERSION=${APP_VERSION:-$(grep '^version' /tmp/Cargo.toml | sed -E 's/version *= *"([^"]+)"/\1/')} bun run build

FROM --platform=linux/amd64 rust:1.95.0 AS builder
ARG LATEST_COMMIT_SHA
ENV LATEST_COMMIT_SHA=${LATEST_COMMIT_SHA}
# Install necessary tools and dependencies

WORKDIR /app

# Copy the Rust project files
COPY backend/ /app/
COPY --from=frontend_builder /app/dist /app/aurcache-api/web

ARG TARGET_ARCH
ADD docker/build-rust.sh /root
RUN bash /root/build-rust.sh $TARGET_ARCH

FROM --platform=$TARGET_ARCH quay.io/podman/stable:v5.8.2
# Copy the built binary from the previous stage
COPY --from=builder --chmod=0755 /app/target/aurcache /usr/local/bin/aurcache
COPY --chmod=0755 docker/entrypoint.sh /entrypoint.sh

# add alpm-pkgbuild-bridge
ADD --chmod=755 https://gitlab.archlinux.org/archlinux/alpm/alpm-pkgbuild-bridge/-/raw/main/alpm-pkgbuild-bridge.sh?ref_type=heads /usr/local/bin/alpm-pkgbuild-bridge

WORKDIR /app
CMD ["/entrypoint.sh"]
