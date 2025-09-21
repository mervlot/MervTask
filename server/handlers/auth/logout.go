package authhandler

import "github.com/gin-gonic/gin"
func LogoutHandler (ctx *gin.Context){
	ctx.SetCookie("access_token", "", 0, "/","",false,true)
	ctx.SetCookie("refresh_token", "", 0, "/","",false,true)
}