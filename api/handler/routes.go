package handler

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

func RegisterRoutes(api huma.API) {
	huma.Register(api, huma.Operation{
		OperationID: "get-yield-curve",
		Method:      http.MethodGet,
		Path:        "/yields",
		Summary:     "Get current yield curve",
		Description: "Returns the latest yield for each treasury term, sorted from shortest to longest.",
		Tags:        []string{"Yields"},
	}, getYieldCurve)

	huma.Register(api, huma.Operation{
		OperationID: "get-yield-history",
		Method:      http.MethodGet,
		Path:        "/yields/history",
		Summary:     "Get yield history for a series",
		Description: "Returns historical yield observations for a given FRED series. Defaults to the past year if no date range is provided.",
		Tags:        []string{"Yields"},
	}, getYieldHistory)

	huma.Register(api, huma.Operation{
		OperationID: "get-orders",
		Method:      http.MethodGet,
		Path:        "/orders",
		Summary:     "List all orders",
		Description: "Returns all treasury orders sorted by creation date, newest first.",
		Tags:        []string{"Orders"},
	}, getOrders)

	huma.Register(api, huma.Operation{
		OperationID:   "add-order",
		Method:        http.MethodPost,
		Path:          "/orders",
		Summary:       "Place a new order",
		Description:   "Places a new treasury order, locking in the current yield for the specified term.",
		Tags:          []string{"Orders"},
		DefaultStatus: http.StatusCreated,
	}, addOrder)
}
