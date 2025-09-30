import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchForm from "../SearchForm";

// Mock del ícono de Material-UI
jest.mock("@mui/icons-material/Search", () => () => <div data-testid="search-icon" />);

// Mock del componente CityAutocomplete para simplificar las pruebas
// Lo tratamos como un input de texto normal.
jest.mock("./CityAutocomplete", () => ({ label, value, onChange }) => (
  <input
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
));

describe("SearchForm Component", () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  // Limpiamos los mocks antes de cada prueba
  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnClear.mockClear();
  });

  test("renderiza el formulario con el botón de búsqueda deshabilitado", () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);

    expect(screen.getByText("Route Search")).toBeInTheDocument();
    expect(screen.getByLabelText("From City")).toBeInTheDocument();
    expect(screen.getByLabelText("To City")).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: /Search Routes & Carriers/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toBeDisabled();
  });

  test("habilita el botón de búsqueda solo cuando ambos campos están llenos", async () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);
    const user = userEvent.setup();

    const fromInput = screen.getByLabelText("From City");
    const toInput = screen.getByLabelText("To City");
    const searchButton = screen.getByRole("button", { name: /Search Routes & Carriers/i });

    // Llenar solo el primer campo
    await user.type(fromInput, "New York");
    expect(searchButton).toBeDisabled();

    // Llenar el segundo campo
    await user.type(toInput, "Los Angeles");
    expect(searchButton).toBeEnabled();

    // Limpiar el primer campo
    await user.clear(fromInput);
    expect(searchButton).toBeDisabled();
  });

  test("llama a onSearch con los valores correctos al enviar el formulario", async () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);
    const user = userEvent.setup();

    const fromInput = screen.getByLabelText("From City");
    const toInput = screen.getByLabelText("To City");
    const searchButton = screen.getByRole("button", { name: /Search Routes & Carriers/i });

    await user.type(fromInput, "Chicago");
    await user.type(toInput, "Miami");

    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({ from: "Chicago", to: "Miami" });
  });

  test("llama a onClear cuando ambos campos se vacían", async () => {
    render(<SearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);
    const user = userEvent.setup();

    const fromInput = screen.getByLabelText("From City");
    const toInput = screen.getByLabelText("To City");

    // Escribir y luego borrar
    await user.type(fromInput, "test");
    await user.type(toInput, "test");

    // onClear no debe ser llamado aún
    expect(mockOnClear).not.toHaveBeenCalled();

    await user.clear(fromInput);
    await user.clear(toInput);

    // El useEffect debería disparar onClear ahora
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});