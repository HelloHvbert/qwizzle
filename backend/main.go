package main

import (
	"api/db"
	"api/routes"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	db.InitDB()

  r := gin.Default()
	// Konfiguracja CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"}, // Domena frontendu
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},	
		AllowHeaders:     []string{"Content-Type", "Authorization", "Access-Control-Allow-Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,                              // Pozwala na wysyłanie cookies
		MaxAge:           12 * time.Hour,
	}))

	
	routes.RegisterRoutes(r)

  godotenv.Load(".env")
  port := os.Getenv("PORT")
  r.Run(":" + port) // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}