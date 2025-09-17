package auth

import (
	authhandler "mervtask/handlers/auth"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func AuthRoute(r *gin.Engine, conn *pgx.Conn) {

	auth := r.Group("/auth")
	{
		auth.POST("/login", authhandler.LoginHandler(conn))
		auth.POST("/register", authhandler.RegisterHandler(conn))
	}
}
