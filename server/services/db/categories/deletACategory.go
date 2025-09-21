package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// DeleteCategory removes all transactions with the given category
func DeleteCategory(conn *pgx.Conn, category string) error {
	_, err := conn.Exec(context.Background(),
		"DELETE FROM transactions WHERE category = $1", category)
	if err != nil {
		return err
	}

	return nil
}
