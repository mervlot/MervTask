package summaryhandler

import (
	db "mervtask/services/db/summary"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetAllMonthlySummaryHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(c *gin.Context) {
		valueid, exists := c.Get("user_id")
		if exists {
			c.JSON(500, gin.H{"error": "user_id not found in context"})
			return
		}
		_, ok := valueid.(int)
		if !ok {
			c.JSON(500, gin.H{"error": "Invalid user_id type"})
			return
		}
		summaryData, err := db.GetMonthlySummary(conn)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, summaryData)
	}
}
