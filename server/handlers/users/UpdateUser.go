package userhandler

import (
	"mervtask/services/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type userdata struct {
	FirstName string `json:"first_name" binding:"required,alphanum,min=3,max=20"`
	UserName  string `json:"user_name" binding:"required,alphanum,min=3,max=20"`
	LastName  string `json:"last_name" binding:"required,alphanum,min=3,max=20"`
}

func UpdateUserHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userData userdata
		// ✅ must bind to pointer
		if err := ctx.ShouldBindJSON(&userData); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		valueid, exists := ctx.Get("user_id")
		if !exists {
			ctx.JSON(400, gin.H{"msg": "user_id not found in context"})
			return
		}

		user_id, ok := valueid.(int)
		if !ok {
			ctx.JSON(400, gin.H{"msg": "invalid user_id type"})
			return
		}

		// ✅ call db update
		if err := db.UpdateUser(conn, userData.UserName, userData.FirstName, userData.LastName, user_id); err != nil {
			ctx.JSON(500, gin.H{"msg": "unable to update user", "error": err.Error()})
			return
		}

		ctx.JSON(200, gin.H{"msg": "user updated successfully"})
	}
}
