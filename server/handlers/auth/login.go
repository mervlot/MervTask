package authhandler

import (
	"fmt"
	"mervtask/services/authentication"
	"mervtask/services/db"
	"mervtask/services/security"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type user struct {
	UserName string `json:"user_name" binding:"required"`
	Password string `json:"password" binding:"required"`
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
			ctx.JSON(400, gin.H{"error1": err.Error()})
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
		fmt.Println(userid)
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
		if err := security.VerifyHashPassword(userData.Password, user.Password); err != nil {
			ctx.JSON(200, gin.H{"msg": "invalid passord"})
		}
		access_token, err := authentication.AccessToken(userid, userData.UserName, userData.Email, userData.Age)
		if err != nil {
			ctx.JSON(400, gin.H{
				"error": "an Error Ocured",
			})
			return
		}

		refresh_token, err := authentication.RefreshToken(int(userData.ID), user.UserName)
		if err != nil {
			ctx.JSON(400, gin.H{
				"error": "an Error Ocured",
			})
			return
		}
		ctx.SetCookie("access_token", access_token, 24*60*60, "/", "localhost", false, true)
		ctx.SetCookie("refresh_token", refresh_token, 30*24*60*60, "/", "localhost", false, true)
		ctx.JSON(200, gin.H{"msg": "logged in all cookies set to roll"})
	}
}
