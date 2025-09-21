package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
)

// Transaction struct to hold a row
type Transaction struct {
	ID          int
	UserID      int
	Title       string
	Description string
	Amount      float64
	Type        string
	Category    string
	CreatedAt   time.Time
}

func GetAllItemsInACategory(conn *pgx.Conn, userID int, category string) ([]Transaction, error) {
	rows, err := conn.Query(context.Background(),
		`SELECT id, user_id, title, description, amount, type, category, created_at
		 FROM transactions
		 WHERE user_id = $1 AND category = $2`, userID, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []Transaction
	for rows.Next() {
		var t Transaction
		if err := rows.Scan(&t.ID, &t.UserID, &t.Title, &t.Description, &t.Amount, &t.Type, &t.Category, &t.CreatedAt); err != nil {
			return nil, err
		}
		transactions = append(transactions, t)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}
