package main

import (
	"context"
	"fmt"
	"log"
	"mervtask/routes/accounts"
	"mervtask/routes/auth"
	"mervtask/routes/categories"
	"mervtask/routes/summary"
	"mervtask/routes/transactions"
	"mervtask/routes/users"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}
	conn, err := pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil {
		fmt.Println("error cconnectng to db:", err)
	}
	defer conn.Close(context.Background())

	server := gin.Default()
	server.Static("/img", "./server/public/img")
	server.Static("/json", "./server/public/json")
	server.Static("/js", "./server/public/js")
	server.Static("/public", "./server/public")
	server.GET("/", func(ctx *gin.Context) {
		ctx.String(200, "%v", "hello")
	})
	accounts.AccountRoute(server)
	auth.AuthRoute(server, conn)
	categories.CategoriesRoute(conn, server)
	summary.SummaryRoute(server)
	transactions.TransactionsRoute(conn, server)
	users.UsersRoute(conn,server)
	server.Run("localhost:5300")
}
