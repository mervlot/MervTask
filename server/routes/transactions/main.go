package transactions

import (
	transactionhandler "mervtask/handlers/transactions"
	"mervtask/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func TransactionsRoute(conn *pgx.Conn, r *gin.Engine) {
	transactions := r.Group("/transactions")
	{
		transactions.GET("/", middlewares.Validator(conn), transactionhandler.GetTransactionsHandler(conn))
		transactions.GET("/tx", middlewares.Validator(conn), transactionhandler.GetATransactionHandler(conn))
		transactions.POST("/", middlewares.Validator(conn), transactionhandler.PostTransactionHandler(conn))
		transactions.PATCH("/", middlewares.Validator(conn), transactionhandler.UpdateTransactionHandler(conn))
		transactions.DELETE("/", middlewares.Validator(conn), transactionhandler.DeleteTransactionHandler(conn))
	}

}
