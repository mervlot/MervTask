package middlewares

import (
	"fmt"
	"mervtask/services/authentication"
	"mervtask/services/db"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func Validator(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get cookies
		access_cookie, _ := ctx.Cookie("access_token")
		refresh_cookie, _ := ctx.Cookie("refresh_token")

		// verify access token
		accessData, err := authentication.VerifyJWTAccess(os.Getenv("ACCESS_SECRET"), access_cookie)
		if err != nil {
			fmt.Println("1", err)

			// if access token invalid, try refresh token
			refreshData, eror := authentication.VerifyJWTRefresh(os.Getenv("REFRESH_SECRET"), refresh_cookie)
			if eror != nil {
				fmt.Println("2", eror)

				// clear cookies
				ctx.SetCookie("access_token", "", -1, "/", "", false, true)
				ctx.SetCookie("refresh_token", "", -1, "/", "", false, true)

				// abort and return (important: MUST return after abort)
				ctx.AbortWithStatusJSON(401, gin.H{"msg": "unauthorised"})
				return
			}

			// fetch user from DB using refresh claims
			person, err := db.GetUser(conn, refreshData.UserID)
			if err != nil {
				fmt.Println("3", err)
				ctx.AbortWithStatusJSON(500, gin.H{"msg": "sorry an error occured while talking to the database"})
				return
			}

			// generate new access token and set cookie
			newAccess, _ := authentication.AccessToken(person.ID, person.UserName, person.Email, person.Age)
			ctx.SetCookie("access_token", newAccess, 3600*24, "/", "", false, true)

			// re-verify with the fresh token so ctx.Set has valid claims
			accessData, _ = authentication.VerifyJWTAccess(os.Getenv("ACCESS_SECRET"), newAccess)
		}

		// ✅ FIX: explicitly set correct types into context
		ctx.Set("user_id", accessData.UserID)
		ctx.Set("user_name", accessData.UserName)

		// debugging (can remove later)
		value, exists := ctx.Get("user_id")
		fmt.Println("user_id in context:", value, "exists:", exists)

		value, _ = ctx.Get("user_name")
		fmt.Println("user_name in context:", value)
	}
}
