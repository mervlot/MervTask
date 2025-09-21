package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type CategorySummary struct {
	Category      string
	TotalExpenses float64
	TotalIncome   float64
	NetBalance    float64
}

func GetCategorySummary(conn *pgx.Conn) ([]CategorySummary, error) {
	query := `
		SELECT 
			category,
			COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expenses,
			COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income
		FROM transactions
		GROUP BY category
		ORDER BY category;
	`

	rows, err := conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var summaries []CategorySummary
	for rows.Next() {
		var s CategorySummary
		err := rows.Scan(&s.Category, &s.TotalExpenses, &s.TotalIncome)
		if err != nil {
			return nil, err
		}
		s.NetBalance = s.TotalIncome - s.TotalExpenses
		summaries = append(summaries, s)
	}

	return summaries, rows.Err()
}
