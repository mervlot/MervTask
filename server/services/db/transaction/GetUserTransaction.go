package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func GetTransaction(conn *pgx.Conn, userID, txID int) (*Transaction, error) {
	row := conn.QueryRow(
		context.Background(),
		`SELECT id, user_id, title, description, amount, type, category, created_at, updated_at
		 FROM transactions
		 WHERE id = $1 AND user_id = $2`,
		txID, userID,
	)

	var tx Transaction
	err := row.Scan(
		&tx.ID, &tx.UserID, &tx.Title, &tx.Description,
		&tx.Amount, &tx.Type, &tx.Category,
		&tx.CreatedAt, &tx.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("transaction not found or not authorized")
		}
		return nil, fmt.Errorf("query error: %v", err)
	}

	return &tx, nil
}
