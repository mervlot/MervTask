package authhandler

import (
	"mervtask/services/authentication"
	"mervtask/services/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type user struct {
	UserName string `json:"username" binding:"required"`
}

func LoginHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var user user
		// check if the json is empty you know just in case
		if ctx.Request.ContentLength == 0 {
			ctx.JSON(400, gin.H{"error": "empty data"})
			return
		}

		// bind the data into our struct

		if err := ctx.ShouldBind(&user); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		//check is user exists
		res, _ := db.CheckIfUserExist(conn, user.UserName)
		if !res {
			ctx.JSON(404, gin.H{
				"error": "user not found",
			})
			return
		}
		userid, err := db.GetUserID(conn, user.UserName)
		if err != nil {
			ctx.JSON(400, gin.H{"error gui": err.Error(),
				"msg": userid})
			return
		}
		userData, err := db.GetUser(conn, userid)
		if err != nil {
			ctx.JSON(400, gin.H{"error gu": err.Error()})
			return
		}
		token, err := authentication.AccessToken(userid, userData.UserName, userData.Email, userData.Age)
		if err != nil {
			ctx.JSON(400, gin.H{
				"error": "an Error Ocured",
			})
			return
		}
		ctx.SetCookie("access_token", token, 60*60, "/", "", false, true)

	}
}
