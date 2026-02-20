FROM golang:1.25-alpine

# Install air for live reload
RUN go install github.com/air-verse/air@latest

WORKDIR /app

# Copy go.mod and go.sum first so dependencies are cached
COPY go.mod go.sum ./
RUN go mod download

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]
