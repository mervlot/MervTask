package categoryhandler

import (
	db "mervtask/services/db/categories"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type categoryUpdate struct {
	OldCategoryName string `json:"old_category_name" binding:"required"`
	NewCategoryName string `json:"new_category_name" binding:"required"`
}

func UpdateCategoryHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var categoryUpdate categoryUpdate
		if err := ctx.BindJSON(&categoryUpdate); err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		val, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
			return
		}
		_, ok := val.(int)
		if !ok {

			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
			return
		}
		 err := db.UpdateCategory(conn, categoryUpdate.OldCategoryName, categoryUpdate.NewCategoryName)
		if err != nil {
			ctx.JSON(404, gin.H{"msg": err.Error()})
			return
		}
	}
}
