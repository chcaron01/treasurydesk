package db

import (
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost port=5432 user=treasury password=treasury dbname=treasury sslmode=disable"
	}

	var err error
	// Retry a few times to allow postgres to start in Docker
	for i := range 10 {
		DB, err = sql.Open("postgres", dsn)
		if err == nil {
			err = DB.Ping()
		}
		if err == nil {
			log.Println("Connected to database")
			return
		}
		log.Printf("DB connection attempt %d failed: %v", i+1, err)
		time.Sleep(2 * time.Second)
	}
	log.Fatalf("Could not connect to database: %v", err)
}
