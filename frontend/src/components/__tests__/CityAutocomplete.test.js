import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CityAutocomplete from "../CityAutocomplete";

// Mock de la API de Google Maps Places
const mockGetPlacePredictions = jest.fn();

beforeAll(() => {
  // Definimos el objeto global 'google' que el componente espera encontrar en 'window'
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

// Limpiamos los mocks después de cada prueba para evitar interferencias
afterEach(() => {
  jest.clearAllMocks();
});

describe("CityAutocomplete Component", () => {
  const mockOnChange = jest.fn();

  test("renderiza correctamente con la etiqueta y el valor inicial", () => {
    render(
      <CityAutocomplete label="From City" value="New York" onChange={mockOnChange} />
    );

    // El input debe mostrar el valor inicial
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("New York");

    // La etiqueta debe estar presente
    expect(screen.getByLabelText("From City")).toBeInTheDocument();
  });

  test("llama a la API de Google Places al escribir en el input", async () => {
    render(
      <CityAutocomplete label="To City" value="" onChange={mockOnChange} />
    );

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Los Angeles" } });

    // Verifica que la función onChange fue llamada con el nuevo valor
    expect(mockOnChange).toHaveBeenCalledWith("Los Angeles");

    // Verifica que se llamó a la función de predicciones de la API
    expect(mockGetPlacePredictions).toHaveBeenCalledTimes(1);
    expect(mockGetPlacePredictions).toHaveBeenCalledWith(
      {
        input: "Los Angeles",
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
      expect.any(Function) // El segundo argumento es un callback
    );
  });

  test("muestra las opciones de la API cuando se reciben predicciones", async () => {
    // Simulamos la respuesta del callback de la API
    const mockPredictions = [
      { description: "Los Angeles, CA, USA", place_id: "1" },
      { description: "Los Angeles County, CA, USA", place_id: "2" },
    ];
    mockGetPlacePredictions.mockImplementation((request, callback) => {
      callback(mockPredictions, "OK");
    });

    render(
      <CityAutocomplete label="To City" value="Los Angeles" onChange={mockOnChange} />
    );

    // Esperamos a que las opciones aparezcan en el DOM
    await waitFor(() => {
      expect(screen.getByText("Los Angeles, CA, USA")).toBeInTheDocument();
    });
    expect(screen.getByText("Los Angeles County, CA, USA")).toBeInTheDocument();
  });

  test("no llama a la API si el input está vacío", () => {
    render(<CityAutocomplete label="From City" value="" onChange={mockOnChange} />);
    // No se realiza ninguna acción, solo se verifica que la API no fue llamada
    expect(mockGetPlacePredictions).not.toHaveBeenCalled();
  });
});