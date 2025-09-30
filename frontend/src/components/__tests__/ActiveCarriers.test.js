import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActiveCarriers from "../ActiveCarriers";

// Mock de los íconos de Material-UI para evitar errores en el entorno de prueba
jest.mock("@mui/icons-material/PeopleAlt", () => () => <div data-testid="people-icon" />);
jest.mock("@mui/icons-material/LocalShipping", () => () => <div data-testid="shipping-icon" />);
jest.mock("@mui/icons-material/ExpandMore", () => () => <div data-testid="expand-more-icon" />);
jest.mock("@mui/icons-material/ExpandLess", () => () => <div data-testid="expand-less-icon" />);

const mockCarriers = [
  {
    name: "Carrier A",
    logo: "logoA.png",
    trucks_per_day: 15,
    trucks: [
      {
        id: 101,
        plate: "TRK-001",
        driver: "John Doe",
        capacity_tons: 20,
        status: "On-route",
        logo: "truck1.png",
      },
    ],
  },
  {
    name: "Carrier B",
    logo: "logoB.png",
    trucks_per_day: 10,
    trucks: [
      {
        id: 202,
        plate: "TRK-002",
        driver: "Jane Smith",
        capacity_tons: 25,
        status: "Available",
        logo: "truck2.png",
      },
    ],
  },
];

describe("ActiveCarriers Component", () => {
  test("muestra el estado 'No Results Yet' cuando no hay transportistas", () => {
    render(<ActiveCarriers carriers={[]} />);

    expect(screen.getByText("No Results Yet")).toBeInTheDocument();
    expect(
      screen.getByText("Search for a route to see active carriers")
    ).toBeInTheDocument();
    expect(screen.queryByText("Total Trucks/Day")).not.toBeInTheDocument();
  });

  test("renderiza la lista de transportistas y las estadísticas correctamente", () => {
    render(<ActiveCarriers carriers={mockCarriers} />);

    // Verificar el título
    expect(screen.getByText("Active Carriers")).toBeInTheDocument();

    // Verificar estadísticas
    const totalTrucks = mockCarriers.reduce((sum, c) => sum + c.trucks_per_day, 0); // 15 + 10 = 25
    const avgPerCarrier = Math.round(totalTrucks / mockCarriers.length); // 25 / 2 = 13

    expect(screen.getByText(totalTrucks.toString())).toBeInTheDocument();
    expect(screen.getByText("Total Trucks/Day")).toBeInTheDocument();

    expect(screen.getByText(avgPerCarrier.toString())).toBeInTheDocument();
    expect(screen.getByText("Avg per Carrier")).toBeInTheDocument();

    expect(screen.getByText("2 carriers found")).toBeInTheDocument();

    // Verificar que los nombres de los transportistas estén en el documento
    expect(screen.getByText("Carrier A")).toBeInTheDocument();
    expect(screen.getByText("Carrier B")).toBeInTheDocument();
  });

  test("expande y colapsa los detalles de un transportista al hacer clic", () => {
    render(<ActiveCarriers carriers={mockCarriers} />);

    // Inicialmente, los detalles del camión no deben ser visibles
    expect(screen.queryByText(/Plate: TRK-001/)).not.toBeInTheDocument();

    // Encontrar todos los botones de expansión. Hay uno por cada Card.
    const expandButtons = screen.getAllByRole("button");

    // Hacer clic en el botón del primer transportista para expandir
    fireEvent.click(expandButtons[0]);

    // Ahora los detalles del primer camión deben ser visibles
    expect(screen.getByText(/Plate: TRK-001/)).toBeInTheDocument();
    expect(
      screen.getByText(/Driver: John Doe | Capacity: 20 tons | Status: On-route/)
    ).toBeInTheDocument();

    // Los detalles del segundo camión no deben ser visibles
    expect(screen.queryByText(/Plate: TRK-002/)).not.toBeInTheDocument();

    // Hacer clic de nuevo en el mismo botón para colapsar
    fireEvent.click(expandButtons[0]);

    // Los detalles del primer camión ya no deben ser visibles
    expect(screen.queryByText(/Plate: TRK-001/)).not.toBeInTheDocument();
  });
});