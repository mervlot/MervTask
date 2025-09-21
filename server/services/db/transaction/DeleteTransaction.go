package db

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

// DeleteTransaction deletes a transaction by id and user_id
func DeleteTransaction(conn *pgx.Conn, userID, txID int) error {
	cmdTag, err := conn.Exec(
		context.Background(),
		`DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
		txID, userID,
	)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("no transaction found or not authorized")
	}

	return nil
}
