package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sort"
	"sync"
	"time"

	"github.com/danielgtaylor/huma/v2"

	"go-test/gateway"
)

func getYieldCurve(ctx context.Context, _ *struct{}) (*YieldCurveOutput, error) {
	type result struct {
		index int
		point YieldPoint
		err   error
	}

	results := make([]result, len(gateway.TreasuryTerms))
	var wg sync.WaitGroup

	for i, term := range gateway.TreasuryTerms {
		wg.Add(1)
		go func(idx int, seriesID, label string, months int) {
			defer wg.Done()
			yield, err := gateway.FetchLatestYield(seriesID)
			results[idx] = result{
				index: idx,
				point: YieldPoint{Label: label, Months: months, Yield: yield},
				err:   err,
			}
		}(i, term.SeriesID, term.Label, term.Months)
	}
	wg.Wait()

	var curve []YieldPoint
	for _, res := range results {
		if res.err != nil {
			log.Printf("Error fetching %s: %v", gateway.TreasuryTerms[res.index].SeriesID, res.err)
			continue
		}
		curve = append(curve, res.point)
	}

	sort.Slice(curve, func(i, j int) bool {
		return curve[i].Months < curve[j].Months
	})

	return &YieldCurveOutput{Body: curve}, nil
}

func getYieldHistory(ctx context.Context, input *YieldHistoryInput) (*YieldHistoryOutput, error) {
	valid := false
	for _, t := range gateway.TreasuryTerms {
		if t.SeriesID == input.Series {
			valid = true
			break
		}
	}
	if !valid {
		return nil, huma.Error400BadRequest("unknown series", nil)
	}

	const dateLayout = "2006-01-02"
	var startDate, endDate string

	if input.Start == "" && input.End == "" {
		startDate = time.Now().AddDate(-1, 0, 0).Format(dateLayout)
	} else {
		if input.Start == "" || input.End == "" {
			return nil, huma.Error400BadRequest("both start and end are required when specifying a custom range", nil)
		}
		parsedStart, err := time.Parse(dateLayout, input.Start)
		if err != nil {
			return nil, huma.Error400BadRequest("invalid start date; expected YYYY-MM-DD", nil)
		}
		parsedEnd, err := time.Parse(dateLayout, input.End)
		if err != nil {
			return nil, huma.Error400BadRequest("invalid end date; expected YYYY-MM-DD", nil)
		}
		if parsedEnd.After(time.Now()) {
			return nil, huma.Error400BadRequest("end date cannot be in the future", nil)
		}
		if !parsedEnd.After(parsedStart) {
			return nil, huma.Error400BadRequest("end date must be after start date", nil)
		}
		startDate = input.Start
		endDate = input.End
	}

	fredURL := fmt.Sprintf("%s?series_id=%s&api_key=%s&file_type=json&sort_order=asc&observation_start=%s",
		gateway.FredBaseURL, input.Series, gateway.FredAPIKey, startDate)
	if endDate != "" {
		fredURL += "&observation_end=" + endDate
	}

	resp, err := http.Get(fredURL)
	if err != nil {
		return nil, huma.Error502BadGateway("failed to contact FRED", nil)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, huma.Error502BadGateway("failed to read FRED response", nil)
	}

	var fredResp gateway.FredResponse
	if err := json.Unmarshal(body, &fredResp); err != nil {
		return nil, huma.Error502BadGateway("failed to parse FRED response", nil)
	}

	var history []HistoryPoint
	for _, obs := range fredResp.Observations {
		if obs.Value == "." {
			continue
		}
		var val float64
		fmt.Sscanf(obs.Value, "%f", &val)
		history = append(history, HistoryPoint{Date: obs.Date, Yield: val})
	}

	return &YieldHistoryOutput{Body: history}, nil
}
