package authhandler

import (
	"mervtask/services/authentication"
	"mervtask/services/db"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type data struct {
	ID          int
	UserName    string
	FirstName   string
	LastName    string
	Age         int
	Email       string
	DateOfBirth time.Time
}

func MeHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookieValue, err := ctx.Cookie("refresh_token")
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		if cookieValue == "" {
			ctx.JSON(400, gin.H{"msg": "error"})
			return
		}
		userData, err := authentication.VerifyJWTRefresh(os.Getenv("REFRESH_SECRET"), cookieValue)
		if err != nil {
			ctx.JSON(400, gin.H{"msg": err.Error()})
			return
		}
		person, _ := db.GetUser(conn, userData.UserID)
		data := data{
			ID:          person.ID,
			UserName:    person.UserName,
			FirstName:   person.FirstName,
			LastName:    person.LastName,
			Age:         person.Age,
			Email:       person.Email,
			DateOfBirth: person.DateOfBirth,
		}
		ctx.JSON(200, data)
	}
}
