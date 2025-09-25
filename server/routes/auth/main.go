package auth

import (
	authhandler "mervtask/handlers/auth"
	"mervtask/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func AuthRoute(r *gin.Engine, conn *pgx.Conn) {

	auth := r.Group("/auth")
	{
		auth.POST("/login", authhandler.LoginHandler(conn))
		auth.POST("/register", authhandler.RegisterHandler(conn))
		auth.POST("/logout", authhandler.LogoutHandler)
		auth.GET("/me", authhandler.MeHandler(conn))
		auth.GET("/verifyaccess", authhandler.VerifyAccessToken(conn))
		auth.POST("/verifyrefresh", middlewares.Validator(conn), authhandler.VerifyRefreshToken(conn))
	}
}
