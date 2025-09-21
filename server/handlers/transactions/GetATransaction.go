package transactionhandler

import (
	db "mervtask/services/db/transaction"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetATransactionHandler(conn *pgx.Conn) gin.HandlerFunc {
	type transactionid struct {
		Tx int `json:"transaction" binding:"required"`
	}
	return func(ctx *gin.Context) {
		valueid, exists := ctx.Get("user_id")
		if !exists {
			print("1")
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
			return
		}
		user_id, ok := valueid.(int)
		if !ok {
			print("2")

			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
			return
		}
		var transactionid transactionid
		if err := ctx.BindJSON(&transactionid); err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}

		transactionData, err := db.GetTransaction(conn, user_id, transactionid.Tx)
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		ctx.JSON(400, gin.H{"msg": transactionData})
	}
}
