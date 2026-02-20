package main

import (
	"os"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/gin-gonic/gin"

	"go-test/db"
	"go-test/handler"
)

func corsOrigin() string {
	if origin := os.Getenv("CORS_ORIGIN"); origin != "" {
		return origin
	}
	return "http://localhost:5173"
}

func corsMiddleware(origin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	db.InitDB()

	r := gin.Default()
	r.Use(corsMiddleware(corsOrigin()))

	config := huma.DefaultConfig("Treasury Yields API", "1.0.0")
	api := humagin.New(r, config)

	handler.RegisterRoutes(api)

	r.Run(":8080")
}
