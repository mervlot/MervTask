package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func UpdateTransaction(conn *pgx.Conn, userID, txID int, title, description string, amount float64, txType, category string) error {
	// simple manual check for valid type (income/expense)
	if txType != "income" && txType != "expense" {
		return errors.New("invalid transaction type")
	}

	cmdTag, err := conn.Exec(
		context.Background(),
		`UPDATE transactions
		 SET title = $1, description = $2, amount = $3, type = $4, category = $5
		 WHERE id = $6 AND user_id = $7`,
		title, description, amount, txType, category, txID, userID,
	)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no transaction found or not authorized")
	}

	return nil
}
