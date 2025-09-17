package authhandler

import (
	"fmt"
	"mervtask/services/db"
	"mervtask/services/security"
	"mervtask/types"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func RegisterHandler(conn *pgx.Conn) gin.HandlerFunc {

	return func(ctx *gin.Context) {
		var user types.User
		if ctx.Request.ContentLength == 0 {
			ctx.JSON(400, gin.H{"error": "empty data"})
			return
		}
		if err := ctx.Bind(&user); err != nil {
			ctx.JSON(401, gin.H{"msg": fmt.Sprintf("error: %v", err)})
			return
		}
		hash_password, _ := security.HashPassword(user.Password, 10)
		err := db.SaveUser(conn, user, hash_password)
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		ctx.JSON(200, gin.H{"msg": "regsterd"})

	}
}
