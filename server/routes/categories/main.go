package categories

import (
	categoryhandler "mervtask/handlers/categories"
	"mervtask/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func CategoriesRoute(conn *pgx.Conn, r *gin.Engine) {
	categories := r.Group("/categories")
	{
		categories.GET("/", middlewares.Validator(conn), categoryhandler.GetAllCategoriesHandler(conn))
		categories.DELETE("/", middlewares.Validator(conn), categoryhandler.DeleteCategoryHandler(conn))
		categories.PUT("/", middlewares.Validator(conn), categoryhandler.UpdateCategoryHandler(conn))
		categories.POST("/items", middlewares.Validator(conn), categoryhandler.GetAllItemsInACategoryHandler(conn))
	}
}
