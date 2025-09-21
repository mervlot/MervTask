package transactionhandler

import (
	db "mervtask/services/db/transaction"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type transaction struct {
	TxID        int     `json:"tx_id" binding:"required"`
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
	TxType      string  `json:"tx_type" binding:"required"`
	Category    string  `json:"category" binding:"required"`
}

func UpdateTransactionHandler(conn *pgx.Conn) gin.HandlerFunc {
	var transaction transaction
	return func(ctx *gin.Context) {
		if err := ctx.BindJSON(&transaction); err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return 
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
		err := db.UpdateTransaction(
            conn,
            user_id, // Ensure userID is cast to int
            transaction.TxID,
            transaction.Title,
            transaction.Description,
            transaction.Amount,
            transaction.TxType,
            transaction.Category,
        )
		if err != nil {
			ctx.JSON(404,gin.H{"msg":err.Error()})
			return 
		}
		ctx.JSON(200, gin.H{"msg":"transaction updated"})
	}

}
