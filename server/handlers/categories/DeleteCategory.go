package categoryhandler

import (
	db "mervtask/services/db/categories"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type category struct {
	CategoryName string `json:"category_name" binding:"required"`
}

func DeleteCategoryHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var category category
		if err := ctx.BindJSON(&category); err != nil {
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
		err := db.DeleteCategory(conn, category.CategoryName)
		if err != nil {
			ctx.JSON(404, gin.H{"msg": err.Error()})
			return
		}
		ctx.JSON(200, gin.H{"msg": "category deleted"})
	}
}
