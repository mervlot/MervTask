package userhandler

import (
	"fmt"
	"mervtask/services/db"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type data struct {
	UserName  string
	FirstName string
	LastName  string
	Age       int
	Email     string
}

func GetUserHandler(conn *pgx.Conn) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		valueid, exists := ctx.Get("user_id")
		if !exists {
			fmt.Println("4", exists)
			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i  just added it here just incase  "})
			return
		}
		user_id, ok := valueid.(int)
		if !ok {
			fmt.Println("4", ok)

			ctx.JSON(400, gin.H{"msg": "i dont know how you made it to this error i just  added it here just incase "})
			return
		}
		person, _ := db.GetUser(conn, user_id)
		data := data{
			UserName:  person.UserName,
			FirstName: person.FirstName,
			LastName:  person.LastName,
			Age:       person.Age,
			Email:     person.Email,
		}
		ctx.JSON(200, data)
	}
}
