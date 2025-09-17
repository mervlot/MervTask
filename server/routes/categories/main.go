package categories

import (

	"github.com/gin-gonic/gin"
)
func CategoriesRoute(r *gin.Engine){
	categories := r.Group("/categories")
	{
		categories.GET("")
	}
}