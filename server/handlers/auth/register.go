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
		logi, _ := db.CheckIfUserExist(conn, user.UserName)
		fmt.Println(logi)
		if logi {
			ctx.JSON(400, gin.H{"msg": "user exists"})
			return
		}
		logi, _ = db.CheckIfEmailExist(conn, user.Email)
		fmt.Println(logi)
		if logi {
			ctx.JSON(400, gin.H{"msg": "email taken"})
			return
		}
		hash_password, _ := security.HashPassword(user.Password, 10)
		err := db.SaveUser(conn, user, hash_password)
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}

		ctx.JSON(200, gin.H{"msg": "regsterd"})
		// ctx.Redirect(http.StatusSeeOther, "/auth/login/")
	}
}
