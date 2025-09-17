package db

import (
	"context"
	"fmt"
	"mervtask/types"

	"github.com/jackc/pgx/v5"
)

func SaveUser(conn *pgx.Conn, user types.User, password string) error {
	_, err := conn.Exec(context.Background(), `
	INSERT INTO Users(user_name,first_name,last_name,age,email,date_of_birth, password)
	VALUES(
	$1,$2,$3,$4,$5,$6,$7	);`, user.UserName, user.FirstName, user.LastName, user.Age, user.Email, user.DateOfBirth, password)
	if err != nil {
		fmt.Println("jjjj", err)

		return  err
	}
	return nil
}
