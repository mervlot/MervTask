package db

import (
	"context"
	"mervtask/types"

	"github.com/jackc/pgx/v5"
)

func GetUser(conn *pgx.Conn, userid int) (types.Person, error) {
	var user types.Person
	var password string
	err := conn.QueryRow(context.Background(), "SELECT * FROM Users where id = $1", userid).
		Scan(&user.ID, &user.UserName, &user.FirstName, &user.LastName, &user.Age, &user.Email, &user.DateOfBirth, &password)
	if err != nil {
		return user, err
	}

	return user, nil
}
