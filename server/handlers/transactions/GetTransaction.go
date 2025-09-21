package transactionhandler

import (
	"fmt"
	db "mervtask/services/db/transaction"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetTransactionsHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		val, exists := ctx.Get("user_id")
		if !exists {
			print("1")
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
			return
		}
		user_id, ok := val.(int)
		if !ok {
			print("2")

			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
			return
		}
		data, err := db.GetUserTransactions(conn, user_id)
		if err != nil {

			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		fmt.Println(data)
		ctx.JSON(200, data)

	}
}
