package transactionhandler

import (
	db "mervtask/services/db/transaction"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type transactionData struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
	ExpenseType string  `json:"expense_type" binding:"required"`
	Category    string  `json:"category" binding:"required"`
}

func PostTransactionHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var transactionData transactionData
		if err := ctx.BindJSON(&transactionData); err != nil {
			ctx.JSON(200, gin.H{
				"msg": err.Error(),
			})
		}
		val, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
			return
		}
		user_id, ok := val.(int)
		if !ok {

			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
			return
		}
		err := db.AddTransaction(conn, user_id, transactionData.Title, transactionData.Description, transactionData.Amount, transactionData.ExpenseType, transactionData.Category)
		if err != nil {

			ctx.JSON(400, gin.H{"msg": err})
			return
		}
	}
}
