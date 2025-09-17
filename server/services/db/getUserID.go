package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func GetUserID(conn *pgx.Conn, username string) (int, error) {

	var res int
	err := conn.QueryRow(context.Background(), "SELECT id FROM Users where user_name = $1", username).Scan(&res)
	if err != nil {
		return 0, err
	}

	return res, nil
}
