package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
)

type Transaction struct {
	ID          int
	UserID      int
	Title       string
	Description string
	Amount      float64
	Type        string
	Category    string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// GetUserTransactions fetches all transactions for a user
func GetUserTransactions(conn *pgx.Conn, userID int) ([]Transaction, error) {
	rows, err := conn.Query(
		context.Background(),
		`SELECT id, user_id, title, description, amount, type, category, created_at, updated_at
		 FROM transactions
		 WHERE user_id = $1
		 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []Transaction
	for rows.Next() {
		var tx Transaction
		if err := rows.Scan(
			&tx.ID, &tx.UserID, &tx.Title, &tx.Description,
			&tx.Amount, &tx.Type, &tx.Category,
			&tx.CreatedAt, &tx.UpdatedAt,
		); err != nil {
			return nil, err
		}
		transactions = append(transactions, tx)
	}

	return transactions, nil
}
