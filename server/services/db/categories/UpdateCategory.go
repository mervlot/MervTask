package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// UpdateCategory changes all transactions with oldCategory to newCategory
func UpdateCategory(conn *pgx.Conn, oldCategory, newCategory string) ( error) {
	_, err := conn.Exec(context.Background(),
		"UPDATE transactions SET category = $1 WHERE category = $2",
		newCategory, oldCategory)
	if err != nil {
		return  err
	}

	return  nil
}
