package transactions

import (

	"github.com/gin-gonic/gin"
)
func TransactionsRoute(r *gin.Engine){
	transactions := r.Group("/transactions")
	{
		transactions.GET("")
	}
	
}