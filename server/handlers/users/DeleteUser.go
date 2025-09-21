package userhandler

import (
	"mervtask/services/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func DeleteUserHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		valueid, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
		}
		user_id, ok := valueid.(int)
		if !ok {
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
		}
		db.DeleteUser(conn, user_id)
		ctx.SetCookie("access_token", "", 0, "/", "", false, true)
		ctx.SetCookie("refresh_token", "", 0, "/", "", false, true)
		ctx.JSON(200,gin.H{"msg":"we will miss you 😭"})
	}
}
