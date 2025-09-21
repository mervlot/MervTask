package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
)

type MonthlySummary struct {
	Month         time.Time
	TotalExpenses float64
	TotalIncome   float64
	NetBalance    float64
}

func GetMonthlySummary(conn *pgx.Conn) ([]MonthlySummary, error) {
	query := `
		SELECT 
			DATE_TRUNC('month', created_at) AS month,
			COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expenses,
			COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income
		FROM transactions
		GROUP BY month
		ORDER BY month;
	`

	rows, err := conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var summaries []MonthlySummary
	for rows.Next() {
		var s MonthlySummary
		err := rows.Scan(&s.Month, &s.TotalExpenses, &s.TotalIncome)
		if err != nil {
			return nil, err
		}
		s.NetBalance = s.TotalIncome - s.TotalExpenses
		summaries = append(summaries, s)
	}

	return summaries, rows.Err()
}
