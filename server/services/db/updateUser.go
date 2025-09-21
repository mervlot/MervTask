package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func UpdateUser(conn *pgx.Conn, username string, firstname string, lastname string, userid int) error {
	// ✅ must use UPDATE not SET
	_, err := conn.Exec(
		context.Background(),
		"UPDATE users SET user_name=$1, first_name=$2, last_name=$3 WHERE id=$4",
		username, firstname, lastname, userid,
	)
	return err
}
