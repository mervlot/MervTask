package users

import (
	userhandler "mervtask/handlers/users"
	"mervtask/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)
func UsersRoute(conn *pgx.Conn, r *gin.Engine){
	users := r.Group("/users")
	{
		users.GET("/", middlewares.Validator(conn), userhandler.GetUserHandler(conn))
		users.PATCH("/", middlewares.Validator(conn), userhandler.UpdateUserHandler(conn))
		users.DELETE("/", middlewares.Validator(conn), userhandler.DeleteUserHandler(conn))

	}
}