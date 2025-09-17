package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

var counter int

// Middleware: increments counter and logs it
func CountMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		counter++
		fmt.Println("Middleware hit count:", counter)
		c.Next()
	}
}

// HelloHandler: returns a handler that prints the given message
func HelloHandler(message string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.String(200, message)
	}
}

func main() {
	r := gin.Default()

	// Apply middleware and pass custom message
	r.GET("/", CountMiddleware(), HelloHandler("As-salaam-alaikum, World!"))
	r.GET("/test", CountMiddleware(), HelloHandler("This is a test message"))

	r.Run(":8080")
}
