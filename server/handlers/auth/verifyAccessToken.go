package authhandler

import (
	"mervtask/services/authentication"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func VerifyAccessToken(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookie, err := ctx.Cookie("access_token")
		if err != nil {
			ctx.JSON(401, gin.H{"msg": "token not found"})
			return
		}

		_, err = authentication.VerifyJWTAccess(cookie)
		if err != nil {
			ctx.JSON(401, gin.H{"msg": err.Error()})
			return
		}

		ctx.JSON(200, gin.H{"msg": "valid access token"})
	}
}
