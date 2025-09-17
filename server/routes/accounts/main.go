package accounts

import (
	"github.com/gin-gonic/gin"
)

func AccountRoute(r *gin.Engine) {
	account := r.Group("/account")
	{
		account.GET("/user", func(ctx *gin.Context) {

		})
	}
}
