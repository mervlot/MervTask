package summary

import (
	summaryhandler "mervtask/handlers/summary"
	"mervtask/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func SummaryRoute(conn *pgx.Conn, r *gin.Engine) {
	summary := r.Group("/summary")
	{
		summary.GET("/", middlewares.Validator(conn), summaryhandler.GetAllSummaryHandler(conn))
		summary.GET("/monthly", middlewares.Validator(conn), summaryhandler.GetAllMonthlySummaryHandler(conn))
		summary.GET("/category", middlewares.Validator(conn), summaryhandler.GetAllCategorySummaryHandler(conn))
	}
}
