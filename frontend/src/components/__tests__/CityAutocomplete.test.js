import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CityAutocomplete from "../CityAutocomplete";

const mockGetPlacePredictions = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  global.window.google = {
    maps: {
      places: {
        AutocompleteService: jest.fn(() => ({
          getPlacePredictions: mockGetPlacePredictions,
        })),
      },
    },
  };
});

describe("CityAutocomplete Component", () => {
  const mockOnChange = jest.fn();

  test("renders correctly with the label and initial value", () => {
    render(
      <CityAutocomplete label="From City" value="New York" onChange={mockOnChange} />
    );

    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("New York");

    expect(screen.getByLabelText("From City")).toBeInTheDocument();
  });

  test("calls the Google Places API when typing in the input", async () => {
    const { rerender } = render(
      <CityAutocomplete label="To City" value="" onChange={mockOnChange} />
    );

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Los Angeles" } });
    expect(mockOnChange).toHaveBeenCalledWith("Los Angeles");

    // Re-render the component with the new value, simulating parent state update
    rerender(
      <CityAutocomplete label="To City" value="Los Angeles" onChange={mockOnChange} />
    );

    expect(mockGetPlacePredictions).toHaveBeenCalledTimes(1);
    expect(mockGetPlacePredictions).toHaveBeenCalledWith(
      {
        input: "Los Angeles",
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
      expect.any(Function)
    );
  });

  test("displays API options when predictions are received", async () => {
    const mockPredictions = [
      { description: "Los Angeles, CA, USA", place_id: "1" },
      { description: "Los Angeles County, CA, USA", place_id: "2" },
    ];

    mockGetPlacePredictions.mockImplementation((request, callback) => {
      callback(mockPredictions, "OK");
    });

    const { rerender } = render(
      <CityAutocomplete
        label="To City"
        value=""
        onChange={mockOnChange} />
    );

    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Los Angeles" } });
    rerender(<CityAutocomplete label="To City" value="Los Angeles" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText("Los Angeles, CA, USA")).toBeInTheDocument();
    });
    expect(screen.getByText("Los Angeles County, CA, USA")).toBeInTheDocument();
  });

  test("does not call the API if the input is empty", () => {
    render(<CityAutocomplete label="From City" value="" onChange={mockOnChange} />);
    expect(mockGetPlacePredictions).not.toHaveBeenCalled();
  });
});