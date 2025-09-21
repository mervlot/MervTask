package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func DeleteUser (conn *pgx.Conn,user_id int) error{
	_, err := conn.Exec(context.Background(), "DELETE FROM users WHERE id = $1", user_id)
	if err != nil {
		return err
	}
	return nil
}