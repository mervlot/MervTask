package authhandler

import (
	"mervtask/services/authentication"
	"mervtask/services/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func VerifyRefreshToken(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookie, err := ctx.Cookie("refresh_token")
		if err != nil {
			ctx.JSON(401, gin.H{"msg": "refresh token not found"})
			return
		}

		claims, err := authentication.VerifyJWTRefresh(cookie)
		if err != nil {
			ctx.JSON(401, gin.H{"msg": "invalid refresh token"})
			return
		}

		// extract user from DB
		userData, err := db.GetUser(conn, claims.UserID)
		if err != nil {
			ctx.JSON(500, gin.H{"msg": "internal database error"})
			return
		}

		// make new access token
		newAccessToken, err := authentication.AccessToken(userData.ID, userData.UserName, userData.Email, userData.Age)
		if err != nil {
			ctx.JSON(500, gin.H{"msg": "failed to create new access token"})
			return
		}

		ctx.SetCookie("access_token", newAccessToken, 24*60*60, "/", "", false, true)

		ctx.JSON(200, gin.H{"msg": "new access token issued"})
	}
}
