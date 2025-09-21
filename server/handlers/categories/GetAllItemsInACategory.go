package categoryhandler

import (
	db "mervtask/services/db/categories"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type GetAllItemsInACategoryRequest struct {
	CategoryName string `json:"category_name" binding:"required"`
}

func GetAllItemsInACategoryHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
			return
		}
		user_id, ok := userId.(int)
		if !ok {

			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
			return
		}
		var req GetAllItemsInACategoryRequest
		if err := ctx.BindJSON(&req); err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		data, err := db.GetAllItemsInACategory(conn, user_id, req.CategoryName)
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		ctx.JSON(200, data)
	}
}
