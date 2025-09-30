import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CarriersList from "../CarriersList";

// Mock del ícono de Material-UI para evitar errores en el entorno de prueba
jest.mock("@mui/icons-material/LocalShipping", () => () => <div data-testid="shipping-icon" />);

const mockCarriers = [
  {
    name: "Carrier A",
    trucks_per_day: 15,
  },
  {
    name: "Carrier B",
    trucks_per_day: 7,
  },
];

describe("CarriersList Component", () => {
  test("muestra el estado 'No Results Yet' cuando no hay transportistas", () => {
    render(<CarriersList carriers={[]} />);

    expect(
      screen.getByText("No Results Yet — Search for a route to see active carriers")
    ).toBeInTheDocument();
    expect(screen.queryByText("Active Carriers")).not.toBeInTheDocument();
  });

  test("renderiza la lista de transportistas, la ruta y las estadísticas correctamente", () => {
    const fromCity = "Los Angeles, CA";
    const toCity = "New York, NY";
    render(<CarriersList carriers={mockCarriers} from={fromCity} to={toCity} />);

    // Verificar título y ruta
    expect(screen.getByText("Active Carriers")).toBeInTheDocument();
    expect(screen.getByText(`Route: ${fromCity} → ${toCity}`)).toBeInTheDocument();

    // Verificar estadísticas
    const totalTrucks = mockCarriers.reduce((sum, c) => sum + c.trucks_per_day, 0); // 15 + 7 = 22
    const avgTrucks = (totalTrucks / mockCarriers.length).toFixed(1); // "11.0"

    expect(screen.getByText(totalTrucks.toString())).toBeInTheDocument();
    expect(screen.getByText("Total Trucks/Day")).toBeInTheDocument();

    expect(screen.getByText(avgTrucks)).toBeInTheDocument();
    expect(screen.getByText("Avg per Carrier")).toBeInTheDocument();

    // Verificar que los transportistas se rendericen
    expect(screen.getByText(/#1 Carrier A/)).toBeInTheDocument();
    expect(screen.getByText(/15 trucks\/day/)).toBeInTheDocument();

    expect(screen.getByText(/#2 Carrier B/)).toBeInTheDocument();
    expect(screen.getByText(/7 trucks\/day/)).toBeInTheDocument();

    // Verificar que los íconos se rendericen (a través de su data-testid)
    expect(screen.getAllByTestId("shipping-icon")).toHaveLength(2);
  });
});