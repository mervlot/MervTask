package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func CheckIfUserExist(conn *pgx.Conn, username string) (bool, error) {

	var res bool
	err := conn.QueryRow(context.Background(), "SELECT EXISTS (SELECT 1 FROM Users where user_name = $1)", username).
		Scan(&res)
	return res, err
}
