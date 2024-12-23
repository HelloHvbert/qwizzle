# Etap 1: Budowanie aplikacji
FROM golang:1.23.1-alpine AS builder

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj pliki `go.mod` i `go.sum`, aby zainstalować zależności
COPY go.mod go.sum ./

# Pobierz zależności
RUN go mod download

# Skopiuj resztę plików projektu do kontenera
COPY . .

# Skonfiguruj zmienną środowiskową Go, aby zbudować aplikację jako binarkę
RUN go build -o main .

# Etap 2: Utworzenie ostatecznego obrazu
FROM alpine:latest

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj zbudowaną binarkę z poprzedniego etapu
COPY --from=builder /app/main .

# Eksponuj port aplikacji
EXPOSE 8080

# Uruchom aplikację
CMD ["./main"]
