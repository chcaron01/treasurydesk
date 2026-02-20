package handler

import "time"

// Yields

type YieldPoint struct {
	Label  string  `json:"label" doc:"Display label for this treasury term (e.g. 10Y)"`
	Months int     `json:"months" doc:"Term length in months"`
	Yield  float64 `json:"yield" doc:"Current yield percentage"`
}

type HistoryPoint struct {
	Date  string  `json:"date" doc:"Observation date in YYYY-MM-DD format"`
	Yield float64 `json:"yield" doc:"Yield percentage on this date"`
}

type YieldCurveOutput struct {
	Body []YieldPoint
}

type YieldHistoryInput struct {
	Series string `query:"series" doc:"FRED series ID (e.g. DGS10)" required:"true"`
	Start  string `query:"start" doc:"Start date in YYYY-MM-DD format. Required if end is provided."`
	End    string `query:"end" doc:"End date in YYYY-MM-DD format. Required if start is provided."`
}

type YieldHistoryOutput struct {
	Body []HistoryPoint
}

// Orders

type Order struct {
	ID        string    `json:"id" doc:"Unique order ID"`
	Term      string    `json:"term" doc:"Treasury term label (e.g. 10Y)"`
	Months    int       `json:"months" doc:"Term length in months"`
	Amount    float64   `json:"amount" doc:"Dollar amount of the order"`
	Yield     float64   `json:"yield" doc:"Yield rate locked in at time of order"`
	CreatedAt time.Time `json:"createdAt" doc:"Timestamp when the order was created"`
}

type OrderRequest struct {
	Term   string  `json:"term" doc:"Treasury term label (e.g. 10Y)" required:"true"`
	Amount float64 `json:"amount" doc:"Dollar amount to invest" required:"true"`
}

type GetOrdersOutput struct {
	Body []Order
}

type AddOrderInput struct {
	Body OrderRequest
}

type AddOrderOutput struct {
	Body Order
}
