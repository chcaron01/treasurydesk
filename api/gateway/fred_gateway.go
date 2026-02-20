package gateway

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// FredAPIKey is read from the FRED_API_KEY environment variable at startup.
var FredAPIKey string

const FredBaseURL = "https://api.stlouisfed.org/fred/series/observations"

func init() {
	FredAPIKey = os.Getenv("FRED_API_KEY")
	if FredAPIKey == "" {
		log.Fatal("FRED_API_KEY environment variable is not set")
	}
}

var TreasuryTerms = []struct {
	SeriesID string
	Label    string
	Months   int
}{
	{"DGS1MO", "1M", 1},
	{"DGS3MO", "3M", 3},
	{"DGS6MO", "6M", 6},
	{"DGS1", "1Y", 12},
	{"DGS2", "2Y", 24},
	{"DGS3", "3Y", 36},
	{"DGS5", "5Y", 60},
	{"DGS7", "7Y", 84},
	{"DGS10", "10Y", 120},
	{"DGS20", "20Y", 240},
	{"DGS30", "30Y", 360},
}

type FredObservation struct {
	Date  string `json:"date"`
	Value string `json:"value"`
}

type FredResponse struct {
	Observations []FredObservation `json:"observations"`
}

func FetchLatestYield(seriesID string) (float64, error) {
	url := fmt.Sprintf("%s?series_id=%s&api_key=%s&file_type=json&sort_order=desc&limit=10", FredBaseURL, seriesID, FredAPIKey)
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var fredResp FredResponse
	if err := json.Unmarshal(body, &fredResp); err != nil {
		return 0, err
	}

	for _, obs := range fredResp.Observations {
		if obs.Value == "." {
			continue
		}
		var val float64
		fmt.Sscanf(obs.Value, "%f", &val)
		return val, nil
	}

	return 0, fmt.Errorf("no valid observations for %s", seriesID)
}
