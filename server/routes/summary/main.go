package summary

import (

	"github.com/gin-gonic/gin"
)
func SummaryRoute(r *gin.Engine){
	summary := r.Group("/summary")
	{
		summary.GET("")
	}
}