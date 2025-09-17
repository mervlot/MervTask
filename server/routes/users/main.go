package users

import (

	"github.com/gin-gonic/gin"
)
func UsersRoute(r *gin.Engine){
	users := r.Group("/users")
	{
		users.GET("")
	}
}