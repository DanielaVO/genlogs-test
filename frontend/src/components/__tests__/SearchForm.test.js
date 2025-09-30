import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchForm from "../SearchForm";

jest.mock("@mui/icons-material/Search", () => () => <div data-testid="search-icon" />);

jest.mock("../CityAutocomplete", () => ({ label, value, onChange }) => (
  <input
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
));

describe("SearchForm Component", () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnClear.mockClear();
  });

  test("renders the form with the search button disabled", () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);

    expect(screen.getByText("Route Search")).toBeInTheDocument();
    expect(screen.getByLabelText("From City")).toBeInTheDocument();
    expect(screen.getByLabelText("To City")).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: /Search Routes & Carriers/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toBeDisabled();
  });

  test("enables the search button only when both fields are filled", async () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);

    const fromInput = screen.getByLabelText("From City");
    const toInput = screen.getByLabelText("To City");
    const searchButton = screen.getByRole("button", { name: /Search Routes & Carriers/i });

    await userEvent.type(fromInput, "New York");
    expect(searchButton).toBeDisabled();

    await userEvent.type(toInput, "Los Angeles");
    expect(searchButton).toBeEnabled();

    await userEvent.clear(fromInput);
    expect(searchButton).toBeDisabled();
  });

  test("calls onSearch with the correct values when the form is submitted", async () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);

    const fromInput = screen.getByLabelText("From City");
    const toInput = screen.getByLabelText("To City");
    const searchButton = screen.getByRole("button", { name: /Search Routes & Carriers/i });

    await userEvent.type(fromInput, "Chicago");
    await userEvent.type(toInput, "Miami");

    await userEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({ from: "Chicago", to: "Miami" });
  });
});