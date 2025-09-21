package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

func GetAllCategories(conn *pgx.Conn) ([]string, error) {
	rows, err := conn.Query(context.Background(), "SELECT DISTINCT category FROM transactions")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []string
	for rows.Next() {
		var category string
		if err := rows.Scan(&category); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	// Check for errors during iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}
