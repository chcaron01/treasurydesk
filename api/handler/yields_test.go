package handler

import (
	"context"
	"testing"
)

// ─── getYieldHistory validation tests ────────────────────────────────────────
// These tests call the handler function directly to test its input validation
// without needing a real FRED API or database connection.

func TestGetYieldHistory_UnknownSeriesReturnsError(t *testing.T) {
	input := &YieldHistoryInput{Series: "UNKNOWN_SERIES"}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error for unknown series, got nil")
	}
}

func TestGetYieldHistory_OnlyStartDateReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "2024-01-01",
		End:    "",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error when only start date is provided, got nil")
	}
}

func TestGetYieldHistory_OnlyEndDateReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "",
		End:    "2024-12-31",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error when only end date is provided, got nil")
	}
}

func TestGetYieldHistory_InvalidStartDateFormatReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "01/01/2024",
		End:    "2024-12-31",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error for invalid start date format, got nil")
	}
}

func TestGetYieldHistory_InvalidEndDateFormatReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "2024-01-01",
		End:    "December 31 2024",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error for invalid end date format, got nil")
	}
}

func TestGetYieldHistory_EndBeforeStartReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "2024-06-01",
		End:    "2024-01-01",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error when end date is before start date, got nil")
	}
}

func TestGetYieldHistory_EndSameAsStartReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "2024-01-01",
		End:    "2024-01-01",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error when end date equals start date, got nil")
	}
}

func TestGetYieldHistory_FutureDateReturnsError(t *testing.T) {
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "2024-01-01",
		End:    "2099-12-31",
	}
	_, err := getYieldHistory(context.Background(), input)
	if err == nil {
		t.Error("expected error for future end date, got nil")
	}
}

// ─── YieldHistoryInput parsing tests ─────────────────────────────────────────

func TestYieldHistoryInput_DefaultsToOneYearWhenNoDatesGiven(t *testing.T) {
	// When both Start and End are empty, the handler should default to 1-year range.
	// We can verify this by checking the error — with a valid series and no dates,
	// the handler will attempt an HTTP call to FRED (which will fail in test env),
	// but the important thing is it does NOT return a validation error first.
	input := &YieldHistoryInput{
		Series: "DGS10",
		Start:  "",
		End:    "",
	}
	_, err := getYieldHistory(context.Background(), input)
	// The error from FRED call is acceptable here (network failure); what we
	// verify is the error message is about FRED, not date validation.
	if err != nil {
		msg := err.Error()
		// Should not be a validation error about dates
		invalidMessages := []string{
			"both start and end are required",
			"invalid start date",
			"invalid end date",
			"end date cannot be in the future",
			"end date must be after start date",
			"unknown series",
		}
		for _, invalid := range invalidMessages {
			if containsString(msg, invalid) {
				t.Errorf("expected no validation error, got: %q", msg)
			}
		}
	}
}

func containsString(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && searchString(s, substr))
}

func searchString(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
