package categoryhandler

import (
	db "mervtask/services/db/categories"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetAllCategoriesHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		data, err := db.GetAllCategories(conn)
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
		}
		ctx.JSON(200, data)
	}
}
