package db

import (
	"context"
	"github.com/jackc/pgx/v5"
)

type Summary struct {
	TotalExpenses float64
	TotalIncome   float64
	NetBalance    float64
}

func GetAllSummary(conn *pgx.Conn) (Summary, error) {
	var summary Summary

	query := `
		SELECT 
			COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expenses,
			COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income
		FROM transactions;
	`

	row := conn.QueryRow(context.Background(), query)
	err := row.Scan(&summary.TotalExpenses, &summary.TotalIncome)
	if err != nil {
		return summary, err
	}

	summary.NetBalance = summary.TotalIncome - summary.TotalExpenses
	return summary, nil
}
