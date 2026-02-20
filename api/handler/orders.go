package handler

import (
	"context"

	"github.com/danielgtaylor/huma/v2"

	"go-test/db"
	"go-test/gateway"
)

func getOrders(ctx context.Context, _ *struct{}) (*GetOrdersOutput, error) {
	rows, err := db.DB.Query(`
		SELECT id, term, months, amount, yield, created_at
		FROM orders
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, huma.Error500InternalServerError("failed to query orders", nil)
	}
	defer rows.Close()

	orders := []Order{}
	for rows.Next() {
		var o Order
		if err := rows.Scan(&o.ID, &o.Term, &o.Months, &o.Amount, &o.Yield, &o.CreatedAt); err != nil {
			return nil, huma.Error500InternalServerError("failed to scan order", nil)
		}
		orders = append(orders, o)
	}

	return &GetOrdersOutput{Body: orders}, nil
}

func addOrder(ctx context.Context, input *AddOrderInput) (*AddOrderOutput, error) {
	var yieldVal float64
	var months int
	for _, t := range gateway.TreasuryTerms {
		if t.Label == input.Body.Term {
			months = t.Months
			val, err := gateway.FetchLatestYield(t.SeriesID)
			if err != nil {
				return nil, huma.Error502BadGateway("failed to fetch yield for term", nil)
			}
			yieldVal = val
			break
		}
	}

	if months == 0 {
		return nil, huma.Error400BadRequest("unknown term", nil)
	}

	var o Order
	err := db.DB.QueryRow(`
		INSERT INTO orders (term, months, amount, yield)
		VALUES ($1, $2, $3, $4)
		RETURNING id, term, months, amount, yield, created_at
	`, input.Body.Term, months, input.Body.Amount, yieldVal).Scan(
		&o.ID, &o.Term, &o.Months, &o.Amount, &o.Yield, &o.CreatedAt,
	)
	if err != nil {
		return nil, huma.Error500InternalServerError("failed to insert order", nil)
	}

	return &AddOrderOutput{Body: o}, nil
}
