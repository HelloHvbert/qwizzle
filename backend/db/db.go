package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	var err error

	// Wartości do połączenia z bazą danych PostgreSQL
	godotenv.Load(".env")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// DSN (Data Source Name)
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Otwarcie połączenia z bazą danych PostgreSQL
	DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	// Sprawdzenie połączenia
	err = DB.Ping()
	if err != nil {
		fmt.Println(err)
		log.Fatalf("Cannot ping the database: %v", err)
	}

	// Ustawienia połączeń
	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)
	fmt.Println("Connected to the database!")
	// createTables()
}

func createTables() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);
	`

	_, err := DB.Exec(createUsersTable)
	if err != nil {
		log.Fatalf("Failed to create the users table: %v", err)
	}

	createEventsTable := `
	CREATE TABLE IF NOT EXISTS events (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		location TEXT NOT NULL,
		dateTime TIMESTAMP NOT NULL,
		user_id INTEGER,
		FOREIGN KEY (user_id) REFERENCES users(id)
	);
	`

	_, err = DB.Exec(createEventsTable)
	if err != nil {
		log.Fatalf("Failed to create the events table: %v", err)
	}

	createRegistrationsTable := `
	CREATE TABLE IF NOT EXISTS registrations (
		id SERIAL PRIMARY KEY,
		user_id INTEGER,
		event_id INTEGER,
		FOREIGN KEY (user_id) REFERENCES users(id),
		FOREIGN KEY (event_id) REFERENCES events(id)
	);
	`

	_, err = DB.Exec(createRegistrationsTable)
	if err != nil {
		log.Fatalf("Failed to create the registrations table: %v", err)
	}
}
