package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func AddTransaction(conn *pgx.Conn, userID int, title string, description string, amount float64, expenseType string, category string) error {
	// Use parameterized query ($1, $2, etc.) to prevent SQL injection
	_, err := conn.Exec(
		context.Background(),
		`INSERT INTO transactions (user_id, title, description, amount, type, category) 
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		userID, title, description, amount, expenseType, category,
	)
	if err != nil {
		return fmt.Errorf("failed to insert transaction: %v", err)
	}
	return nil
}
