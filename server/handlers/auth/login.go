package authhandler

import (
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

		// check if request body is empty
		if ctx.Request.ContentLength == 0 {
			ctx.JSON(400, gin.H{"error": "empty data"})
			return
		}

		// bind JSON into struct
		if err := ctx.ShouldBind(&user); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// check if user exists
		exists, _ := db.CheckIfUserExist(conn, user.UserName)
		if !exists {
			ctx.JSON(404, gin.H{"error": "user not found"})
			return
		}

		userid, err := db.GetUserID(conn, user.UserName)
		if err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		userData, err := db.GetUser(conn, userid)
		if err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// verify password
		if err := security.VerifyHashPassword(userData.Password, user.Password); err != nil {
			ctx.JSON(401, gin.H{"error": "invalid password"})
			return
		}

		// generate access token
		accessToken, err := authentication.AccessToken(userid, userData.UserName, userData.Email, userData.Age)
		if err != nil {
			ctx.JSON(500, gin.H{"error": "failed to create access token"})
			return
		}

		// generate refresh token
		refreshToken, err := authentication.RefreshToken(int(userData.ID), user.UserName)
		if err != nil {
			ctx.JSON(500, gin.H{"error": "failed to create refresh token"})
			return
		}

		// set cookies (no domain → stick to current host)
		ctx.SetCookie("access_token", accessToken, 24*60*60, "/", "", false, true)
		ctx.SetCookie("refresh_token", refreshToken, 30*24*60*60, "/", "", false, true)

		ctx.JSON(200, gin.H{"msg": "logged in successfully"})
	}
}
