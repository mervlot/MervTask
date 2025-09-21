package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func CheckIfEmailExist(conn *pgx.Conn, email string) (bool, error) {

	var res bool
	err := conn.QueryRow(context.Background(), "SELECT EXISTS (SELECT 1 FROM Users where email = $1)", email).
		Scan(&res)
	return res, err
}
